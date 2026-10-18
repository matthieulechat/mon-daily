---
id: ZBLK-009
type: blocker
date: 2026-09-22
summary: "Pool de tirage au sort sous-estimé (show vs épisode)"
tags: [spotify, podcast, random-selection, mon-daily]
status: résolu
---

# ZBLK-009 — Pool de tirage au sort sous-estimé (show vs épisode)

**Friction** : Claude a affirmé une "tension mathématique" (pool de 15 shows épuisé en ~4 jours) que Baptiste a signalée comme fausse

**Cause réelle** : Le code ne regardait que le dernier épisode par show, sous-comptant largement le pool réel de candidats

**Solution** : Réécriture de `getEligibleEpisodes` pour retourner tous les épisodes éligibles par show (confirmé : 45 épisodes actu, 34 thématiques sur un run réel, contre 13/15 shows)

## Références

- [LRN-014](../../learnings/LRN-014.md) — pattern extrait de ce blocage
- [BDR-012](../../decisions/BDR-012.md) — décision de sélection podcast concernée
