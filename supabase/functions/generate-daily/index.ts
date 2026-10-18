import { createClient } from "npm:@supabase/supabase-js@2";
import { env } from "./config/env.ts";
import type { ShowCheck } from "./core/podcast-source.ts";
import { generatePlaylistForUser } from "./generate-playlist.ts";
import { monitorSources } from "./monitor-sources.ts";
import { pushUptime } from "./uptime.ts";

interface RunOutcome {
  userId: string;
  status: "ok" | "error";
  result?: Awaited<ReturnType<typeof generatePlaylistForUser>>;
  error?: string;
}

// Heartbeat Uptime Kuma "Mon Daily" : "down" si un compte échoue ou si un
// daily sort sans podcast (ex. 429 Spotify) ; l'absence de ping (crash, cron
// muet) est détectée côté Kuma par l'intervalle de 25 h.
const pingUptime = async (outcomes: RunOutcome[]): Promise<void> => {
  const problems = outcomes.flatMap((o) => {
    if (o.status === "error") return [`${o.userId}: ${o.error}`];
    if (o.result?.podcastsCount === 0) return [`${o.userId}: 0 podcast`];
    return [];
  });
  await pushUptime(
    "UPTIME_PUSH_URL",
    problems.length > 0 ? "down" : "up",
    problems.length > 0
      ? problems.join(" | ").slice(0, 250)
      : `${outcomes.length} compte(s) OK`,
  );
};

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
  // Santé des sources (monitor-sources.ts) : un show interrogé pour plusieurs
  // comptes n'est compté qu'une fois.
  const showChecks = new Map<string, ShowCheck>();
  const onShowChecked = (check: ShowCheck) =>
    showChecks.set(check.showId, check);
  for (const row of rows) {
    const userId = row.platform_user_id as string;
    try {
      const result = await generatePlaylistForUser(userId, onShowChecked);
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
  await pingUptime(outcomes);
  // Le suivi des sources ne doit jamais faire échouer le run : sans ping,
  // le monitor "sources" de Kuma alertera de lui-même au bout de 25 h.
  try {
    await monitorSources(supabase, showChecks);
  } catch (err) {
    console.error("Suivi de santé des sources échoué:", err);
  }

  return new Response(JSON.stringify({ outcomes }), {
    status: hasError ? 207 : 200,
    headers: { "Content-Type": "application/json" },
  });
});
