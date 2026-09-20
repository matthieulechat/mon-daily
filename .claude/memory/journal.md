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

Lancement effectif du dev "étape par étape" (Phase 0 + Phase 1 de la ROADMAP). Écart validé avec Baptiste dès le départ : storage Supabase directement au lieu du JSON local de l'Étape A ([BDR-002](decisions/BDR-002.md)) — projet Supabase `mon-daily` créé (tables `users`/`oauth_tokens`, RLS activé), scaffold Node/TS complet (`auth`, `providers`, `storage`, `core`, `generate.ts`), typecheck OK. Deux frictions techniques mineures en cours de route : `pnpm install` qui échouait silencieusement à cause du blocage des postinstall scripts ([ZBLK-002](archive/blockers/ZBLK-002.md) → [LRN-002](learnings/LRN-002.md)), et un `exec()` avec string interpolée flagué par le hook sécurité, corrigé en `execFile()` ([LRN-003](learnings/LRN-003.md)).

Blocage plus sérieux en fin de session : au moment de créer l'app Spotify Developer, découverte que Spotify exige depuis le 11 février 2026 un compte Premium pour le PROPRIÉTAIRE d'une app en Development Mode — Baptiste n'a pas de Premium ([ZBLK-003](archive/blockers/ZBLK-003.md), encore **ouvert** à ce stade de la session). Recherche approfondie menée pour identifier toutes les voies possibles ([LRN-004](learnings/LRN-004.md)) : la piste la plus prometteuse est qu'un proche avec Premium crée l'app et ajoute Baptiste comme "authorized user" (la règle ne s'applique qu'au propriétaire, pas aux users autorisés). Alternatives explorées et écartées ou mises en réserve : Extended Quota Mode (fermé aux projets perso depuis mai 2025), Last.fm (ne contourne pas le vrai blocage côté création de playlist), pivot Deezer (viable mais demande de recoder le provider), automatisation navigateur hors API (zone grise ToS). Décision encore en attente de Baptiste — session interrompue sur ce point avant le `/memory-close`.

**Entrées clés :**

- [BDR-002](decisions/BDR-002.md) — Storage Supabase dès la Phase 1 (skip JSON local)
- [ZBLK-003](archive/blockers/ZBLK-003.md) — Spotify Dev Mode bloqué sans compte Premium (ouvert à ce stade)
- [LRN-004](learnings/LRN-004.md) — Spotify Dev Mode exige Premium du owner, pas des users

## 2026-09-20

Session sans code : Matthieu a tranché sur [ZBLK-003](archive/blockers/ZBLK-003.md) en souscrivant lui-même un abonnement Spotify Premium plutôt que les contournements envisagés en session précédente ([BDR-003](decisions/BDR-003.md)) — docs PRD/ARCHITECTURE mis à jour en conséquence. Développement mis de côté pour plus tard avec Baptiste ; le reste de la session a porté sur l'identité visuelle de "Mon Daily" via le skill `brand-creator`, détourné pour un projet sans UI existante (usage réel visé : cover de playlist Spotify + base pour une future page de réglages). Exploration itérative : 12 directions UI puis convergence sur "Bulletin Groove" (bleu/jaune/lime néon, fond quasi noir, thème vinyle/radio, animations CSS — vinyle qui tourne, waveform live), 23 variantes de logo (A-N, P-V) convergeant sur "O + texte" — un disque vinyle avec le nom en bas à gauche, inspiré de l'ancienne cover Daily Drive fournie en référence ([BDR-004](decisions/BDR-004.md)). Description de playlist figée (option "face A / face B" du vinyle). Un bug mineur découvert et corrigé : le SVG exporté seul perdait la police Google Fonts chargée par la page HTML qui l'avait produit, résolu par un `@import` embarqué (voir aussi GLRN-283, pattern cross-projet). Changelog : rien ajouté (docs + assets design pas encore user-facing). Commit unique créé (`💄 Design`), pas de push demandé.

**Entrées clés :**

- [BDR-003](decisions/BDR-003.md) — Souscription Premium personnelle plutôt que contournement
- [BDR-004](decisions/BDR-004.md) — Identité visuelle "Bulletin Groove" retenue pour Mon Daily

---

Session d'exploration pure, sans code, centrée sur les prochaines pistes pour la Phase 2 (podcasts + mixer). Point de départ : clarifier l'anti-répétition documentée dans `ARCHITECTURE.md` (table `playlist_history`) — jamais implémentée dans le code actuel, avec un risque concret repéré : la recherche par genre Spotify est quasi-déterministe, donc sans historique les découvertes se répètent d'un jour sur l'autre ([LRN-005](learnings/LRN-005.md)). Trouvaille notable : l'album officiel Spotify "Mon Daily" (7 jingles "C'est {jour}", 2021) à préfixer en intro de playlist — IDs figés directement dans `docs/ROADMAP.md`, pas de fichier memory dédié. Pivot de sourcing des podcasts : abandon du parser RSS prévu (les flux publics Le Monde/France Info sont des articles texte, pas de l'audio) au profit de 3 shows Spotify natifs testés en pilote via `GET /shows/{id}/episodes` ([BDR-005](decisions/BDR-005.md)). En creusant plus loin, risque sérieux découvert sur le principe même du mix : les épisodes de podcast ajoutés à une playlist Spotify sont documentés comme peu fiables côté API, indépendamment de la source ([LRN-006](learnings/LRN-006.md)) — un test manuel est prévu avant de coder `mixer.ts`. Idée notée pour plus tard sans trancher : remplacer/compléter la recherche par genre par un vrai moteur de similarité d'artistes (Last.fm ou ListenBrainz), à rediscuter. Session close : changelog mis à jour (icône app en Unreleased), commit unique (`📝 Docs`), pas de push demandé. Au passage, [ZBLK-003](archive/blockers/ZBLK-003.md) (résolu depuis la session précédente mais jamais archivé) a été rangé.

