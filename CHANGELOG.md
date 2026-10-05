# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Sources régionales : journaux locaux « ICI Loire Océan » et « ICI Mayenne » en actu (seul le journal le plus récent est retenu), « L'invité d'ICI Matin, ICI Loire Océan » et « Ça va faire du reuz ! » (Bretagne) en thématique. Nouveau thème « Régions » dans l'interface de réglages
- Journaux d'autres régions (Nord, Normandie, Lorraine, Pays Basque, Azur, Corse) et d'outre-mer (Martinique, Guadeloupe, Guyane, Nouvelle-Calédonie, Polynésie, journaux d'Outre-mer La 1ère) : désactivés par défaut, à activer un par un dans les thèmes « Régions » et « Outre-mer » des réglages
- Interface de réglages : ta photo de profil et ton nom Spotify s'affichent en haut à droite (une pastille avec ton initiale si le compte n'a pas de photo)
- Animations de l'interface de réglages : entrée de page en cascade, ouverture et fermeture du bac sous la rangée de sa pile (la page défile pour le montrer si besoin), pochettes qui arrivent une à une, vinyle de fond qui se pose avec son bras de platine, retour visuel au clic, compteurs qui « tickent » à chaque changement. Les utilisateurs qui réduisent les animations dans leur système n'ont que des fondus
- Page de connexion animée (carte, logo aux ondes qui se propagent) et bouton « Se connecter avec Spotify » qui passe en attente pendant la redirection
- Bouton « Enregistrer » qui raconte l'enregistrement : spinner pendant la sauvegarde (visible au moins 0,9 s), puis flash vert avec coche tracée, puis retour à l'état grisé
- Pool de podcasts étendu de 48 sources (RTL, Europe 1, franceinfo, Radio Classique, RMC, Le Figaro, L'Express, France Culture…) : journal RTL, revues de presse, flashs et magazines en actu ; débats, interviews, histoire, crime, sport et humour en thématique. Nouveau thème « Revues de presse » (actu) et « Humour » (thématique) dans l'interface de réglages
- « Slate Infos » : seules les éditions « La quotidienne » comptent comme actu, le reste du flux (interviews) alimente les thématiques
- Interface de réglages installable comme application (PWA) avec icônes à l'effigie de la pochette (favicon, écran d'accueil mobile, icône maskable Android)
- Interface web de réglages (`web/`, Vite + React, connexion Spotify via Supabase Auth) : durée maximale de la playlist (1 à 8 h) et activation source par source des 55 shows. Les réglages sont lus à chaque génération quotidienne ; sans réglage enregistré, le comportement reste celui d'avant (4 h, toutes sources)
- Automatisation quotidienne : la génération de la playlist tourne désormais seule, sans intervention manuelle, via une Edge Function Supabase (`supabase/functions/generate-daily`) déclenchée chaque jour à 5h UTC (6h/7h Paris selon la saison) par `pg_cron`/`pg_net`, boucle sur tous les comptes Spotify connectés (un compte en échec n'empêche pas les autres)
- Retry automatique (backoff + `Retry-After`) sur les appels Spotify en 429 (`scripts/providers/spotify-http.ts`) — Spotify limite par app, pas par compte, et `fetchEligibleEpisodes` tire des dizaines de requêtes en rafale par run
- Icône de l'application (identité visuelle "Bulletin Groove" : disque vinyle, label jaune, icône radio centrée)
- Première génération fonctionnelle de la playlist quotidienne "Mon Daily" (`pnpm run login` + `pnpm run generate`) : sélection des top titres, pochette et description personnalisées, playlist privée sauvegardée dans la bibliothèque
- Mix musique/actu dans la playlist générée : jingle "C'est {jour}" en intro, le mix ouvre sur une actu puis la météo du jour (extraite du Journal d'Europe 1) puis alterne avec des podcasts thématiques toutes les 4 musiques (3 actus + 1 météo + 4 thématiques par jour, tirés au sort), toujours les musiques les plus écoutées, playlist plafonnée à 4h (un épisode d'actu de plus de 2 jours, de météo de plus d'1 jour, ou un épisode thématique de plus de 3 jours est ignoré)
- Sources podcast étendues à 55 shows (journaux France Inter/France Culture/RFI, géopolitique, grands reportages, récits…)
- Nouveaux journaux France Inter (6h, 6h30, 13h, 18h, 19h) en actu et « Les interviews d'Inter » en thématique
- Trois nouveaux podcasts thématiques : « L'Invité de 8h20 : le grand entretien », « Le Grand portrait » et « Les enquêtes d'Yvan Casta »

### Changed

- La génération quotidienne tourne à 7h heure de Paris toute l'année, été comme hiver (elle glissait à 6h en heure d'hiver). L'interface de réglages indique quand tes changements seront pris en compte (« demain à 7h »)
- Interface de réglages : « Se déconnecter » est rangé sous ton nom et l'onglet « Réglages », seul de son espèce, disparaît de l'en-tête
- Interface de réglages : une catégorie dont toutes les sources sont désactivées est grisée, comme les pochettes exclues
- Interface de réglages : les sources podcast sont rangées en thèmes (Actu : Matin, Midi & soir, Autres stations, Flashs ; Thématiques : Débats, Géopolitique, Sport, Culture, Histoires, Interviews). Chaque thème est une pile de pochettes colorée avec compteur et jauge de sources actives ; un clic ouvre son bac de disques, un second le referme. La recherche affiche les résultats de tous les thèmes
- Interface de réglages en style « home cinéma » : façade d'ampli noir et néon, afficheur de la durée maximale avec potard à glisser (clavier toujours possible), LED d'état, disque vinyle en fond avec bras de platine et icône radio ; les sources podcast sont des pochettes rondes qui tournent quand elles sont dans le mix, grisées et à l'arrêt quand elles sont exclues
- Classement actu/thématique revu à la main : seuls les journaux et flashs du jour comptent comme "actu" (les émissions de débat/décryptage comme C dans l'air, Code source ou L'Heure du Monde passent en thématique)
- "La Matinée Est Tienne, par Samuel Etienne" : seuls les épisodes "L'actu du jour en bref" alimentent le mix, le reste du flux (chroniques, interviews) est écarté
- HugoDécrypte : les "actu du jour" et "actu Pop" comptent comme actu, les interviews/rediffs passent en thématique (détecté sur le titre et la description de chaque épisode)
- Plus de plafond de 3 actus / 4 thématiques : le mix enchaîne actu et thématiques (avec 4 musiques entre chaque) tant qu'il reste des épisodes éligibles, jusqu'à la coupe à 4h ; si une catégorie est épuisée, l'autre prend le relais (la météo reste limitée à 1)
- "Le journal d'Europe 1" et "Journal Monde" (publiés plusieurs fois par jour) : seul l'épisode le plus proche de l'heure actuelle est retenu (heure lue dans le titre), séparément pour l'actu et la météo
- Journaux « de XXhXX » de France Inter/France Culture (6h à 19h) : parmi tous ces shows, seul le journal le plus proche de l'heure de génération est retenu, pour avoir une actu fraîche (les shows restent dans la liste, ils sont seulement filtrés)

- Musiques plus variées d'un jour à l'autre : le mix puise désormais dans tes écoutes des 4 dernières semaines (60 %), des 6 derniers mois (25 %) et de l'année (15 %), dans un ordre mélangé chaque jour, avec 5 titres maximum par artiste (les places libérées sont comblées par d'autres artistes)

