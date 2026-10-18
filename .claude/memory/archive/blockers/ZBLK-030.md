---
id: ZBLK-030
type: blocker
date: 2026-10-05
summary: "Script d'ajout cassé 3 fois (échappements, CRLF)"
tags: [bash, node, escaping, crlf, script, tooling, mon-daily]
status: résolu
---

# ZBLK-030 — Script d'ajout de shows cassé trois fois (échappements shell, CRLF)

**Friction** : Trois tentatives pour réappliquer les ajouts de shows après restauration des fichiers reformatés : ancre introuvable, puis script corrompu (`SyntaxError: Invalid regular expression`), puis `Write` refusé sur le script

**Cause réelle** : Patch du script via `sed` et `node -e` dans Bash : les `\\n` et backticks ont été mangés par les couches d'échappement. Ancres écrites en LF alors que les fichiers sont en CRLF, et virgule finale oubliée dans `show-covers.ts`. Le hook avait aussi reformaté le script entre deux écritures

**Solution** : Réécrire le script en entier dans un nouveau fichier avec l'outil `Write` : regex déclarées en littéraux, lecture normalisée en LF, écriture en CRLF, ancres construites par `join("\n")`. Ne plus patcher du code par `sed`/`node -e` imbriqués

## Références

- [LRN-068](../../learnings/LRN-068.md) — origine : reformatage par le hook
