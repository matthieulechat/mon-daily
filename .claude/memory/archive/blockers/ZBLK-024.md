---
id: ZBLK-024
type: blocker
date: 2026-10-04
tags: [spotify, rate-limit, 429, search, mon-daily]
---

# ZBLK-024 — Spotify bloque l'app après ~2 000 requêtes (429, Retry-After ≈ 23 h)

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| Recherche de nouvelles sources suspendue ; un `pnpm generate` lancé ensuite a pendu aussi (jamais terminé, arrêté à la main) | Lot de ~150 recherches puis vérifications d'épisodes en rafale avec les identifiants de l'app : Spotify renvoie 429 avec `Retry-After` ≈ 82 000 s ; le script attendait docilement | Attendre la levée (≈ 2026-10-05 05h UTC : Retry-After mesuré à 44 963 s le 2026-10-04 à 16:30 UTC), puis vérifier le cron de 05h UTC ou lancer un run manuel ; régional/international à chercher par petits lots. **Levé le 2026-10-05** : le cron de 05:00 UTC a encore pris quelques 429 à 05:00:17 puis les appels sont passés ; test direct à 19h (token, `/shows/{id}/episodes`, `/search`) en 200 sans `Retry-After` | résolu |

## Références

- [LRN-046](../../learnings/LRN-046.md) — règle pour ne plus recommencer
- [LRN-047](../../learnings/LRN-047.md) — id à passer à `pnpm generate`
- [ZBLK-025](ZBLK-025.md) — conséquence sur l'Edge Function (546), résolue par le plafond [BDR-038](../../decisions/BDR-038.md)
