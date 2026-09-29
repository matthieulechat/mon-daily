import { todaysJingleUri } from "./config/jingles.ts";
import {
  PODCAST_SHOWS,
  type PodcastCategory,
  type PodcastShow,
} from "./config/podcast-shows.ts";
import { getEligibleEpisodes, keepClosestByGroup } from "./core/podcast-source.ts";
import { spotifyProvider } from "./providers/spotify.provider.ts";
import { supabaseStorage } from "./storage/supabase-storage.ts";
import type { Track } from "./types/index.ts";

const MAX_PLAYLIST_DURATION_MS = 4 * 60 * 60 * 1000;
// Jingle très court (~15s) : pas besoin d'un appel API dédié juste pour sa
// durée exacte, négligeable sur un budget de 4h.
const JINGLE_DURATION_MS = 15_000;

// "actu" et "thematique" sont catégorisées par show (podcast-shows.ts) et
// tirées au sort parmi tous les ÉPISODES éligibles (actu ≤ 2 jours,
// thématique ≤ 3 jours, cf. podcast-source.ts) — un show peut contribuer
// plusieurs épisodes, le pool n'est pas limité au nombre de shows. Pas de
// signal de popularité exploitable côté API Spotify, donc le tirage au
// sort remplace un vrai classement "plus écouté".
// "meteo" n'a pas de show dédié : ce sont les épisodes du "journal
// d'Europe 1" (catégorisé "actu") dont le titre matche le préfixe météo
// (cf. podcast-source.ts) — le pool est donc tiré du même fetch que l'actu,
// puis séparé par catégorie effective ci-dessous.
const ACTU_SHOWS = PODCAST_SHOWS.filter((s) => s.category === "actu");
const THEMATIC_SHOWS = PODCAST_SHOWS.filter((s) => s.category === "thematique");
const ACTU_SLOTS_MAX = 3;
const METEO_SLOTS_MAX = 1;
const THEMATIC_SLOTS_MAX = 4;

// Spotify liste parfois le même morceau deux fois sous des ids différents
// (ex. "Titre" et "Titre (Music Video)") — on dédoublonne aussi sur
// nom+artiste après avoir retiré ce suffixe, pas juste sur l'id.
const normalizeTrackName = (name: string): string =>
  name
    .replace(/\s*\(music video\)\s*$/i, "")
    .trim()
    .toLowerCase();

const dedupeTracks = (tracks: Track[]): Track[] => {
  const seen = new Set<string>();
  return tracks.filter((track) => {
    const nameKey = `${normalizeTrackName(track.name)}::${track.artistNames[0]?.trim().toLowerCase() ?? ""}`;
    if (seen.has(track.id) || seen.has(nameKey)) return false;
    seen.add(track.id);
    seen.add(nameKey);
    return true;
  });
};

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};

interface PodcastPick {
  showId: string;
  track: Track;
  category: PodcastCategory;
}

// Tente TOUS les shows donnés (pas d'arrêt anticipé) pour connaître
// l'ensemble des épisodes éligibles avant tirage au sort. Un show peut
// contribuer PLUSIEURS entrées (ex. HugoDécrypte publie plusieurs fois par
// jour) — le pool réel est celui des épisodes éligibles, pas celui des
// shows. Un show sans épisode éligible (trop vieux, absent, erreur API,
// cf. podcast-source.ts) contribue simplement 0 entrée.
const fetchEligibleEpisodes = async (
  accessToken: string,
  shows: PodcastShow[],
): Promise<PodcastPick[]> => {
  const results = await Promise.all(
    shows.map(async (show) => {
      const episodes = await getEligibleEpisodes(accessToken, show);
      return episodes.map(({ track, category }) => ({
        showId: show.id,
        track,
        category,
      }));
    }),
  );
  return results.flat();
};

