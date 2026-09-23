<h1 align="center">Mon Daily 🎧</h1>

<p align="center">
  <i>Your personal Daily Drive replacement — a daily mix of your favorite music and French podcasts, straight into Spotify.</i>
</p>

<p align="center">
  <a href="README.fr.md">🇫🇷 Lire en français</a>
</p>

![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg) ![Node.js](https://shieldcn.dev/badge/Node.js-ESM-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) ![Spotify](https://shieldcn.dev/badge/Spotify-Web%20API-1DB954.svg) ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg)

---

## 📸 Screenshots

<p align="center">
  <img src="public/playlist-cover.jpg" width="240" alt="Mon Daily playlist cover" />
</p>
<p align="center"><sub>The cover of the generated "Mon Daily" playlist</sub></p>

## 🚀 Key Features

- **Daily Drive, rebuilt**: Spotify removed the Daily Drive in March 2026 — one command regenerates a private "Mon Daily" playlist mixing your music and French podcasts.
- **Your own top tracks**: no black-box recommendations (Spotify deprecated `/recommendations` for new apps in November 2024) — the music comes from your short-term top tracks, deduplicated.
- **55 French podcasts**: news bulletins, geopolitics, culture, sport, reportage... hand-sorted into `actu` (11 shows) and `thematique` (44 shows) in [`src/config/podcast-shows.ts`](src/config/podcast-shows.ts).
- **A fixed mix template**: 2 news episodes to open, then a podcast every 4 songs, alternating news and themed shows — 4 + 4 per day, drawn at random.
- **Fresh and varied**: episodes older than 3 days are ignored, and themed shows already used in the last 14 days are skipped.
- **Daily jingle**: the playlist starts with the official Spotify "C'est {jour}" jingle, computed on the `Europe/Paris` timezone.
- **Capped at 4 hours**: the playlist is cut as soon as the next track would exceed the budget — the priority tracks at the top survive.
- **Multi-platform ready**: music platforms and storage sit behind shared interfaces, so Deezer and Apple Music can be added without touching the business logic.

## 💻 Technical Stack

| Category           | Technologies                                                                                                                                              |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**       | ![TypeScript](https://shieldcn.dev/badge/TypeScript-5-blue.svg)                                                                                           |
| **Runtime**        | ![Node.js](https://shieldcn.dev/badge/Node.js-ESM-339933.svg) ![pnpm](https://shieldcn.dev/badge/pnpm-package%20manager-F69220.svg) `tsx`                 |
| **Music provider** | ![Spotify Web API](https://shieldcn.dev/badge/Spotify-Web%20API-1DB954.svg) OAuth 2.0 authorization code + PKCE                                           |
| **Storage**        | ![Supabase](https://shieldcn.dev/badge/Supabase-Postgres-3ECF8E.svg) OAuth tokens and playlist history, RLS enabled, accessed with the `service_role` key |
| **Validation**     | ![Zod](https://shieldcn.dev/badge/Zod-3-3E67B1.svg) environment variables checked at startup                                                              |

## 📦 Installation & Getting Started

> ⚠️ The Spotify developer account needs an active **Premium** subscription to register an app. Users of the playlist don't — a free account is enough. In Development Mode, the app is limited to 5 authorized users.

1. **Clone the project**
   ```bash
   git clone https://github.com/matthieulechat/mon-daily.git
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
   Fill in your Spotify app credentials (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI` — the default `http://127.0.0.1:8888/callback` must be registered in your Spotify app) and your Supabase project (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). All five are required.
4. **Authenticate with Spotify** — opens your browser and stores the tokens in Supabase
   ```bash
   pnpm run login
   ```
   > Use `pnpm run login`, not `pnpm login`: the latter is pnpm's own registry login command.
5. **Generate today's playlist** — with the Spotify user id printed by the previous step
   ```bash
   pnpm run generate <spotify_user_id>
   ```

The generation is triggered by hand for now. Daily automation (Supabase Edge Function + `pg_cron`) is planned, see the roadmap.

## 📂 Project Structure

```
src/
├── auth/        # Spotify OAuth flow (login script + PKCE service)
├── config/      # env validation, daily jingles, podcast shows list
├── core/        # podcast episode selection (freshness rules)
├── providers/   # music platform interface (Spotify today, Deezer/Apple Music later)
├── storage/     # storage interface (Supabase)
├── types/       # shared types
└── generate.ts  # mix builder: template, 4h cut, playlist update
```

## 🧠 How the mix is built

Step-by-step logic, mix template and known limitations: [`docs/PLAYLIST_GENERATION.md`](docs/PLAYLIST_GENERATION.md).

## 🛠️ Development

Other useful script: `pnpm run typecheck`.

Scope, architecture and progress log: [`docs/PRD.md`](docs/PRD.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

Made with ❤️ by [Matthieu LECHAT](https://github.com/matthieulechat)
