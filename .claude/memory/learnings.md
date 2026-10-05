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
| [LRN-034](learnings/LRN-034.md) | 2026-10-01 | Runs de test répétés : 429 Spotify, pool d'actu dégradé | #spotify #rate-limit #retry-after #debugging #logs #podcast #mon-daily |
| [LRN-035](learnings/LRN-035.md) | 2026-10-01 | Edge Function : un fichier lu sur disque n'est pas déployé | #supabase #edge-functions #readfile #assets #deployment #base64 #mon-daily |
| [LRN-036](learnings/LRN-036.md) | 2026-10-01 | `deploy_edge_function` MCP fragile sur gros fichiers : CLI | #supabase #mcp #edge-functions #cli #deployment #payload #mon-daily |
| [LRN-037](learnings/LRN-037.md) | 2026-10-01 | `tsx` hors projet sous Windows : `.mts` + imports `file:///` | #tsx #windows #esm #scratchpad #top-level-await #tooling #mon-daily |
| [LRN-038](learnings/LRN-038.md) | 2026-10-02 | Id de ressource stocké : config idempotente à chaque run | #spotify #idempotence #playlist #cover #stored-id #silent-failure #mon-daily |
| [LRN-039](learnings/LRN-039.md) | 2026-10-02 | RLS Supabase : `auth.identities`, pas `user_metadata` | #supabase #rls #auth #user-metadata #security-definer #advisors #mon-daily |
| [LRN-040](learnings/LRN-040.md) | 2026-10-02 | Exposer une clé publique à Vite : préfixes exacts, bundle vérifié | #vite #env #secrets #supabase #service-role #bundle #mon-daily |
| [LRN-041](learnings/LRN-041.md) | 2026-10-02 | Spotify OAuth : `show_dialog=true` pour changer de compte | #spotify #oauth #supabase-auth #show-dialog #logout #mon-daily |
| [LRN-042](learnings/LRN-042.md) | 2026-10-03 | Vérifier une exclusion en relisant la playlist réelle | #spotify #settings #verification #playlist #exclusions #service-role #mon-daily |
| [LRN-043](learnings/LRN-043.md) | 2026-10-03 | Contrôle custom (potard) : vrai input masqué dessous | #a11y #custom-control #sr-only #range #react #knob |
| [LRN-044](learnings/LRN-044.md) | 2026-10-03 | Prévisualiser une page authentifiée : fausse session | #supabase #auth #preview #localstorage #testing #mon-daily |
| [LRN-045](learnings/LRN-045.md) | 2026-10-03 | `pnpm peers check` après ajout de plugins couplés | #pnpm #peer-deps #vite #plugins #verification |
| [LRN-046](learnings/LRN-046.md) | 2026-10-04 | Pas de gros lot Spotify sans plafond ; stop au 429 long | #spotify #rate-limit #429 #search #batch #mon-daily |
| [LRN-047](learnings/LRN-047.md) | 2026-10-04 | `pnpm generate` : `platform_user_id`, pas `user_id` | #spotify #supabase #oauth-tokens #generate #cli #mon-daily |
| [LRN-048](learnings/LRN-048.md) | 2026-10-04 | Requête pg_net « bloquée » : en vol, pas coincée | #supabase #pg-net #edge-functions #queue #debugging #mon-daily |
| [LRN-049](learnings/LRN-049.md) | 2026-10-04 | Nom et pochette d'un show sans l'API Spotify | #spotify #covers #og-image #oembed #rate-limit #mon-daily |
| [LRN-050](learnings/LRN-050.md) | 2026-10-04 | Script générateur : ne pas écraser avec 0 résultat | #covers #script #rate-limit #guard #mon-daily |
| [LRN-051](learnings/LRN-051.md) | 2026-10-05 | `scale`/`translate`/`rotate` se composent avec `transform` | #css #animation #transform #keyframes |
| [LRN-052](learnings/LRN-052.md) | 2026-10-05 | Entrée de page séquencée par `animation-delay` | #animation #css #stagger #login #mon-daily |
| [LRN-053](learnings/LRN-053.md) | 2026-10-05 | Rejouer par `key`, sortir par classe + `onAnimationEnd` | #react #css #animation #key #onanimationend |
| [LRN-054](learnings/LRN-054.md) | 2026-10-05 | Durée minimale d'un état « en cours » | #ux #loading #feedback #promise-all #zustand |
| [LRN-055](learnings/LRN-055.md) | 2026-10-05 | Playlist courte : mesurer le pool avant de corriger | #diagnostic #measurement #spotify #top-tracks #mon-daily |
| [LRN-056](learnings/LRN-056.md) | 2026-10-05 | `break` dans une coupe par budget sacrifie la fin | #truncate #budget #break #greedy #algorithm |
| [LRN-057](learnings/LRN-057.md) | 2026-10-05 | `oauth_tokens.expires_at` révèle l'ordre du cron | #supabase #logs #oauth #cron #attribution #mon-daily |
| [LRN-058](learnings/LRN-058.md) | 2026-10-05 | Valider un algo aléatoire : N tirages, données figées | #testing #simulation #random #rate-limit #before-after #mon-daily |
| [LRN-059](learnings/LRN-059.md) | 2026-10-05 | Catégorie par épisode : vérifier qu'une file la consomme | #categorization #mixed-feed #pipeline #podcast #mix #data-flow #mon-daily |
| [LRN-060](learnings/LRN-060.md) | 2026-10-05 | `web:build` ne type-check pas `scripts/` | #typescript #typecheck #build #scripts #monorepo #verification #mon-daily |
| [LRN-061](learnings/LRN-061.md) | 2026-10-05 | Page blanche Vite : console, puis noms des clés d'env | #vite #env #debugging #blank-page #supabase #console #mon-daily |
| [LRN-062](learnings/LRN-062.md) | 2026-10-05 | `pg_cron` UTC : heure locale fixe par double horaire filtré | #pg-cron #supabase #timezone #dst #postgres #tzdata |
| [LRN-063](learnings/LRN-063.md) | 2026-10-05 | Profil Spotify déjà dans `session.user.user_metadata` | #supabase #auth #oauth #spotify #user-metadata #avatar #web |
| [LRN-064](learnings/LRN-064.md) | 2026-10-05 | Vérifier la planification avant d'écrire une heure dans l'UI | #ui #copy #schedule #verification #cron #requirements |
