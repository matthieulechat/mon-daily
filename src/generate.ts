import { todaysJingleUri } from "./config/jingles.js";
import {
  PODCAST_SHOWS,
  type PodcastCategory,
  type PodcastShow,
} from "./config/podcast-shows.js";
import { getEligibleEpisodes, keepClosestByGroup } from "./core/podcast-source.js";
import type { TopTracksRange } from "./providers/provider.interface.js";
import { spotifyProvider } from "./providers/spotify.provider.js";
import { supabaseStorage } from "./storage/supabase-storage.js";
import type { Track } from "./types/index.js";

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
const METEO_SLOTS_MAX = 1;

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

// Répartition des titres musique par fenêtre d'écoute (60 % récents, 25 %
// habitudes des 6 derniers mois, 15 % classiques). Un titre présent dans
// plusieurs fenêtres compte dans la plus récente. Plafond de titres par
// artiste (1er artiste listé) appliqué AVANT le mélange final : les titres
// écartés sont remplacés par d'autres artistes jusqu'à MUSIC_TARGET_COUNT,
// dans la limite de ce que les pools contiennent.
const MUSIC_TARGET_COUNT = 50;
const MAX_TRACKS_PER_ARTIST = 5;
const MUSIC_RANGES: { range: TopTracksRange; share: number }[] = [
  { range: "short_term", share: 0.6 },
  { range: "medium_term", share: 0.25 },
  { range: "long_term", share: 0.15 },
];

const buildMusicMix = async (accessToken: string): Promise<Track[]> => {
  const results = await Promise.all(
    MUSIC_RANGES.map(({ range }) =>
      spotifyProvider.getTopTracks(accessToken, range),
    ),
  );

  const kept: Track[] = [];
  const picked: Track[] = [];
  const leftovers: Track[] = [];
  MUSIC_RANGES.forEach(({ share }, i) => {
    const unique = dedupeTracks([...kept, ...results[i]!]).slice(kept.length);
    kept.push(...unique);
    const shuffled = shuffle(unique);
    const quota = Math.round(MUSIC_TARGET_COUNT * share);
    picked.push(...shuffled.slice(0, quota));
    leftovers.push(...shuffled.slice(quota));
  });

  const perArtist = new Map<string, number>();
  const selected: Track[] = [];
  const tryAdd = (track: Track): void => {
    const artist = track.artistNames[0]?.trim().toLowerCase() ?? track.id;
    const count = perArtist.get(artist) ?? 0;
    if (count >= MAX_TRACKS_PER_ARTIST) return;
    perArtist.set(artist, count + 1);
    selected.push(track);
  };

  picked.forEach(tryAdd);
  for (const track of shuffle(leftovers)) {
    if (selected.length >= MUSIC_TARGET_COUNT) break;
    tryAdd(track);
  }

  return shuffle(selected);
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
  return keepClosestByGroup(results.flat(), shows);
};

// Gabarit (donné par Matthieu le 2026-09-22, ouverture actu+météo ajoutée le
// 2026-09-28) : 1 actu puis la météo du jour en ouverture (avant toute
// musique), 2 musiques, puis la boucle "thématique, 4 musiques, actu, 4
// musiques" répétée tant qu'il reste des podcasts éligibles. Plus de plafond
// par catégorie : c'est la coupe 4h qui borne la playlist. Une catégorie
// épuisée est remplacée par l'autre (fallback croisé), la météo reste limitée
// à 1. Pool épuisé : la musique restante suit en continu.
const OPENING_MUSIC_COUNT = 2;
const MUSIC_BLOCK_COUNT = 4;

interface MixQueues {
  actu: PodcastPick[];
  meteo: PodcastPick[];
  thematic: PodcastPick[];
}

const takePick = (
  primary: PodcastPick[],
  secondary: PodcastPick[],
): PodcastPick | undefined => primary.shift() ?? secondary.shift();

const buildMix = (
  music: Track[],
  queues: MixQueues,
): { tracks: Track[]; picks: PodcastPick[] } => {
  const tracks: Track[] = [];
  const picks: PodcastPick[] = [];
  let musicIndex = 0;

  const addMusic = (count: number): void => {
    const end = Math.min(musicIndex + count, music.length);
    tracks.push(...music.slice(musicIndex, end));
    musicIndex = end;
  };
  const addPick = (pick: PodcastPick | undefined): void => {
    if (!pick) return;
    tracks.push(pick.track);
    picks.push(pick);
  };

  addPick(takePick(queues.actu, queues.thematic));
  addPick(queues.meteo.shift());
  addMusic(OPENING_MUSIC_COUNT);

  while (queues.actu.length > 0 || queues.thematic.length > 0) {
    addPick(takePick(queues.thematic, queues.actu));
    addMusic(MUSIC_BLOCK_COUNT);
    addPick(takePick(queues.actu, queues.thematic));
    addMusic(MUSIC_BLOCK_COUNT);
  }

  addMusic(music.length - musicIndex);
  return { tracks, picks };
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

const main = async (): Promise<void> => {
  const userId = process.argv[2];
  if (!userId) {
    throw new Error(
      "Usage : pnpm run generate <spotify_user_id> (l'id affiché après pnpm run login)",
    );
  }

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

  // Les musiques les plus écoutées — pas de découverte par genre ni de
  // playlists éditoriales Spotify (les deux essayées puis retirées, cf.
  // docs/PLAYLIST_GENERATION.md, revu en Phase 6). Mélange pondéré sur 3
  // fenêtres d'écoute, puis mélange final : sans ça, l'ordre Spotify est
  // identique chaque jour et la coupe 4h sacrifie toujours les mêmes titres.
  const musicMix = await buildMusicMix(tokens.accessToken);

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

  // Tirage au sort dans chaque pool éligible, sans plafond : buildMix
  // consomme les files dans l'ordre du gabarit (fallback croisé actu <->
  // thématique, météo limitée à 1 sans fallback) et la coupe 4h borne le tout.
  const queues: MixQueues = {
    actu: shuffle(eligibleActu),
    meteo: shuffle(eligibleMeteo).splice(0, METEO_SLOTS_MAX),
    thematic: shuffle(eligibleThematic),
  };

  const { tracks: mixTracks, picks } = buildMix(musicMix, queues);
  const fullMix: Track[] = [
    {
      id: "jingle",
      name: "Jingle du jour",
      artistNames: [],
      uri: todaysJingleUri(),
      durationMs: JINGLE_DURATION_MS,
    },
    ...mixTracks,
  ];

  const mix = truncateToDuration(fullMix, MAX_PLAYLIST_DURATION_MS);

  await spotifyProvider.createOrUpdatePlaylist(tokens.accessToken, userId, mix);

  // Podcasts réellement inclus après la coupe 4h (un pick tronqué n'est pas
  // dans la playlist).
  const mixTrackIds = new Set(mix.map((track) => track.id));
  const includedPicks = picks.filter((pick) => mixTrackIds.has(pick.track.id));

  const totalMinutes = Math.round(
    mix.reduce((sum, track) => sum + track.durationMs, 0) / 60_000,
  );
  console.log(
    `Playlist "Mon Daily" mise à jour avec ${mix.length} titres (~${totalMinutes} min, ${includedPicks.length} podcasts).`,
  );
};

main().catch((error: unknown) => {
  console.error(
    "Échec de la génération :",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
