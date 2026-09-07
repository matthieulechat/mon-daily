import type { Artist, OAuthTokens, Track } from "../types/index.js";

export interface MusicProvider {
  getTopTracks: (accessToken: string) => Promise<Track[]>;
  getTopArtists: (accessToken: string) => Promise<Artist[]>;
  searchByGenre: (
    accessToken: string,
    genre: string,
    limit?: number,
  ) => Promise<Track[]>;
  createOrUpdatePlaylist: (
    accessToken: string,
    userId: string,
    tracks: Track[],
  ) => Promise<void>;
  refreshTokenIfNeeded: (tokens: OAuthTokens) => Promise<OAuthTokens>;
}
