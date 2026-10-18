---
id: ZBLK-027
type: blocker
date: 2026-10-05
summary: "Maquette d'animations invisible dans le panneau"
tags: [visualize, preview, html, browser-pane, mon-daily]
status: résolu
---

# ZBLK-027 — Maquette d'animations invisible dans le panneau

**Friction** : Les maquettes (widget puis page HTML) s'affichaient vides ou cassées : aucune pile visible

**Cause réelle** : Style du widget qui écrasait les balises `<i>`/`<u>`, puis page hors projet servie en instantané statique sans exécuter ses scripts

**Solution** : Page copiée dans le dossier du projet (scripts exécutés), puis supprimée après usage
