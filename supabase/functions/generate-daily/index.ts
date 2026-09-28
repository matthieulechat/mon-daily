import { createClient } from "npm:@supabase/supabase-js@2";
import { env } from "./config/env.ts";
import { generatePlaylistForUser } from "./generate-playlist.ts";

interface RunOutcome {
  userId: string;
  status: "ok" | "error";
  result?: Awaited<ReturnType<typeof generatePlaylistForUser>>;
  error?: string;
}

Deno.serve(async () => {
  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data: rows, error } = await supabase
    .from("oauth_tokens")
    .select("platform_user_id")
    .eq("platform", "spotify");

  if (error) {
    return new Response(
      JSON.stringify({
        error: `Lecture oauth_tokens échouée: ${error.message}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Un compte en échec (token révoqué, erreur Spotify...) n'empêche pas les
  // autres de tourner — même logique que l'isolation d'erreur déjà en place
  // par show dans podcast-source.ts.
  const outcomes: RunOutcome[] = [];
  for (const row of rows) {
    const userId = row.platform_user_id as string;
    try {
      const result = await generatePlaylistForUser(userId);
      outcomes.push({ userId, status: "ok", result });
    } catch (err) {
      console.error(`Génération échouée pour "${userId}":`, err);
      outcomes.push({
        userId,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const hasError = outcomes.some((o) => o.status === "error");

  return new Response(JSON.stringify({ outcomes }), {
    status: hasError ? 207 : 200,
    headers: { "Content-Type": "application/json" },
  });
});