**Entrées clés :**

- [LRN-005](learnings/LRN-005.md) — Recherche par genre Spotify quasi-déterministe → répétition sans historique
- [BDR-005](decisions/BDR-005.md) — Sourcer les podcasts via 3 shows Spotify natifs, pas RSS
- [LRN-006](learnings/LRN-006.md) — Épisodes de podcast peu fiables dans une playlist Spotify (bug API)

---

Premier vrai lancement du développement Phase 0/1, maintenant que Baptiste a le Premium ([BDR-003](decisions/BDR-003.md)). Guidage en direct via le panneau navigateur pour créer l'app Spotify Developer (client_id/secret récupérés et posés dans `.env.local`, scopes déjà codés dans `oauth.service.ts`). Le projet Supabase `mon-daily` était en pause (plan gratuit) ; réveillé, ses tables `users`/`oauth_tokens` correspondaient bien à [BDR-002](decisions/BDR-002.md). Baptiste a ensuite demandé à basculer la région de Dublin vers Paris — décision actée ([BDR-006](decisions/BDR-006.md)), mais la recréation du projet a échoué deux fois avant de réussir : limite de 2 projets actifs sur le plan gratuit, puis collision de nom ([ZBLK-004](archive/blockers/ZBLK-004.md), résolu). Deux patterns Supabase génériques en tirés pour la mémoire globale : le plafond de 2 projets actifs par org free, et l'absence de migration de région in-place. Sur suggestion de Baptiste (le dashboard Supabase le propose lui-même), ajout d'un serveur MCP Supabase project-scoped à `mon-daily` ([BDR-007](decisions/BDR-007.md)) — au passage, découverte qu'aucun outil MCP ne permet de supprimer un projet Supabase (create/pause/restore seulement), l'ancien projet Dublin reste donc en pause, vide, non supprimé. `docs/ROADMAP.md` mis à jour pour refléter l'état réel : Phase 0 entièrement faite, Phase 1 codée en quasi-totalité, seul le premier run (`pnpm run login`/`generate`) reste explicitement à faire. Session close : rien au changelog (tout ce qui a changé est infra/config/doc, pas user-facing), commit unique `aa762fc` (`.mcp.json` + `ROADMAP.md`), pas de push demandé.

**Entrées clés :**

- [BDR-006](decisions/BDR-006.md) — Bascule du projet Supabase de Dublin vers Paris
- [ZBLK-004](archive/blockers/ZBLK-004.md) — Création Supabase Paris échouée 2x avant de réussir
- [BDR-007](decisions/BDR-007.md) — Ajout du serveur MCP Supabase project-scoped à mon-daily

## 2026-09-21

Baptiste a fourni 25 URLs de shows Spotify supplémentaires à ajouter à la liste des médias podcast (Phase 2), en signalant deux besoins futurs : filtrer selon la durée/fréquence des épisodes, et modérer par mots-clés sur les titres pour les sujets sensibles (guerre, sexualité). Résolution des 28 show IDs (3 pilotes de [BDR-005](decisions/BDR-005.md) + 25 nouveaux) via l'API Spotify en Client Credentials pour confirmer leur existence et récupérer leurs noms réels — l'appel batch `GET /shows?ids=` a échoué en 403 sans raison explicite, contournement par appels individuels `GET /shows/{id}` ([BLK-005](blockers/BLK-005.md), résolu → [LRN-008](learnings/LRN-008.md)). Cadrage avec Baptiste avant d'écrire quoi que ce soit : les préférences de filtrage sont explicitement dépriorisées ("pas une priorité pour le moment"), le test manuel du risque [LRN-006](learnings/LRN-006.md) (playabilité d'un épisode inséré dans une playlist) reste à faire par Baptiste lui-même faute de temps, et les sujets de modération retenus sont guerre/conflits armés, sexualité et violence/faits divers — décidé de ne rien implémenter maintenant et de tout documenter comme tâches futures ([BDR-008](decisions/BDR-008.md)). En résolvant les shows, découverte que le flag `explicit` de Spotify n'est pas corrélé aux sujets sensibles visés (5 shows d'actu neutre l'ont, "Les Couilles sur la table" — centré sur la sexualité — ne l'a pas) ([LRN-007](learnings/LRN-007.md)). `docs/ROADMAP.md` (tableau à 28 shows + étape bloquante avant le mixer + réglages futurs en Phase 6) et `docs/PRD.md` mis à jour en conséquence. Changelog : rien ajouté (documentation de planification pure, aucun changement utilisateur). Session close : commit unique `198e264` (`📝 Podcasts`), pas de push demandé. Au passage, [BLK-004](blockers/BLK-004.md) (résolu depuis la session précédente) a été archivé en [ZBLK-004](archive/blockers/ZBLK-004.md).

**Entrées clés :**

- [BDR-008](decisions/BDR-008.md) — Liste des médias étendue à 28 shows ; préférences/modération repoussées
- [LRN-007](learnings/LRN-007.md) — Flag `explicit` Spotify non corrélé aux sujets sensibles à modérer
- [BLK-005](blockers/BLK-005.md) — Batch `GET /shows?ids=` renvoie 403, single `/shows/{id}` OK
