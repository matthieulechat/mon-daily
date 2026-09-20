# PRD — "Mon Daily" (remplaçant du Spotify Daily Drive)

## 1. Contexte & Problème

Spotify a supprimé la fonctionnalité **Daily Drive** en mars 2026 (mix quotidien musique + actus, personnalisé, régénéré automatiquement). Aucun remplaçant officiel équivalent n'existe côté Spotify (l'AI DJ ne couvre pas la partie actus/podcasts) ni côté Deezer/Apple Music.

**Contrainte forte à connaître** : Spotify a déprécié en novembre 2024 son endpoint `/recommendations` (et `/audio-features`, `/related-artists`) pour toute app créée après cette date. Il n'existe donc plus de moteur de recommandation "boîte noire" officiel et gratuit — la personnalisation musicale doit être reconstruite maison à partir des données d'écoute de l'utilisateur (top tracks/artists, genres, recherche par mot-clé).

**Contrainte d'accès à l'API** : depuis mars 2026, Spotify exige que le compte qui enregistre une app sur le Developer Dashboard dispose d'un abonnement **Premium actif** — sans quoi il est impossible de créer l'app et donc d'utiliser le Web API (peu importe l'usage : lecture seule, écriture, mix musique ou podcasts uniquement). Matthieu a tranché : il prend un abonnement Premium pour débloquer le projet. Point de vigilance : l'accès API reste conditionné au maintien de cet abonnement — une résiliation coupe le fonctionnement de "Mon Daily".

**Important — cette contrainte Premium ne concerne QUE le développeur.** Les utilisateurs qui profitent ensuite de "Mon Daily" n'ont besoin d'aucun abonnement particulier : un compte Spotify gratuit suffit pour être ajouté comme utilisateur autorisé et profiter de la playlist auto-générée (comme à l'époque de l'ancien Daily Drive, disponible en Free avec pubs). La seule limite pour eux est le plafond de comptes autorisés en Development Mode (voir périmètre ci-dessous).

## 2. Objectif produit

Permettre à un utilisateur de retrouver une expérience équivalente au Daily Drive : une playlist qui se régénère automatiquement chaque jour, mélangeant :

- 🎵 de la musique personnalisée selon ses goûts,
- 🎙️ des podcasts d'actu en français (Le Monde, France Info, AFP...),
- et ce, **directement dans l'app qu'il utilise déjà** (Spotify, puis Deezer, puis Apple Music) — sans qu'il ait besoin d'ouvrir une app tierce au quotidien.

## 3. Utilisateurs cibles

- V1 : usage personnel (toi-même) — validation du concept.
- V2 : élargissement possible à un petit groupe d'utilisateurs (amis/famille) si le concept tient la route.

**Limite technique à connaître** : tant que l'app Spotify reste en "Development Mode" (le mode par défaut, sans démarche particulière), elle est plafonnée à **5 comptes utilisateurs autorisés au total** (toi inclus). Aucun de ces comptes n'a besoin d'être Premium — seul le compte développeur (le tien) l'exige. Aller au-delà de 5 utilisateurs demanderait un "extended quota" auprès de Spotify, qui impose d'être une entreprise enregistrée avec 250 000 utilisateurs actifs/mois — hors de portée pour ce projet, donc V2 restera nécessairement un cercle restreint (famille/amis proches).

## 4. Périmètre fonctionnel (MVP — Spotify uniquement)

### Must have

- Connexion OAuth de l'utilisateur à son compte Spotify.
- Récupération des goûts musicaux (top tracks / top artists / genres dominants).
- Génération d'une sélection musicale personnalisée (basée sur genres + recherche, sans `/recommendations`).
- Sélection de podcasts d'actu FR (flux RSS statiques au départ : Le Monde, France Info...).
- Mix musique/podcasts dans une playlist Spotify dédiée ("Mon Daily").
- Régénération automatique 1x/jour (backend, sans action utilisateur).
- Stockage sécurisé des tokens OAuth (refresh token chiffré).

### Nice to have (V1.x)

- Réglage de la proportion musique/actu par l'utilisateur.
- Choix des sources d'actu (médias) — liste étendue à 28 shows Spotify le 2026-09-20, cf. [ROADMAP.md](ROADMAP.md#phase-2--podcasts-fr--mix-toujours-en-local).
- Filtrage des podcasts par préférence utilisateur : durée max de l'épisode et fréquence de publication du show (pas prioritaire pour l'instant, gardé en tête).
- Modération de contenu par mots-clés sur le titre de l'épisode, activable/désactivable par l'utilisateur, sujets retenus : guerre/conflits armés, sexualité, violence/faits divers (pas prioritaire pour l'instant, gardé en tête).
- Historique des playlists générées (éviter les doublons d'un jour sur l'autre).

### Hors scope V1

- Deezer (V2) et Apple Music (V3) — architecture pensée pour, mais pas implémentés en V1.
- Multi-utilisateurs à grande échelle (pas de dashboard admin, pas de facturation).
- Analyse audio fine (mood/énergie) — impossible gratuitement sans `/audio-features`.

## 5. Critères de succès

- La playlist Spotify se régénère seule chaque matin sans intervention.
- Le mix musical "sonne juste" par rapport aux goûts réels de l'utilisateur (validation subjective).
- Le système tient sur plusieurs semaines sans rupture de token (refresh géré correctement).

## 6. Risques identifiés

| Risque                                                                                                                                                                                                                                                                                 | Impact                                                                                                                  | Mitigation                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pas de `/recommendations` Spotify                                                                                                                                                                                                                                                      | Perso musicale moins fine                                                                                               | Approche genres + search, itérative                                                                                                                                                            |
| Résiliation de l'abonnement Premium                                                                                                                                                                                                                                                    | Coupure totale de l'accès API, arrêt de "Mon Daily"                                                                     | Maintenir l'abonnement actif tant que le projet tourne ; prévoir une alerte si les appels API échouent en masse                                                                                |
| Expiration/révocation des tokens OAuth                                                                                                                                                                                                                                                 | Playlist qui s'arrête de se mettre à jour                                                                               | Refresh token + alerte si échec                                                                                                                                                                |
| Flux RSS podcasts qui changent de format                                                                                                                                                                                                                                               | Cassure du mix actu                                                                                                     | Parsing RSS défensif + fallback                                                                                                                                                                |
| Rate limits API Spotify                                                                                                                                                                                                                                                                | Échec de génération si trop d'appels                                                                                    | Cache local des top tracks/artists (24h)                                                                                                                                                       |
| Épisodes de podcast peu fiables dans une playlist Spotify (`is_playable: false` / `episode: false` mal renvoyés par l'API, retours utilisateurs 2024-2025 d'épisodes qui n'apparaissent pas ou ne jouent pas — [spotify/web-api#1528](https://github.com/spotify/web-api/issues/1528)) | Le mix musique/actu dans une seule playlist pourrait ne pas fonctionner du tout, quelle que soit la source des épisodes | Tester manuellement l'ajout d'un `spotify:episode:` (ex. L'Heure du Monde) dans une playlist perso avant de coder `mixer.ts` — valider que ça joue réellement avant d'investir dans la Phase 2 |