### Removed

- « La semaine européenne » et sa règle de fraîcheur dédiée (7 jours) : le podcast « L'Express Podcasts », qui l'inclut, la remplace

### Fixed

- HugoDécrypte : ses interviews n'étaient jamais jouées (reconnues comme thématiques mais écartées du mix). Elles alimentent désormais les thématiques, et le podcast apparaît dans les deux sections de l'interface de réglages (« Flashs & magazines » et « Interviews »), comme Slate Infos
- Playlist plus courte que la durée maximale réglée (ex. 208 min au lieu de 240) : un podcast trop long pour la place restante coupait toute la fin de la playlist. Il est désormais remplacé par un épisode plus court tiré dans la même file, sans toucher à l'alternance musique/podcast
- Génération quotidienne qui plantait sans résultat (erreur 546) quand Spotify imposait une très longue attente (ex. ~12 h) après trop de requêtes : au-delà de 30 s d'attente demandée, les podcasts concernés sont ignorés et la playlist est quand même générée (musique seule)
- Doublons de titres dans le mix généré (ex. "Titre" et "Titre (Music Video)" comptés comme deux titres différents)
- Un podcast pouvait être ignoré à tort ("aucun épisode disponible") quand Spotify renvoyait un épisode inexploitable en première position alors qu'un épisode valide existait juste après
- « Les journaux de France Culture » : un journal ancien (ex. 7h) pouvait passer devant le plus récent (ex. 8h45), car ce show n'était pas filtré par heure et son titre « JOURNAL DE 7H, du … » (avec virgule) n'était pas reconnu
- Génération quotidienne en échec et playlist « Mon Daily » recréée en doublon (vide, sans pochette) quand Spotify ne la retrouvait pas par son nom : l'id de la playlist est désormais mémorisé par compte, et la pochette est embarquée dans l'Edge Function (elle n'y était pas déployée)
- Playlist « Mon Daily » sans pochette sur un compte (la mosaïque Spotify s'affichait) : la pochette est désormais renvoyée à chaque génération, plus seulement à la création de la playlist
