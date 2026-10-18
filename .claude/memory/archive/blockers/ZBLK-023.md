---
id: ZBLK-023
type: blocker
date: 2026-10-03
summary: "`vite-plugin-pwa` 1.3.0 refuse `assets-generator` 2.0"
tags: [pnpm, peer-deps, vite-pwa, eperm, mon-daily]
status: résolu
---

# ZBLK-023 — `vite-plugin-pwa` 1.3.0 refuse `assets-generator` 2.0.0

**Friction** : `pnpm peers check` signale un peer non satisfait après l'ajout des deux plugins PWA

**Cause réelle** : `pnpm add -D` a pris `@vite-pwa/assets-generator` 2.0.0 alors que `vite-plugin-pwa` 1.3.0 exige `^1` ; la correction par `pnpm add` a échoué en EPERM (rename de `package.json`), laissant le fichier désynchronisé

**Solution** : Éditer `web/package.json` à la main (`^1.0.2`) puis `pnpm install` ; vérifié par `pnpm peers check`

## Références

- [LRN-045](../../learnings/LRN-045.md) — vérifier les peers après un `add`
