---
id: ZBLK-029
type: blocker
date: 2026-10-05
tags: [vite, env, blank-page, supabase, dev-server, mon-daily]
---

# ZBLK-029 — Page blanche au lancement du serveur de dev

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| `pnpm web:dev` démarre sans erreur mais la page reste blanche | `SUPABASE_PUBLISHABLE_KEY` absente de `.env.local` (présente dans `.env.example`) : `supabase.ts` lève une erreur au chargement | Ligne ajoutée à `.env.local` avec la clé publique lue via le MCP Supabase ; Vite a rechargé seul | résolu |

## Références

- [LRN-061](../../learnings/LRN-061.md) — pattern de diagnostic
