import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { env } from "../config/env.js";
import { supabaseStorage } from "../storage/supabase-storage.js";
import {
  buildAuthUrl,
  exchangeCodeForToken,
  generatePkcePair,
} from "./oauth.service.js";

const openInBrowser = (url: string): void => {
  if (process.platform === "win32") {
    execFile("cmd", ["/c", "start", "", url.replace(/&/g, "^&")]);
  } else if (process.platform === "darwin") {
    execFile("open", [url]);
  } else {
    execFile("xdg-open", [url]);
  }
};

const fetchSpotifyUserId = async (accessToken: string): Promise<string> => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Récupération du profil Spotify échouée (${response.status})`,
    );
  }

  const profile = (await response.json()) as { id: string };
  return profile.id;
};

const main = async (): Promise<void> => {
  const { verifier, challenge } = generatePkcePair();
  const state = randomBytes(16).toString("hex");
  const redirect = new URL(env.SPOTIFY_REDIRECT_URI);

  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", env.SPOTIFY_REDIRECT_URI);
      if (url.pathname !== redirect.pathname) {
        res.writeHead(404).end();
        return;
      }

      const returnedState = url.searchParams.get("state");
      const returnedCode = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        error
          ? `<p>Échec de l'autorisation Spotify : ${error}. Tu peux fermer cet onglet.</p>`
          : "<p>Connexion Spotify réussie, tu peux fermer cet onglet.</p>",
      );

      server.close();

      if (error) {
        reject(new Error(`Autorisation Spotify refusée : ${error}`));
      } else if (returnedState !== state || !returnedCode) {
        reject(
          new Error(
            "Réponse OAuth invalide (state ou code manquant/incorrect)",
          ),
        );
      } else {
        resolve(returnedCode);
      }
    });

    server.listen(Number(redirect.port), redirect.hostname, () => {
      const authUrl = buildAuthUrl(challenge, state);
      console.log(
        `Ouverture du navigateur pour te connecter à Spotify...\nSi rien ne s'ouvre, colle cette URL : ${authUrl}`,
      );
      openInBrowser(authUrl);
    });
  });

  const tokens = await exchangeCodeForToken(code, verifier);
  const userId = await fetchSpotifyUserId(tokens.accessToken);

  await supabaseStorage.saveTokens(userId, tokens);

  console.log(
    `Connexion réussie pour l'utilisateur Spotify "${userId}". Tokens enregistrés dans Supabase.`,
  );
};

main().catch((error: unknown) => {
  console.error(
    "Échec du login Spotify :",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
