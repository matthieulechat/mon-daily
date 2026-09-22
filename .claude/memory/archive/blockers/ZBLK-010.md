---
id: ZBLK-010
type: blocker
date: 2026-09-22
tags: [spotify, bug, podcast, debugging, mon-daily]
---

# ZBLK-010 — Bug silencieux "aucun épisode" sur Gaspard G

| Friction                                                                                                                | Cause réelle                                                                                                              | Solution                                                                                                                                                                                                                                                      | Statut |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Le show "Gaspard G" était systématiquement ignoré ("aucun épisode sur le marché FR") alors qu'il a 66 épisodes au total | `items[0]` de la réponse `GET /shows/{id}/episodes` était `null` pour ce show précis ; le code ne regardait que cet index | Script de diagnostic direct à l'API (avec un token frais via `spotifyProvider.refreshTokenIfNeeded`) confirmant le `null` en position 0 puis un épisode valide en position 1 → filtrage de tous les `null` avant traitement, plus de dépendance à la position | résolu |

## Références

- [LRN-016](../../learnings/LRN-016.md) — pattern extrait de ce bug
