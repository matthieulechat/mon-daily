---
id: ZBLK-026
type: blocker
date: 2026-10-04
tags: [spotify, 429, covers, show-names, mon-daily]
---

# ZBLK-026 — Noms et pochettes des nouveaux shows introuvables sous 429

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| Ajout de 48 podcasts : l'API Spotify (noms, pochettes) renvoyait 429 sur tous les appels, et `pnpm covers` a écrasé `show-covers.ts` avec 0 entrée | Limite de débit encore active ([ZBLK-024](ZBLK-024.md)) ; le script écrit son fichier même sans résultat | Noms et pochettes lus sur les pages publiques des shows ([LRN-049](../../learnings/LRN-049.md)) ; `show-covers.ts` restauré par git puis complété | résolu |

## Références

- [ZBLK-024](ZBLK-024.md) — le rate limit Spotify à l'origine
- [LRN-049](../../learnings/LRN-049.md), [LRN-050](../../learnings/LRN-050.md) — patterns extraits
