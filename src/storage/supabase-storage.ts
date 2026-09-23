import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import type { OAuthTokens } from "../types/index.js";
import type { Storage } from "./storage.interface.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

interface OAuthTokensRow {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

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
};
