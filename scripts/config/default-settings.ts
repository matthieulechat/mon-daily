import type { UserSettings } from "../types/index.js";

// Bornes identiques aux contraintes CHECK de la table `user_settings`.
export const SETTINGS_LIMITS = {
  maxDurationMinutes: { min: 60, max: 480, step: 15 },
} as const;

// Touches de l'interface, calées sur les durées réelles des épisodes (mesure
// du 2026-10-07 sur 127 shows : médiane 14 min, 78 % ≤ 30 min, 97 % ≤ 1 h,
// rien entre 1 h 30 et les intégrales de 3 h) ; `null` = sans limite.
export const EPISODE_MAX_PRESETS = [15, 30, 45, 60, 90, null] as const;

// 4h, épisodes de 1h30 max, toutes sources actives.
export const DEFAULT_SETTINGS: UserSettings = {
  maxDurationMinutes: 240,
  maxEpisodeMinutes: 90,
  disabledShowIds: [],
  enabledShowIds: [],
};
