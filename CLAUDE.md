## 💻 mon-daily

Remplaçant maison du **Daily Drive Spotify** (supprimé en mars 2026) : un script qui régénère automatiquement une playlist quotidienne mêlant musique personnalisée (basée sur les goûts de l'utilisateur, sans l'endpoint `/recommendations` déprécié) et podcasts d'actu en français.

### Stack technique

- **Langage** : TypeScript
- **Runtime / Package manager** : Node.js + pnpm
- **Base de données** : fichier JSON local (`data/store.json`, Étape A) → PostgreSQL via Supabase + Vault (Étape B)
- **Déploiement** : script manuel local (V1) → Supabase Edge Function + `pg_cron` (V2, automatisation quotidienne)

### Architecture

Découpage volontaire en 2 étapes : d'abord un script local sans infra (stockage JSON), puis migration vers Supabase pour l'automatisation. Le code passe par une interface `Storage` commune (`storage.interface.ts`) et une interface `Provider` commune (`provider.interface.ts`, pensée multi-plateforme Spotify → Deezer → Apple Music) pour que la migration ne touche que la couche de stockage, jamais la logique métier.

### Conventions importantes

- Imports ESM (`import x from 'x'`), jamais `require`
- `fetch` natif pour le HTTP, jamais Axios
- Toute nouvelle intégration externe (provider musical, source de données) passe par son interface dédiée, pas d'appel direct depuis `core/`
