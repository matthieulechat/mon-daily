<h1 align="center">Mon Daily 🎧</h1>

<p align="center">
  <i>Ton remplaçant personnel du Daily Drive — un mix quotidien de musique et de podcasts d'actu FR, directement dans Spotify.</i>
</p>

<p align="center">
  <a href="README.md">🇬🇧 Read in English</a>
</p>

![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg) ![Node.js](https://shieldcn.dev/badge/Node.js-18%2B-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg)

---

## 🚀 Fonctionnalités clés

- **Mix quotidien automatique** : régénère chaque jour une playlist Spotify dédiée, mélangeant musique personnalisée et podcasts d'actu FR (Le Monde, France Info...).
- **Pas de recommandation boîte noire** : Spotify a déprécié `/recommendations` pour les nouvelles apps en novembre 2024 — la découverte musicale est reconstruite à partir de tes propres top tracks/artists et genres dominants.
- **Stockage en 2 étapes** : démarre avec un simple fichier JSON local (pas d'infra requise), migre vers Supabase (Postgres + Vault) plus tard sans toucher à la logique métier.
- **Pensé multi-plateforme** : les providers musicaux passent par une interface commune, conçue pour s'étendre au-delà de Spotify vers Deezer et Apple Music.

## 💻 Stack technique

| Catégorie            | Technologies                                                                                                                          |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Langage**          | ![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg)                                                                       |
| **Runtime**          | ![Node.js](https://shieldcn.dev/badge/Node.js-18%2B-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) |
| **Provider musical** | ![Spotify Web API](https://shieldcn.dev/badge/Spotify-Web%20API-1DB954.svg)                                                           |
| **Stockage**         | JSON local → ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg)                                                     |
| **Validation**       | ![Zod](https://shieldcn.dev/badge/Zod-3-3E67B1.svg)                                                                                   |

## 📦 Installation & Démarrage

1. **Cloner le projet**
   ```bash
   git clone https://github.com/baptistelechat/mon-daily.git
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
   Renseigne tes identifiants d'app Spotify (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`) et, une fois à l'étape de migration Supabase, `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
4. **S'authentifier auprès de Spotify**
   ```bash
   pnpm login
   ```
5. **Générer la playlist du jour**
   ```bash
   pnpm generate
   ```

## 📂 Structure du projet

```
src/
├── auth/        # flow OAuth Spotify
├── config/      # chargement des variables d'environnement
├── core/        # analyse des goûts & moteur de découverte (logique de sélection musicale)
├── providers/   # interface plateforme musicale (Spotify aujourd'hui, Deezer/Apple Music plus tard)
├── storage/     # interface de stockage (JSON local → Supabase)
└── types/       # types partagés
```

Docs du projet — périmètre, architecture et roadmap : [`docs/PRD.md`](docs/PRD.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

Fait avec ❤️ par [Baptiste Lechat](https://github.com/baptistelechat)
