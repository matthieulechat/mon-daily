import { refreshAccessToken } from "../auth/oauth.service.js";
import type { Track } from "../types/index.js";
import type { MusicProvider } from "./provider.interface.js";

const API_BASE = "https://api.spotify.com/v1";
const PLAYLIST_NAME = "Mon Daily";
const REFRESH_MARGIN_MS = 60_000;

interface SpotifyArtistObject {
  id: string;
  name: string;
  genres: string[];
}

interface SpotifyTrackObject {
  id: string;
  name: string;
  uri: string;
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
  const response = await fetch(`${API_BASE}${path}`, {
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

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const toTrack = (track: SpotifyTrackObject): Track => ({
  id: track.id,
  name: track.name,
  artistNames: track.artists.map((artist) => artist.name),
  uri: track.uri,
});

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

  const created = await spotifyFetch<SpotifyPlaylistObject>(
    accessToken,
    `/users/${spotifyUserId}/playlists`,
    {
      method: "POST",
      body: JSON.stringify({
        name: PLAYLIST_NAME,
        public: false,
        description:
          "Mix quotidien généré automatiquement — remplaçant du Daily Drive Spotify.",
      }),
    },
  );

  return created.id;
};

export const spotifyProvider: MusicProvider = {
  getTopTracks: async (accessToken) => {
    const data = await spotifyFetch<SpotifyPagedResponse<SpotifyTrackObject>>(
      accessToken,
      "/me/top/tracks?time_range=short_term&limit=50",
    );
    return data.items.map(toTrack);
  },

  getTopArtists: async (accessToken) => {
    const data = await spotifyFetch<SpotifyPagedResponse<SpotifyArtistObject>>(
      accessToken,
      "/me/top/artists?time_range=short_term&limit=50",
    );
    return data.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
    }));
  },

  searchByGenre: async (accessToken, genre, limit = 20) => {
    const query = encodeURIComponent(`genre:"${genre}"`);
    const data = await spotifyFetch<{
      tracks: SpotifyPagedResponse<SpotifyTrackObject>;
    }>(accessToken, `/search?q=${query}&type=track&limit=${limit}`);
    return data.tracks.items.map(toTrack);
  },

  createOrUpdatePlaylist: async (accessToken, spotifyUserId, tracks) => {
    const playlistId = await findOrCreatePlaylistId(accessToken, spotifyUserId);
    await spotifyFetch(accessToken, `/playlists/${playlistId}/tracks`, {
      method: "PUT",
      body: JSON.stringify({ uris: tracks.map((track) => track.uri) }),
    });
  },

  refreshTokenIfNeeded: async (tokens) => {
    const expiresInMs = new Date(tokens.expiresAt).getTime() - Date.now();
    if (expiresInMs > REFRESH_MARGIN_MS) return tokens;
    return refreshAccessToken(tokens.refreshToken);
  },
};
