import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import type { OAuthTokens } from "../types/index.js";
import type { PlaylistHistoryEntry, Storage } from "./storage.interface.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

interface OAuthTokensRow {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

// `userId` (param public) est l'id externe Spotify ; l'historique est
// rattaché à l'identité interne `users.id` (cf. BDR-010). Le login/generate
// crée déjà la ligne oauth_tokens avant d'atteindre ce point.
const resolveInternalUserId = async (userId: string): Promise<string> => {
  const { data, error } = await supabase
    .from("oauth_tokens")
    .select("user_id")
    .eq("platform", "spotify")
    .eq("platform_user_id", userId)
    .single<{ user_id: string }>();

  if (error || !data)
    throw new Error(
      `Aucun utilisateur pour "${userId}" — lance d'abord pnpm run login.`,
    );

  return data.user_id;
};

export const supabaseStorage: Storage = {
  // `userId` est l'id externe de la plateforme (ex. Spotify user id).
  // `oauth_tokens` porte le (platform, platform_user_id) : un même `users.id`
  // peut avoir plusieurs lignes `oauth_tokens` (une par provider connecté).
  getTokens: async (userId) => {
    const { data, error } = await supabase
      .from("oauth_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("platform", "spotify")
      .eq("platform_user_id", userId)
      .maybeSingle<OAuthTokensRow>();

    if (error) throw new Error(`Supabase getTokens: ${error.message}`);
    if (!data) return null;

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
    };
  },

  saveTokens: async (userId, tokens) => {
    const { data: existing, error: findError } = await supabase
      .from("oauth_tokens")
      .select("user_id")
      .eq("platform", "spotify")
      .eq("platform_user_id", userId)
      .maybeSingle<{ user_id: string }>();

    if (findError)
      throw new Error(`Supabase saveTokens (lookup): ${findError.message}`);

    let ownerId = existing?.user_id;

    if (!ownerId) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({})
        .select("id")
        .single();

      if (userError)
        throw new Error(`Supabase saveTokens (users): ${userError.message}`);

      ownerId = user.id;
    }

    const { error: tokensError } = await supabase.from("oauth_tokens").upsert(
      {
        user_id: ownerId,
        platform: "spotify",
        platform_user_id: userId,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: tokens.expiresAt,
      },
      { onConflict: "platform,platform_user_id" },
    );

    if (tokensError)
      throw new Error(
        `Supabase saveTokens (oauth_tokens): ${tokensError.message}`,
      );
  },

  // Sert uniquement à la rotation des podcasts "découverte" (cf. generate.ts)
  // — pas à l'anti-répétition musicale, qui est désormais voulue.
  getRecentShowIds: async (userId, days) => {
    const internalUserId = await resolveInternalUserId(userId);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("playlist_history")
      .select("show_ids")
      .eq("user_id", internalUserId)
      .gte("generated_at", since.toISOString())
      .returns<{ show_ids: string[] }[]>();

    if (error) throw new Error(`Supabase getRecentShowIds: ${error.message}`);

    return data.flatMap((row) => row.show_ids);
  },

  saveHistory: async (userId, entry: PlaylistHistoryEntry) => {
    const internalUserId = await resolveInternalUserId(userId);

    const { error } = await supabase.from("playlist_history").insert({
      user_id: internalUserId,
      track_ids: entry.trackIds,
      show_ids: entry.showIds,
    });

    if (error) throw new Error(`Supabase saveHistory: ${error.message}`);
  },
};
