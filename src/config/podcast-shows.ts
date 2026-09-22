export type PodcastCategory = "actu" | "thematique";

export interface PodcastShow {
  id: string;
  name: string;
  category: PodcastCategory;
}

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
    id: "0pj85Csk4cPVRulubA1sel",
    name: "La semaine européenne",
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
  },
  { id: "20rMwrrfflhMee6dxnxE57", name: "Le Crayon", category: "thematique" },
  {
    id: "1AUM0tB6DZBShd4nyzZHHE",
    name: "Le journal d'Europe 1",
    category: "actu",
  },
  { id: "6y3v3GWUBwANr9hK9m1frF", name: "Journal Monde", category: "actu" },
  {
    id: "1YlJfmqBsfLHI9QZksdSbR",
    name: "La Matinée Est Tienne, par Samuel Etienne",
    category: "actu",
  },
  { id: "58PM4YR8kDyH7lU5yVbgjT", name: "Journal de 07h00", category: "actu" },
  { id: "31c051Jvz9MkmkK1dCBoHQ", name: "Journal de 07h30", category: "actu" },
  { id: "0q3CZ4Gn4BbRjfzhfWNgwt", name: "Le journal de 6h", category: "actu" },
  {
    id: "0pversl5NYX9qOs4WD7sfN",
    name: "Les journaux de France Culture",
    category: "actu",
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
];
