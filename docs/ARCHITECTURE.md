# Architecture technique — "Mon Daily"

## Approche en 2 temps

Pour valider le concept rapidement, on découpe en deux étapes :

| Étape                            | Objectif                                                                   | Stockage                                        |
| -------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| **Étape A — Script local**       | Script Node/TS lancé **manuellement**, pas d'infra, pas de Supabase        | Fichier **JSON local** (`data/store.json`)      |
| **Étape B — Migration Supabase** | Automatisation complète (cron quotidien, plusieurs utilisateurs possibles) | **Postgres (Supabase)** + Vault pour les tokens |

Le code est pensé dès le départ pour que le passage de A à B ne demande de toucher **que la couche de stockage** (pas la logique métier).

---

## Étape A — Script local (MVP rapide)

### Stack

- **Nom du projet / package npm** : `mon-daily`
- **Runtime** : Node.js + TypeScript
- **Package manager** : pnpm
- **Style d'import** : `import x from 'x'` (ESM)
- **Stockage** : fichier JSON local (`data/store.json`) via les fonctions natives Node (`fs/promises`)
- **Lancement** : manuel, via un script (`pnpm run generate`)
- **HTTP client** : `fetch` natif (Node 18+)

### Structure de dossiers

```
mon-daily/
├── src/
│   ├── providers/
│   │   ├── provider.interface.ts     # interface commune (déjà pensée multi-plateforme)
│   │   └── spotify.provider.ts       # seul provider implémenté à l'étape A
│   │
│   ├── sources/
│   │   └── rss-fetcher.ts            # récupération flux podcasts FR
│   │
│   ├── core/
│   │   ├── taste-analyzer.ts         # extraction genres dominants
│   │   ├── discovery-engine.ts       # recherche par genre (remplace /recommendations)
│   │   └── mixer.ts                  # logique de mix musique/podcast
│   │
│   ├── auth/
│   │   └── oauth.service.ts          # flow OAuth Spotify
│   │
│   ├── storage/
│   │   ├── storage.interface.ts      # interface commune (clé = ce qui permettra la migration)
│   │   └── json-storage.ts           # implémentation Étape A (fichier local)
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── generate.ts                   # script lancé manuellement (point d'entrée)
│
├── data/
│   └── store.json                    # tokens (local, jamais commité)
│
├── .env                               # secrets (client_id, client_secret Spotify)
├── package.json
└── tsconfig.json
```

### Interface `Storage` (le point clé pour la migration future)

```typescript
interface Storage {
  getTokens(userId: string): Promise<OAuthTokens | null>;
  saveTokens(userId: string, tokens: OAuthTokens): Promise<void>;
}
```

- `json-storage.ts` (Étape A) lit/écrit dans `data/store.json`.
- `supabase-storage.ts` (Étape B) implémentera la même interface avec des requêtes Postgres.
- **Aucun autre fichier du projet ne connaît le détail du stockage** — seul `storage.interface.ts` est référencé partout ailleurs.

### Flux (lancement manuel)

```
[pnpm run generate]
        │
        ▼
[storage.getTokens] ──── token expiré ──► [oauth.service: refresh]
        │
        ▼
[spotify.provider: getTopTracks + getTopArtists]
        │
        ▼
[taste-analyzer: extraire genres dominants]
        │
        ▼
[discovery-engine: searchByGenre sur 2-3 genres du jour]
        │
        ▼
[rss-fetcher: récupérer derniers épisodes podcasts FR]
        │
        ▼
[mixer: assembler musique + actu selon pattern (ex: 4 titres / 1 podcast)]
        │
        ▼
[spotify.provider: createOrUpdatePlaylist]
```

### Format `data/store.json`

```json
{
  "users": {
    "matthieu": {
      "platform": "spotify",
      "tokens": {
        "access_token": "...",
        "refresh_token": "...",
        "expires_at": "2026-09-08T06:00:00Z"
      }
    }
  }
}
```

---

## Étape B — Migration Supabase (automatisation)

Une fois l'Étape A validée manuellement, on bascule :

