---
id: ZBLK-014
type: blocker
date: 2026-09-28
summary: "Filtre HugoDécrypte par titre seul incomplet"
tags: [spotify, podcast, categorization, hugodecrypte, title-filter]
status: résolu
---

# ZBLK-014 — Filtre HugoDécrypte par titre seul incomplet

**Friction** : Le premier filtre HugoDécrypte (titre se terminant par une date OU commençant par "(Pop)") classait à tort certaines actus du jour en thématique

**Cause réelle** : Certains épisodes actu du jour n'ont pas de date en suffixe de titre (ex. "Le Royaume-Uni vit-il ses dernières heures ?") ; le titre seul n'encode pas systématiquement le format

**Solution** : Récupération des descriptions réelles via l'API (Client Credentials), comparaison sur les 25 derniers épisodes, ajout d'un critère combiné titre OU description ; découverte au passage que la description est parfois tronquée côté API sur les épisodes `(Pop)`, d'où le maintien du signal titre en complément

## Références

- [LRN-022](../../learnings/LRN-022.md) — Client Credentials Spotify suffisant pour ce diagnostic
- [LRN-023](../../learnings/LRN-023.md) — pattern extrait de cette friction
- [BDR-019](../../decisions/BDR-019.md) — décision finale issue de cette correction
