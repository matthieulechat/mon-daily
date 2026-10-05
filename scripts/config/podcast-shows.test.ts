import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PODCAST_SHOWS,
  isShowEnabled,
  type PodcastShow,
} from "./podcast-shows.js";

const regular: PodcastShow = { id: "a", name: "A", category: "actu" };
const optIn: PodcastShow = {
  id: "b",
  name: "B",
  category: "actu",
  optIn: true,
};
const none = { disabledShowIds: [], enabledShowIds: [] };

test("un show classique est actif sauf s'il est désactivé", () => {
  assert.equal(isShowEnabled(regular, none), true);
  assert.equal(
    isShowEnabled(regular, { ...none, disabledShowIds: ["a"] }),
    false,
  );
});

test("un show optIn est inactif sauf s'il est activé", () => {
  assert.equal(isShowEnabled(optIn, none), false);
  assert.equal(isShowEnabled(optIn, { ...none, enabledShowIds: ["b"] }), true);
  // `disabledShowIds` ne joue pas pour un show optIn.
  assert.equal(
    isShowEnabled(optIn, { ...none, disabledShowIds: ["b"] }),
    false,
  );
});

test("les ids de PODCAST_SHOWS sont uniques", () => {
  const ids = PODCAST_SHOWS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});
