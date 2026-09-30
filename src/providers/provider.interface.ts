import type { OAuthTokens, Track } from "../types/index.js";

// Fenêtres d'écoute Spotify : ~4 semaines, ~6 mois, ~1 an et plus.
export type TopTracksRange = "short_term" | "medium_term" | "long_term";

export interface MusicProvider {
  getTopTracks: (
    accessToken: string,
    range: TopTracksRange,
  ) => Promise<Track[]>;
  createOrUpdatePlaylist: (
    accessToken: string,
    userId: string,
    tracks: Track[],
  ) => Promise<void>;
  refreshTokenIfNeeded: (tokens: OAuthTokens) => Promise<OAuthTokens>;
}
