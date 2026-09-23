---
id: ZBLK-013
type: blocker
date: 2026-09-23
tags: [rename, grep, search, git-remote, mon-daily]
---

# ZBLK-013 — Renommage d'auteur incomplet : 3 passes nécessaires

| Friction                                                                                                                       | Cause réelle                                                                                                                                                                                                                           | Solution                                                                                                                                                                                                                                                                                        | Statut |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Le remplacement de « Baptiste LECHAT » par « Matthieu LECHAT » a laissé des mentions et un lien erroné après la première passe | Recherche limitée au nom complet (`Baptiste\s+LECHAT`) : le prénom seul dans `docs/` et `src/` a été écarté à tort comme « prénom d'utilisateur » ; le handle `baptistelechat` a été jugé « le vrai compte » sans lire `git remote -v` | Grep élargi au prénom seul (6 mentions : `docs/ROADMAP.md`, `docs/PLAYLIST_GENERATION.md`, commentaire de `src/generate.ts`), puis URL GitHub alignée sur le remote `matthieulechat`. Les 28 mentions de `.claude/memory` sont laissées volontairement (cf. [BDR-014](../../decisions/BDR-014.md)) | résolu |

## Références

- [BDR-014](../../decisions/BDR-014.md) — attribution retenue et périmètre du remplacement
- Voir aussi GLRN-304 (pattern global extrait)
