---
id: ZBLK-003
type: blocker
date: 2026-09-07
tags: [spotify, premium, oauth, api-restriction, v1]
---

# ZBLK-003 — Spotify Dev Mode bloqué sans compte Premium

| Friction                                                                                                                                              | Cause réelle                                                                                                                                                                                        | Solution                                                                                                                            | Statut |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Impossible de finaliser la création de l'app Spotify Developer / de tester le flow OAuth pour mon-daily — Baptiste n'a pas de compte Spotify Premium. | Depuis le 11 février 2026, Spotify exige que le PROPRIÉTAIRE d'une app en Development Mode ait un abonnement Premium actif (voir [LRN-004](../../learnings/LRN-004.md) pour le détail de la règle). | Matthieu (propriétaire du compte développeur) souscrit lui-même un abonnement Premium — voir [BDR-003](../../decisions/BDR-003.md). | résolu |

## Références

- [LRN-004](../../learnings/LRN-004.md) — règle Spotify à l'origine du blocage
- [BDR-002](../../decisions/BDR-002.md) — décision storage Supabase, indépendante mais adoptée dans la même session avant que ce blocage apparaisse
- [BDR-003](../../decisions/BDR-003.md) — décision qui résout ce blocage
