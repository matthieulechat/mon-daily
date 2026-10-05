---
id: ZBLK-025
type: blocker
date: 2026-10-04
tags: [spotify, retry-after, edge-functions, pg-net, 546, mon-daily]
---

# ZBLK-025 — Génération sans résultat : 546 sur `generate-daily`

| Friction                                                                                                                                     | Cause réelle                                                                                                                                              | Solution                                                                                                                                             | Statut |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Rejeu de la génération pour les 2 comptes : deux runs (n°13, n°14) sans réponse puis `546 WORKER_RESOURCE_LIMIT`, file `pg_net` crue bloquée | `Retry-After` Spotify de ~12 h 30 respecté sans plafond : la fonction dormait jusqu'à la limite de ressources, figée sur « Récupération des podcasts... » | Plafond de 30 s ([BDR-038](../../decisions/BDR-038.md)), v10 déployée, rejeu n°15 OK pour les 2 comptes mais **sans podcasts** (429 sur tous les shows) | résolu |

## Références

- [BDR-038](../../decisions/BDR-038.md) — plafond du `Retry-After`
- [ZBLK-024](ZBLK-024.md) — le rate limit Spotify qui reste actif
- [LRN-048](../../learnings/LRN-048.md) — requête `pg_net` en vol, pas coincée
