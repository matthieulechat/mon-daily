// Génère scripts/config/show-covers.ts (id de show → URL de pochette 300 px).
// À relancer quand PODCAST_SHOWS change : pnpm covers
import { writeFileSync } from "node:fs";
import { env } from "./config/env.js";
import { PODCAST_SHOWS } from "./config/podcast-shows.js";

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = env;

interface Image {
  url: string;
  width: number | null;
}

const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});
const { access_token } = (await tokenRes.json()) as { access_token: string };

// Le batch /shows?ids= est refusé (403, cf. LRN-008) : un appel par show.
const covers: Record<string, string> = {};
for (const show of PODCAST_SHOWS) {
  const res = await fetch(
    `https://api.spotify.com/v1/shows/${show.id}?market=FR`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
    },
  );
  if (!res.ok) {
    console.warn(`✗ ${show.name} (${res.status})`);
    continue;
  }
  const { images } = (await res.json()) as { images: Image[] };
  const best = [...images].sort(
    (a, b) => Math.abs((a.width ?? 0) - 300) - Math.abs((b.width ?? 0) - 300),
  )[0];
  if (best) covers[show.id] = best.url;
}

writeFileSync(
  new URL("./config/show-covers.ts", import.meta.url),
  `// Généré par scripts/fetch-show-covers.ts — ne pas éditer à la main.\nexport const SHOW_COVERS: Record<string, string> = ${JSON.stringify(covers, null, 2)};\n`,
);
console.log(
  `✓ ${Object.keys(covers).length}/${PODCAST_SHOWS.length} pochettes`,
);
