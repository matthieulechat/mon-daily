import { discoverTracksForGenres } from "./core/discovery-engine.js";
import { extractDominantGenres } from "./core/taste-analyzer.js";
import { spotifyProvider } from "./providers/spotify.provider.js";
import { supabaseStorage } from "./storage/supabase-storage.js";
import type { Track } from "./types/index.js";

const TOP_TRACKS_IN_MIX = 25;
const DISCOVERED_TRACKS_IN_MIX = 15;

const main = async (): Promise<void> => {
  const userId = process.argv[2];
  if (!userId) {
    throw new Error(
      "Usage : pnpm run generate <spotify_user_id> (l'id affiché après pnpm run login)",
    );
  }

  const storedTokens = await supabaseStorage.getTokens(userId);
  if (!storedTokens) {
    throw new Error(
      `Aucun token trouvé pour "${userId}". Lance d'abord pnpm run login.`,
    );
  }

  const tokens = await spotifyProvider.refreshTokenIfNeeded(storedTokens);
  if (tokens.accessToken !== storedTokens.accessToken) {
    await supabaseStorage.saveTokens(userId, tokens);
  }

  const [topTracks, topArtists] = await Promise.all([
    spotifyProvider.getTopTracks(tokens.accessToken),
    spotifyProvider.getTopArtists(tokens.accessToken),
  ]);

  const dominantGenres = extractDominantGenres(topArtists);
  console.log(`Genres dominants : ${dominantGenres.join(", ") || "(aucun)"}`);

  const knownTrackIds = new Set(topTracks.map((track) => track.id));
  const discovered = await discoverTracksForGenres(
    spotifyProvider,
    tokens.accessToken,
    dominantGenres,
    knownTrackIds,
  );

  const mix: Track[] = [
    ...topTracks.slice(0, TOP_TRACKS_IN_MIX),
    ...discovered.slice(0, DISCOVERED_TRACKS_IN_MIX),
  ];

  await spotifyProvider.createOrUpdatePlaylist(tokens.accessToken, userId, mix);

  console.log(`Playlist "Mon Daily" mise à jour avec ${mix.length} titres.`);
};

main().catch((error: unknown) => {
  console.error(
    "Échec de la génération :",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
