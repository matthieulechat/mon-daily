import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchSpotifyWithRetry } from "./spotify-http.js";

const stubFetch = (statuses: number[]): (() => number) => {
  let calls = 0;
  globalThis.fetch = (async () =>
    new Response(null, {
      status: statuses[Math.min(calls++, statuses.length - 1)],
      headers: { "Retry-After": "0" },
    })) as typeof fetch;
  return () => calls;
};

test("retente un 502 passager puis renvoie la réponse OK", async () => {
  const calls = stubFetch([502, 200]);
  const response = await fetchSpotifyWithRetry("https://example.test");
  assert.equal(response.status, 200);
  assert.equal(calls(), 2);
});

test("ne retente pas une erreur 4xx hors 429", async () => {
  const calls = stubFetch([400]);
  const response = await fetchSpotifyWithRetry("https://example.test");
  assert.equal(response.status, 400);
  assert.equal(calls(), 1);
});
