import type { Session } from "@supabase/supabase-js";
import { DEFAULT_SETTINGS } from "@shared/config/default-settings";
import type { UserSettings } from "@shared/types/index";
import { settingsRowSchema, settingsSchema } from "./settings.schema";
import { supabase } from "./supabase";

// Supabase Auth renseigne l'id Spotify dans `user_metadata.provider_id`
// (repli `sub`) — même clé que la policy RLS de `user_settings`.
export const spotifyIdOf = (session: Session): string | null => {
  const meta = session.user.user_metadata as Record<string, unknown>;
  const id = meta.provider_id ?? meta.sub;
  return typeof id === "string" ? id : null;
};

export const fetchSettings = async (
  platformUserId: string,
): Promise<UserSettings> => {
  const { data, error } = await supabase
    .from("user_settings")
    .select("max_duration_minutes, disabled_show_ids")
    .eq("platform", "spotify")
    .eq("platform_user_id", platformUserId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return DEFAULT_SETTINGS;

  const row = settingsRowSchema.parse(data);
  return {
    maxDurationMinutes: row.max_duration_minutes,
    disabledShowIds: row.disabled_show_ids,
  };
};

export const saveSettings = async (
  platformUserId: string,
  settings: UserSettings,
): Promise<void> => {
  const valid = settingsSchema.parse(settings);
  const { error } = await supabase.from("user_settings").upsert(
    {
      platform: "spotify",
      platform_user_id: platformUserId,
      max_duration_minutes: valid.maxDurationMinutes,
      disabled_show_ids: valid.disabledShowIds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "platform,platform_user_id" },
  );
  if (error) throw new Error(error.message);
};
