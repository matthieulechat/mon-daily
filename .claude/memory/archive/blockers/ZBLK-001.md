---
id: ZBLK-001
type: blocker
date: 2026-09-07
tags: [spotify, audio-features, scope, limitation-api, v1]
---

# ZBLK-001 — Analyse audio fine (mood/énergie) impossible gratuitement

| Friction                                                                                                                                     | Cause réelle                                                                                                                                                           | Solution                                                                                                                                                                        | Statut |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Impossible de construire un mix basé sur le mood/l'énergie des morceaux (façon Daily Drive original) sans passer par une analyse audio fine. | L'endpoint `/audio-features` est déprécié depuis novembre 2024 pour toute app créée après cette date — aucune donnée d'analyse audio gratuite disponible côté Spotify. | Fonctionnalité explicitement sortie du périmètre V1 (voir "Hors scope V1" dans le PRD) — la personnalisation V1 repose uniquement sur genres dominants + recherche par mot-clé. | résolu |

## Références

- [LRN-001](../../learnings/LRN-001.md) — contrainte API à l'origine de ce blocage
