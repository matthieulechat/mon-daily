import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });

const envSchema = z.object({
  SPOTIFY_CLIENT_ID: z
    .string()
    .min(1, "SPOTIFY_CLIENT_ID manquant dans .env.local"),
  SPOTIFY_CLIENT_SECRET: z
    .string()
    .min(1, "SPOTIFY_CLIENT_SECRET manquant dans .env.local"),
  SPOTIFY_REDIRECT_URI: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local"),
});

export const env = envSchema.parse(process.env);
