import assert from "node:assert/strict";
import { test } from "node:test";
import {
  deadShowsMessage,
  healthStatusOf,
  pickRotation,
} from "./show-health.js";

const now = new Date("2026-10-19T05:00:00Z");
const check = (httpStatus: number, lastEpisodeDate: string | null) => ({
  showId: "s",
  httpStatus,
  lastEpisodeDate,
});

test("verdict de santé d'un show", () => {
  assert.equal(healthStatusOf(check(200, "2026-10-10"), now), "ok");
  assert.equal(healthStatusOf(check(200, "2026-09-01"), now), "stale");
  assert.equal(healthStatusOf(check(200, null), now), "stale");
  assert.equal(healthStatusOf(check(404, null), now), "not_found");
  assert.equal(healthStatusOf(check(503, null), now), null);
});

test("rotation : jamais vérifiés puis plus anciens, sans ceux du jour", () => {
  const lastChecked = new Map([
    ["a", "2026-10-18T05:00:00Z"],
    ["b", "2026-10-10T05:00:00Z"],
  ]);
  assert.deepEqual(
    pickRotation(["a", "b", "c", "d"], lastChecked, new Set(["d"]), 2),
    ["c", "b"],
  );
});

test("message des shows morts, tronqué au-delà de la limite", () => {
  assert.equal(
    deadShowsMessage([
      { name: "A", lastEpisodeDate: "2026-06-05", status: "stale" },
      { name: "B", lastEpisodeDate: null, status: "not_found" },
    ]),
    "2 sources mortes : A (05/06), B (introuvable sur Spotify)",
  );
  const many = Array.from({ length: 20 }, (_, i) => ({
    name: `Un podcast au nom assez long ${i}`,
    lastEpisodeDate: "2026-06-05",
    status: "stale" as const,
  }));
  const message = deadShowsMessage(many);
  assert.ok(message.length <= 250);
  assert.match(message, /… \+\d+ autres$/);
});
