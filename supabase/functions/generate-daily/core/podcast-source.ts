import type { PodcastCategory, PodcastShow } from "../config/podcast-shows.ts";
import { fetchSpotifyWithRetry } from "../providers/spotify-http.ts";
import type { Track } from "../types/index.ts";

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

  if (
    show.actuTitleIncludes &&
    title.includes(show.actuTitleIncludes.toLowerCase())
  ) {
    return "actu";
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

// Titres des shows `latestOnly` (deux formats) :
// - Paris : "Le journal de 12h30 du 29/09/2026", "La météo de 8h du 29/09/2026"
// - GMT   : "Journal 29/09/2026 03h00 GMT", "Tranche d'information 29/09 05h00 GMT"
const TITLE_PARIS = /(\d{1,2})h(\d{2})?\s+du\s+(\d{2})\/(\d{2})\/(\d{4})/i;
const TITLE_GMT = /(\d{2})\/(\d{2})(?:\/(\d{4}))?\s+(\d{1,2})h(\d{2})?\s+GMT/i;

// Heure murale de Paris d'un instant, en ms "UTC" (comparable entre elles).
const parisWallMs = (date: Date): number => {
  const p: Record<string, string> = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  return Date.UTC(+p.year!, +p.month! - 1, +p.day!, +p.hour!, +p.minute!);
};

// - FR    : "Le journal de 08h00 du mardi 29 septembre 2026" (jour de semaine
//           optionnel, titre parfois précédé d'un résumé : "... : le journal de 18h00 du ...")
const TITLE_FR_LONG = /(\d{1,2})h(\d{2})?,?\s+du\s+(?:\p{L}+\s+)?(\d{1,2})(?:er)?\s+(\p{L}+)(?:\s+(\d{4}))?/iu;
const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

// Heure du titre en heure murale de Paris, ou null si absente.
const titleDateMs = (title: string): number | null => {
  const paris = TITLE_PARIS.exec(title);
  if (paris) {
    return Date.UTC(+paris[5]!, +paris[4]! - 1, +paris[3]!, +paris[1]!, +(paris[2] ?? 0));
  }
  const fr = TITLE_FR_LONG.exec(title);
  const month = fr ? FR_MONTHS.indexOf(fr[4]!.toLowerCase()) : -1;
  if (fr && month !== -1) {
    return Date.UTC(fr[5] ? +fr[5] : new Date().getUTCFullYear(), month, +fr[3]!, +fr[1]!, +(fr[2] ?? 0));
  }
  const gmt = TITLE_GMT.exec(title);
  if (gmt) {
    const year = gmt[3] ? +gmt[3] : new Date().getUTCFullYear();
    return parisWallMs(
      new Date(Date.UTC(year, +gmt[2]! - 1, +gmt[1]!, +gmt[4]!, +(gmt[5] ?? 0))),
    );
  }
  return null;
};

// Par clé, garde l'élément dont l'heure (lue dans le titre) est la plus proche
// de l'heure actuelle. Sans heure dans le titre, on retombe sur l'ordre de
// l'API (plus récent d'abord).
// ponytail: "heure actuelle" en dur, à rendre configurable avec la page de
// personnalisation utilisateur.
const keepClosestToNow = <T>(
  items: T[],
  keyOf: (item: T) => string,
  titleOf: (item: T) => string,
): T[] => {
  const now = parisWallMs(new Date());
  const best = new Map<string, { item: T; gap: number }>();
  for (const item of items) {
    const at = titleDateMs(titleOf(item));
    const gap = at === null ? Infinity : Math.abs(now - at);
    const cur = best.get(keyOf(item));
    if (!cur || gap < cur.gap) best.set(keyOf(item), { item, gap });
  }
  return [...best.values()].map(({ item }) => item);
};

// Filtre inter-shows : parmi les épisodes des shows partageant un
// `closestGroup` (ex. "Le journal de 07h00", "de 18h00"...), ne garde que
// celui dont l'heure est la plus proche de maintenant, par catégorie
// effective. Les shows sans groupe passent tels quels ; rien n'est retiré de
// la liste des shows, seuls les épisodes moins frais sont écartés.
export const keepClosestByGroup = <
  T extends { showId: string; track: Track; category: PodcastCategory },
>(
  picks: T[],
  shows: PodcastShow[],
): T[] => {
  const groupOf = new Map(shows.map((s) => [s.id, s.closestGroup]));
  const grouped = picks.filter((p) => groupOf.get(p.showId));
  const kept = new Set(
    keepClosestToNow(
      grouped,
      (p) => `${groupOf.get(p.showId)}|${p.category}`,
      (p) => p.track.name,
    ),
  );
  return picks.filter((p) => !groupOf.get(p.showId) || kept.has(p));
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
    const response = await fetchSpotifyWithRetry(
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
          !isTooOld(
            episode.release_date,
            show.maxAgeDays ?? EPISODE_MAX_AGE_DAYS[category],
          ),
      );
    if (eligible.length === 0) {
      console.warn(
        `Podcast "${show.name}" ignoré (dernier épisode du ${episodes[0]!.release_date}, trop ancien)`,
      );
      return [];
    }

    const kept = show.latestOnly
      ? keepClosestToNow(eligible, (i) => i.category, (i) => i.episode.name)
      : eligible;

    return kept.map(({ episode, category }) => ({
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
