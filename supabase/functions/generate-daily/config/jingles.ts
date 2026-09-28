// Album officiel Spotify "Mon Daily" (2021) — 7 jingles "C'est {jour}".
// https://open.spotify.com/intl-fr/album/7F6q2YyEzP7ugqZhxfwouD
const JINGLE_URIS_BY_WEEKDAY: Record<string, string> = {
  Monday: "spotify:track:5quzUGpkOiiDYSVpLgVRri",
  Tuesday: "spotify:track:02ccJIawsUKanHns1VUb9g",
  Wednesday: "spotify:track:17k0IC1WEG1dlyXaTsyydc",
  Thursday: "spotify:track:0OjHAfLQvGHVazovHWGWcQ",
  Friday: "spotify:track:3ogo0ojU68mwMWQrC1AAoN",
  Saturday: "spotify:track:3ZHPew5MTUrLbadSVfANiI",
  Sunday: "spotify:track:5AL05HYdyP8tzDhQrkr1Vh",
};

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Paris",
  weekday: "long",
});

// Le jour se calcule sur le fuseau utilisateur (Europe/Paris), pas sur
// l'heure serveur brute — désynchro possible une fois automatisé (Phase 3).
export const todaysJingleUri = (): string => {
  const weekday = weekdayFormatter.format(new Date());
  return JINGLE_URIS_BY_WEEKDAY[weekday]!;
};
