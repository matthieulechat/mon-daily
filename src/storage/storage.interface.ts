import type { OAuthTokens } from "../types/index.js";

export interface PlaylistHistoryEntry {
  trackIds: string[];
  showIds: string[];
}

export interface Storage {
  getTokens: (userId: string) => Promise<OAuthTokens | null>;
  saveTokens: (userId: string, tokens: OAuthTokens) => Promise<void>;
  getRecentShowIds: (userId: string, days: number) => Promise<string[]>;
  saveHistory: (userId: string, entry: PlaylistHistoryEntry) => Promise<void>;
}
