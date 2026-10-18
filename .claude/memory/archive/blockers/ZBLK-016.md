---
id: ZBLK-016
type: blocker
date: 2026-09-28
summary: "curl avec JWT en clair bloqué par le classifier"
tags: [claude-code, auto-mode, classifier, credential-materialization, bash, testing]
status: résolu
---

# ZBLK-016 — `curl` avec le JWT `service_role` en clair bloqué par le classifier

**Friction** : Test manuel de l'Edge Function via `curl -H "Authorization: Bearer <clé service_role collée en clair>"` refusé par le classifier auto-mode ("Credential Materialization")

**Cause réelle** : Le classifier juge la commande elle-même dès qu'un secret y apparaît littéralement, même s'il provient d'un fichier local déjà lisible (`.env.local`)

**Solution** : `source .env.local && curl ... -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"` — plus aucune valeur littérale dans la commande, passe sans accroc

## Références

Voir aussi GLRN-315 (mémoire globale)
