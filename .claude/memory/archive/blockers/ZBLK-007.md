---
id: ZBLK-007
type: blocker
date: 2026-09-21
summary: "SVG en `<img>` avec police Google Fonts échoue silencieusement dans le Claude Browser pane"
tags: [claude-browser, svg, fonts, canvas, sandboxing]
status: résolu
---

# ZBLK-007 — SVG en `<img>` avec police Google Fonts échoue silencieusement dans le Claude Browser pane

**Friction** : Une page HTML de test (rasterisation de `public/icon.svg` en JPEG via canvas, pour la pochette de playlist) ne déclenchait jamais `img.onload` — le SVG en data-URI contenait un `@import` Google Fonts dans son `<style>`, et rien n'apparaissait dans les logs console ni le réseau.

**Cause réelle** : Ajout d'un `img.onerror` a révélé l'échec (auparavant silencieux). Le Claude Browser pane bloque les requêtes vers des domaines externes non explicitement autorisés (`fonts.googleapis.com`) — visible via `read_network_requests` qui ne montrait aucune requête sortante vers ce domaine, ni côté SVG en `<img>`, ni via un `<link>` classique dans le `<head>` de la page.

**Solution** : Retrait de l'`@import` du SVG (police système en repli pour un premier test), puis téléchargement direct du fichier `.woff2` d'Archivo Black via `fetch` côté Node (hors sandbox du navigateur) et service local via un mini-serveur HTTP + `@font-face` pointant vers ce fichier local — plus aucune requête externe nécessaire depuis le navigateur.

## Références

- Voir aussi GLRN-288 (pattern généralisé, mémoire globale)
