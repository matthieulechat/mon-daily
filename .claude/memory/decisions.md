---
register: decisions
---

## Index

| ID                              | Date       | Titre                                                                   | Tags                                                                          | Statut |
| ------------------------------- | ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------ |
| [BDR-001](decisions/BDR-001.md) | 2026-09-07 | Migration en 2 étapes JSON local → Supabase                             | #architecture #storage #migration #supabase #interface-pattern                | actif  |
| [BDR-002](decisions/BDR-002.md) | 2026-09-07 | Storage Supabase dès la Phase 1 (skip JSON local)                       | #supabase #storage #architecture #scope #mon-daily                            | actif  |
| [BDR-003](decisions/BDR-003.md) | 2026-09-20 | Souscription Premium personnelle plutôt que contournement               | #spotify #premium #api-restriction #v1                                        | actif  |
| [BDR-004](decisions/BDR-004.md) | 2026-09-20 | Identité visuelle "Bulletin Groove" retenue pour Mon Daily              | #branding #design #ui #logo #vinyle #mon-daily                                | actif  |
| [BDR-005](decisions/BDR-005.md) | 2026-09-20 | Sourcer les podcasts via 3 shows Spotify natifs, pas RSS                | #spotify #podcasts #shows-api #architecture #mon-daily                        | actif  |
| [BDR-006](decisions/BDR-006.md) | 2026-09-20 | Bascule du projet Supabase de Dublin vers Paris                         | #supabase #region #paris #migration #mon-daily                                | actif  |
| [BDR-007](decisions/BDR-007.md) | 2026-09-20 | Ajout du serveur MCP Supabase project-scoped à mon-daily                | #supabase #mcp #tooling #claude-code #mon-daily                               | actif  |
| [BDR-008](decisions/BDR-008.md) | 2026-09-20 | Liste des médias étendue à 28 shows ; préférences/modération repoussées | #spotify #podcasts #moderation #preferences #mon-daily                        | actif  |
| [BDR-009](decisions/BDR-009.md) | 2026-09-21 | Repli sur `/followers` (déprécié) plutôt que `/me/library` (cassé)      | #spotify #api #library #playlist #deprecated-endpoint                         | actif  |
| [BDR-010](decisions/BDR-010.md) | 2026-09-22 | `users` identité pure, `platform`/`platform_user_id` sur `oauth_tokens` | #supabase #database-schema #identity #oauth #multi-provider #mon-daily        | actif  |
| [BDR-011](decisions/BDR-011.md) | 2026-09-22 | Mix musique : répétition volontaire, découvertes retirées               | #spotify #playlist-generation #music-mix #discovery #mon-daily                | remplacé par [BDR-027](decisions/BDR-027.md) |
| [BDR-012](decisions/BDR-012.md) | 2026-09-22 | Podcasts : catégorisation actu/thématique + gabarit fixe 4+4            | #spotify #podcast #playlist-generation #random-selection #rotation #mon-daily | actif  |
| [BDR-013](decisions/BDR-013.md) | 2026-09-23 | Actu = journaux du jour uniquement ; liste étendue à 55 shows           | #spotify #podcast #categorization #manual-review #mon-daily                   | actif  |
| [BDR-014](decisions/BDR-014.md) | 2026-09-23 | Auteur du projet : Matthieu LECHAT (plus Baptiste)                      | #mon-daily #attribution #readme #docs #naming                                 | actif  |
| [BDR-015](decisions/BDR-015.md) | 2026-09-23 | Fraîcheur podcast par catégorie ; rotation thématique retirée           | #spotify #podcast #freshness #rotation #playlist-generation #mon-daily        | actif  |
| [BDR-016](decisions/BDR-016.md) | 2026-09-23 | Historique des mix supprimé, pool de podcasts assez large               | #supabase #playlist-history #rotation #simplification #podcast #mon-daily     | actif  |
| [BDR-017](decisions/BDR-017.md) | 2026-09-28 | Météo extraite d'Europe 1 par titre ; ouverture actu+météo              | #spotify #podcast #categorization #weather #playlist-generation #mon-daily    | actif  |
| [BDR-018](decisions/BDR-018.md) | 2026-09-28 | Samuel Etienne : ne garder que "L'actu du jour en bref"                 | #spotify #podcast #categorization #title-filter #inclusion-filter #mon-daily  | actif  |
| [BDR-019](decisions/BDR-019.md) | 2026-09-28 | HugoDécrypte : actu/thématique croisant titre et description            | #spotify #podcast #categorization #hugodecrypte #multi-signal #mon-daily      | actif  |
| [BDR-020](decisions/BDR-020.md) | 2026-09-28 | Edge Function + pg_cron retenu plutôt que cron self-hosté               | #supabase #edge-functions #pg-cron #automation #self-hosted #mon-daily        | actif  |
| [BDR-021](decisions/BDR-021.md) | 2026-09-28 | Automatisation appliquée aux 2 comptes Spotify existants                | #supabase #oauth-tokens #multi-account #automation #mon-daily                 | actif  |
| [BDR-022](decisions/BDR-022.md) | 2026-09-28 | Vault sécurise l'appel pg_cron, pas les tokens OAuth                    | #supabase #vault #secrets #oauth #scope-clarification #mon-daily              | actif  |
| [BDR-023](decisions/BDR-023.md) | 2026-09-29 | Podcasts multi-éditions : garder l'épisode le plus proche de l'heure | #spotify #podcast #freshness #title-parsing #timezone #latestonly #mon-daily | actif |
| [BDR-024](decisions/BDR-024.md) | 2026-09-29 | Journaux horaires : filtre inter-shows via closestGroup | #spotify #podcast #freshness #closest-group #cross-show #mon-daily | actif |
| [BDR-025](decisions/BDR-025.md) | 2026-09-30 | Mix sans plafond par catégorie : boucle jusqu'à la coupe 4 h | #spotify #playlist-generation #mix #podcast #fallback #duration-cap #mon-daily | actif |
| [BDR-026](decisions/BDR-026.md) | 2026-09-30 | Exception de fraîcheur par show (`maxAgeDays`) | #spotify #podcast #freshness #max-age #weekly-show #mon-daily | actif |
| [BDR-027](decisions/BDR-027.md) | 2026-09-30 | Mix musique pondéré 3 fenêtres + plafond par artiste | #spotify #music-mix #weighted-sampling #artist-cap #shuffle #mon-daily | actif |
| [BDR-028](decisions/BDR-028.md) | 2026-09-30 | France Culture dans `closestGroup` ; regex tolère la virgule | #spotify #podcast #freshness #closest-group #title-parsing #regex #mon-daily | actif |
| [BDR-029](decisions/BDR-029.md) | 2026-10-01 | Id de playlist stocké par compte, plus de recherche par nom | #spotify #playlist #oauth-tokens #duplicates #supabase #idempotence #mon-daily | actif |
| [BDR-030](decisions/BDR-030.md) | 2026-10-02 | UI de réglages : SPA Vite + Supabase Auth Spotify, RLS | #ui #vite #react #supabase-auth #rls #settings #mon-daily | actif |
| [BDR-031](decisions/BDR-031.md) | 2026-10-02 | Pas de réglage de proportion musique/podcasts | #settings #mix #playlist-generation #pattern #scope #mon-daily | actif |
| [BDR-032](decisions/BDR-032.md) | 2026-10-02 | Code Node dans `scripts/`, `.env.local` racine partagé | #project-structure #env #vite #pnpm #deployment #mon-daily | actif |
| [BDR-033](decisions/BDR-033.md) | 2026-10-03 | UI réglages : amp « home cinéma », sources en disques | #ui #design #home-cinema #vinyle #knob #mon-daily | actif |
| [BDR-034](decisions/BDR-034.md) | 2026-10-03 | Pochettes de podcasts figées par script | #spotify #covers #static-data #script #shows-api #mon-daily | actif |
| [BDR-035](decisions/BDR-035.md) | 2026-10-03 | PWA installable, icônes tirées de la pochette | #pwa #vite #icons #cover #qrcode #mon-daily | actif |
| [BDR-036](decisions/BDR-036.md) | 2026-10-04 | Sources en thèmes : piles + bac, repliés par défaut | #ui #settings #themes #vinyle #react #mon-daily | actif |
| [BDR-037](decisions/BDR-037.md) | 2026-10-04 | Actu classée par moment de la journée | #ui #podcast #actu #france-inter #classification #mon-daily | actif |
| [BDR-038](decisions/BDR-038.md) | 2026-10-04 | Plafond de 30 s sur le Retry-After Spotify | #spotify #retry-after #edge-functions #rate-limit #resilience #mon-daily | actif |
| [BDR-039](decisions/BDR-039.md) | 2026-10-04 | Show à flux mixte : catégorie par épisode | #podcast #categorization #slate #mixed-feed #ui #mon-daily | actif |
| [BDR-040](decisions/BDR-040.md) | 2026-10-05 | Animations CSS pures, pas de lib (GSAP écarté) | #ui #animation #css #gsap #reduced-motion #mon-daily | actif |
| [BDR-041](decisions/BDR-041.md) | 2026-10-05 | Bac ouvert dans la grille, sous la rangée de sa pile | #ui #css-grid #settings #ux #mon-daily | actif |
| [BDR-042](decisions/BDR-042.md) | 2026-10-05 | Bouton Enregistrer : confirmation intégrée, durée mini 0,9 s | #ui #feedback #save #zustand #mon-daily | actif |
