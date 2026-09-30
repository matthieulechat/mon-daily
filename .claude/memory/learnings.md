---
register: learnings
---

## Index

| ID                              | Date       | Pattern observé                                                             | Tags                                                                                    |
| ------------------------------- | ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [LRN-001](learnings/LRN-001.md) | 2026-09-07 | Spotify a tué `/recommendations` pour les apps post-nov 2024                | #spotify #api-deprecation #recommendations #personnalisation                            |
| [LRN-002](learnings/LRN-002.md) | 2026-09-07 | pnpm bloque les postinstall scripts par défaut                              | #pnpm #install #postinstall #tooling #node                                              |
| [LRN-003](learnings/LRN-003.md) | 2026-09-07 | Préférer `execFile()` à `exec()` par réflexe (hook sécurité)                | #security #child-process #exec #command-injection #node                                 |
| [LRN-004](learnings/LRN-004.md) | 2026-09-07 | Spotify Dev Mode exige Premium du owner (fév 2026), pas des users           | #spotify #api #premium #oauth #platform-policy                                          |
| [LRN-005](learnings/LRN-005.md) | 2026-09-20 | Recherche par genre Spotify quasi-déterministe → répétition sans historique | #spotify #discovery-engine #anti-repetition #playlist-history #search-genre             |
| [LRN-006](learnings/LRN-006.md) | 2026-09-20 | Épisodes de podcast peu fiables dans une playlist Spotify (bug API)         | #spotify #podcast #playlist #api-bug #playability                                       |
| [LRN-007](learnings/LRN-007.md) | 2026-09-20 | Flag `explicit` Spotify non corrélé aux sujets sensibles à modérer          | #spotify #podcast #explicit-flag #moderation #content-filtering                         |
| [LRN-008](learnings/LRN-008.md) | 2026-09-21 | Endpoint batch Spotify plus restreint (403) que son équivalent single       | #spotify #shows-api #batch-endpoint #http-403 #client-credentials                       |
| [LRN-009](learnings/LRN-009.md) | 2026-09-21 | Migration Spotify "février 2026" a renommé/cassé des endpoints utilisés     | #spotify #api-migration #deprecated-endpoints #playlists #documentation                 |
| [LRN-010](learnings/LRN-010.md) | 2026-09-21 | Spotify top tracks peut lister le même morceau 2x sous 2 IDs                | #spotify #top-tracks #duplicates #music-video #dedupe                                   |
| [LRN-011](learnings/LRN-011.md) | 2026-09-21 | `public:false` à la création peut être ignoré par Spotify (réglage compte)  | #spotify #playlist #privacy #public-flag #account-default                               |
| [LRN-012](learnings/LRN-012.md) | 2026-09-22 | Colonne dupliquée = souvent une identité interne/externe pas encore séparée | #database-design #schema #identity-modeling #oauth #code-review                         |
| [LRN-013](learnings/LRN-013.md) | 2026-09-22 | Classifier auto mode bloque un DDL Supabase même après accord en chat       | #claude-code #auto-mode #classifier #supabase #migration #ddl                           |
| [LRN-014](learnings/LRN-014.md) | 2026-09-22 | Pool de tirage au sort à compter au niveau atomique, pas de l'agrégat       | #random-selection #sampling #data-modeling #granularity                                 |
| [LRN-015](learnings/LRN-015.md) | 2026-09-22 | Spotify ne renvoie plus le contenu d'une playlist non possédée (fév 2026)   | #spotify #api-restriction #playlists #deprecated-endpoint                               |
| [LRN-016](learnings/LRN-016.md) | 2026-09-22 | Item d'un tableau paginé Spotify peut être `null` à une position arbitraire | #spotify #api-quirk #null-handling #pagination                                          |
| [LRN-017](learnings/LRN-017.md) | 2026-09-23 | Spotify : l'oEmbed d'un show renvoie le dernier épisode                     | #spotify #oembed #show-metadata #scraping #og-title                                     |
| [LRN-018](learnings/LRN-018.md) | 2026-09-23 | Page HTML jetable pour trier à la main une liste de données                 | #manual-review #html #localstorage #human-in-the-loop #classification #tooling          |
| [LRN-019](learnings/LRN-019.md) | 2026-09-23 | Contenu généré en JS invisible hors projet dans le Browser pane             | #claude-browser #html #static-rendering #preview #javascript                            |
| [LRN-020](learnings/LRN-020.md) | 2026-09-23 | `release_date` Spotify au jour près : « N jours » = N-1 effectif            | #spotify #release-date #freshness #timezone #date-precision                             |
| [LRN-021](learnings/LRN-021.md) | 2026-09-28 | Container mixte : classifier chaque item par motif de titre                 | #data-modeling #categorization #content-classification #string-matching #multi-category |
| [LRN-022](learnings/LRN-022.md) | 2026-09-28 | Client Credentials Spotify suffit pour un show public                       | #spotify #api #client-credentials #oauth #public-endpoint                               |
| [LRN-023](learnings/LRN-023.md) | 2026-09-28 | Un seul champ ne suffit pas si chacun peut individuellement faillir         | #data-modeling #categorization #multi-signal #string-matching #api-truncation           |
| [LRN-024](learnings/LRN-024.md) | 2026-09-29 | Spotify ne donne pas l'heure : la lire dans le titre | #spotify #release-date #title-parsing #timezone #intl |
| [LRN-025](learnings/LRN-025.md) | 2026-09-29 | Rejouer le net.http_post du cron pour tester une Edge Function | #supabase #pg-cron #pg-net #vault #edge-functions #testing |
| [LRN-026](learnings/LRN-026.md) | 2026-09-29 | Vérifier le format de titre de chaque nouveau show | #spotify #podcast #title-parsing #oembed #regex |
| [LRN-027](learnings/LRN-027.md) | 2026-09-30 | Copie Edge Function à répliquer et redéployer à chaque modif | #supabase #edge-functions #duplication #deployment #sync #mon-daily |
| [LRN-028](learnings/LRN-028.md) | 2026-09-30 | `python` Bash Windows = alias Store ; `tsc && OK` valide l'ancien code | #windows #bash #python #store-alias #verification #tooling |
| [LRN-029](learnings/LRN-029.md) | 2026-09-30 | Prévisualiser un tirage aléatoire en lecture seule sur données réelles | #sampling #preview #read-only #data-analysis #spotify #mon-daily |
| [LRN-030](learnings/LRN-030.md) | 2026-09-30 | Fenêtres top tracks : fort recoupement après dédoublonnage | #spotify #top-tracks #dedupe #pool-size #time-range #mon-daily |
| [LRN-031](learnings/LRN-031.md) | 2026-09-30 | Épisode « manquant » : vérifier d'abord s'il est publié | #spotify #podcast #publication-delay #debugging #freshness #mon-daily |
| [LRN-032](learnings/LRN-032.md) | 2026-09-30 | Edge Function : CLI sans login, déployer via MCP (13 fichiers) | #supabase #edge-functions #deployment #mcp #cli #mon-daily |
| [LRN-033](learnings/LRN-033.md) | 2026-09-30 | Tester du code dépendant de l'heure : `node:test` `mock.timers` | #node-test #mock-timers #tsx #date #testing #pnpm #mon-daily |
