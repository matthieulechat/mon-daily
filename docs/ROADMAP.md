# Roadmap — "Mon Daily"

## Phase 0 — Setup (avant dev)

- [x] Créer une app sur le Spotify Developer Dashboard (obtenir `client_id` / `client_secret`) — nécessitait le Premium du compte développeur (cf. [BDR-003](../.claude/memory/decisions/BDR-003.md)), débloqué le 2026-09-20
- [x] Choisir les scopes OAuth nécessaires (`user-top-read`, `playlist-modify-private`, `playlist-read-private`, `user-read-recently-played`, `ugc-image-upload`) — implémentés dans `oauth.service.ts`
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
- [x] Lancer le script manuellement (`pnpm run login` puis `pnpm run generate <user_id>`) — premier run réussi le 2026-09-21, playlist "Mon Daily" créée avec 25 titres

**Livrable** : tu lances une commande, ta playlist Spotify se remplit avec de la musique cohérente avec tes goûts.

## Phase 2 — Podcasts FR + mix (toujours en local)

**Objectif : le script génère un vrai mix musique + actu, toujours lancé manuellement.**

- [x] Récupérer le dernier épisode d'un show Spotify natif via `GET /shows/{id}/episodes?market=FR&limit=1`, pas de parser RSS (liste étendue le 2026-09-20 à partir des 3 pilotes de [BDR-005](../.claude/memory/decisions/BDR-005.md), cf. [BDR-008](../.claude/memory/decisions/BDR-008.md)) — implémenté en `src/core/podcast-source.ts` ; par souci d'appels API, on ne récupère que les shows sélectionnés pour le mix du jour (cf. item mix ci-dessous), pas les 55 à chaque run :

  | Média              | Show                                                   | Show ID                  | Format                                             |
  | ------------------ | ------------------------------------------------------ | ------------------------ | -------------------------------------------------- |
  | Le Monde           | L'Heure du Monde                                       | `2ceI3IzPwHJywfQTAtrQSI` | Actu quotidienne courte                            |
  | France Info        | Les informés de franceinfo                             | `4wyNV1lUV1Wm2wqN91mEx6` | Débat hebdo, format long                           |
  | France Info        | 8h30 franceinfo                                        | `6RHQXwIlOrjdZ86forQKlw` | Actu quotidienne courte                            |
  | AFP                | Sur le fil                                             | `1QSQSKhOnNKkm6jr4afJHg` | Actu quotidienne courte                            |
  | AFP                | Le Fil Culture G                                       | `73jHIG8pyTbbRnhVUwRXnZ` | Culture générale quotidienne, format court         |
  | Le Monde           | L'ordre du monde                                       | `62iffPHZ8yR5yvRZN9C2f4` | Géopolitique, hebdo, format long                   |
  | —                  | Maintenant, vous savez                                 | `2syIwMfdIPTD6VgkOY6FGa` | Culture générale, format court                     |
  | —                  | HugoDécrypte - Actus et interviews                     | `6y1PloEyNsCNJH9vHias4T` | Actu, plusieurs épisodes/jour, durée variable      |
  | —                  | La semaine européenne                                  | `0pj85Csk4cPVRulubA1sel` | Actu UE, hebdo                                     |
  | —                  | Ça dit quoi ?                                          | `4wMWrabr79pA104WEAkcH3` | Format court                                       |
  | —                  | Maintenant Vous Savez - Culture                        | `6rnrqx5EXCQUriDzp9Y0sw` | Culture générale, format court                     |
  | —                  | La question info                                       | `3YCFNohB2PpHNY41qNsc5Q` | Actu quotidienne courte                            |
  | —                  | Maintenant Vous Savez Santé                            | `5DUxdQ9CFJza8jpjGpO3Q2` | Santé, format court                                |
  | France Télévisions | C dans l'air                                           | `1teuRpy91067CoPOPfArRE` | Débat quotidien, format long (~1h)                 |
  | Le Parisien        | Code source                                            | `4J2KJU7Lcv0e1wH3728Fse` | Actu quotidienne courte                            |
  | —                  | Journal de 08h00                                       | `108ja5N6Lhjl7M8TjTYcNa` | Actu quotidienne courte                            |
  | —                  | Gaspard G                                              | `5zhGjnzRr4On2lWMIgFQPm` | Interviews, humour                                 |
  | Binge Audio        | Les Couilles sur la table                              | `3xk078ZrBB5X75zQzHEHRN` | Société/sexualité, hebdo                           |
  | —                  | L'œil de Philippe Caverivière                          | `5iZAQiKv5QamDAzT2jOn1f` | Humour, chronique courte                           |
  | Arte               | Le Dessous des Cartes                                  | `0mGLRxbnUfEtBmgpE9bRXT` | Géopolitique, hebdo                                |
  | France Culture     | Géopolitique                                           | `7trRb7PXoTNX9kbEKZI5uY` | Géopolitique quotidien                             |
  | —                  | Le Crayon                                              | `20rMwrrfflhMee6dxnxE57` | Actu / dessin de presse                            |
  | Europe 1           | Le journal d'Europe 1                                  | `1AUM0tB6DZBShd4nyzZHHE` | Actu quotidienne courte                            |
  | —                  | Journal Monde                                          | `6y3v3GWUBwANr9hK9m1frF` | Actu internationale                                |
  | L'Équipe           | Undercut, le podcast F1 de L'Équipe                    | `17gHyBzJ8BC7i8O9DgJUal` | Sport                                              |
  | L'Équipe           | Big 5, le podcast foot de L'Équipe                     | `4CjHsp28z1bL2ji5j6PCGX` | Sport                                              |
  | L'Équipe           | Crunch, le podcast rugby de L'Équipe                   | `5SqKygFl8gfylpIDtfqVe2` | Sport                                              |
  | L'Équipe           | Ultra Run, le podcast trail de L'Équipe                | `1a9RSfnhxLiwOZJL0mU3ww` | Sport                                              |
  | —                  | La Matinée Est Tienne, par Samuel Etienne              | `1YlJfmqBsfLHI9QZksdSbR` | Actu quotidienne (ajout 2026-09-22)                |
  | —                  | Journal de 07h00                                       | `58PM4YR8kDyH7lU5yVbgjT` | Actu quotidienne courte (ajout 2026-09-22)         |
  | Libération         | Libération Podcast                                     | `4l7WZcg5qBOdo76lL9ZtEj` | Thématique (ajout 2026-09-22)                      |
  | —                  | Le Phil d'Actu - Philosophie et Actualité              | `6d9U2NiY1792t8gNE9Eptm` | Thématique (ajout 2026-09-22)                      |
  | —                  | Le Titre à la une                                      | `0WjH88Utuz9qOS9FzUp1xu` | Thématique (ajout 2026-09-22)                      |
  | —                  | Saga                                                   | `4MF0XYJpnZQ2za6CCJ61Q5` | Thématique (ajout 2026-09-22)                      |
  | —                  | Décryptage                                             | `271pQcFjR0jlqgthMUZdKG` | Thématique (ajout 2026-09-22)                      |
  | —                  | L'Entretien géopolitique                               | `4nWaNsD1fMzJRbxTQKEmnP` | Thématique (ajout 2026-09-22)                      |
  | —                  | La Story                                               | `3OiGhrRIdqhorrpPhlfiFt` | Thématique (ajout 2026-09-22)                      |
  | —                  | En Immersion                                           | `2SWtkazFRAdcOxFN3hUvSL` | Thématique (ajout 2026-09-22)                      |
  | France Inter       | Journal de 07h30                                       | `31c051Jvz9MkmkK1dCBoHQ` | Actu quotidienne courte (ajout 2026-09-23)         |
  | France Inter       | Le journal de 6h                                       | `0q3CZ4Gn4BbRjfzhfWNgwt` | Actu quotidienne courte (ajout 2026-09-23)         |
  | France Culture     | Les journaux de France Culture                         | `0pversl5NYX9qOs4WD7sfN` | Actu quotidienne (ajout 2026-09-23)                |
  | RFI                | Journal en français facile                             | `0AVkxaaQWUC6QAn38x5OmR` | Actu internationale quotidienne (ajout 2026-09-23) |
  | Le Figaro          | L'édito du Figaro                                      | `0F3VqxhfFyKB8MxnddgpSg` | Édito quotidien (ajout 2026-09-23)                 |
  | Le Figaro          | La Question du jour                                    | `6E5NW1rh303Jx28QEw18K0` | Débat quotidien court (ajout 2026-09-23)           |
  | France Culture     | Les Enjeux internationaux                              | `4d8b4VDri5fMz1a2U4p0tF` | Géopolitique quotidienne (ajout 2026-09-23)        |
  | France Culture     | L'actu internationale par France Culture               | `4zkO1BrMVLpN8YFT4fub9h` | Géopolitique (ajout 2026-09-23)                    |
  | RFI                | Géopolitique (RFI)                                     | `6p28Rq8jqWzBlkNuOl1bae` | Géopolitique, week-end (ajout 2026-09-23)          |
  | Le Figaro          | Le Club Le Figaro International                        | `3oRAgecaFNTxmSEea00V7m` | Géopolitique, hebdo (ajout 2026-09-23)             |
  | France Inter       | Le Grand reportage de France Inter                     | `7BayWqjvFaZDTY1P8h1jN6` | Reportage (ajout 2026-09-23)                       |
  | RFI                | Grand reportage (RFI)                                  | `1EJVUzPQJAM9b3Qp7gyaPm` | Reportage international (ajout 2026-09-23)         |
  | France Inter       | Interception                                           | `6lHI4xTEvCB0PAwahBiwGO` | Reportage société, sujets durs (ajout 2026-09-23)  |
  | France Inter       | Affaires sensibles                                     | `2mgIj1Y64XTLJT2Ax9rYEx` | Récit historique, sujets durs (ajout 2026-09-23)   |
  | Binge Audio        | Programme B                                            | `3b5FHUYRoCb6D8LjnGMK09` | Décryptage société/tech (ajout 2026-09-23)         |
  | Louie Media        | Passages, le podcast d'histoires vraies de Louie Media | `5u5HcL7HaColC7ULKhA4zZ` | Histoires vraies, sujets durs (ajout 2026-09-23)   |
  | Le Figaro          | Les Récits du Figaro                                   | `6yurCuUVoJL5rheKRHzMvM` | Récit historique (ajout 2026-09-23)                |

  ⚠️ Plusieurs shows (Sur le fil, Le Fil Culture G, Maintenant Vous Savez Santé, Code source, Le Crayon) sont marqués `explicit: true` par Spotify — ce flag ne couvre pas les sujets sensibles visés par la modération prévue plus bas (guerre, sexualité, violence), à ne pas utiliser comme substitut.

