import { createHash, randomBytes } from "node:crypto";
import { env } from "../config/env.js";
import type { OAuthTokens } from "../types/index.js";

export const SPOTIFY_SCOPES = [
  "user-top-read",
  "playlist-modify-private",
  "playlist-read-private",
  "user-read-recently-played",
  "ugc-image-upload",
].join(" ");

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

const base64url = (buffer: Buffer): string =>
  buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export interface PkcePair {
  verifier: string;
  challenge: string;
}

export const generatePkcePair = (): PkcePair => {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
};

export const buildAuthUrl = (challenge: string, state: string): string => {
  const params = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SPOTIFY_SCOPES,
    state,
  });

  return `${AUTHORIZE_URL}?${params.toString()}`;
};

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

const toOAuthTokens = (
  data: SpotifyTokenResponse,
  previousRefreshToken?: string,
): OAuthTokens => ({
  accessToken: data.access_token,
  refreshToken: data.refresh_token ?? previousRefreshToken ?? "",
  expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
});

export const exchangeCodeForToken = async (
  code: string,
  verifier: string,
): Promise<OAuthTokens> => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    client_id: env.SPOTIFY_CLIENT_ID,
    client_secret: env.SPOTIFY_CLIENT_SECRET,
    code_verifier: verifier,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(
      `Échange du code Spotify échoué (${response.status}): ${await response.text()}`,
    );
  }

  return toOAuthTokens((await response.json()) as SpotifyTokenResponse);
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<OAuthTokens> => {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: env.SPOTIFY_CLIENT_ID,
    client_secret: env.SPOTIFY_CLIENT_SECRET,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(
      `Refresh du token Spotify échoué (${response.status}): ${await response.text()}`,
    );
  }

  return toOAuthTokens(
    (await response.json()) as SpotifyTokenResponse,
    refreshToken,
  );
};
