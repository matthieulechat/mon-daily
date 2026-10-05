import type { PodcastCategory } from "../config/podcast-shows.ts";
import type { Track } from "../types/index.ts";

export interface PodcastPick {
  showId: string;
  track: Track;
  category: PodcastCategory;
}

export interface MixQueues {
  actu: PodcastPick[];
  meteo: PodcastPick[];
  thematic: PodcastPick[];
}

export interface RangeShare {
  share: number;
}

// Durée moyenne d'un titre musique, pour estimer combien de titres il faut
// piocher dans les fenêtres d'écoute avant de connaître leur durée réelle.
const AVG_TRACK_MS = 3.5 * 60 * 1000;
const MUSIC_MARGIN_COUNT = 10;
const MUSIC_MIN_COUNT = 20;
const MAX_TRACKS_PER_ARTIST = 5;

// Gabarit (donné par Matthieu le 2026-09-22, ouverture actu+météo ajoutée le
// 2026-09-28) : 1 actu puis la météo du jour en ouverture (avant toute
// musique), 2 musiques, puis la boucle "thématique, 4 musiques, actu, 4
// musiques" répétée tant qu'il reste des podcasts éligibles. Une catégorie
// épuisée est remplacée par l'autre (fallback croisé), la météo reste limitée
// à 1. Pool épuisé : la musique restante suit en continu. Aucun plafond par
// catégorie ni proportion : c'est la coupe de durée max qui borne la playlist.
const OPENING_MUSIC_COUNT = 2;
const MUSIC_BLOCK_COUNT = 4;

// Spotify liste parfois le même morceau deux fois sous des ids différents
// (ex. "Titre" et "Titre (Music Video)") — on dédoublonne aussi sur
// nom+artiste après avoir retiré ce suffixe, pas juste sur l'id.
const normalizeTrackName = (name: string): string =>
  name
    .replace(/\s*\(music video\)\s*$/i, "")
    .trim()
    .toLowerCase();

export const dedupeTracks = (tracks: Track[]): Track[] => {
  const seen = new Set<string>();
  return tracks.filter((track) => {
    const nameKey = `${normalizeTrackName(track.name)}::${track.artistNames[0]?.trim().toLowerCase() ?? ""}`;
    if (seen.has(track.id) || seen.has(nameKey)) return false;
    seen.add(track.id);
    seen.add(nameKey);
    return true;
  });
};

export const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};

// Nombre de titres musique à sélectionner : assez pour remplir toute la durée
// max (les podcasts n'en prennent qu'une partie, la coupe finale tranche),
// plus une marge.
export const musicTargetCount = (maxDurationMs: number): number =>
  Math.max(
    MUSIC_MIN_COUNT,
    Math.ceil(maxDurationMs / AVG_TRACK_MS) + MUSIC_MARGIN_COUNT,
  );

// Répartition des titres musique par fenêtre d'écoute (`results[i]` suit
// `ranges[i].share`). Un titre présent dans plusieurs fenêtres compte dans la
// plus récente. Plafond de titres par artiste (1er artiste listé) appliqué
// AVANT le mélange final : les titres écartés sont remplacés par d'autres
// artistes jusqu'à `targetCount`, dans la limite de ce que les pools
// contiennent.
export const selectMusic = (
  results: Track[][],
  ranges: RangeShare[],
  targetCount: number,
): Track[] => {
  const kept: Track[] = [];
  const picked: Track[] = [];
  const leftovers: Track[] = [];
  ranges.forEach(({ share }, i) => {
    const unique = dedupeTracks([...kept, ...(results[i] ?? [])]).slice(
      kept.length,
    );
    kept.push(...unique);
    const shuffled = shuffle(unique);
    const quota = Math.round(targetCount * share);
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
    if (selected.length >= targetCount) break;
    tryAdd(track);
  }

  return shuffle(selected);
};

// Premier épisode de la file qui tient dans le budget restant (file primaire
// d'abord, puis secondaire = fallback croisé) : un épisode trop long est
// laissé de côté et un plus court est repioché à sa place.
const takePick = (
  primary: PodcastPick[],
  secondary: PodcastPick[],
  fits: (pick: PodcastPick) => boolean,
): PodcastPick | undefined => {
  for (const queue of [primary, secondary]) {
    const index = queue.findIndex(fits);
    if (index >= 0) return queue.splice(index, 1)[0];
  }
  return undefined;
};

// `maxDurationMs` / `usedMs` : budget total et durée déjà consommée (jingle).
// Un podcast qui ferait dépasser le budget n'est jamais posé ; la musique ne
// comble pas la place, le gabarit continue tel quel.
export const buildMix = (
  music: Track[],
  queues: MixQueues,
  maxDurationMs = Infinity,
  usedMs = 0,
): { tracks: Track[]; picks: PodcastPick[] } => {
  const tracks: Track[] = [];
  const picks: PodcastPick[] = [];
  let musicIndex = 0;
  let elapsedMs = usedMs;

  const fits = (pick: PodcastPick): boolean =>
    elapsedMs + pick.track.durationMs <= maxDurationMs;
  const addMusic = (count: number): void => {
    const end = Math.min(musicIndex + count, music.length);
    for (const track of music.slice(musicIndex, end)) {
      tracks.push(track);
      elapsedMs += track.durationMs;
    }
    musicIndex = end;
  };
  const addPick = (pick: PodcastPick | undefined): void => {
    if (!pick) return;
    tracks.push(pick.track);
    picks.push(pick);
    elapsedMs += pick.track.durationMs;
  };

  addPick(takePick(queues.actu, queues.thematic, fits));
  addPick(takePick(queues.meteo, [], fits));
  addMusic(OPENING_MUSIC_COUNT);

  // Arrêt sans progrès (musique épuisée et plus aucun podcast ne tient).
  while (
    (queues.actu.length > 0 || queues.thematic.length > 0) &&
    elapsedMs < maxDurationMs
  ) {
    const before = tracks.length;
    addPick(takePick(queues.thematic, queues.actu, fits));
    addMusic(MUSIC_BLOCK_COUNT);
    addPick(takePick(queues.actu, queues.thematic, fits));
    addMusic(MUSIC_BLOCK_COUNT);
    if (tracks.length === before) break;
  }

  addMusic(music.length - musicIndex);
  return { tracks, picks };
};

// Coupe la playlist dès que l'ajout du titre suivant dépasserait le budget —
// les titres en tête (musiques les plus écoutées, podcasts prioritaires)
// survivent, ceux de fin sont sacrifiés en premier.
export const truncateToDuration = (
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
