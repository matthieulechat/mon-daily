// Modération par mots-clés sur le titre des épisodes thématiques (l'actu en
// est exemptée : les journaux parlent de guerre presque chaque jour). Le flag
// `explicit` de Spotify n'est pas un signal fiable, cf. LRN-007.
// Titre normalisé (minuscules, sans accents) puis motifs ancrés en début de
// mot. ponytail: titre seul, ni description ni audio — un show entièrement
// consacré à un sujet se désactive plutôt dans les sources.
export const MODERATION_TOPICS = {
  guerre: {
    label: "Guerre et conflits",
    patterns: [
      "guerres?",
      "militaires?",
      "armees?",
      "bombard\\w*",
      "missiles?",
      "soldats?",
      "genocides?",
      "invasions?",
      "massacres?",
    ],
  },
  sexualite: {
    label: "Sexualité",
    patterns: [
      // Pas « sex\w* » : il capterait « sexisme », sujet à garder.
      "sexes?",
      "sexuel(le)?s?",
      "sexualites?",
      "porno\\w*",
      "orgasm\\w*",
      "masturb\\w*",
      "prostitu\\w*",
      "erotique\\w*",
      "libido",
    ],
  },
  violence: {
    label: "Violence et faits divers",
    patterns: [
      "meurtr\\w*",
      "assassin\\w*",
      "tueu[rs]\\w*",
      "tueries?",
      "(homi|infanti|parri)cides?",
      "crimes?",
      "criminel\\w*",
      // Faits violents seulement : « violence(s) » et « féminicide » sont aussi
      // des sujets de société (violences conjugales, policières…), gardés.
      "viol(s|ee?s?|eurs?)?",
      "agress\\w*",
      "faits? divers",
      "attentats?",
      "terroris\\w*",
      "otages?",
      "enlevements?",
      "poignard\\w*",
      "cadavres?",
      "tortur\\w*",
      "fusillades?",
    ],
  },
} as const;

export type ModerationTopic = keyof typeof MODERATION_TOPICS;

export const MODERATION_TOPIC_IDS = Object.keys(
  MODERATION_TOPICS,
) as ModerationTopic[];

const normalize = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const TOPIC_REGEX = Object.fromEntries(
  MODERATION_TOPIC_IDS.map((topic) => [
    topic,
    new RegExp(
      `(^|[^a-z])(${MODERATION_TOPICS[topic].patterns.join("|")})($|[^a-z])`,
    ),
  ]),
) as Record<ModerationTopic, RegExp>;

// Premier sujet modéré trouvé dans le titre, `null` sinon.
export const moderatedTopicOf = (
  title: string,
  topics: readonly ModerationTopic[],
): ModerationTopic | null => {
  const normalized = normalize(title);
  return topics.find((topic) => TOPIC_REGEX[topic].test(normalized)) ?? null;
};
