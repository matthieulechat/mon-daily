---
id: ZBLK-022
type: blocker
date: 2026-10-02
tags: [supabase-auth, spotify, oauth, email, rate-limit, mon-daily]
---

# ZBLK-022 — Login OAuth Spotify : `over_email_send_rate_limit`

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| Première connexion à l'UI : retour sur `localhost:5173/?error=server_error&error_code=over_email_send_rate_limit` | Spotify renvoie l'e-mail du compte sans le marquer vérifié ; Supabase tentait un e-mail de confirmation, avec « Confirm email » actif et un SMTP par défaut très limité (de l'ordre de 2 e-mails/heure). Déduit des logs Auth : tentative à 17:54, puis signup réussi à 17:59 après le changement de réglage | Désactiver « Confirm email » dans Auth, Providers, Email, puis réessayer | résolu |

## Références

- [BDR-030](../../decisions/BDR-030.md) — l'UI dont c'est la première connexion
