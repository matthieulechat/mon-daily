// Sous-thèmes des podcasts "thématiques" — purement visuel (UI de réglages),
// la génération de playlist ne les utilise pas. Un show absent de cette liste
// tombe dans "Autres" : il reste visible et activable.
export interface ShowTheme {
  title: string;
  hint: string;
  color: string;
  ids: string[];
}

export const SHOW_THEMES: ShowTheme[] = [
  {
    title: "Débats",
    hint: "Décryptage de l'actu",
    color: "#2f93ff",
    ids: [
      "2ceI3IzPwHJywfQTAtrQSI", // L'Heure du Monde
      "4wyNV1lUV1Wm2wqN91mEx6", // Les informés de franceinfo
      "6RHQXwIlOrjdZ86forQKlw", // 8h30 franceinfo
      "1QSQSKhOnNKkm6jr4afJHg", // Sur le fil
      "3YCFNohB2PpHNY41qNsc5Q", // La question info
      "1teuRpy91067CoPOPfArRE", // C dans l'air
      "4J2KJU7Lcv0e1wH3728Fse", // Code source
      "20rMwrrfflhMee6dxnxE57", // Le Crayon
      "4l7WZcg5qBOdo76lL9ZtEj", // Libération Podcast
      "0WjH88Utuz9qOS9FzUp1xu", // Le Titre à la une
      "271pQcFjR0jlqgthMUZdKG", // Décryptage
      "0F3VqxhfFyKB8MxnddgpSg", // L'édito du Figaro
      "6E5NW1rh303Jx28QEw18K0", // La Question du jour
      "5iZAQiKv5QamDAzT2jOn1f", // L'œil de Philippe Caverivière
    ],
  },
  {
    title: "Géopolitique",
    hint: "International",
    color: "#a3e635",
    ids: [
      "62iffPHZ8yR5yvRZN9C2f4", // L'ordre du monde
      "0mGLRxbnUfEtBmgpE9bRXT", // Le Dessous des Cartes
      "7trRb7PXoTNX9kbEKZI5uY", // Géopolitique
      "4nWaNsD1fMzJRbxTQKEmnP", // L'Entretien géopolitique
      "4d8b4VDri5fMz1a2U4p0tF", // Les Enjeux internationaux
      "4zkO1BrMVLpN8YFT4fub9h", // L'actu internationale par France Culture
      "6p28Rq8jqWzBlkNuOl1bae", // Géopolitique (RFI)
      "3oRAgecaFNTxmSEea00V7m", // Le Club Le Figaro International
      "7BayWqjvFaZDTY1P8h1jN6", // Le Grand reportage de France Inter
      "1EJVUzPQJAM9b3Qp7gyaPm", // Grand reportage (RFI)
    ],
  },
  {
    title: "Sport",
    hint: "F1, foot, rugby, trail",
    color: "#ff6a3d",
    ids: [
      "17gHyBzJ8BC7i8O9DgJUal", // Undercut (F1)
      "4CjHsp28z1bL2ji5j6PCGX", // Big 5 (foot)
      "5SqKygFl8gfylpIDtfqVe2", // Crunch (rugby)
      "1a9RSfnhxLiwOZJL0mU3ww", // Ultra Run (trail)
    ],
  },
  {
    title: "Culture",
    hint: "Savoirs & société",
    color: "#c084fc",
    ids: [
      "73jHIG8pyTbbRnhVUwRXnZ", // Le Fil Culture G
      "2syIwMfdIPTD6VgkOY6FGa", // Maintenant, vous savez
      "6rnrqx5EXCQUriDzp9Y0sw", // Maintenant Vous Savez - Culture
      "5DUxdQ9CFJza8jpjGpO3Q2", // Maintenant Vous Savez Santé
      "4wMWrabr79pA104WEAkcH3", // Ça dit quoi ?
      "5zhGjnzRr4On2lWMIgFQPm", // Gaspard G
      "3xk078ZrBB5X75zQzHEHRN", // Les Couilles sur la table
      "6d9U2NiY1792t8gNE9Eptm", // Le Phil d'Actu
      "3b5FHUYRoCb6D8LjnGMK09", // Programme B
    ],
  },
  {
    title: "Histoires",
    hint: "Enquêtes & reportages",
    color: "#ffd23f",
    ids: [
      "4MF0XYJpnZQ2za6CCJ61Q5", // Saga
      "3OiGhrRIdqhorrpPhlfiFt", // La Story
      "2SWtkazFRAdcOxFN3hUvSL", // En Immersion
      "6lHI4xTEvCB0PAwahBiwGO", // Interception
      "2mgIj1Y64XTLJT2Ax9rYEx", // Affaires sensibles
      "5u5HcL7HaColC7ULKhA4zZ", // Passages
      "6yurCuUVoJL5rheKRHzMvM", // Les Récits du Figaro
      "6uvxJSBUQxaKkrJ7zux3OJ", // Les enquêtes d'Yvan Casta
    ],
  },
  {
    title: "Interviews",
    hint: "Portraits",
    color: "#22d3ee",
    ids: [
      "3G9rZxNBUCPltjP1zLWC5h", // Les interviews d'Inter
      "2KZgJ6CxdTXzrEDR7Sdlq6", // L'Invité de 8h20
      "3mI1FSqvVAfA2UXAQTDeWx", // Le Grand portrait
    ],
  },
];

// Actu du jour — ids dans l'ordre d'affichage (journaux classés par heure).
export const ACTU_THEMES: ShowTheme[] = [
  {
    title: "Matin",
    hint: "Journaux de 6h à 8h",
    color: "#ff4d6d",
    ids: [
      "0q3CZ4Gn4BbRjfzhfWNgwt", // Le journal de 6h
      "6jxzu0YQMy6DP6PKsg3Ub4", // Le journal de 6h30
      "58PM4YR8kDyH7lU5yVbgjT", // Journal de 07h00
      "31c051Jvz9MkmkK1dCBoHQ", // Journal de 07h30
      "108ja5N6Lhjl7M8TjTYcNa", // Journal de 08h00
    ],
  },
  {
    title: "Midi & soir",
    hint: "Journaux de 13h à 19h",
    color: "#ff9f1c",
    ids: [
      "2pFNO7RV5JVFbFMQlfgc6i", // Le journal de 13h
      "6PZ0sczZaenEXeMtFjIYjK", // Le journal de 18h
      "1waeTs7fCaeh4yGJIBKeSJ", // Le journal de 19h
    ],
  },
  {
    title: "Autres stations",
    hint: "Europe 1, France Culture, RFI",
    color: "#2f93ff",
    ids: [
      "1AUM0tB6DZBShd4nyzZHHE", // Le journal d'Europe 1
      "0pversl5NYX9qOs4WD7sfN", // Les journaux de France Culture
      "6y3v3GWUBwANr9hK9m1frF", // Journal Monde
      "0AVkxaaQWUC6QAn38x5OmR", // Journal en français facile
    ],
  },
  {
    title: "Flashs & magazines",
    hint: "Actu en bref",
    color: "#ffd23f",
    ids: [
      "6y1PloEyNsCNJH9vHias4T", // HugoDécrypte
      "1YlJfmqBsfLHI9QZksdSbR", // La Matinée Est Tienne (actu du jour en bref)
      "0pj85Csk4cPVRulubA1sel", // La semaine européenne
    ],
  },
];
