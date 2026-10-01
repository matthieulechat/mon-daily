# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Automatisation quotidienne : la génération de la playlist tourne désormais seule, sans intervention manuelle, via une Edge Function Supabase (`supabase/functions/generate-daily`) déclenchée chaque jour à 5h UTC (6h/7h Paris selon la saison) par `pg_cron`/`pg_net`, boucle sur tous les comptes Spotify connectés (un compte en échec n'empêche pas les autres)
- Retry automatique (backoff + `Retry-After`) sur les appels Spotify en 429 (`src/providers/spotify-http.ts`) — Spotify limite par app, pas par compte, et `fetchEligibleEpisodes` tire des dizaines de requêtes en rafale par run
- Icône de l'application (identité visuelle "Bulletin Groove" : disque vinyle, label jaune, icône radio centrée)
- Première génération fonctionnelle de la playlist quotidienne "Mon Daily" (`pnpm run login` + `pnpm run generate`) : sélection des top titres, pochette et description personnalisées, playlist privée sauvegardée dans la bibliothèque
- Mix musique/actu dans la playlist générée : jingle "C'est {jour}" en intro, le mix ouvre sur une actu puis la météo du jour (extraite du Journal d'Europe 1) puis alterne avec des podcasts thématiques toutes les 4 musiques (3 actus + 1 météo + 4 thématiques par jour, tirés au sort), toujours les musiques les plus écoutées, playlist plafonnée à 4h (un épisode d'actu de plus de 2 jours, de météo de plus d'1 jour, ou un épisode thématique de plus de 3 jours est ignoré)
- Sources podcast étendues à 55 shows (journaux France Inter/France Culture/RFI, géopolitique, grands reportages, récits…)
- Nouveaux journaux France Inter (6h, 6h30, 13h, 18h, 19h) en actu et « Les interviews d'Inter » en thématique
- Trois nouveaux podcasts thématiques : « L'Invité de 8h20 : le grand entretien », « Le Grand portrait » et « Les enquêtes d'Yvan Casta »

### Changed

- Classement actu/thématique revu à la main : seuls les journaux et flashs du jour comptent comme "actu" (les émissions de débat/décryptage comme C dans l'air, Code source ou L'Heure du Monde passent en thématique)
- "La Matinée Est Tienne, par Samuel Etienne" : seuls les épisodes "L'actu du jour en bref" alimentent le mix, le reste du flux (chroniques, interviews) est écarté
- HugoDécrypte : les "actu du jour" et "actu Pop" comptent comme actu, les interviews/rediffs passent en thématique (détecté sur le titre et la description de chaque épisode)
- Plus de plafond de 3 actus / 4 thématiques : le mix enchaîne actu et thématiques (avec 4 musiques entre chaque) tant qu'il reste des épisodes éligibles, jusqu'à la coupe à 4h ; si une catégorie est épuisée, l'autre prend le relais (la météo reste limitée à 1)
- "Le journal d'Europe 1" et "Journal Monde" (publiés plusieurs fois par jour) : seul l'épisode le plus proche de l'heure actuelle est retenu (heure lue dans le titre), séparément pour l'actu et la météo
- Journaux « de XXhXX » de France Inter/France Culture (6h à 19h) : parmi tous ces shows, seul le journal le plus proche de l'heure de génération est retenu, pour avoir une actu fraîche (les shows restent dans la liste, ils sont seulement filtrés)

- Musiques plus variées d'un jour à l'autre : le mix puise désormais dans tes écoutes des 4 dernières semaines (60 %), des 6 derniers mois (25 %) et de l'année (15 %), dans un ordre mélangé chaque jour, avec 5 titres maximum par artiste (les places libérées sont comblées par d'autres artistes)

### Fixed

- « La semaine européenne » (hebdomadaire) était presque toujours ignorée car son dernier épisode dépassait 2 jours : sa fraîcheur maximale passe à 7 jours
- Doublons de titres dans le mix généré (ex. "Titre" et "Titre (Music Video)" comptés comme deux titres différents)
- Un podcast pouvait être ignoré à tort ("aucun épisode disponible") quand Spotify renvoyait un épisode inexploitable en première position alors qu'un épisode valide existait juste après
- « Les journaux de France Culture » : un journal ancien (ex. 7h) pouvait passer devant le plus récent (ex. 8h45), car ce show n'était pas filtré par heure et son titre « JOURNAL DE 7H, du … » (avec virgule) n'était pas reconnu
- Génération quotidienne en échec et playlist « Mon Daily » recréée en doublon (vide, sans pochette) quand Spotify ne la retrouvait pas par son nom : l'id de la playlist est désormais mémorisé par compte, et la pochette est embarquée dans l'Edge Function (elle n'y était pas déployée)
