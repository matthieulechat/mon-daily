export type PodcastCategory = "actu" | "meteo" | "thematique";

export interface PodcastShow {
  id: string;
  name: string;
  category: PodcastCategory;
  // Sous-chaîne (insensible à la casse) qu'un titre d'épisode doit contenir
  // pour rester éligible — pour un show qui mélange plusieurs formats.
  titleIncludes?: string;
  // Show publié plusieurs fois par jour (journaux à heures différentes) : on
  // ne garde que l'épisode le plus récent par catégorie effective, donc le
  // plus proche de l'heure de génération.
  latestOnly?: boolean;
  // Shows de même groupe (ex. "Le journal de 07h00", "de 18h00"...) : parmi
  // tous leurs épisodes, seul le plus proche de l'heure de génération est
  // gardé (les autres shows restent dans la liste, ils sont juste filtrés).
  closestGroup?: string;
  // Flux mixte classé "thematique" : un épisode dont le titre contient cette
  // sous-chaîne (insensible à la casse) est de l'actu, les autres restent
  // thématiques (ex. "La quotidienne" de Slate Infos).
  actuTitleIncludes?: string;
}

const JOURNAL_HORAIRE = "journal-horaire";

// Liste figée le 2026-09-20 (cf. docs/ROADMAP.md Phase 2, BDR-005/BDR-008).
// `category` catégorisée le 2026-09-22 sur la base de la colonne "Format" du
// ROADMAP : "actu" = actualité du jour, "thematique" = analyse/culture/sport/
// humour, pas lié au jour même. Sert à prioriser l'actu dans le mix
// (generate.ts) — quelques cas limites (ex. "Géopolitique" de France
// Culture est quotidien mais classé thématique par nature du contenu) à
// corriger ici si le classement ne convient pas.
// Revu à la main le 2026-09-22 (via docs/podcast-review.html) : 8 shows
// d'analyse/débat passés de "actu" à "thematique" — seuls les journaux et
// flashs du jour restent en "actu".
// "meteo" n'apparaît jamais ici : "Le journal d'Europe 1" mixe actu et
// météo dans le même flux, donc la catégorie effective est déduite par
// épisode (titre) dans podcast-source.ts, pas fixée par show.
export const PODCAST_SHOWS: PodcastShow[] = [
  {
    id: "2ceI3IzPwHJywfQTAtrQSI",
    name: "L'Heure du Monde",
    category: "thematique",
  },
  {
    id: "4wyNV1lUV1Wm2wqN91mEx6",
    name: "Les informés de franceinfo",
    category: "thematique",
  },
  {
    id: "6RHQXwIlOrjdZ86forQKlw",
    name: "8h30 franceinfo",
    category: "thematique",
  },
  { id: "1QSQSKhOnNKkm6jr4afJHg", name: "Sur le fil", category: "thematique" },
  {
    id: "6y1PloEyNsCNJH9vHias4T",
    name: "HugoDécrypte - Actus et interviews",
    category: "actu",
  },
  {
    id: "3YCFNohB2PpHNY41qNsc5Q",
    name: "La question info",
    category: "thematique",
  },
  {
    id: "1teuRpy91067CoPOPfArRE",
    name: "C dans l'air",
    category: "thematique",
  },
  { id: "4J2KJU7Lcv0e1wH3728Fse", name: "Code source", category: "thematique" },
  {
    id: "108ja5N6Lhjl7M8TjTYcNa",
    name: "Journal de 08h00",
    category: "actu",
    closestGroup: JOURNAL_HORAIRE,
  },
  { id: "20rMwrrfflhMee6dxnxE57", name: "Le Crayon", category: "thematique" },
  {
    id: "1AUM0tB6DZBShd4nyzZHHE",
    name: "Le journal d'Europe 1",
    category: "actu",
    latestOnly: true,
  },
  { id: "6y3v3GWUBwANr9hK9m1frF", name: "Journal Monde", category: "actu", latestOnly: true },
  {
    id: "1YlJfmqBsfLHI9QZksdSbR",
    name: "La Matinée Est Tienne, par Samuel Etienne",
    category: "actu",
    // Flux mixte (chroniques, interviews...) — seul le format quotidien
    // "L'actu du jour en bref" est retenu.
    titleIncludes: "actu du jour en bref",
  },
  { id: "58PM4YR8kDyH7lU5yVbgjT", name: "Journal de 07h00", category: "actu", closestGroup: JOURNAL_HORAIRE },
  { id: "31c051Jvz9MkmkK1dCBoHQ", name: "Journal de 07h30", category: "actu", closestGroup: JOURNAL_HORAIRE },
  { id: "0q3CZ4Gn4BbRjfzhfWNgwt", name: "Le journal de 6h", category: "actu", closestGroup: JOURNAL_HORAIRE },
  { id: "6jxzu0YQMy6DP6PKsg3Ub4", name: "Le journal de 6h30", category: "actu", closestGroup: JOURNAL_HORAIRE },
  { id: "6PZ0sczZaenEXeMtFjIYjK", name: "Le journal de 18h", category: "actu", closestGroup: JOURNAL_HORAIRE },
  { id: "1waeTs7fCaeh4yGJIBKeSJ", name: "Le journal de 19h", category: "actu", closestGroup: JOURNAL_HORAIRE },
  { id: "2pFNO7RV5JVFbFMQlfgc6i", name: "Le journal de 13h", category: "actu", closestGroup: JOURNAL_HORAIRE },
  {
    id: "0pversl5NYX9qOs4WD7sfN",
    name: "Les journaux de France Culture",
    category: "actu",
    closestGroup: JOURNAL_HORAIRE,
  },
  {
    id: "0AVkxaaQWUC6QAn38x5OmR",
    name: "Journal en français facile",
    category: "actu",
  },

  {
    id: "73jHIG8pyTbbRnhVUwRXnZ",
    name: "Le Fil Culture G",
    category: "thematique",
  },
  {
    id: "62iffPHZ8yR5yvRZN9C2f4",
    name: "L'ordre du monde",
    category: "thematique",
  },
  {
    id: "2syIwMfdIPTD6VgkOY6FGa",
    name: "Maintenant, vous savez",
    category: "thematique",
  },
  {
    id: "4wMWrabr79pA104WEAkcH3",
    name: "Ça dit quoi ?",
    category: "thematique",
  },
  {
    id: "6rnrqx5EXCQUriDzp9Y0sw",
    name: "Maintenant Vous Savez - Culture",
    category: "thematique",
  },
  {
    id: "5DUxdQ9CFJza8jpjGpO3Q2",
    name: "Maintenant Vous Savez Santé",
    category: "thematique",
  },
  { id: "5zhGjnzRr4On2lWMIgFQPm", name: "Gaspard G", category: "thematique" },
  {
    id: "3xk078ZrBB5X75zQzHEHRN",
    name: "Les Couilles sur la table",
    category: "thematique",
  },
  {
    id: "5iZAQiKv5QamDAzT2jOn1f",
    name: "L'œil de Philippe Caverivière",
    category: "thematique",
  },
  {
    id: "0mGLRxbnUfEtBmgpE9bRXT",
    name: "Le Dessous des Cartes",
    category: "thematique",
  },
  {
    id: "7trRb7PXoTNX9kbEKZI5uY",
    name: "Géopolitique",
    category: "thematique",
  },
  {
    id: "17gHyBzJ8BC7i8O9DgJUal",
    name: "Undercut, le podcast F1 de L'Équipe",
    category: "thematique",
  },
  {
    id: "4CjHsp28z1bL2ji5j6PCGX",
    name: "Big 5, le podcast foot de L'Équipe",
    category: "thematique",
  },
  {
    id: "5SqKygFl8gfylpIDtfqVe2",
    name: "Crunch, le podcast rugby de L'Équipe",
    category: "thematique",
  },
  {
    id: "1a9RSfnhxLiwOZJL0mU3ww",
    name: "Ultra Run, le podcast trail de L'Équipe",
    category: "thematique",
  },
  {
    id: "4l7WZcg5qBOdo76lL9ZtEj",
    name: "Libération Podcast",
    category: "thematique",
  },
  {
    id: "6d9U2NiY1792t8gNE9Eptm",
    name: "Le Phil d'Actu - Philosophie et Actualité",
    category: "thematique",
  },
  {
    id: "0WjH88Utuz9qOS9FzUp1xu",
    name: "Le Titre à la une",
    category: "thematique",
  },
  { id: "4MF0XYJpnZQ2za6CCJ61Q5", name: "Saga", category: "thematique" },
  { id: "271pQcFjR0jlqgthMUZdKG", name: "Décryptage", category: "thematique" },
  {
    id: "4nWaNsD1fMzJRbxTQKEmnP",
    name: "L'Entretien géopolitique",
    category: "thematique",
  },
  { id: "3OiGhrRIdqhorrpPhlfiFt", name: "La Story", category: "thematique" },
  {
    id: "2SWtkazFRAdcOxFN3hUvSL",
    name: "En Immersion",
    category: "thematique",
  },
  {
    id: "0F3VqxhfFyKB8MxnddgpSg",
    name: "L'édito du Figaro",
    category: "thematique",
  },
  {
    id: "6E5NW1rh303Jx28QEw18K0",
    name: "La Question du jour",
    category: "thematique",
  },
  {
    id: "4d8b4VDri5fMz1a2U4p0tF",
    name: "Les Enjeux internationaux",
    category: "thematique",
  },
  {
    id: "4zkO1BrMVLpN8YFT4fub9h",
    name: "L'actu internationale par France Culture",
    category: "thematique",
  },
  {
    id: "6p28Rq8jqWzBlkNuOl1bae",
    name: "Géopolitique (RFI)",
    category: "thematique",
  },
  {
    id: "3oRAgecaFNTxmSEea00V7m",
    name: "Le Club Le Figaro International",
    category: "thematique",
  },
  {
    id: "7BayWqjvFaZDTY1P8h1jN6",
    name: "Le Grand reportage de France Inter",
    category: "thematique",
  },
  {
    id: "1EJVUzPQJAM9b3Qp7gyaPm",
    name: "Grand reportage (RFI)",
    category: "thematique",
  },
  {
    id: "6lHI4xTEvCB0PAwahBiwGO",
    name: "Interception",
    category: "thematique",
  },
  {
    id: "2mgIj1Y64XTLJT2Ax9rYEx",
    name: "Affaires sensibles",
    category: "thematique",
  },
  { id: "3b5FHUYRoCb6D8LjnGMK09", name: "Programme B", category: "thematique" },
  {
    id: "5u5HcL7HaColC7ULKhA4zZ",
    name: "Passages, le podcast d'histoires vraies de Louie Media",
    category: "thematique",
  },
  {
    id: "6yurCuUVoJL5rheKRHzMvM",
    name: "Les Récits du Figaro",
    category: "thematique",
  },
  {
    id: "3G9rZxNBUCPltjP1zLWC5h",
    name: "Les interviews d'Inter",
    category: "thematique",
  },
  {
    id: "2KZgJ6CxdTXzrEDR7Sdlq6",
    name: "L'Invité de 8h20 : le grand entretien",
    category: "thematique",
  },
  { id: "3mI1FSqvVAfA2UXAQTDeWx", name: "Le Grand portrait", category: "thematique" },
  {
    id: "6uvxJSBUQxaKkrJ7zux3OJ",
    name: "Les enquêtes d'Yvan Casta",
    category: "thematique",
  },
  { id: "6xlXRVwfN8ruLSLDoEfo0U", name: "Le journal RTL", category: "actu", latestOnly: true },
  { id: "6eUkIGI0fQWMB0tuHV5KtH", name: "L'invité RTL de 7h40", category: "thematique" },
  { id: "4k0HzNOCXA4fq6Mi1fJn52", name: "Le grand jury", category: "thematique" },
  { id: "0SPjN9Sc4mJ4YWUu73qGXS", name: "La revue de presse", category: "actu" },
  { id: "5IIX7ZPalhtTKt4esRHer3", name: "La revue de presse internationale - Les correspondants d'Europe 1", category: "actu" },
  { id: "6QHdvWJDqyCBNulOQ9Q5SS", name: "franceinfo monde", category: "actu" },
  { id: "36I5SmJo2lyC2ItN6HgYxU", name: "Le choix de franceinfo", category: "actu" },
  { id: "2RR0sbmCht1FV9huRDWg1H", name: "franceinfo sports", category: "actu" },
  { id: "1UqC9vb9bmugCK23m14MLs", name: "La Revue de presse internationale", category: "actu" },
  { id: "1sR81vYrWb2MGSyiaJxa5U", name: "Le Flash info 20 Minutes", category: "actu" },
  {
    id: "1AHG8f8NWv9WZtRTA7k3dy",
    name: "Slate Infos",
    category: "thematique",
    // Flux mixte : seule "La quotidienne" est de l'actu, le reste (interviews)
    // reste thématique.
    actuTitleIncludes: "la quotidienne",
  },
  { id: "1vZVfukC3QBbZWg7hG1dqU", name: "La Revue de Presse", category: "actu" },
  { id: "4WoDw5FtSR53h4Uz76DrqE", name: "Les Essentiels de l'info", category: "thematique" },
  { id: "7Lfq9hAm5UFyuBoaJE7J3w", name: "Le sens de l'actu", category: "thematique" },
  { id: "3FA6OTTrmQw7nJQailXCda", name: "Les coulisses de la politique", category: "thematique" },
  { id: "7BULZvzhFCdZEf3D1m8yOt", name: "Le Journal de l'Economie", category: "actu" },
  { id: "7kcz74SPx9ZqS5eE4HbBkW", name: "Chronique économique", category: "thematique" },
  { id: "2KhIYTtyuWb1K2F5VThYRf", name: "Entendez-vous l'éco ?", category: "actu" },
  { id: "0b3B75OyFO6msRJOvtjbBX", name: "L’Express Podcasts", category: "thematique" },
  { id: "3HNRGEtjT3UrOpc6vsfRdt", name: "Anatomie d'une décision", category: "thematique" },
  { id: "4wO7tqeEL2RTVDxv1cXdn2", name: "Newsroom, les invités de la rédaction d'Ouest-France", category: "thematique" },
  { id: "52nCR9jqRKsiN1Ve0aZiGA", name: "Le Club Le Figaro Politique", category: "thematique" },
  { id: "50GTqIdUIvw0nxFMdPBGrB", name: "Le Club Le Figaro Culture", category: "thematique" },
  { id: "4lPbJxQ3b1G5B60PEwK0t3", name: "Les podcasts 20 Minutes", category: "thematique" },
  { id: "5vWK8VVtYVqez2TTc0vBwN", name: "28 Minutes", category: "thematique" },
  { id: "2R47RsdPn70kVpLIK0cIKl", name: "Conflits, géopolitique", category: "thematique" },
  { id: "5AU3GzHiJhrRgUsJ8iEdxZ", name: "Culture G", category: "thematique" },
  { id: "5ZdVWjo3QIdEOpGdcb8HPP", name: "Les Echos de l'IA", category: "thematique" },
  { id: "166QNRRFq22r2iSLFgn4BX", name: "Face à Face", category: "thematique" },
  { id: "0L85fRQXSTXgbqQWAa6wY4", name: "Points de Vue", category: "thematique" },
  { id: "2VRR0TGLn4ckba3J0UyJjq", name: "Les pieds sur terre", category: "thematique" },
  { id: "7lcxzeC0jTbpU7jBDu5IyW", name: "Entrez dans l'Histoire", category: "thematique" },
  { id: "7iFJQotqjCziytm2RSuXB8", name: "Un Jour dans l'Histoire", category: "thematique" },
  { id: "1fUNqOF5TeME7dEpU4aE65", name: "Face à l'histoire", category: "thematique" },
  { id: "3HKqZ6Xyg4R2DCvMxnttR6", name: "Secrets d'Histoire", category: "thematique" },
  { id: "0rhNDVyH0iGVHVDH6SOiMv", name: "Hondelatte Raconte", category: "thematique" },
  { id: "3pYH5Kxw9IiznsPz0WoIn5", name: "L'Heure Du Crime", category: "thematique" },
  { id: "38EKOHm8o9LflZRiqDmrmf", name: "Crime story", category: "thematique" },
  { id: "4RSOfC8evY1VaRZrMO5PNk", name: "LSD, la série documentaire", category: "thematique" },
  { id: "3ixMUAbmKEYcoRt62l48Zp", name: "L'After Foot", category: "thematique" },
  { id: "7Msy4JUPv8qodVftr33WGv", name: "Le Paddock RMC", category: "thematique" },
  { id: "4YrgK0BhFAwXDKqvebvNVP", name: "Rugby Confidential", category: "thematique" },
  { id: "6iGZsNqtX8q1skSBBtQWik", name: "Peloton RMC", category: "thematique" },
  { id: "0hBA2K37Vo1zoyShv1yPCK", name: "Les Grosses Têtes", category: "thematique" },
  { id: "5WPgD6986cdh0P31pVAYbE", name: "Laurent Gerra", category: "thematique" },
  { id: "5mHgwovq7vwh1hw88tidWS", name: "Les chroniques d'Arnaud Demanche", category: "thematique" },
  { id: "0oEyqaLqs3WCbnLMqUAj3S", name: "Les chroniques de Daniel Morin", category: "thematique" },
  { id: "5jZmbWSaEIQMPOjbarGxWB", name: "Laurent Baffie", category: "thematique" },
];
