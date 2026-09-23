# Automatisation — Edge Functions, `pg_cron`, limites et coût

Notes de cadrage pour la [Phase 3 de la roadmap](ROADMAP.md) (génération quotidienne sans intervention manuelle). Vérifié dans la doc Supabase le 2026-09-23 — les quotas évoluent, à revérifier avant de s'y fier.

## Architecture visée

```
pg_cron (1×/jour) → pg_net (HTTP POST) → Edge Function "generate" → Spotify API
                                              ↓
                                   Supabase Postgres (tokens, préférences)
```

- `pg_cron` déclenche le job, `pg_net` fait l'appel HTTP vers `/functions/v1/<fonction>`.
- L'URL du projet et la clé d'appel sont stockées dans **Supabase Vault** et lues depuis le job (recommandation officielle, pas de secret en clair dans `cron.job`).
- Exemple de référence : [Scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions).

## Coût : gratuit (plan Free)

| Ressource                  | Quota Free               | Usage prévu                                    |
| -------------------------- | ------------------------ | ---------------------------------------------- |
| Invocations Edge Functions | 500 000 / mois           | ~30 / mois (1 par jour)                        |
| `pg_cron` + `pg_net`       | inclus, sans quota dédié | 1 job quotidien                                |
| Vault                      | inclus                   | tokens OAuth                                   |
| Base de données            | 500 Mo                   | quelques Ko                                    |
| Projets actifs             | 2 par organisation       | `kronik` + `mon-daily-paris` (limite atteinte) |

Le plan Pro (25 $/mois) n'apporte rien pour ce projet.

## Limites Edge Functions (plan Free)

| Limite                         | Valeur | Impact sur mon-daily                                                                                             |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------- |
| Durée d'exécution (wall clock) | 150 s  | OK : l'essentiel est de l'attente réseau vers Spotify. À confirmer en chronométrant `pnpm run generate` en local |
| Temps CPU par requête          | 2 s    | Seul point à surveiller ; appels API + JSON de quelques dizaines de titres = négligeable                         |
| Mémoire                        | 256 Mo | OK                                                                                                               |
| Nombre de fonctions            | 100    | 1 ou 2 prévues                                                                                                   |
| Taille de bundle serveur       | 5 Mo   | OK                                                                                                               |
| Secrets par projet             | 100    | OK                                                                                                               |

Dépassement de durée ou de CPU → réponse **546**.

## Points de vigilance

1. **Pause d'inactivité (7 jours)** : un projet Free est mis en pause après une semaine sans activité. Le cron appelle l'Edge Function chaque jour, qui lit/écrit en base via l'API — ça devrait compter comme activité, mais la doc ne le garantit pas explicitement. Vérifier dans le dashboard après quelques jours de run réel que le projet ne passe pas en pause.
2. **Limite de 2 projets actifs** ([GLRN-284](../../baptistelechat-setup/settings/Claude/global-memory/learnings/GLRN-284.md)) : aucun autre projet Supabase ne peut être actif en parallèle sans en mettre un en pause.
3. **`pg_cron` tourne en UTC** : pas de suivi de l'heure d'été. `0 5 * * *` = 6h l'hiver, 7h l'été à Paris. Choisir une heure tolérante. Le jour du jingle (`src/config/jingles.ts`) reste calculé sur `Europe/Paris`, pas sur l'heure serveur.
4. **Rétention `cron.job_run_details`** : non purgée automatiquement, à nettoyer périodiquement (job `cron` de suppression) pour ne pas gonfler la base.

## Points de portage Node → Deno

- L'Edge Function tourne sur **Deno**, pas Node : `process.env.X` → `Deno.env.get('X')`.
- Imports npm via `npm:` ou `deno.json` (import map) ; adapter les imports de `src/generate.ts` et de ses dépendances.
- Le code métier reste derrière `Storage` / `Provider` (cf. [ARCHITECTURE.md](ARCHITECTURE.md)) : seule la couche d'entrée (script CLI → handler `Deno.serve`) change.
- Éviter les appels Edge Function → Edge Function (budget de ~5 000 req/min par chaîne, non pertinent ici mais à savoir) ; partager le code via un dossier `_shared/`.

## Ordre de travail proposé

1. Chronométrer `pnpm run generate` en local (marge vs 150 s).
2. Porter `generate.ts` en Edge Function et la déployer.
3. Tester l'appel manuel (`curl` avec la clé) avant de programmer quoi que ce soit.
4. Stocker URL + clé dans Vault, créer le job `pg_cron` (fréquence rapprochée pour un test, puis quotidienne).
5. Vérifier le refresh automatique du token OAuth en conditions réelles.
6. Surveiller la pause d'inactivité sur la première semaine.

## Sources

- [Limites des Edge Functions](https://supabase.com/docs/guides/functions/limits)
- [Scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [pg_net](https://supabase.com/docs/guides/database/extensions/pg_net) · [Cron quickstart](https://supabase.com/docs/guides/cron/quickstart)
- [Tarifs](https://supabase.com/pricing)
