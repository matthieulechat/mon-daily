import type { Artist } from "../types/index.js";

export const extractDominantGenres = (
  artists: Artist[],
  topN = 3,
): string[] => {
  const genreCounts = new Map<string, number>();

  for (const artist of artists) {
    for (const genre of artist.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }

  return [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([genre]) => genre);
};
