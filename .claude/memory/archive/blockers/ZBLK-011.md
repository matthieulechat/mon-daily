---
id: ZBLK-011
type: blocker
date: 2026-09-22
summary: "Playlists éditoriales Spotify tentées puis retirées"
tags: [spotify, api-restriction, playlists, mon-daily]
status: résolu
---

# ZBLK-011 — Playlists éditoriales Spotify tentées puis retirées

**Friction** : Intégration de 2 playlists éditoriales Spotify ("Hot Hits France" et une playlist découverte) pour enrichir le mix musique, échec en 404 sur `GET /playlists/{id}`

**Cause réelle** : Migration Spotify de février 2026 : une playlist non possédée par le token authentifié ne renvoie plus son contenu via l'API, même officielle

**Solution** : Code retiré (`getPlaylistTracks` sur `MusicProvider`), reporté en Phase 6 de la ROADMAP, récupérable via git si une piste apparaît

## Références

- [LRN-015](../../learnings/LRN-015.md) — pattern extrait de ce blocage
- [BDR-011](../../decisions/BDR-011.md) — décision musicale concernée
