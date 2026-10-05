import { todaysJingleUri } from "./config/jingles.js";
import { PODCAST_SHOWS, type PodcastShow } from "./config/podcast-shows.js";
import {
  buildMix,
  musicTargetCount,
  selectMusic,
  shuffle,
  truncateToDuration,
  type MixQueues,
  type PodcastPick,
} from "./core/mix-builder.js";
import {
  getEligibleEpisodes,
  keepClosestByGroup,
} from "./core/podcast-source.js";
import type { TopTracksRange } from "./providers/provider.interface.js";
import { spotifyProvider } from "./providers/spotify.provider.js";
import { supabaseStorage } from "./storage/supabase-storage.js";
import type { Track } from "./types/index.js";

// Jingle très court (~15s) : pas besoin d'un appel API dédié juste pour sa
// durée exacte, négligeable sur un budget de plusieurs heures.
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
const METEO_SLOTS_MAX = 1;

// Fenêtres d'écoute : 60 % récents, 25 % habitudes des 6 derniers mois, 15 %
// classiques.
const MUSIC_RANGES: { range: TopTracksRange; share: number }[] = [
  { range: "short_term", share: 0.6 },
  { range: "medium_term", share: 0.25 },
  { range: "long_term", share: 0.15 },
];

const buildMusicMix = async (
  accessToken: string,
  targetCount: number,
): Promise<Track[]> => {
  const results = await Promise.all(
    MUSIC_RANGES.map(({ range }) =>
      spotifyProvider.getTopTracks(accessToken, range),
    ),
  );
  return selectMusic(results, MUSIC_RANGES, targetCount);
};

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

  // Réglages de l'interface web (durée max, sources désactivées) — valeurs historiques si jamais enregistrés.
  const settings = await supabaseStorage.getSettings(userId);
  const maxDurationMs = settings.maxDurationMinutes * 60_000;
  const enabledShows = PODCAST_SHOWS.filter(
    (s) => !settings.disabledShowIds.includes(s.id),
  );
  const actuShows = enabledShows.filter((s) => s.category === "actu");
  const thematicShows = enabledShows.filter((s) => s.category === "thematique");

  // Les musiques les plus écoutées — pas de découverte par genre ni de
  // playlists éditoriales Spotify (les deux essayées puis retirées, cf.
  // docs/PLAYLIST_GENERATION.md). Mélange pondéré sur 3 fenêtres d'écoute,
  // puis mélange final : sans ça, l'ordre Spotify est identique chaque jour
  // et la coupe sacrifie toujours les mêmes titres.
  const musicMix = await buildMusicMix(
    tokens.accessToken,
    musicTargetCount(maxDurationMs),
  );

  console.log("Récupération des podcasts...");
  const [actuPoolPicks, thematicPoolPicks] = await Promise.all([
    fetchEligibleEpisodes(tokens.accessToken, actuShows),
    fetchEligibleEpisodes(tokens.accessToken, thematicShows),
  ]);
  // Le pool "actu" fetché (catégorisation par show) contient aussi la
  // météo (catégorisation par titre d'épisode, cf. podcast-source.ts) —
  // séparation ici, avant tirage au sort.
  // Un show "thématique" à flux mixte (actuTitleIncludes) peut aussi livrer
  // de l'actu, et un show "actu" à flux mixte (alsoThematic) du thématique :
  // on trie par catégorie effective de l'épisode.
  const eligibleActu = [...actuPoolPicks, ...thematicPoolPicks].filter(
    (p) => p.category === "actu",
  );
  const eligibleThematic = [...actuPoolPicks, ...thematicPoolPicks].filter(
    (p) => p.category === "thematique",
  );
  const eligibleMeteo = actuPoolPicks.filter((p) => p.category === "meteo");
  console.log(
    `Pool éligible : ${eligibleActu.length} épisodes actu, ${eligibleMeteo.length} épisodes météo, ${eligibleThematic.length} épisodes thématiques.`,
  );

  // Tirage au sort dans chaque pool éligible : buildMix consomme les files
  // dans l'ordre du gabarit (fallback croisé actu <-> thématique, météo
  // limitée à 1 sans fallback) jusqu'à épuisement des pools, la coupe de durée borne le tout.
  const queues: MixQueues = {
    actu: shuffle(eligibleActu),
    meteo: shuffle(eligibleMeteo).splice(0, METEO_SLOTS_MAX),
    thematic: shuffle(eligibleThematic),
  };

  const { tracks: mixTracks, picks } = buildMix(
    musicMix,
    queues,
    maxDurationMs,
    JINGLE_DURATION_MS,
  );
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

  const mix = truncateToDuration(fullMix, maxDurationMs);

  const knownPlaylistId = await supabaseStorage.getPlaylistId(userId);
  const playlistId = await spotifyProvider.createOrUpdatePlaylist(
    tokens.accessToken,
    userId,
    mix,
    knownPlaylistId ?? undefined,
  );
  if (playlistId !== knownPlaylistId) {
    await supabaseStorage.savePlaylistId(userId, playlistId);
  }

  // Podcasts réellement inclus après la coupe (un pick tronqué n'est pas
  // dans la playlist).
  const mixTrackIds = new Set(mix.map((track) => track.id));
  const includedPicks = picks.filter((pick) => mixTrackIds.has(pick.track.id));

  const totalMinutes = Math.round(
    mix.reduce((sum, track) => sum + track.durationMs, 0) / 60_000,
  );
  console.log(
    `Playlist "Mon Daily" mise à jour avec ${mix.length} titres (~${totalMinutes} min sur ${settings.maxDurationMinutes} max, ${includedPicks.length} podcasts).`,
  );
};

main().catch((error: unknown) => {
  console.error(
    "Échec de la génération :",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
