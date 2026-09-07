<h1 align="center">Mon Daily 🎧</h1>

<p align="center">
  <i>Your personal Daily Drive replacement — a daily mix of music and French news podcasts, straight into Spotify.</i>
</p>

<p align="center">
  <a href="README.fr.md">🇫🇷 Lire en français</a>
</p>

![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg) ![Node.js](https://shieldcn.dev/badge/Node.js-18%2B-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg)

---

## 🚀 Key Features

- **Automatic daily mix**: regenerates a dedicated Spotify playlist every day, blending personalized music with French news podcasts (Le Monde, France Info...).
- **No black-box recommendations**: Spotify deprecated `/recommendations` for new apps in November 2024 — music discovery is rebuilt from your own top tracks/artists and dominant genres instead.
- **Two-stage storage**: starts with a local JSON file (no infra needed), migrates to Supabase (Postgres + Vault) later without touching the business logic.
- **Multi-platform ready**: music providers sit behind a shared interface, designed to extend beyond Spotify to Deezer and Apple Music down the line.

## 💻 Technical Stack

| Category           | Technologies                                                                                                                          |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Language**       | ![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg)                                                                       |
| **Runtime**        | ![Node.js](https://shieldcn.dev/badge/Node.js-18%2B-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) |
| **Music provider** | ![Spotify Web API](https://shieldcn.dev/badge/Spotify-Web%20API-1DB954.svg)                                                           |
| **Storage**        | local JSON → ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg)                                                     |
| **Validation**     | ![Zod](https://shieldcn.dev/badge/Zod-3-3E67B1.svg)                                                                                   |

## 📦 Installation & Getting Started

1. **Clone the project**
   ```bash
   git clone https://github.com/baptistelechat/mon-daily.git
   cd mon-daily
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Spotify app credentials (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`) and, once you reach the Supabase migration stage, `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
4. **Authenticate with Spotify**
   ```bash
   pnpm login
   ```
5. **Generate today's playlist**
   ```bash
   pnpm generate
   ```

## 📂 Project Structure

```
src/
├── auth/        # Spotify OAuth flow
├── config/      # environment loading
├── core/        # taste analysis & discovery engine (music selection logic)
├── providers/   # music platform interface (Spotify today, Deezer/Apple Music later)
├── storage/     # storage interface (local JSON → Supabase)
└── types/       # shared types
```

Project docs — scope, architecture and roadmap: [`docs/PRD.md`](docs/PRD.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

Made with ❤️ by [Baptiste Lechat](https://github.com/baptistelechat)
