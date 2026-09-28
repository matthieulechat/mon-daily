import type { PodcastCategory, PodcastShow } from "../config/podcast-shows.js";
import type { Track } from "../types/index.js";

const API_BASE = "https://api.spotify.com/v1";
// Fraîcheur max d'un épisode selon sa catégorie effective : les actus
// périment vite, la météo n'a de sens que le jour même, les thématiques
// (moins liées à l'actualité) tolèrent quelques jours.
const EPISODE_MAX_AGE_DAYS: Record<PodcastCategory, number> = {
  actu: 2,
  meteo: 1,
  thematique: 3,
};
const EPISODES_FETCH_LIMIT = 10;
// "Le journal d'Europe 1" mixe actu et météo dans le même flux — les titres
// météo commencent toujours par ce préfixe, seul moyen de les distinguer
// (pas de champ dédié côté API Spotify).
const METEO_TITLE_PREFIX = "la météo de";
// HugoDécrypte mixe 3 formats dans le même flux : actu du jour, actu pop
// culture et interviews/rediffs (le reste). Le titre seul n'est pas fiable
// (certaines actus du jour n'ont pas de date en suffixe) donc on croise
// titre ET description (Spotify tronque parfois le début de la description
// sur les épisodes Pop, d'où le OR plutôt qu'un seul signal) — dès qu'un des
// deux signaux matche, l'épisode compte comme actu.
const HUGODECRYPTE_SHOW_ID = "6y1PloEyNsCNJH9vHias4T";
const ACTU_DU_JOUR_DATE_SUFFIX = /\(\d{2}\/\d{2}\)$/;
const ACTU_DU_JOUR_DESC = "résumé de l’actualité du jour";
const ACTU_POP_TITLE_PREFIX = "(pop)";
const ACTU_POP_DESC = "résumé de l’actualité culturelle";

const matchesTitleFilter = (show: PodcastShow, episodeName: string): boolean =>
  !show.titleIncludes ||
  episodeName.toLowerCase().includes(show.titleIncludes.toLowerCase());

const detectEpisodeCategory = (
  show: PodcastShow,
  episode: SpotifyEpisodeObject,
): PodcastCategory => {
  const title = episode.name.trim().toLowerCase();

  if (show.category === "actu" && title.startsWith(METEO_TITLE_PREFIX)) {
    return "meteo";
  }

  if (show.id === HUGODECRYPTE_SHOW_ID) {
    const description = episode.description.toLowerCase();
    const isActuDuJour =
      ACTU_DU_JOUR_DATE_SUFFIX.test(title) ||
      description.includes(ACTU_DU_JOUR_DESC);
    const isActuPop =
      title.startsWith(ACTU_POP_TITLE_PREFIX) ||
      description.includes(ACTU_POP_DESC);
    return isActuDuJour || isActuPop ? "actu" : "thematique";
  }

  return show.category;
};

interface SpotifyEpisodeObject {
  id: string;
  name: string;
  description: string;
  uri: string;
  duration_ms: number;
  release_date: string;
}

// `release_date` peut être tronquée ("YYYY" ou "YYYY-MM") sur de rares
// épisodes mal renseignés — un Date invalide est alors traité comme frais
// plutôt que d'exclure une source à tort.
const isTooOld = (releaseDate: string, maxAgeDays: number): boolean => {
  const ageMs = Date.now() - new Date(releaseDate).getTime();
  return !Number.isNaN(ageMs) && ageMs > maxAgeDays * 24 * 60 * 60 * 1000;
};

interface SpotifyPagedResponse<T> {
  items: T[];
}

// Un épisode se glisse dans le mix comme un Track (même `uri`, ajoutable à
// la playlist de la même façon) — pas besoin d'un type dédié.
const toEpisodeTrack = (
  show: PodcastShow,
  episode: SpotifyEpisodeObject,
): Track => ({
  id: episode.id,
  name: episode.name,
  artistNames: [show.name],
  uri: episode.uri,
  durationMs: episode.duration_ms,
});

export interface EligibleEpisode {
  track: Track;
  category: PodcastCategory;
}

// Un show peut avoir PLUSIEURS épisodes récents éligibles (ex. HugoDécrypte
// publie plusieurs fois par jour) — on ne se limite plus au seul dernier
// épisode, sinon le pool de tirage au sort est artificiellement réduit au
// nombre de shows au lieu du nombre réel d'épisodes frais disponibles.
// Un show sans épisode éligible (flux à l'arrêt, trop vieux, erreur API) ne
// doit pas faire échouer toute la génération — on le log et on continue
// sans lui.
export const getEligibleEpisodes = async (
  accessToken: string,
  show: PodcastShow,
): Promise<EligibleEpisode[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/shows/${show.id}/episodes?market=FR&limit=${EPISODES_FETCH_LIMIT}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.ok) {
      console.warn(
        `Podcast "${show.name}" ignoré (${response.status} sur /shows/${show.id}/episodes)`,
      );
      return [];
    }

    const data =
      (await response.json()) as SpotifyPagedResponse<SpotifyEpisodeObject | null>;
    // Spotify peut renvoyer `null` pour un épisode précis (restriction par
    // épisode, indépendante de la restriction par show) — on les retire
    // avant tout, peu importe leur position dans la liste.
    const episodes = data.items
      .filter((item): item is SpotifyEpisodeObject => item !== null)
      .filter((episode) => matchesTitleFilter(show, episode.name));

    if (episodes.length === 0) {
      console.warn(
        `Podcast "${show.name}" ignoré (aucun épisode exploitable sur le marché FR)`,
      );
      return [];
    }

    const eligible = episodes
      .map((episode) => ({
        episode,
        category: detectEpisodeCategory(show, episode),
      }))
      .filter(
        ({ episode, category }) =>
          !isTooOld(episode.release_date, EPISODE_MAX_AGE_DAYS[category]),
      );
    if (eligible.length === 0) {
      console.warn(
        `Podcast "${show.name}" ignoré (dernier épisode du ${episodes[0]!.release_date}, trop ancien)`,
      );
      return [];
    }

    return eligible.map(({ episode, category }) => ({
      track: toEpisodeTrack(show, episode),
      category,
    }));
  } catch (error) {
    console.warn(
      `Podcast "${show.name}" ignoré (${error instanceof Error ? error.message : error})`,
    );
    return [];
  }
};
