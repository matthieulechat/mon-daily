---
id: ZBLK-028
type: blocker
date: 2026-10-05
tags: [playlist, duration, truncate, podcast, mix, mon-daily]
---

# ZBLK-028 — Playlist de Matthieu à 208 min au lieu de 240

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| Playlist à 208 min alors que le réglage est à 240 (4 h) ; 20 % des tirages simulés sous 230 min | Le `break` de `truncateToDuration` face à un podcast trop long. Deux fausses pistes avant : cron/réglage (corrects), puis pool de musique (suffisant) | Budget dans `buildMix` : repiocher un épisode plus court, gabarit conservé. Déployé et poussé (`b36aa95`) | résolu |

## Références

- [LRN-055](../../learnings/LRN-055.md) — mesurer le pool
- [LRN-056](../../learnings/LRN-056.md) — pattern de coupe
- [BDR-043](../../decisions/BDR-043.md) — décision retenue
