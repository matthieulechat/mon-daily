---
register: learnings
---

## Index

| ID                              | Date       | Pattern observé                                                             | Tags                                                                        |
| ------------------------------- | ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [LRN-001](learnings/LRN-001.md) | 2026-09-07 | Spotify a tué `/recommendations` pour les apps post-nov 2024                | #spotify #api-deprecation #recommendations #personnalisation                |
| [LRN-002](learnings/LRN-002.md) | 2026-09-07 | pnpm bloque les postinstall scripts par défaut                              | #pnpm #install #postinstall #tooling #node                                  |
| [LRN-003](learnings/LRN-003.md) | 2026-09-07 | Préférer `execFile()` à `exec()` par réflexe (hook sécurité)                | #security #child-process #exec #command-injection #node                     |
| [LRN-004](learnings/LRN-004.md) | 2026-09-07 | Spotify Dev Mode exige Premium du owner (fév 2026), pas des users           | #spotify #api #premium #oauth #platform-policy                              |
| [LRN-005](learnings/LRN-005.md) | 2026-09-20 | Recherche par genre Spotify quasi-déterministe → répétition sans historique | #spotify #discovery-engine #anti-repetition #playlist-history #search-genre |
| [LRN-006](learnings/LRN-006.md) | 2026-09-20 | Épisodes de podcast peu fiables dans une playlist Spotify (bug API)         | #spotify #podcast #playlist #api-bug #playability                           |
| [LRN-007](learnings/LRN-007.md) | 2026-09-20 | Flag `explicit` Spotify non corrélé aux sujets sensibles à modérer          | #spotify #podcast #explicit-flag #moderation #content-filtering             |
| [LRN-008](learnings/LRN-008.md) | 2026-09-21 | Endpoint batch Spotify plus restreint (403) que son équivalent single       | #spotify #shows-api #batch-endpoint #http-403 #client-credentials           |
| [LRN-009](learnings/LRN-009.md) | 2026-09-21 | Migration Spotify "février 2026" a renommé/cassé des endpoints utilisés     | #spotify #api-migration #deprecated-endpoints #playlists #documentation     |
| [LRN-010](learnings/LRN-010.md) | 2026-09-21 | Spotify top tracks peut lister le même morceau 2x sous 2 IDs                | #spotify #top-tracks #duplicates #music-video #dedupe                       |
| [LRN-011](learnings/LRN-011.md) | 2026-09-21 | `public:false` à la création peut être ignoré par Spotify (réglage compte)  | #spotify #playlist #privacy #public-flag #account-default                   |
