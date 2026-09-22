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
export const PODCAST_SHOWS: PodcastShow[] = [
  { id: "2ceI3IzPwHJywfQTAtrQSI", name: "L'Heure du Monde", category: "actu" },
  {
    id: "4wyNV1lUV1Wm2wqN91mEx6",
    name: "Les informés de franceinfo",
    category: "actu",
  },
  { id: "6RHQXwIlOrjdZ86forQKlw", name: "8h30 franceinfo", category: "actu" },
  { id: "1QSQSKhOnNKkm6jr4afJHg", name: "Sur le fil", category: "actu" },
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
  { id: "3YCFNohB2PpHNY41qNsc5Q", name: "La question info", category: "actu" },
  { id: "1teuRpy91067CoPOPfArRE", name: "C dans l'air", category: "actu" },
  { id: "4J2KJU7Lcv0e1wH3728Fse", name: "Code source", category: "actu" },
  {
    id: "108ja5N6Lhjl7M8TjTYcNa",
    name: "Journal de 08h00",
    category: "actu",
  },
  { id: "20rMwrrfflhMee6dxnxE57", name: "Le Crayon", category: "actu" },
  {
    id: "1AUM0tB6DZBShd4nyzZHHE",
    name: "Le journal d'Europe 1",
    category: "actu",
  },
  { id: "6y3v3GWUBwANr9hK9m1frF", name: "Journal Monde", category: "actu" },

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
];
