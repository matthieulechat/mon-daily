---
id: ZBLK-019
type: blocker
date: 2026-10-01
summary: "3 déploiements MCP échoués avant le CLI"
tags: [supabase, mcp, edge-functions, deployment, payload, mon-daily]
status: résolu
---

# ZBLK-019 — 3 déploiements MCP échoués avant le CLI

**Friction** : `deploy_edge_function` échoue 3 fois au bundling (`Module not found …/config/podcast-shows.ts`, puis `…/generate-playlist.ts`)

**Cause réelle** : L'outil exige tous les fichiers recopiés dans l'appel : ma recopie omettait des fichiers et tronquait le base64 de 58 Ko de la pochette. La v6 est restée intacte à chaque fois

**Solution** : Déploiement par `npx supabase functions deploy` après `supabase login` par l'utilisateur : version 7, `verify_jwt` conservé, test réel OK ([LRN-036](../../learnings/LRN-036.md))

## Références

- [LRN-036](../../learnings/LRN-036.md) — MCP fragile sur gros fichiers, préférer le CLI
- [LRN-032](../../learnings/LRN-032.md) — consigne précédente (MCP, 13 fichiers)
