// Version Deno de scripts/config/env.ts — mêmes clés, lues via Deno.env.get()
// au lieu de dotenv/process.env. SPOTIFY_REDIRECT_URI n'est pas nécessaire
// ici (utilisé uniquement par le flow login.ts, jamais exécuté côté cron).
import { z } from "npm:zod@3";

const envSchema = z.object({
  SPOTIFY_CLIENT_ID: z
    .string()
    .min(1, "SPOTIFY_CLIENT_ID manquant dans les secrets de la fonction"),
  SPOTIFY_CLIENT_SECRET: z
    .string()
    .min(1, "SPOTIFY_CLIENT_SECRET manquant dans les secrets de la fonction"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY manquant"),
});

export const env = envSchema.parse({
  SPOTIFY_CLIENT_ID: Deno.env.get("SPOTIFY_CLIENT_ID"),
  SPOTIFY_CLIENT_SECRET: Deno.env.get("SPOTIFY_CLIENT_SECRET"),
  SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
});
