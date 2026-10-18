// Push monitor Uptime Kuma (RPi perso, exposé via Tailscale Funnel, cf.
// docs/AUTOMATION.md). Secret absent = pas de ping. Un ping raté ne fait pas
// échouer la génération : Kuma alertera de lui-même faute de heartbeat.
export const pushUptime = async (
  secretName: string,
  status: "up" | "down",
  msg: string,
): Promise<void> => {
  const pushUrl = Deno.env.get(secretName);
  if (!pushUrl) return;

  try {
    const url = new URL(pushUrl);
    url.searchParams.set("status", status);
    url.searchParams.set("msg", msg);
    await fetch(url, { signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    console.error(`Ping Uptime Kuma (${secretName}) échoué:`, err);
  }
};
