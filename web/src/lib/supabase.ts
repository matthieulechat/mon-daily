import { createClient } from "@supabase/supabase-js";

// Lues dans le .env.local de la racine (cf. envDir dans vite.config.ts).
const url = import.meta.env.SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

if (!url || !publishableKey) {
  throw new Error(
    "SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY manquants dans .env.local (racine)",
  );
}

export const supabase = createClient(url, publishableKey);
