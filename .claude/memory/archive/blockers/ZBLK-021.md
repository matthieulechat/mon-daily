---
id: ZBLK-021
type: blocker
date: 2026-10-02
tags: [spotify, playlist, cover, stored-id, idempotence, edge-functions, mon-daily]
---

# ZBLK-021 — Pochette absente chez un compte malgré id stocké

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| Après le cron du 02/10, la playlist de Baptiste n'a pas de pochette (mosaïque Spotify) alors que celle de Matthieu est correcte ; les logs sont propres (`Pochette OK`, 2 comptes mis à jour) | `uploadCoverImage` n'était appelé qu'à la **création** de la playlist. Depuis [BDR-029](../../decisions/BDR-029.md) l'id est stocké et réutilisé tel quel : la playlist sans pochette (celle restée après suppression à la main des doublons) n'était plus jamais corrigée | Upload de la pochette à chaque run, après `/items` (copie `src/` + Edge Function), déploiement v8 par le CLI, cron rejoué (200, 2 comptes OK), commit `0653a96` | résolu |

## Références

- [LRN-038](../../learnings/LRN-038.md) — config idempotente à réappliquer à chaque run
- [ZBLK-018](ZBLK-018.md) — cron du 01/10 à l'origine des doublons
- [LRN-035](../../learnings/LRN-035.md) — pochette non déployée dans l'Edge Function
