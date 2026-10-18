---
id: ZBLK-004
type: blocker
date: 2026-09-20
summary: "Création Supabase Paris échoue 2x (quota + nom dupliqué)"
tags: [supabase, mcp, project-limit, naming]
status: résolu
---

# ZBLK-004 — Création du projet Supabase Paris échouée 2 fois avant de réussir

**Friction** : `create_project` (région Paris) a échoué deux fois de suite : d'abord avec une erreur de limite de plan, puis avec une collision de nom.

**Cause réelle** : (1) L'organisation était déjà à sa limite de 2 projets actifs sur le plan gratuit (`kronik` + `mon-daily` fraîchement réveillé) — `get_cost` annonçait pourtant 0€, ce qui ne présage rien de la capacité disponible. (2) Le nom `"mon-daily"` était déjà pris par l'ancien projet, même mis en pause.

**Solution** : (1) `pause_project` sur l'ancien projet Dublin pour libérer un slot. (2) Renommage du nouveau projet en `mon-daily-paris`.

## Références

- [BDR-006](../../decisions/BDR-006.md) — décision ayant motivé cette recréation
