---
id: ZBLK-017
type: blocker
date: 2026-09-28
tags: [spotify, rate-limit, 429, testing, automation, mon-daily]
---

# ZBLK-017 — 429 Spotify pendant les tests d'automatisation

| Friction                                                                                                                                                       | Cause réelle                                                                                                                                                                                                               | Solution                                                                                                                                                                                                                                                                             | Statut |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Premier test réel de `generate-daily` : un des deux comptes échoue en 429 sur `/me/playlists`, Baptiste s'inquiète d'un plantage systématique au run quotidien | Cumul de mes tests rapprochés (`pnpm run generate` local + curl quelques minutes après, même app Spotify) sur un rate limit partagé par app, pas par compte ; le code n'avait par ailleurs aucun retry sur 429, nulle part | Diagnostic confirmé : un retest quelques minutes plus tard passe en 200 pour les deux comptes (rate limit transitoire, pas un bug). Filet de sécurité ajouté quand même : `fetchSpotifyWithRetry` (backoff + `Retry-After`) partagé par `spotify.provider.ts` et `podcast-source.ts` | résolu |

## Références

Voir aussi GLRN-317 (mémoire globale)
