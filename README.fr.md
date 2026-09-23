<h1 align="center">Mon Daily 🎧</h1>

<p align="center">
  <i>Ton remplaçant personnel du Daily Drive — un mix quotidien de ta musique préférée et de podcasts français, directement dans Spotify.</i>
</p>

<p align="center">
  <a href="README.md">🇬🇧 Read in English</a>
</p>

![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg) ![Node.js](https://shieldcn.dev/badge/Node.js-ESM-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) ![Spotify](https://shieldcn.dev/badge/Spotify-Web%20API-1DB954.svg) ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg)

---

## 📸 Captures d'écran

<p align="center">
  <img src="public/playlist-cover.jpg" width="240" alt="Pochette de la playlist Mon Daily" />
</p>
<p align="center"><sub>La pochette de la playlist « Mon Daily » générée</sub></p>

## 🚀 Fonctionnalités clés

- **Le Daily Drive, reconstruit** : Spotify a supprimé le Daily Drive en mars 2026 — une commande régénère une playlist privée « Mon Daily » mêlant ta musique et des podcasts français.
- **Tes propres top tracks** : pas de recommandation boîte noire (Spotify a déprécié `/recommendations` pour les nouvelles apps en novembre 2024) — la musique vient de tes top tracks à court terme, dédoublonnés.
- **55 podcasts français** : journaux d'actu, géopolitique, culture, sport, reportages... triés à la main en `actu` (11 shows) et `thematique` (44 shows) dans [`src/config/podcast-shows.ts`](src/config/podcast-shows.ts).
- **Un gabarit de mix fixe** : 2 épisodes d'actu en ouverture, puis un podcast toutes les 4 musiques en alternant actu et thématique — 4 + 4 par jour, tirés au sort.
- **Frais et varié** : un épisode de plus de 3 jours est ignoré, et les shows thématiques déjà utilisés dans les 14 derniers jours sont écartés.
- **Jingle du jour** : la playlist démarre avec le jingle officiel Spotify « C'est {jour} », calculé sur le fuseau `Europe/Paris`.
- **Plafonnée à 4 heures** : la playlist est coupée dès que le titre suivant ferait dépasser le budget — les titres prioritaires en tête survivent.
- **Pensé multi-plateforme** : les plateformes musicales et le stockage passent par des interfaces communes, pour ajouter Deezer et Apple Music sans toucher à la logique métier.

## 💻 Stack technique

| Catégorie            | Technologies                                                                                                                              |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Langage**          | ![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg)                                                                           |
| **Runtime**          | ![Node.js](https://shieldcn.dev/badge/Node.js-ESM-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) `tsx` |
| **Provider musical** | ![Spotify Web API](https://shieldcn.dev/badge/Spotify-Web%20API-1DB954.svg) OAuth 2.0 authorization code + PKCE                           |
| **Stockage**         | ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg) tokens OAuth, RLS activé, accès avec la clé `service_role`           |
| **Validation**       | ![Zod](https://shieldcn.dev/badge/Zod-3-3E67B1.svg) variables d'environnement vérifiées au démarrage                                      |

## 📦 Installation & Démarrage

> ⚠️ Le compte développeur Spotify doit avoir un abonnement **Premium** actif pour enregistrer une app. Les utilisateurs de la playlist, non — un compte gratuit suffit. En Development Mode, l'app est limitée à 5 utilisateurs autorisés.

1. **Cloner le projet**
   ```bash
   git clone https://github.com/matthieulechat/mon-daily.git
   cd mon-daily
   ```
2. **Installer les dépendances**
   ```bash
   pnpm install
   ```
3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   Renseigne les identifiants de ton app Spotify (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI` — la valeur par défaut `http://127.0.0.1:8888/callback` doit être enregistrée dans ton app Spotify) et ton projet Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). Les cinq sont obligatoires.
4. **S'authentifier auprès de Spotify** — ouvre le navigateur et enregistre les tokens dans Supabase
   ```bash
   pnpm run login
   ```
   > Utilise `pnpm run login`, pas `pnpm login` : ce dernier est la commande de connexion au registre propre à pnpm.
5. **Générer la playlist du jour** — avec l'id utilisateur Spotify affiché à l'étape précédente
   ```bash
   pnpm run generate <spotify_user_id>
   ```

La génération se lance à la main pour l'instant. L'automatisation quotidienne (Edge Function Supabase + `pg_cron`) est prévue, cf. la roadmap.

## 📂 Structure du projet

```
src/
├── auth/        # flow OAuth Spotify (script de login + service PKCE)
├── config/      # validation de l'env, jingles du jour, liste des podcasts
├── core/        # sélection des épisodes de podcast (règles de fraîcheur)
├── providers/   # interface plateforme musicale (Spotify aujourd'hui, Deezer/Apple Music plus tard)
├── storage/     # interface de stockage (Supabase)
├── types/       # types partagés
└── generate.ts  # construction du mix : gabarit, coupe 4h, mise à jour de la playlist
```

## 🧠 Comment le mix est construit

Logique étape par étape, gabarit du mix et limitations connues : [`docs/PLAYLIST_GENERATION.md`](docs/PLAYLIST_GENERATION.md).

## 🛠️ Développement

Autre script utile : `pnpm run typecheck`.

Périmètre, architecture et journal d'avancement : [`docs/PRD.md`](docs/PRD.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) et [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

Fait avec ❤️ par [Matthieu LECHAT](https://github.com/matthieulechat)
