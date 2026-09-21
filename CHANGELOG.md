# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Icône de l'application (identité visuelle "Bulletin Groove" : disque vinyle, label jaune, icône radio centrée)
- Première génération fonctionnelle de la playlist quotidienne "Mon Daily" (`pnpm run login` + `pnpm run generate`) : sélection des top titres, pochette et description personnalisées, playlist privée sauvegardée dans la bibliothèque

### Fixed

- Doublons de titres dans le mix généré (ex. "Titre" et "Titre (Music Video)" comptés comme deux titres différents)
