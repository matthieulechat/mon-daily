# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Icône de l'application (identité visuelle "Bulletin Groove" : disque vinyle, label jaune, icône radio centrée)
- Première génération fonctionnelle de la playlist quotidienne "Mon Daily" (`pnpm run login` + `pnpm run generate`) : sélection des top titres, pochette et description personnalisées, playlist privée sauvegardée dans la bibliothèque
- Mix musique/actu dans la playlist générée : jingle "C'est {jour}" en intro, l'actu ouvre le mix dès les 2 premiers podcasts puis alterne avec des podcasts thématiques toutes les 4 musiques (4 actus + 4 thématiques par jour, tirés au sort en évitant les 14 derniers jours pour les thématiques), toujours les musiques les plus écoutées, playlist plafonnée à 4h (un épisode de plus de 3 jours est ignoré)

### Fixed

- Doublons de titres dans le mix généré (ex. "Titre" et "Titre (Music Video)" comptés comme deux titres différents)
- Un podcast pouvait être ignoré à tort ("aucun épisode disponible") quand Spotify renvoyait un épisode inexploitable en première position alors qu'un épisode valide existait juste après
