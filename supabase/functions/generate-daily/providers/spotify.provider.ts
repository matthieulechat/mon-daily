import { refreshAccessToken } from "../auth/oauth.service.ts";
import { COVER_IMAGE_BASE64 } from "../config/cover-image.ts";
import type { Track } from "../types/index.ts";
import type { MusicProvider } from "./provider.interface.ts";
import { fetchSpotifyWithRetry } from "./spotify-http.ts";

const API_BASE = "https://api.spotify.com/v1";
const PLAYLIST_NAME = "Mon Daily";
const PLAYLIST_DESCRIPTION =
  "Un nouveau mix chaque jour, pressé sur vinyle : face A tes sons, face B tes news.";
const REFRESH_MARGIN_MS = 60_000;

interface SpotifyTrackObject {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: { name: string }[];
}

interface SpotifyPagedResponse<T> {
  items: T[];
}

interface SpotifyPlaylistObject {
  id: string;
  name: string;
}

const spotifyFetch = async <T>(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetchSpotifyWithRetry(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Appel Spotify échoué (${response.status} ${path}): ${await response.text()}`,
    );
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

const toTrack = (track: SpotifyTrackObject): Track => ({
  id: track.id,
  name: track.name,
  artistNames: track.artists.map((artist) => artist.name),
  uri: track.uri,
  durationMs: track.duration_ms,
});

const uploadCoverImage = async (
  accessToken: string,
  playlistId: string,
): Promise<void> => {
  await spotifyFetch(accessToken, `/playlists/${playlistId}/images`, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: COVER_IMAGE_BASE64,
  });
};

const findOrCreatePlaylistId = async (
  accessToken: string,
  spotifyUserId: string,
): Promise<string> => {
  const existing = await spotifyFetch<
    SpotifyPagedResponse<SpotifyPlaylistObject>
  >(accessToken, "/me/playlists?limit=50");

  const found = existing.items.find(
    (playlist) => playlist.name === PLAYLIST_NAME,
  );
  if (found) return found.id;

  // Diagnostic : une recherche ratée a déjà créé des playlists en doublon
  // alors que "Mon Daily" existait — on garde la trace de ce que Spotify a
  // réellement renvoyé.
  console.warn(
    `Playlist "${PLAYLIST_NAME}" introuvable parmi ${existing.items.length} playlists reçues : ${existing.items.map((playlist) => playlist.name).join(" | ")}`,
  );

  const created = await spotifyFetch<SpotifyPlaylistObject>(
    accessToken,
    "/me/playlists",
    {
      method: "POST",
      body: JSON.stringify({
        name: PLAYLIST_NAME,
        public: false,
        description: PLAYLIST_DESCRIPTION,
      }),
    },
  );

  return created.id;
};

export const spotifyProvider: MusicProvider = {
  getTopTracks: async (accessToken, range) => {
    const data = await spotifyFetch<SpotifyPagedResponse<SpotifyTrackObject>>(
      accessToken,
      `/me/top/tracks?time_range=${range}&limit=50`,
    );
    return data.items.map(toTrack);
  },

  createOrUpdatePlaylist: async (
    accessToken,
    spotifyUserId,
    tracks,
    knownPlaylistId,
  ) => {
    // ponytail: un id connu est utilisé tel quel (pas de contrôle d'existence) ;
    // une playlist supprimée à la main est à effacer de oauth_tokens.playlist_id.
    const playlistId =
      knownPlaylistId ?? (await findOrCreatePlaylistId(accessToken, spotifyUserId));

    // Créer une playlist ne la fait plus apparaître automatiquement dans la
    // bibliothèque du propriétaire (migration Spotify de février 2026) — il
    // faut explicitement la "sauvegarder", comme n'importe quel utilisateur.
    // /me/library (nouvel endpoint unifié documenté) renvoie 400 quel que
    // soit le format du body — on retombe sur /followers, marqué déprécié
    // mais fonctionnel. "public" doit être répété à chaque appel : omis, il
    // repasse la playlist en publique par défaut.
    await spotifyFetch(accessToken, `/playlists/${playlistId}/followers`, {
      method: "PUT",
      body: JSON.stringify({ public: false }),
    });

    await spotifyFetch(accessToken, `/playlists/${playlistId}/items`, {
      method: "PUT",
      body: JSON.stringify({ uris: tracks.map((track) => track.uri) }),
    });

    // À chaque run (pas seulement à la création) : l'id est stocké, une
    // playlist sans pochette ne serait sinon jamais réparée.
    await uploadCoverImage(accessToken, playlistId);

    return playlistId;
  },

  refreshTokenIfNeeded: async (tokens) => {
    const expiresInMs = new Date(tokens.expiresAt).getTime() - Date.now();
    if (expiresInMs > REFRESH_MARGIN_MS) return tokens;
    return refreshAccessToken(tokens.refreshToken);
  },
};
