import type { OAuthTokens, UserSettings } from "../types/index.js";

export interface Storage {
  getTokens: (userId: string) => Promise<OAuthTokens | null>;
  saveTokens: (userId: string, tokens: OAuthTokens) => Promise<void>;
  // Id de la playlist "Mon Daily" du compte, pour ne pas la rechercher par nom
  // à chaque run (une recherche ratée créait une playlist en doublon).
  getPlaylistId: (userId: string) => Promise<string | null>;
  savePlaylistId: (userId: string, playlistId: string) => Promise<void>;
  // Réglages de l'interface web ; valeurs par défaut si jamais enregistrés.
  getSettings: (userId: string) => Promise<UserSettings>;
}
