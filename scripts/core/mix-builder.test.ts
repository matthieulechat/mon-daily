import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildMix,
  musicTargetCount,
  truncateToDuration,
  type MixQueues,
  type PodcastPick,
} from "./mix-builder.js";
import type { Track } from "../types/index.js";

const MIN = 60_000;

const track = (id: string, minutes: number): Track => ({
  id,
  name: id,
  artistNames: [id],
  uri: id,
  durationMs: minutes * MIN,
});

const pick = (id: string, minutes: number, category: "actu" | "thematique") =>
  ({ showId: id, category, track: track(id, minutes) }) as PodcastPick;

const music = Array.from({ length: 40 }, (_, i) => track(`m${i}`, 3));

const queues = (): MixQueues => ({
  actu: [pick("a1", 10, "actu"), pick("a2", 10, "actu"), pick("a3", 10, "actu")],
  meteo: [],
  thematic: [pick("t1", 30, "thematique"), pick("t2", 30, "thematique")],
});

test("buildMix suit le gabarit jusqu'à épuisement des podcasts", () => {
  const { picks, tracks } = buildMix(music, queues());
  assert.equal(picks.length, 5);
  // Ouverture : 1 actu, puis 2 musiques.
  assert.deepEqual(
    tracks.slice(0, 3).map((t) => t.id),
    ["a1", "m0", "m1"],
  );
});

test("buildMix conserve toute la musique restante", () => {
  const { tracks } = buildMix(music, queues());
  const musicCount = tracks.filter((t) => t.id.startsWith("m")).length;
  assert.equal(musicCount, music.length);
});

test("buildMix repioche un podcast plus court quand le tirage ne tient pas", () => {
  const q: MixQueues = {
    actu: [pick("long", 60, "actu"), pick("court", 10, "actu")],
    meteo: [],
    thematic: [],
  };
  const { picks } = buildMix(music, q, 30 * MIN);
  assert.deepEqual(
    picks.map((p) => p.showId),
    ["court"],
  );
});

test("buildMix ne pose aucun podcast qui dépasse et garde le gabarit", () => {
  const q: MixQueues = {
    actu: [pick("a1", 10, "actu")],
    meteo: [],
    thematic: [pick("t1", 90, "thematique")],
  };
  const { tracks, picks } = buildMix(music, q, 60 * MIN);
  assert.deepEqual(
    picks.map((p) => p.showId),
    ["a1"],
  );
  assert.deepEqual(
    tracks.slice(0, 3).map((t) => t.id),
    ["a1", "m0", "m1"],
  );
});

test("musicTargetCount suit la durée max", () => {
  assert.equal(musicTargetCount(240 * MIN), 79);
  assert.ok(musicTargetCount(480 * MIN) > musicTargetCount(240 * MIN));
  assert.equal(musicTargetCount(10 * MIN), 20);
});

test("truncateToDuration coupe avant de dépasser le budget", () => {
  const result = truncateToDuration([track("a", 10), track("b", 10)], 15 * MIN);
  assert.deepEqual(
    result.map((t) => t.id),
    ["a"],
  );
});
