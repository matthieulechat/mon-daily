---
id: ZBLK-015
type: blocker
date: 2026-09-28
tags: [deno, supabase, edge-functions, module-resolution, deployment]
---

# ZBLK-015 — Déploiement Edge Function échoue "Module not found .js"

| Friction                                                                                                                                | Cause réelle                                                                                                                                                                    | Solution                                                                                                                                                         | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Premier `deploy_edge_function` échoue au bundle : `Module not found "file:///…/config/jingles.js". Maybe change the extension to '.ts'` | Les fichiers copiés verbatim depuis `src/` (convention NodeNext : imports `.js` pointant vers des fichiers `.ts`) ne se résolvent pas de la même façon sous Deno que sous `tsc` | Réécriture de tous les imports relatifs `.js` en `.ts` dans la copie `supabase/functions/generate-daily/` (sed ciblé, fichier par fichier), redéploiement réussi | résolu |

## Références

Voir aussi GLRN-314 (mémoire globale)
