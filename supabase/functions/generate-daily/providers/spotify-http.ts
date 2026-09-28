// Partagé par spotify.provider.ts et podcast-source.ts : Spotify applique
// un rate limit par app (fenêtre glissante courte), pas par compte — un run
// qui tire des dizaines de requêtes en rafale (cf. fetchEligibleEpisodes)
// peut le taper. Respecte l'en-tête Retry-After quand Spotify le fournit,
// sinon backoff exponentiel + jitter (évite que plusieurs requêtes en
// rafale retentent toutes au même instant).
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchSpotifyWithRetry = async (
  url: string,
  init?: RequestInit,
): Promise<Response> => {
  let response = await fetch(url, init);

  for (
    let attempt = 0;
    attempt < MAX_RETRIES && response.status === 429;
    attempt++
  ) {
    const retryAfterHeader = response.headers.get("Retry-After");
    const delayMs = retryAfterHeader
      ? Number(retryAfterHeader) * 1000
      : BASE_DELAY_MS * 2 ** attempt + Math.random() * 500;

    await wait(delayMs);
    response = await fetch(url, init);
  }

  return response;
};
