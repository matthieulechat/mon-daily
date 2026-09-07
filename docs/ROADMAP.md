# Roadmap — "Mon Daily"

## Phase 0 — Setup (avant dev)
- [ ] Créer une app sur le Spotify Developer Dashboard (obtenir `client_id` / `client_secret`)
- [ ] Choisir les scopes OAuth nécessaires (`user-top-read`, `playlist-modify-private`, `user-read-recently-played`)
- [ ] Initialiser le repo Node/TypeScript (pnpm, structure de dossiers)
- [ ] Choisir la DB (recommandation : **SQLite** pour démarrer léger, migration Postgres possible plus tard)

## Phase 1 — MVP Spotify, script local (musique uniquement, sans podcasts)
**Objectif : un script lancé à la main qui remplit une playlist Spotify avec de la musique personnalisée. Pas de Supabase à ce stade — stockage dans un simple fichier JSON local.**
- [ ] Implémenter le flow OAuth (authorization code + PKCE)
- [ ] Stocker le refresh token dans `data/store.json` (fichier local)
- [ ] Récupérer top tracks / top artists (`time_range=short_term`)
- [ ] Extraire les genres dominants
- [ ] Construire la logique de recherche par genre (`/search?q=genre:"x"`)
- [ ] Dédupliquer / mixer top tracks connus + découvertes
- [ ] Créer/mettre à jour une playlist Spotify via l'API (`playlists/{id}/tracks`)
- [ ] Lancer le script manuellement (`pnpm run generate`)

**Livrable** : tu lances une commande, ta playlist Spotify se remplit avec de la musique cohérente avec tes goûts.

## Phase 2 — Podcasts FR + mix (toujours en local)
**Objectif : le script génère un vrai mix musique + actu, toujours lancé manuellement.**
- [ ] Intégrer un parser RSS (flux Le Monde, France Info, AFP...)
- [ ] Ajouter la logique de mix musique/podcast (pattern façon Daily Drive : ex. 4 musiques / 1 actu)
- [ ] Enregistrer l'historique des playlists dans `data/store.json` (éviter les répétitions)
- [ ] Logging + gestion d'erreurs (échec API, token expiré...)

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
