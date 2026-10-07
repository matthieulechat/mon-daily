import { z } from "zod";
import { SETTINGS_LIMITS } from "@shared/config/default-settings";

const { maxDurationMinutes } = SETTINGS_LIMITS;

// Mêmes bornes que les CHECK de la table `user_settings`.
export const settingsSchema = z.object({
  maxDurationMinutes: z
    .number()
    .int()
    .min(maxDurationMinutes.min)
    .max(maxDurationMinutes.max),
  maxEpisodeMinutes: z.number().int().min(5).max(600).nullable(),
  disabledShowIds: z.array(z.string()),
  enabledShowIds: z.array(z.string()),
});

export const settingsRowSchema = z.object({
  max_duration_minutes: z.number(),
  max_episode_minutes: z.number().nullable(),
  disabled_show_ids: z.array(z.string()),
  enabled_show_ids: z.array(z.string()),
});
