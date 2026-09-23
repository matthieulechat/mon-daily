import type { OAuthTokens } from "../types/index.js";

export interface Storage {
  getTokens: (userId: string) => Promise<OAuthTokens | null>;
  saveTokens: (userId: string, tokens: OAuthTokens) => Promise<void>;
}