| Composant Étape A                    | Devient (Étape B)                                                 |
| ------------------------------------ | ----------------------------------------------------------------- |
| `data/store.json`                    | Tables Postgres (`users`, `oauth_tokens`)                         |
| Tokens en clair dans le JSON local   | Tokens dans **Supabase Vault** (chiffrés)                         |
| Lancement manuel `pnpm run generate` | **Edge Function** Supabase déclenchée par **pg_cron** chaque jour |
| `json-storage.ts`                    | `supabase-storage.ts` (même interface `Storage`)                  |

### Modèle de données Postgres (Étape B)

`users` est une identité pure (juste un uuid) : `platform` et `platform_user_id` vivent sur `oauth_tokens`, pas sur `users`, pour qu'un même utilisateur de l'app puisse avoir plusieurs comptes provider (Spotify + Deezer) sans doublon d'identité.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'spotify',  -- 'spotify' | 'deezer' | 'apple_music'
  platform_user_id TEXT NOT NULL,            -- id de l'utilisateur tel que connu par cette plateforme
  access_token TEXT NOT NULL,           -- via Supabase Vault
  refresh_token TEXT NOT NULL,          -- via Supabase Vault
  expires_at TIMESTAMP NOT NULL,
  UNIQUE (platform, platform_user_id)
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  music_podcast_ratio TEXT DEFAULT '4:1',
  podcast_sources JSONB DEFAULT '[]'
);
```

### Déclenchement automatique (Étape B)

```sql
SELECT cron.schedule(
  'daily-mix-generation',
  '0 6 * * *',   -- tous les jours à 6h
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/generate-daily-mix',
    headers := jsonb_build_object('Content-type', 'application/json')
  );
  $$
);
```

---

## Interface commune `MusicProvider` (dès l'Étape A, pour la suite Deezer/Apple Music)

```typescript
interface MusicProvider {
  authenticate(userId: string): Promise<void>;
  getTopTracks(userId: string): Promise<Track[]>;
  getTopArtists(userId: string): Promise<Artist[]>;
  searchByGenre(genre: string): Promise<Track[]>;
  createOrUpdatePlaylist(userId: string, tracks: Track[]): Promise<void>;
  refreshTokenIfNeeded(userId: string): Promise<void>;
}
```

Chaque plateforme (`SpotifyProvider`, `DeezerProvider`, `AppleMusicProvider`) implémente cette interface — le `mixer` ne connaît jamais la plateforme sous-jacente.

## Sécurité — points d'attention

- **Étape A** : `data/store.json` dans `.gitignore` dès le premier commit (contient des tokens en clair, acceptable en usage strictement local/perso).
- **Étape B** : tokens obligatoirement dans Supabase Vault, jamais en clair en base.
- **Scopes OAuth minimaux** : `user-top-read`, `playlist-modify-private`, `user-read-recently-played`.
- **`.env` jamais commité**.
- Prévoir un cas d'échec propre si un utilisateur révoque l'accès.

## Contrainte Spotify — plafond utilisateurs (Development Mode)

- L'app Spotify reste en **Development Mode** tant qu'aucune démarche d'extension n'est faite → **5 comptes utilisateurs autorisés maximum** (toi inclus), à ajouter manuellement en allowlist dans le Developer Dashboard.
- Seul le compte développeur (celui qui a créé l'app) doit être Premium ; les comptes utilisateurs ajoutés peuvent rester en Free.
- La table `users` (Étape B, Supabase) doit donc rester dimensionnée pour un petit nombre d'utilisateurs (5 max côté Spotify) — pas de logique de scale à prévoir tant que ce plafond n'est pas levé.

## Points d'extension futurs

- `discovery-engine.ts` : endroit où brancher une source de recommandation plus fine si besoin, sans toucher au reste du pipeline.
- `rss-fetcher.ts` : conçu pour accepter une liste de flux configurable par utilisateur (Phase 5).
- `storage.interface.ts` : garantit que la migration A → B ne touche qu'une seule couche.