// Gabarit fixe (donné par Matthieu le 2026-09-22, ouverture actu+météo
// ajoutée le 2026-09-28) : 1 actu puis la météo du jour en ouverture (avant
// toute musique), puis 4 musiques entre chaque podcast en alternant
// actu/thématique, jusqu'à 3 actus + 1 météo + 4 thématiques placées.
// Au-delà, plus aucun podcast — la musique continue seule jusqu'à la coupe
// 4h.
type MixSlot =
  | { kind: "music"; count: number }
  | { kind: "podcast"; source: "actu" | "meteo" | "thematic" };

const MIX_TEMPLATE: MixSlot[] = [
  { kind: "podcast", source: "actu" },
  { kind: "podcast", source: "meteo" },
  { kind: "music", count: 2 },
  { kind: "podcast", source: "thematic" },
  { kind: "music", count: 4 },
  { kind: "podcast", source: "actu" },
  { kind: "music", count: 4 },
  { kind: "podcast", source: "thematic" },
  { kind: "music", count: 4 },
  { kind: "podcast", source: "actu" },
  { kind: "music", count: 4 },
  { kind: "podcast", source: "thematic" },
  { kind: "music", count: 4 },
  { kind: "podcast", source: "thematic" },
];

// Un slot "podcast" sans pick disponible ce jour-là est simplement sauté
// (le gabarit continue, rien ne se décale). Le reste de la musique non
// consommée par le gabarit suit en continu, sans plus aucun podcast.
const buildMix = (
  music: Track[],
  actuPicks: PodcastPick[],
  meteoPicks: PodcastPick[],
  thematicPicks: PodcastPick[],
): Track[] => {
  const result: Track[] = [];
  let musicIndex = 0;
  let actuIndex = 0;
  let meteoIndex = 0;
  let thematicIndex = 0;

  for (const slot of MIX_TEMPLATE) {
    if (slot.kind === "music") {
      const end = Math.min(musicIndex + slot.count, music.length);
      result.push(...music.slice(musicIndex, end));
      musicIndex = end;
    } else if (slot.source === "actu") {
      if (actuIndex < actuPicks.length)
        result.push(actuPicks[actuIndex++]!.track);
    } else if (slot.source === "meteo") {
      if (meteoIndex < meteoPicks.length)
        result.push(meteoPicks[meteoIndex++]!.track);
    } else if (thematicIndex < thematicPicks.length) {
      result.push(thematicPicks[thematicIndex++]!.track);
    }
  }

  result.push(...music.slice(musicIndex));
  return result;
};

// Coupe la playlist dès que l'ajout du titre suivant dépasserait le budget —
// les titres en tête (musiques les plus écoutées, podcasts prioritaires)
// survivent, ceux de fin sont sacrifiés en premier.
const truncateToDuration = (
  tracks: Track[],
  maxDurationMs: number,
): Track[] => {
  const result: Track[] = [];
  let totalMs = 0;

  for (const track of tracks) {
    if (totalMs + track.durationMs > maxDurationMs) break;
    result.push(track);
    totalMs += track.durationMs;
  }

  return result;
};

// Adapté de src/generate.ts pour être appelable pour un `userId` donné
// (boucle multi-comptes gérée par index.ts) plutôt qu'un script CLI
// mono-utilisateur avec `process.argv`/`process.exit`.
export interface GenerationResult {
  userId: string;
  tracksCount: number;
  durationMinutes: number;
  podcastsCount: number;
}

