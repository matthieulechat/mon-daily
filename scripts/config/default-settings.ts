import type { UserSettings } from "../types/index.js";

// Bornes identiques aux contraintes CHECK de la table `user_settings`.
export const SETTINGS_LIMITS = {
  maxDurationMinutes: { min: 60, max: 480, step: 15 },
} as const;

// Comportement historique : 4h, toutes sources actives.
export const DEFAULT_SETTINGS: UserSettings = {
  maxDurationMinutes: 240,
  disabledShowIds: [],
};
