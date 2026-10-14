---
id: ZBLK-032
type: blocker
date: 2026-10-12
tags: [supabase-auth, spotify, oauth, redirect, vercel, deployment, mon-daily]
---

# ZBLK-032 — Connexion Spotify en échec sur l'app déployée

| Friction | Cause réelle | Solution | Statut |
| -------- | ------------ | -------- | ------ |
| Première mise en ligne de l'interface sur `https://mon-daily.vercel.app/` : la connexion Spotify n'aboutit pas, alors qu'elle marche en local | L'URL de prod n'était pas dans la configuration d'URL de Supabase Auth (Site URL et Redirect URLs). Le `redirectTo: window.location.origin` de `LoginScreen.tsx` était donc ignoré au retour de Spotify | Dans le dashboard Supabase (Authentication, URL Configuration) : Site URL sur `https://mon-daily.vercel.app`, `https://mon-daily.vercel.app/**` ajouté aux Redirect URLs, `localhost` de dev conservé. Aucun changement de code ni côté Spotify Developer Dashboard. Connexion confirmée par Baptiste le 2026-10-12 | résolu |

## Références

- [LRN-074](../../learnings/LRN-074.md) — comment le saut fautif a été isolé
- [BDR-030](../../decisions/BDR-030.md) — SPA Vite + Supabase Auth Spotify
- voir aussi GLRN-339
