import type { ShowCheck } from "./podcast-source.ts";

// Suivi de la mort des sources podcast (table `show_health`, partagée entre
// comptes). Logique pure ici ; l'écriture en base et l'alerte Uptime Kuma
// vivent dans l'Edge Function (monitor-sources.ts).
export type ShowHealthStatus = "ok" | "stale" | "not_found";

// 30 j plutôt qu'une semaine : évite les fausses alertes sur les pauses
// estivales et les hebdos qui sautent une semaine.
export const DEAD_AFTER_DAYS = 30;
// Message Kuma tronqué au-delà (la liste complète est dans la vue `dead_shows`).
const MESSAGE_MAX = 250;

// `null` = erreur passagère (5xx, 429…) : pas de verdict, on revérifiera.
export const healthStatusOf = (
  check: ShowCheck,
  now: Date = new Date(),
): ShowHealthStatus | null => {
  if (check.httpStatus === 404) return "not_found";
  if (check.httpStatus !== 200) return null;
  if (!check.lastEpisodeDate) return "stale";
  const ageDays =
    (now.getTime() - new Date(check.lastEpisodeDate).getTime()) / 86_400_000;
  return ageDays > DEAD_AFTER_DAYS ? "stale" : "ok";
};

// Shows non vérifiés aujourd'hui (pas interrogés par la génération), le plus
// anciennement vérifié d'abord, jamais vérifié en tête.
export const pickRotation = (
  showIds: string[],
  lastCheckedAt: Map<string, string>,
  checkedToday: Set<string>,
  size: number,
): string[] =>
  showIds
    .filter((id) => !checkedToday.has(id))
    .sort((a, b) =>
      (lastCheckedAt.get(a) ?? "").localeCompare(lastCheckedAt.get(b) ?? ""),
    )
    .slice(0, size);

export interface DeadShow {
  name: string;
  lastEpisodeDate: string | null;
  status: ShowHealthStatus;
}

const deadLabel = ({ name, lastEpisodeDate, status }: DeadShow): string => {
  if (status === "not_found") return `${name} (introuvable sur Spotify)`;
  if (!lastEpisodeDate) return `${name} (aucun épisode exploitable)`;
  const [, month, day] = lastEpisodeDate.split("-");
  return `${name} (${day}/${month})`;
};

// "2 sources mortes : A (05/06), B (introuvable sur Spotify)", suffixé de
// "… +N autre(s)" quand la liste dépasse la limite du message.
export const deadShowsMessage = (dead: DeadShow[]): string => {
  const plural = dead.length > 1 ? "s" : "";
  let message = `${dead.length} source${plural} morte${plural} : `;
  for (const [index, show] of dead.entries()) {
    const label = (index > 0 ? ", " : "") + deadLabel(show);
    const remaining = dead.length - index;
    // Réserve la place du suffixe tant que d'autres shows suivent.
    if (
      message.length + label.length >
      MESSAGE_MAX - (remaining > 1 ? 20 : 0)
    ) {
      return `${message} … +${remaining} autre${remaining > 1 ? "s" : ""}`;
    }
    message += label;
  }
  return message;
};
