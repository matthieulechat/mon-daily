# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Icône de l'application (identité visuelle "Bulletin Groove" : disque vinyle, label jaune, icône radio centrée)
- Première génération fonctionnelle de la playlist quotidienne "Mon Daily" (`pnpm run login` + `pnpm run generate`) : sélection des top titres, pochette et description personnalisées, playlist privée sauvegardée dans la bibliothèque
- Mix musique/actu dans la playlist générée : jingle "C'est {jour}" en intro, le mix ouvre sur une actu puis la météo du jour (extraite du Journal d'Europe 1) puis alterne avec des podcasts thématiques toutes les 4 musiques (3 actus + 1 météo + 4 thématiques par jour, tirés au sort), toujours les musiques les plus écoutées, playlist plafonnée à 4h (un épisode d'actu de plus de 2 jours, de météo de plus d'1 jour, ou un épisode thématique de plus de 3 jours est ignoré)
- Sources podcast étendues à 55 shows (journaux France Inter/France Culture/RFI, géopolitique, grands reportages, récits…)

### Changed

- Classement actu/thématique revu à la main : seuls les journaux et flashs du jour comptent comme "actu" (les émissions de débat/décryptage comme C dans l'air, Code source ou L'Heure du Monde passent en thématique)
- "La Matinée Est Tienne, par Samuel Etienne" : seuls les épisodes "L'actu du jour en bref" alimentent le mix, le reste du flux (chroniques, interviews) est écarté
- HugoDécrypte : les "actu du jour" et "actu Pop" comptent comme actu, les interviews/rediffs passent en thématique (détecté sur le titre et la description de chaque épisode)

### Fixed

- Doublons de titres dans le mix généré (ex. "Titre" et "Titre (Music Video)" comptés comme deux titres différents)
- Un podcast pouvait être ignoré à tort ("aucun épisode disponible") quand Spotify renvoyait un épisode inexploitable en première position alors qu'un épisode valide existait juste après
