---
id: ZBLK-018
type: blocker
date: 2026-10-01
tags: [spotify, supabase, edge-functions, cron, playlist, cover, mon-daily]
---

# ZBLK-018 — Cron du 01/10 : 2 comptes en échec, mix non mis à jour

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| Le cron de 05:00 UTC répond 207 : les 2 comptes échouent, les playlists de la veille ne sont pas mises à jour | **Deux bugs enchaînés.** (1) Certain : `uploadCoverImage` lit `public/playlist-cover.jpg` absent de l'Edge Function ([LRN-035](../../learnings/LRN-035.md)). (2) Non prouvé : `/me/playlists` n'a pas renvoyé « Mon Daily » à 05:00 pour les 2 comptes (35 et 14 playlists, nom identique, première page ; le code de recherche n'a pas changé depuis le 07/09), d'où une création en doublon vide qui déclenche le bug (1). Les runs des 29 et 30/09 avaient retrouvé la playlist. Hypothèses : transitoire côté Spotify, différence Edge/local, état de la bibliothèque | Pochette embarquée en base64 ; id de playlist stocké ([BDR-029](../../decisions/BDR-029.md)) ; `console.warn` listant les playlists reçues si la recherche ne trouve rien ; doublons supprimés à la main ; déploiement v7 testé (200, 2 comptes, `Pochette OK`). Confirmé au cron du 02/10 05:00 (2 comptes OK, aucun `console.warn`). Le symptôme restant (pochette absente chez un compte) venait de [ZBLK-021](ZBLK-021.md) | résolu |

## Références

- [BDR-029](../../decisions/BDR-029.md) — id de playlist stocké
- [LRN-035](../../learnings/LRN-035.md) — fichier lu sur disque non déployé
- [LRN-034](../../learnings/LRN-034.md) — rate limit pendant les tests
