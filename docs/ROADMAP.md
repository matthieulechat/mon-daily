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

- [ ] Récupérer le dernier épisode de chaque show Spotify natif ci-dessous via `GET /shows/{id}/episodes?market=FR&limit=1`, pas de parser RSS (liste étendue le 2026-09-20 à partir des 3 pilotes de [BDR-005](../.claude/memory/decisions/BDR-005.md), cf. [BDR-008](../.claude/memory/decisions/BDR-008.md)) :

  | Média              | Show                                    | Show ID                  | Format                                        |
  | ------------------ | --------------------------------------- | ------------------------ | --------------------------------------------- |
  | Le Monde           | L'Heure du Monde                        | `2ceI3IzPwHJywfQTAtrQSI` | Actu quotidienne courte                       |
  | France Info        | Les informés de franceinfo              | `4wyNV1lUV1Wm2wqN91mEx6` | Débat hebdo, format long                      |
  | France Info        | 8h30 franceinfo                         | `6RHQXwIlOrjdZ86forQKlw` | Actu quotidienne courte                       |
  | AFP                | Sur le fil                              | `1QSQSKhOnNKkm6jr4afJHg` | Actu quotidienne courte                       |
  | AFP                | Le Fil Culture G                        | `73jHIG8pyTbbRnhVUwRXnZ` | Culture générale quotidienne, format court    |
  | Le Monde           | L'ordre du monde                        | `62iffPHZ8yR5yvRZN9C2f4` | Géopolitique, hebdo, format long              |
  | —                  | Maintenant, vous savez                  | `2syIwMfdIPTD6VgkOY6FGa` | Culture générale, format court                |
  | —                  | HugoDécrypte - Actus et interviews      | `6y1PloEyNsCNJH9vHias4T` | Actu, plusieurs épisodes/jour, durée variable |
  | —                  | La semaine européenne                   | `0pj85Csk4cPVRulubA1sel` | Actu UE, hebdo                                |
  | —                  | Ça dit quoi ?                           | `4wMWrabr79pA104WEAkcH3` | Format court                                  |
  | —                  | Maintenant Vous Savez - Culture         | `6rnrqx5EXCQUriDzp9Y0sw` | Culture générale, format court                |
  | —                  | La question info                        | `3YCFNohB2PpHNY41qNsc5Q` | Actu quotidienne courte                       |
  | —                  | Maintenant Vous Savez Santé             | `5DUxdQ9CFJza8jpjGpO3Q2` | Santé, format court                           |
  | France Télévisions | C dans l'air                            | `1teuRpy91067CoPOPfArRE` | Débat quotidien, format long (~1h)            |
  | Le Parisien        | Code source                             | `4J2KJU7Lcv0e1wH3728Fse` | Actu quotidienne courte                       |
  | —                  | Journal de 08h00                        | `108ja5N6Lhjl7M8TjTYcNa` | Actu quotidienne courte                       |
  | —                  | Gaspard G                               | `5zhGjnzRr4On2lWMIgFQPm` | Interviews, humour                            |
  | Binge Audio        | Les Couilles sur la table               | `3xk078ZrBB5X75zQzHEHRN` | Société/sexualité, hebdo                      |
  | —                  | L'œil de Philippe Caverivière           | `5iZAQiKv5QamDAzT2jOn1f` | Humour, chronique courte                      |
  | Arte               | Le Dessous des Cartes                   | `0mGLRxbnUfEtBmgpE9bRXT` | Géopolitique, hebdo                           |
  | France Culture     | Géopolitique                            | `7trRb7PXoTNX9kbEKZI5uY` | Géopolitique quotidien                        |
  | —                  | Le Crayon                               | `20rMwrrfflhMee6dxnxE57` | Actu / dessin de presse                       |
  | Europe 1           | Le journal d'Europe 1                   | `1AUM0tB6DZBShd4nyzZHHE` | Actu quotidienne courte                       |
  | —                  | Journal Monde                           | `6y3v3GWUBwANr9hK9m1frF` | Actu internationale                           |
  | L'Équipe           | Undercut, le podcast F1 de L'Équipe     | `17gHyBzJ8BC7i8O9DgJUal` | Sport                                         |
  | L'Équipe           | Big 5, le podcast foot de L'Équipe      | `4CjHsp28z1bL2ji5j6PCGX` | Sport                                         |
  | L'Équipe           | Crunch, le podcast rugby de L'Équipe    | `5SqKygFl8gfylpIDtfqVe2` | Sport                                         |
  | L'Équipe           | Ultra Run, le podcast trail de L'Équipe | `1a9RSfnhxLiwOZJL0mU3ww` | Sport                                         |

  ⚠️ Plusieurs shows (Sur le fil, Le Fil Culture G, Maintenant Vous Savez Santé, Code source, Le Crayon) sont marqués `explicit: true` par Spotify — ce flag ne couvre pas les sujets sensibles visés par la modération prévue plus bas (guerre, sexualité, violence), à ne pas utiliser comme substitut.

- [ ] **Bloquant avant le mixer** — Tester manuellement qu'un épisode ajouté à une playlist perso (bouton "Ajouter à la playlist" sur la page d'un épisode dans l'app Spotify) apparaît et **joue bien depuis la playlist elle-même** (pas seulement en lecture directe du podcast) — risque documenté dans [LRN-006](../.claude/memory/learnings/LRN-006.md) (bug API Spotify connu depuis 2020, jamais corrigé), toujours non vérifié au 2026-09-20.
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
- [ ] **(pas prioritaire, gardé en tête)** Filtrage des podcasts par préférence utilisateur : durée max de l'épisode (certains shows font ~1h, ex. C dans l'air, Les informés, L'ordre du monde) et fréquence de publication (certains shows publient plusieurs épisodes/jour, ex. HugoDécrypte) — cf. tableau Phase 2 pour le point de départ éditorial (colonne Format)
- [ ] **(pas prioritaire, gardé en tête)** Modération de contenu par mots-clés sur le titre de l'épisode, activable/désactivable par l'utilisateur, pour exclure un épisode de la sélection du jour quand un sujet sensible est détecté. Sujets retenus au 2026-09-20 : guerre/conflits armés, sexualité, violence/faits divers (pertinent notamment pour "Les Couilles sur la table", centré sur la sexualité/le genre). Limite connue à assumer : modération sur le titre uniquement, pas sur la description ni l'audio
- [ ] **(à trancher)** Remplacer/compléter `discoverTracksForGenres` (recherche par genre) par un vrai moteur de similarité d'artistes, gratuit — reconstruit ce que `/recommendations` faisait avant sa dépréciation (cf. [LRN-001](../.claude/memory/learnings/LRN-001.md)) :
  - [Last.fm `artist.getSimilar`](https://www.last.fm/api/show/artist.getSimilar) — 1 hop (nom d'artiste direct), mais ajoute une clé API dans `.env`
  - [ListenBrainz Labs `similar-artists`](https://labs.api.listenbrainz.org/) — aucun secret, mais 2 hops (résolution MBID MusicBrainz puis similaires)
  - Pas encore décidé si ça vaut le coup de l'intégrer — à rediscuter
