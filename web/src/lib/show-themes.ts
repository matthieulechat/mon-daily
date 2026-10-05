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
      "4WoDw5FtSR53h4Uz76DrqE", // Les Essentiels de l'info
      "7Lfq9hAm5UFyuBoaJE7J3w", // Le sens de l'actu
      "3FA6OTTrmQw7nJQailXCda", // Les coulisses de la politique
      "7kcz74SPx9ZqS5eE4HbBkW", // Chronique économique
      "3HNRGEtjT3UrOpc6vsfRdt", // Anatomie d'une décision
      "5vWK8VVtYVqez2TTc0vBwN", // 28 Minutes
      "0L85fRQXSTXgbqQWAa6wY4", // Points de Vue
      "5ZdVWjo3QIdEOpGdcb8HPP", // Les Echos de l'IA
      "4lPbJxQ3b1G5B60PEwK0t3", // Les podcasts 20 Minutes
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
      "2R47RsdPn70kVpLIK0cIKl", // Conflits, géopolitique
    ],
  },
  {
    title: "Sport",
    hint: "F1, foot, rugby, vélo, trail",
    color: "#ff6a3d",
    ids: [
      "17gHyBzJ8BC7i8O9DgJUal", // Undercut (F1)
      "4CjHsp28z1bL2ji5j6PCGX", // Big 5 (foot)
      "5SqKygFl8gfylpIDtfqVe2", // Crunch (rugby)
      "1a9RSfnhxLiwOZJL0mU3ww", // Ultra Run (trail)
      "3ixMUAbmKEYcoRt62l48Zp", // L'After Foot
      "7Msy4JUPv8qodVftr33WGv", // Le Paddock RMC
      "4YrgK0BhFAwXDKqvebvNVP", // Rugby Confidential
      "6iGZsNqtX8q1skSBBtQWik", // Peloton RMC
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
      "5AU3GzHiJhrRgUsJ8iEdxZ", // Culture G
      "2VRR0TGLn4ckba3J0UyJjq", // Les pieds sur terre
      "1AHG8f8NWv9WZtRTA7k3dy", // Slate Infos
    ],
  },
  {
    title: "Histoires",
    hint: "Histoire, enquêtes & reportages",
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
      "7lcxzeC0jTbpU7jBDu5IyW", // Entrez dans l'Histoire
      "7iFJQotqjCziytm2RSuXB8", // Un Jour dans l'Histoire
      "1fUNqOF5TeME7dEpU4aE65", // Face à l'histoire
      "3HKqZ6Xyg4R2DCvMxnttR6", // Secrets d'Histoire
      "0rhNDVyH0iGVHVDH6SOiMv", // Hondelatte Raconte
      "3pYH5Kxw9IiznsPz0WoIn5", // L'Heure Du Crime
      "38EKOHm8o9LflZRiqDmrmf", // Crime story
      "4RSOfC8evY1VaRZrMO5PNk", // LSD, la série documentaire
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
      "6eUkIGI0fQWMB0tuHV5KtH", // L'invité RTL de 7h40
      "4k0HzNOCXA4fq6Mi1fJn52", // Le grand jury
      "166QNRRFq22r2iSLFgn4BX", // Face à Face
      "4wO7tqeEL2RTVDxv1cXdn2", // Newsroom (Ouest-France)
      "0b3B75OyFO6msRJOvtjbBX", // L'Express Podcasts (dont La semaine européenne)
      "52nCR9jqRKsiN1Ve0aZiGA", // Le Club Le Figaro Politique
      "50GTqIdUIvw0nxFMdPBGrB", // Le Club Le Figaro Culture
      "5jZmbWSaEIQMPOjbarGxWB", // Laurent Baffie
      "6y1PloEyNsCNJH9vHias4T", // HugoDécrypte (interviews)
    ],
  },
  {
    title: "Humour",
    hint: "Chroniques & fous rires",
    color: "#f472b6",
    ids: [
      "0hBA2K37Vo1zoyShv1yPCK", // Les Grosses Têtes
      "5WPgD6986cdh0P31pVAYbE", // Laurent Gerra
      "5mHgwovq7vwh1hw88tidWS", // Les chroniques d'Arnaud Demanche
      "0oEyqaLqs3WCbnLMqUAj3S", // Les chroniques de Daniel Morin
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
    hint: "RTL, Europe 1, France Culture",
    color: "#2f93ff",
    ids: [
      "6xlXRVwfN8ruLSLDoEfo0U", // Le journal RTL
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
      "6QHdvWJDqyCBNulOQ9Q5SS", // franceinfo monde
      "36I5SmJo2lyC2ItN6HgYxU", // Le choix de franceinfo
      "2RR0sbmCht1FV9huRDWg1H", // franceinfo sports
      "1sR81vYrWb2MGSyiaJxa5U", // Le Flash info 20 Minutes
      "7BULZvzhFCdZEf3D1m8yOt", // Le Journal de l'Économie
      "2KhIYTtyuWb1K2F5VThYRf", // Entendez-vous l'éco ?
      "1AHG8f8NWv9WZtRTA7k3dy", // Slate Infos (La quotidienne)
    ],
  },
  {
    title: "Revues de presse",
    hint: "Ce que dit la presse",
    color: "#34d399",
    ids: [
      "0SPjN9Sc4mJ4YWUu73qGXS", // La revue de presse (Europe 1)
      "5IIX7ZPalhtTKt4esRHer3", // Revue de presse internationale (Europe 1)
      "1UqC9vb9bmugCK23m14MLs", // La Revue de presse internationale (France Culture)
      "1vZVfukC3QBbZWg7hG1dqU", // La Revue de Presse (Radio Classique)
    ],
  },
];
