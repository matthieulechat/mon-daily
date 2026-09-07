---
register: journal
---

## 2026-09-07

Installation de l'infrastructure mémoire agent (`/memory-setup`) sur le projet **mon-daily**. Le projet est au tout début : structure de dossiers en place (`src/providers`, `src/core`, `src/auth`, `src/storage`), docs de cadrage rédigées (PRD, ARCHITECTURE, ROADMAP), mais aucun commit git encore. Les 3 entrées d'exemple créées reflètent les décisions et contraintes déjà actées dans la documentation : l'approche de migration en 2 étapes (JSON local → Supabase), la dépréciation de l'API de recommandation Spotify, et la mise hors scope de l'analyse audio fine qui en découle.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — Migration en 2 étapes JSON local → Supabase
- [LRN-001](learnings/LRN-001.md) — Spotify a tué `/recommendations` pour les apps post-nov 2024
- [ZBLK-001](archive/blockers/ZBLK-001.md) — Analyse audio fine (mood/énergie) impossible gratuitement

---

Lancement effectif du dev "étape par étape" (Phase 0 + Phase 1 de la ROADMAP). Écart validé avec Baptiste dès le départ : storage Supabase directement au lieu du JSON local de l'Étape A ([BDR-002](decisions/BDR-002.md)) — projet Supabase `mon-daily` créé (tables `users`/`oauth_tokens`, RLS activé), scaffold Node/TS complet (`auth`, `providers`, `storage`, `core`, `generate.ts`), typecheck OK. Deux frictions techniques mineures en cours de route : `pnpm install` qui échouait silencieusement à cause du blocage des postinstall scripts ([BLK-002](blockers/BLK-002.md) → [LRN-002](learnings/LRN-002.md)), et un `exec()` avec string interpolée flagué par le hook sécurité, corrigé en `execFile()` ([LRN-003](learnings/LRN-003.md)).

Blocage plus sérieux en fin de session : au moment de créer l'app Spotify Developer, découverte que Spotify exige depuis le 11 février 2026 un compte Premium pour le PROPRIÉTAIRE d'une app en Development Mode — Baptiste n'a pas de Premium ([BLK-003](blockers/BLK-003.md), encore **ouvert**). Recherche approfondie menée pour identifier toutes les voies possibles ([LRN-004](learnings/LRN-004.md)) : la piste la plus prometteuse est qu'un proche avec Premium crée l'app et ajoute Baptiste comme "authorized user" (la règle ne s'applique qu'au propriétaire, pas aux users autorisés). Alternatives explorées et écartées ou mises en réserve : Extended Quota Mode (fermé aux projets perso depuis mai 2025), Last.fm (ne contourne pas le vrai blocage côté création de playlist), pivot Deezer (viable mais demande de recoder le provider), automatisation navigateur hors API (zone grise ToS). Décision encore en attente de Baptiste — session interrompue sur ce point avant le `/memory-close`.

**Entrées clés :**

- [BDR-002](decisions/BDR-002.md) — Storage Supabase dès la Phase 1 (skip JSON local)
- [BLK-003](blockers/BLK-003.md) — Spotify Dev Mode bloqué sans compte Premium (ouvert)
- [LRN-004](learnings/LRN-004.md) — Spotify Dev Mode exige Premium du owner, pas des users
