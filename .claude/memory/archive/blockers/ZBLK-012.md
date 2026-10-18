---
id: ZBLK-012
type: blocker
date: 2026-09-23
summary: "Page de review sans liens visibles"
tags: [html, claude-browser, static-rendering, mon-daily]
status: résolu
---

# ZBLK-012 — Page de review sans liens visibles

**Friction** : Baptiste ne voyait aucun lien dans la page de tri des podcasts

**Cause réelle** : Lignes du tableau générées en JS ; fichier hors projet ouvert en instantané statique sans JS dans le Claude Browser pane

**Solution** : Lignes écrites en dur dans le HTML, copie sur le Bureau pour ouverture dans le vrai navigateur, puis déplacement dans `docs/podcast-review.html`

## Références

- [LRN-019](../../learnings/LRN-019.md) — pattern extrait