export const generatePlaylistForUser = async (
  userId: string,
): Promise<GenerationResult> => {
  const storedTokens = await supabaseStorage.getTokens(userId);
  if (!storedTokens) {
    throw new Error(
      `Aucun token trouvé pour "${userId}". Lance d'abord pnpm run login.`,
    );
  }

  const tokens = await spotifyProvider.refreshTokenIfNeeded(storedTokens);
  if (tokens.accessToken !== storedTokens.accessToken) {
    await supabaseStorage.saveTokens(userId, tokens);
  }

  // Les musiques les plus écoutées, telles quelles, tous les jours — pas de
  // découverte par genre ni de playlists éditoriales Spotify (les deux
  // essayées puis retirées, cf. docs/PLAYLIST_GENERATION.md, revu en
  // Phase 6).
  const topTracks = await spotifyProvider.getTopTracks(tokens.accessToken);
  const musicMix = dedupeTracks(topTracks);

  console.log("Récupération des podcasts...");
  const [actuPoolPicks, eligibleThematic] = await Promise.all([
    fetchEligibleEpisodes(tokens.accessToken, ACTU_SHOWS),
    fetchEligibleEpisodes(tokens.accessToken, THEMATIC_SHOWS),
  ]);
  // Le pool "actu" fetché (catégorisation par show) contient aussi la
  // météo (catégorisation par titre d'épisode, cf. podcast-source.ts) —
  // séparation ici, avant tirage au sort.
  const eligibleActu = actuPoolPicks.filter((p) => p.category === "actu");
  const eligibleMeteo = actuPoolPicks.filter((p) => p.category === "meteo");
  console.log(
    `Pool éligible : ${eligibleActu.length} épisodes actu, ${eligibleMeteo.length} épisodes météo, ${eligibleThematic.length} épisodes thématiques.`,
  );

  // Tirage au sort dans chaque pool éligible. Fallback croisé symétrique
  // actu/thématique si un pool ne suffit pas (voir
  // docs/PLAYLIST_GENERATION.md pour le détail) : les actus manquantes sont
  // comblées par des thématiques non tirées, et vice versa. La météo n'a
  // qu'un seul slot et pas de fallback — absente, le slot est simplement
  // sauté (comportement déjà géré par buildMix).
  const actuQueue = shuffle(eligibleActu);
  const thematicQueue = shuffle(eligibleThematic);
  const meteoPicks = shuffle(eligibleMeteo).splice(0, METEO_SLOTS_MAX);

  const actuPicks = actuQueue.splice(0, ACTU_SLOTS_MAX);
  const actuShortfall = ACTU_SLOTS_MAX - actuPicks.length;
  if (actuShortfall > 0) {
    actuPicks.push(...thematicQueue.splice(0, actuShortfall));
  }

  const thematicPicks = thematicQueue.splice(0, THEMATIC_SLOTS_MAX);
  const thematicShortfall = THEMATIC_SLOTS_MAX - thematicPicks.length;
  if (thematicShortfall > 0) {
    thematicPicks.push(...actuQueue.splice(0, thematicShortfall));
  }

  const fullMix: Track[] = [
    {
      id: "jingle",
      name: "Jingle du jour",
      artistNames: [],
      uri: todaysJingleUri(),
      durationMs: JINGLE_DURATION_MS,
    },
    ...buildMix(musicMix, actuPicks, meteoPicks, thematicPicks),
  ];

  const mix = truncateToDuration(fullMix, MAX_PLAYLIST_DURATION_MS);

  await spotifyProvider.createOrUpdatePlaylist(tokens.accessToken, userId, mix);

  // Podcasts réellement inclus après la coupe 4h (un pick tronqué n'est pas
  // dans la playlist).
  const mixTrackIds = new Set(mix.map((track) => track.id));
  const includedPicks = [...actuPicks, ...meteoPicks, ...thematicPicks].filter(
    (pick) => mixTrackIds.has(pick.track.id),
  );

  const totalMinutes = Math.round(
    mix.reduce((sum, track) => sum + track.durationMs, 0) / 60_000,
  );
  console.log(
    `Playlist "Mon Daily" mise à jour avec ${mix.length} titres (~${totalMinutes} min, ${includedPicks.length} podcasts).`,
  );

  return {
    userId,
    tracksCount: mix.length,
    durationMinutes: totalMinutes,
    podcastsCount: includedPicks.length,
  };
};
