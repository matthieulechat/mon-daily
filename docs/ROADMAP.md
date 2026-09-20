# Roadmap — "Mon Daily"

## Phase 0 — Setup (avant dev)

- [x] Créer une app sur le Spotify Developer Dashboard (obtenir `client_id` / `client_secret`) — nécessitait le Premium du compte développeur (cf. [BDR-003](../.claude/memory/decisions/BDR-003.md)), débloqué le 2026-09-20
- [x] Choisir les scopes OAuth nécessaires (`user-top-read`, `playlist-modify-private`, `user-read-recently-played`) — implémentés dans `oauth.service.ts`
- [x] Initialiser le repo Node/TypeScript (pnpm, structure de dossiers)
- [x] Choisir la DB — **Supabase Postgres dès la Phase 1** (SQLite/JSON local écartés, cf. [BDR-002](../.claude/memory/decisions/BDR-002.md)). Projet `mon-daily-paris` en région `eu-west-3` (Paris) — l'ancien projet `mon-daily` (Ireland, `eu-west-1`) est mis en pause, vide, à supprimer manuellement si besoin (pas d'outil pour le faire depuis Claude Code)
- [x] Serveur MCP Supabase ajouté au projet (`.mcp.json`, scope projet, `project_ref` figé sur `mon-daily-paris`) pour faciliter les manipulations DB depuis Claude Code

## Phase 1 — MVP Spotify, script local (musique uniquement, sans podcasts)

**Objectif : un script lancé à la main qui remplit une playlist Spotify avec de la musique personnalisée. Stockage Supabase dès cette phase (cf. [BDR-002](../.claude/memory/decisions/BDR-002.md)), pas de JSON local.**

- [x] Implémenter le flow OAuth (authorization code + PKCE) — `src/auth/oauth.service.ts` + `src/auth/login.ts`
- [x] Stocker le refresh token dans Supabase (table `oauth_tokens`, RLS activé, accès via `service_role`) — `src/storage/supabase-storage.ts`
- [x] Récupérer top tracks / top artists (`time_range=short_term`) — `src/providers/spotify.provider.ts`
- [x] Extraire les genres dominants — `src/core/taste-analyzer.ts`
- [x] Construire la logique de recherche par genre (`/search?q=genre:"x"`) — `src/core/discovery-engine.ts`
- [x] Dédupliquer / mixer top tracks connus + découvertes — `src/generate.ts`
- [x] Créer/mettre à jour une playlist Spotify via l'API (`playlists/{id}/tracks`) — `src/providers/spotify.provider.ts`
- [ ] Lancer le script manuellement (`pnpm run login` puis `pnpm run generate <user_id>`) — code prêt, `.env.local` complet, **premier run pas encore fait**

**Livrable** : tu lances une commande, ta playlist Spotify se remplit avec de la musique cohérente avec tes goûts.

## Phase 2 — Podcasts FR + mix (toujours en local)

**Objectif : le script génère un vrai mix musique + actu, toujours lancé manuellement.**

- [ ] Récupérer le dernier épisode de 3 shows Spotify natifs (test initial — sources supplémentaires à ajouter plus tard) via `GET /shows/{id}/episodes?market=FR&limit=1`, pas de parser RSS :

  | Média       | Show                       | Show ID                  |
  | ----------- | -------------------------- | ------------------------ |
  | Le Monde    | L'Heure du Monde           | `2ceI3IzPwHJywfQTAtrQSI` |
  | France Info | Les informés de franceinfo | `4wyNV1lUV1Wm2wqN91mEx6` |
  | France Info | 8h30 franceinfo            | `6RHQXwIlOrjdZ86forQKlw` |