- [x] **Bloquant avant le mixer** — Tester manuellement qu'un épisode ajouté à une playlist perso (bouton "Ajouter à la playlist" sur la page d'un épisode dans l'app Spotify) apparaît et **joue bien depuis la playlist elle-même** (pas seulement en lecture directe du podcast) — risque documenté dans [LRN-006](../.claude/memory/learnings/LRN-006.md) (bug API Spotify connu depuis 2020, jamais corrigé). Testé OK par Matthieu le 2026-09-22.
- [x] Ajouter la logique de mix musique/podcast (gabarit fixe : 2 actus d'affilée en ouverture, puis alternance actu/thématique toutes les 4 musiques jusqu'à 4 actus + 4 thématiques ; au-delà, musique seule jusqu'à la coupe 4h) — `src/generate.ts`, `src/core/podcast-source.ts`. Décisions du 2026-09-22, cf. [docs/PLAYLIST_GENERATION.md](PLAYLIST_GENERATION.md) :
  - Musique : top tracks seuls, répétition voulue. Deux pistes d'enrichissement essayées puis retirées (code supprimé, récupérable via git) : découverte par genre, et playlists éditoriales Spotify hits/découvertes — **bloquées côté API** (404, migration Spotify de février 2026 sur les playlists non possédées), reportées en Phase 6
  - Podcasts : catégorisation manuelle `actu`/`thematique` dans `podcast-shows.ts` (pas de signal de popularité exposé par l'API Spotify, ni sur les shows ni dans l'historique d'écoute), tirage au sort (pas un ordre fixe), plafonné à **4 actus + 4 thématiques/jour**. Actu tirée parmi les 11 shows actu (épisodes frais (< 3 jours) ; < 3 jours) ; thématique tirée parmi les 44 shows thématiques hors des 14 derniers jours utilisés (compteurs après tri manuel + ajouts des 2026-09-22 et 2026-09-23). Fallback croisé symétrique si un pool est trop court. Fraîcheur commune aux 2 catégories, abaissée à `EPISODE_MAX_AGE_DAYS = 3` le 2026-09-22 (7 jours laissait passer du contenu périmé) — **tensions connues acceptées telles quelles** : pénalise les thématiques hebdomadaires (fraîcheur), et un pool de 15 s'épuise en ~4 jours à raison de 4/jour avec exclusion 14 jours (rotation) — cf. doc pour le détail
  - Playlist plafonnée à **4h** de durée cumulée (coupe en fin de pipeline, les titres prioritaires survivent)
  - **Fix** : `getLatestEpisode` ne regardait que l'index 0 de la réponse Spotify et ratait les épisodes valides quand Spotify renvoie `null` à cet index précis (repéré sur "Gaspard G") — cherche maintenant le premier élément non-`null` parmi les 5 récupérés
- [x] Enregistrer l'historique des playlists — table Supabase `playlist_history` (pas `data/store.json`, cf. [BDR-002](../.claude/memory/decisions/BDR-002.md) : storage Supabase dès la Phase 1). Sert à la rotation du podcast découverte (seuls les podcasts réellement inclus après la coupe 4h sont enregistrés) ; `track_ids` gardé en écriture seule pour un futur historique visible (Phase 6)
- [x] Logging + gestion d'erreurs (échec API, token expiré...) — un show en erreur/sans contenu/trop ancien est loggé et ignoré, ne fait pas échouer toute la génération
- [x] Préfixer la playlist du jour par le jingle "C'est {jour}" de l'album officiel Spotify [Mon Daily](https://open.spotify.com/intl-fr/album/7F6q2YyEzP7ugqZhxfwouD) (2021) — `src/config/jingles.ts`, calculé sur `Europe/Paris` (pas `getDay()` brut) :

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
- [ ] **(à trancher, pas avant d'avoir redemandé à Matthieu)** Réintroduire de la découverte musicale via un vrai moteur de similarité d'artistes, gratuit — reconstruit ce que `/recommendations` faisait avant sa dépréciation (cf. [LRN-001](../.claude/memory/learnings/LRN-001.md)). La recherche par genre (`discoverTracksForGenres`) avait été tentée puis retirée le 2026-09-22 (trop de répétition, cf. [docs/PLAYLIST_GENERATION.md](PLAYLIST_GENERATION.md)) — repartir d'un vrai moteur de similarité directement, pas de la recherche par genre :
  - [Last.fm `artist.getSimilar`](https://www.last.fm/api/show/artist.getSimilar) — 1 hop (nom d'artiste direct), mais ajoute une clé API dans `.env`
  - [ListenBrainz Labs `similar-artists`](https://labs.api.listenbrainz.org/) — aucun secret, mais 2 hops (résolution MBID MusicBrainz puis similaires)
  - Pas encore décidé si ça vaut le coup de l'intégrer — à rediscuter
- [ ] **(à trancher, bloqué côté API pour l'instant)** Enrichir la musique avec des playlists éditoriales Spotify (hits du moment, découvertes) — essayé le 2026-09-22 avec `37i9dQZF1DWVuV87wUBNwc` (Hot Hits France) et `37i9dQZEVXcEf1WT9Cq9sA` : les deux renvoient 404 sur `GET /playlists/{id}`, y compris pour les métadonnées seules. Confirmé via la doc à jour (migration Spotify de février 2026) : une playlist non possédée (même suivie, même officielle) ne renvoie plus son contenu via l'API. Aucun contournement officiel trouvé (pas de "charts" public dans le Web API). Code supprimé (`getPlaylistTracks` sur `MusicProvider`), récupérable via git si une piste apparaît — cf. [docs/PLAYLIST_GENERATION.md](PLAYLIST_GENERATION.md)
