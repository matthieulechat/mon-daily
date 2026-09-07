import type { MusicProvider } from "../providers/provider.interface.js";
import type { Track } from "../types/index.js";

export const discoverTracksForGenres = async (
  provider: MusicProvider,
  accessToken: string,
  genres: string[],
  knownTrackIds: Set<string>,
  perGenre = 10,
): Promise<Track[]> => {
  const results = await Promise.all(
    genres.map((genre) => provider.searchByGenre(accessToken, genre, perGenre)),
  );

  const seen = new Set<string>(knownTrackIds);
  const discovered: Track[] = [];

  for (const track of results.flat()) {
    if (seen.has(track.id)) continue;
    seen.add(track.id);
    discovered.push(track);
  }

  return discovered;
};