- [ ] Ajouter la logique de mix musique/podcast (pattern façon Daily Drive : ex. 4 musiques / 1 actu)
- [ ] Enregistrer l'historique des playlists dans `data/store.json` (éviter les répétitions)
- [ ] Logging + gestion d'erreurs (échec API, token expiré...)
- [ ] Préfixer la playlist du jour par le jingle "C'est {jour}" de l'album officiel Spotify [Mon Daily](https://open.spotify.com/intl-fr/album/7F6q2YyEzP7ugqZhxfwouD) (2021) — IDs fixes, pas d'appel API supplémentaire, juste un `Record<number, Track>` indexé sur `getDay()` :

  | Jour     | URI                                    |
  | -------- | -------------------------------------- |
  | Lundi    | `spotify:track:5quzUGpkOiiDYSVpLgVRri` |
  | Mardi    | `spotify:track:02ccJIawsUKanHns1VUb9g` |
  | Mercredi | `spotify:track:17k0IC1WEG1dlyXaTsyydc` |
  | Jeudi    | `spotify:track:0OjHAfLQvGHVazovHWGWcQ` |
  | Vendredi | `spotify:track:3ogo0ojU68mwMWQrC1AAoN` |
  | Samedi   | `spotify:track:3ZHPew5MTUrLbadSVfANiI` |
  | Dimanche | `spotify:track:5AL05HYdyP8tzDhQrkr1Vh` |

  ⚠️ Calculer le jour sur le fuseau utilisateur (`Europe/Paris`), pas sur l'heure serveur brute — désynchro possible une fois automatisé en `pg_cron` (Phase 3).

**Livrable** : le vrai mix "Daily Drive maison", généré manuellement mais complet.

## Phase 3 — Migration vers Supabase (automatisation)

**Objectif : basculer le stockage local vers Supabase et automatiser la génération quotidienne.**

- [ ] Créer le projet Supabase (plan gratuit) + les tables (`users`, `oauth_tokens`, `playlist_history`, `user_preferences`)
- [ ] Implémenter `supabase-storage.ts` (même interface `Storage` que `json-storage.ts`)
- [ ] Migrer les tokens vers Supabase Vault
- [ ] Porter la logique de génération (`generate.ts`) en Edge Function
- [ ] Programmer le déclenchement quotidien via `pg_cron` + `pg_net`
- [ ] Gérer le refresh automatique du token OAuth expiré (sans intervention manuelle)

**Livrable** : le "Daily Drive maison" tourne seul, chaque jour, sans que tu aies à lancer quoi que ce soit.

## Phase 4 — Deezer

**Objectif : dupliquer l'expérience sur Deezer.**

- [ ] Implémenter l'adaptateur `DeezerProvider` (même interface que `SpotifyProvider`)
- [ ] OAuth Deezer
- [ ] Équivalents des endpoints top tracks/artists/search côté Deezer
- [ ] Réutiliser le moteur de mix déjà construit en Phase 2 (agnostique de la plateforme)

**Livrable** : choix Spotify OU Deezer comme plateforme de destination.

## Phase 5 — Apple Music

**Objectif : compléter avec Apple Music.**

- [ ] Créer un compte Apple Developer (payant, 99$/an)
- [ ] Générer les tokens JWT (clé privée ES256) pour MusicKit
- [ ] Gérer le Music User Token côté client (spécificité Apple)
- [ ] Implémenter `AppleMusicProvider`

**Livrable** : les 3 plateformes supportées.

## Phase 6 — Améliorations (optionnel, post-V1)

- [ ] Interface utilisateur simple (réglages : ratio musique/actu, sources d'actu)
- [ ] Historique des playlists générées (éviter répétitions)
- [ ] Notifications (playlist prête, échec de génération)
- [ ] Multi-utilisateurs si le projet s'ouvre à d'autres personnes
- [ ] **(à trancher)** Remplacer/compléter `discoverTracksForGenres` (recherche par genre) par un vrai moteur de similarité d'artistes, gratuit — reconstruit ce que `/recommendations` faisait avant sa dépréciation (cf. [LRN-001](../.claude/memory/learnings/LRN-001.md)) :
  - [Last.fm `artist.getSimilar`](https://www.last.fm/api/show/artist.getSimilar) — 1 hop (nom d'artiste direct), mais ajoute une clé API dans `.env`
  - [ListenBrainz Labs `similar-artists`](https://labs.api.listenbrainz.org/) — aucun secret, mais 2 hops (résolution MBID MusicBrainz puis similaires)
  - Pas encore décidé si ça vaut le coup de l'intégrer — à rediscuter
