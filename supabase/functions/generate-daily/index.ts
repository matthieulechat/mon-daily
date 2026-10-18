import { createClient } from "npm:@supabase/supabase-js@2";
import { env } from "./config/env.ts";
import { generatePlaylistForUser } from "./generate-playlist.ts";

interface RunOutcome {
  userId: string;
  status: "ok" | "error";
  result?: Awaited<ReturnType<typeof generatePlaylistForUser>>;
  error?: string;
}

// Heartbeat Uptime Kuma (push monitor sur le RPi, exposé via Tailscale Funnel,
// cf. docs/AUTOMATION.md). "down" si un compte échoue ou si un daily sort sans
// podcast (ex. 429 Spotify) ; l'absence de ping (crash, cron muet) est
// détectée côté Kuma par l'intervalle de 25 h. Secret absent = pas de ping.
const pingUptime = async (outcomes: RunOutcome[]): Promise<void> => {
  const pushUrl = Deno.env.get("UPTIME_PUSH_URL");
  if (!pushUrl) return;

  const problems = outcomes.flatMap((o) => {
    if (o.status === "error") return [`${o.userId}: ${o.error}`];
    if (o.result?.podcastsCount === 0) return [`${o.userId}: 0 podcast`];
    return [];
  });
  const status = problems.length > 0 ? "down" : "up";
  const msg =
    problems.length > 0
      ? problems.join(" | ").slice(0, 250)
      : `${outcomes.length} compte(s) OK`;

  try {
    const url = new URL(pushUrl);
    url.searchParams.set("status", status);
    url.searchParams.set("msg", msg);
    await fetch(url, { signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    // Un ping raté ne doit pas faire échouer la génération : Kuma alertera
    // de lui-même faute de heartbeat.
    console.error("Ping Uptime Kuma échoué:", err);
  }
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
  await pingUptime(outcomes);

  return new Response(JSON.stringify({ outcomes }), {
    status: hasError ? 207 : 200,
    headers: { "Content-Type": "application/json" },
  });
});
