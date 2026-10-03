import { useMemo, useState } from "react";
import {
  PODCAST_SHOWS,
  type PodcastCategory,
} from "@shared/config/podcast-shows";
import { SHOW_COVERS } from "@shared/config/show-covers";
import { ShowDisc } from "@/components/ShowDisc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/settings.store";

const GROUPS: { category: PodcastCategory; title: string; hint: string }[] = [
  { category: "actu", title: "Actu du jour", hint: "Journaux et flashs" },
  {
    category: "thematique",
    title: "Thématiques",
    hint: "Analyses, culture, sport",
  },
];

const normalize = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export const ShowsPicker = () => {
  const disabled = useSettingsStore((s) => s.settings.disabledShowIds);
  const setShowsEnabled = useSettingsStore((s) => s.setShowsEnabled);
  const [query, setQuery] = useState("");

  const disabledSet = useMemo(() => new Set(disabled), [disabled]);
  const needle = normalize(query);
  const activeCount = PODCAST_SHOWS.length - disabledSet.size;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Sources</span>
          <Badge>
            {activeCount}/{PODCAST_SHOWS.length} actives
          </Badge>
        </div>
        <input
          type="search"
          aria-label="Rechercher une source"
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-full border border-border bg-secondary px-4 py-1.5 text-sm placeholder:text-muted"
        />
      </div>

      {GROUPS.map(({ category, title, hint }) => {
        const shows = PODCAST_SHOWS.filter((s) => s.category === category);
        const visible = shows.filter((s) => normalize(s.name).includes(needle));
        const ids = shows.map((s) => s.id);
        return (
          <section key={category} aria-label={title}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">
                {title} <span className="font-normal text-muted">· {hint}</span>
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowsEnabled(ids, true)}
                >
                  Tout activer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowsEnabled(ids, false)}
                >
                  Tout désactiver
                </Button>
              </div>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-y-5">
              {visible.map((show, i) => (
                <li key={show.id} className="flex justify-center">
                  <ShowDisc
                    name={show.name}
                    cover={SHOW_COVERS[show.id]}
                    index={i}
                    active={!disabledSet.has(show.id)}
                    onToggle={() =>
                      setShowsEnabled([show.id], disabledSet.has(show.id))
                    }
                  />
                </li>
              ))}
            </ul>
            {visible.length === 0 && (
              <p className="text-xs text-muted">Aucun résultat.</p>
            )}
          </section>
        );
      })}
    </Card>
  );
};
