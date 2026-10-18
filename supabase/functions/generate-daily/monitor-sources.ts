import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { DEFAULT_SETTINGS } from "./config/default-settings.ts";
import { env } from "./config/env.ts";
import { PODCAST_SHOWS } from "./config/podcast-shows.ts";
import { getEligibleEpisodes, type ShowCheck } from "./core/podcast-source.ts";
import {
  deadShowsMessage,
  healthStatusOf,
  pickRotation,
  type DeadShow,
  type ShowHealthStatus,
} from "./core/show-health.ts";
import { pushUptime } from "./uptime.ts";

// Shows non interrogés par la génération (optIn jamais activés, shows
// désactivés partout) : 10 par jour en rotation, soit tout le pool en
// quelques jours, très loin du rate limit Spotify (cf. LRN-046).
const ROTATION_SIZE = 10;
const ROTATION_GAP_MS = 1200;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Token "app" (client credentials) : la rotation ne dépend d'aucun compte.
const getAppToken = async (): Promise<string> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error(`Token app Spotify : ${response.status}`);
  const { access_token } = (await response.json()) as { access_token: string };
  return access_token;
};

// `checks` : vérifications passives faites pendant la génération du jour.
export const monitorSources = async (
  supabase: SupabaseClient,
  checks: Map<string, ShowCheck>,
): Promise<void> => {
  const showsById = new Map(PODCAST_SHOWS.map((s) => [s.id, s]));

  const { data: known, error } = await supabase
    .from("show_health")
    .select("show_id, checked_at");
  if (error) throw new Error(`Lecture show_health : ${error.message}`);

  const toCheck = pickRotation(
    [...showsById.keys()],
    new Map(known.map((r) => [r.show_id as string, r.checked_at as string])),
    new Set(checks.keys()),
    ROTATION_SIZE,
  );
  if (toCheck.length > 0) {
    const token = await getAppToken();
    for (const id of toCheck) {
      const show = showsById.get(id);
      if (!show) continue;
      let last: ShowCheck | undefined;
      await getEligibleEpisodes(token, show, DEFAULT_SETTINGS, (check) => {
        last = check;
        checks.set(check.showId, check);
      });
      if (last?.httpStatus === 429) {
        console.warn("Rotation santé des sources interrompue (429 Spotify)");
        break;
      }
      await sleep(ROTATION_GAP_MS);
    }
  }

  const checkedAt = new Date().toISOString();
  const rows = [...checks.values()].flatMap((check) => {
    const status = healthStatusOf(check);
    const show = showsById.get(check.showId);
    if (!status || !show) return [];
    return [
      {
        show_id: check.showId,
        name: show.name,
        last_episode_date: check.lastEpisodeDate,
        status,
        checked_at: checkedAt,
      },
    ];
  });
  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from("show_health")
      .upsert(rows);
    if (upsertError)
      throw new Error(`Écriture show_health : ${upsertError.message}`);
  }

  // Un show retiré de PODCAST_SHOWS ne compte plus (ni dans la vue, ni dans l'alerte).
  await supabase
    .from("show_health")
    .delete()
    .not("show_id", "in", `(${[...showsById.keys()].join(",")})`);

  const { data: dead, error: deadError } = await supabase
    .from("dead_shows")
    .select("name, last_episode_date, status");
  if (deadError) throw new Error(`Lecture dead_shows : ${deadError.message}`);

  const deadShows: DeadShow[] = dead.map((d) => ({
    name: d.name as string,
    lastEpisodeDate: d.last_episode_date as string | null,
    status: d.status as ShowHealthStatus,
  }));
  if (deadShows.length > 0) {
    console.warn(`Sources mortes : ${deadShows.map((d) => d.name).join(", ")}`);
  }
  await pushUptime(
    "UPTIME_SOURCES_PUSH_URL",
    deadShows.length > 0 ? "down" : "up",
    deadShows.length > 0
      ? deadShowsMessage(deadShows)
      : `${showsById.size} sources vivantes`,
  );
};
