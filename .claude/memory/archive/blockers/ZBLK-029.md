---
id: ZBLK-029
type: blocker
date: 2026-10-05
summary: "Page blanche au lancement du serveur de dev"
tags: [vite, env, blank-page, supabase, dev-server, mon-daily]
status: résolu
---

# ZBLK-029 — Page blanche au lancement du serveur de dev

**Friction** : `pnpm web:dev` démarre sans erreur mais la page reste blanche

**Cause réelle** : `SUPABASE_PUBLISHABLE_KEY` absente de `.env.local` (présente dans `.env.example`) : `supabase.ts` lève une erreur au chargement

**Solution** : Ligne ajoutée à `.env.local` avec la clé publique lue via le MCP Supabase ; Vite a rechargé seul

## Références

- [LRN-061](../../learnings/LRN-061.md) — pattern de diagnostic
