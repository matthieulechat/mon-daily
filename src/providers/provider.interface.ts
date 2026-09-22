import type { OAuthTokens, Track } from "../types/index.js";

export interface MusicProvider {
  getTopTracks: (accessToken: string) => Promise<Track[]>;
  createOrUpdatePlaylist: (
    accessToken: string,
    userId: string,
    tracks: Track[],
  ) => Promise<void>;
  refreshTokenIfNeeded: (tokens: OAuthTokens) => Promise<OAuthTokens>;
}
