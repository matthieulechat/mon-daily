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
  getTokens: async (userId) => {
    const { data, error } = await supabase
      .from("oauth_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("user_id", userId)
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
    const { error: userError } = await supabase
      .from("users")
      .upsert(
        { id: userId, platform: "spotify", platform_user_id: userId },
        { onConflict: "id" },
      );

    if (userError)
      throw new Error(`Supabase saveTokens (users): ${userError.message}`);

    const { error: tokensError } = await supabase.from("oauth_tokens").upsert(
      {
        user_id: userId,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: tokens.expiresAt,
      },
      { onConflict: "user_id" },
    );

    if (tokensError)
      throw new Error(
        `Supabase saveTokens (oauth_tokens): ${tokensError.message}`,
      );
  },
};
