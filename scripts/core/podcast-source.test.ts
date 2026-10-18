import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { PodcastShow } from "../config/podcast-shows.js";
import { moderatedTopicOf } from "../config/moderation.js";
import { keepClosestByGroup, matchesTitleFilter } from "./podcast-source.js";

const shows: PodcastShow[] = [
  { id: "fc", name: "Les journaux de France Culture", category: "actu", closestGroup: "g" },
  { id: "j8", name: "Journal de 08h00", category: "actu", closestGroup: "g" },
];

const pick = (showId: string, name: string) => ({
  showId,
  category: "actu" as const,
  track: { id: name, name, artistNames: [], uri: name, durationMs: 0 },
});

const picks = [
  pick("fc", "JOURNAL DE 7H, du mercredi 30 septembre 2026"),
  pick("fc", "JOURNAL DE 8H45, du mercredi 30 septembre 2026"),
  pick("j8", "Le journal de 08h00 du 30/09/2026"),
];

// 30/09/2026 09:10 à Paris (UTC+2) = 07:10 UTC
test("garde l'édition la plus proche de l'heure actuelle", () => {
  mock.timers.enable({ apis: ["Date"], now: Date.UTC(2026, 8, 30, 7, 10) });
  const kept = keepClosestByGroup(picks, shows).map((p) => p.track.name);
  assert.deepEqual(kept, ["JOURNAL DE 8H45, du mercredi 30 septembre 2026"]);
  mock.timers.reset();
});

test("format GMT : à 11h04 Paris, 09h00 GMT (11h Paris) bat 08h00 GMT", () => {
  mock.timers.enable({ apis: ["Date"], now: Date.UTC(2026, 8, 30, 9, 4) });
  const gmt = [
    pick("fc", "Journal 30/09/2026 08h00 GMT"),
    pick("fc", "Journal 30/09/2026 09h00 GMT"),
  ];
  const kept = keepClosestByGroup(gmt, shows).map((p) => p.track.name);
  assert.deepEqual(kept, ["Journal 30/09/2026 09h00 GMT"]);
  mock.timers.reset();
});

test("à 07h20 Paris, c'est le 7H qui gagne", () => {
  mock.timers.enable({ apis: ["Date"], now: Date.UTC(2026, 8, 30, 5, 20) });
  const kept = keepClosestByGroup(picks, shows).map((p) => p.track.name);
  assert.deepEqual(kept, ["JOURNAL DE 7H, du mercredi 30 septembre 2026"]);
  mock.timers.reset();
});

test("modération : titre normalisé, mots entiers, sujets choisis seulement", () => {
  assert.equal(moderatedTopicOf("L'Ukraine en GUERRE", ["guerre"]), "guerre");
  assert.equal(moderatedTopicOf("Un homicide à Lyon", ["violence"]), "violence");
  assert.equal(moderatedTopicOf("Un féminicide à Lyon", ["violence"]), null);
  assert.equal(moderatedTopicOf("Les violences conjugales", ["violence"]), null);
  assert.equal(moderatedTopicOf("Le violon de Mozart", ["violence"]), null);
  assert.equal(moderatedTopicOf("Il décide de partir", ["violence"]), null);
  assert.equal(moderatedTopicOf("L'éducation sexuelle", ["guerre"]), null);
  assert.equal(moderatedTopicOf("L'éducation sexuelle", ["guerre", "sexualite"]), "sexualite");
  assert.equal(moderatedTopicOf("Le sexisme au travail", ["sexualite"]), null);
  assert.equal(moderatedTopicOf("Sexualités et handicap", ["sexualite"]), "sexualite");
});

test("titleExcludes écarte l'épisode, titleIncludes le garde", () => {
  const show: PodcastShow = { id: "m", name: "Matins", category: "thematique", titleExcludes: "journal de 8h" };
  assert.equal(matchesTitleFilter(show, "JOURNAL DE 8H du dimanche 18 octobre"), false);
  assert.equal(matchesTitleFilter(show, "Travailler comme une bête"), true);
  assert.equal(matchesTitleFilter({ ...show, titleExcludes: undefined, titleIncludes: "actu" }, "Hors sujet"), false);
});
