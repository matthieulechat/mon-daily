import { useState, type CSSProperties } from "react";
import { PODCAST_SHOWS } from "@shared/config/podcast-shows";
import { SHOW_COVERS } from "@shared/config/show-covers";
import { ShowDisc } from "@/components/ShowDisc";
import { ThemePile } from "@/components/ThemePile";
import { Button } from "@/components/ui/button";
import type { ShowTheme } from "@/lib/show-themes";

type Show = (typeof PODCAST_SHOWS)[number];

export const normalize = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

interface GroupProps {
  title: string;
  hint?: string;
  shows: Show[];
  needle: string;
  disabledSet: Set<string>;
  setShowsEnabled: (ids: string[], enabled: boolean) => void;
}

const ShowGroup = ({
  title,
  hint,
  shows,
  needle,
  disabledSet,
  setShowsEnabled,
}: GroupProps) => {
  const ids = shows.map((s) => s.id);
  const visible = shows.filter((s) => normalize(s.name).includes(needle));
  const active = ids.filter((id) => !disabledSet.has(id)).length;
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        {title ? (
          <h3 className="text-sm font-semibold">
            {title}{" "}
            {hint && <span className="font-normal text-muted">· {hint}</span>}
            <span className="ml-2 font-normal text-muted">
              {active}/{ids.length}
            </span>
          </h3>
        ) : (
          <span />
        )}
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
    </>
  );
};

interface ThemeSectionProps {
  label: string;
  hint: string;
  themes: ShowTheme[];
  // Shows de la section (les ids non classés tombent dans "Autres").
  shows: Show[];
  needle: string;
  disabledSet: Set<string>;
  setShowsEnabled: (ids: string[], enabled: boolean) => void;
  onSelect: () => void;
}

// Piles (une par thème) + bac du thème ouvert. Clic = ouvre, re-clic = ferme.
export const ThemeSection = ({
  label,
  hint,
  themes,
  shows,
  onSelect,
  ...common
}: ThemeSectionProps) => {
  const { needle, disabledSet } = common;
  const [openIndex, setOpen] = useState<number | null>(null);

  const byId = new Map(shows.map((s) => [s.id, s]));
  const known = new Set(themes.flatMap((t) => t.ids));
  const groups = themes.map(({ ids, ...t }) => ({
    ...t,
    shows: ids.flatMap((id) => byId.get(id) ?? []),
  }));
  const others = shows.filter((s) => !known.has(s.id));
  if (others.length)
    groups.push({ title: "Autres", hint: "Non classés", color: "#7686a0", shows: others });

  const current = openIndex === null ? undefined : groups[openIndex];
  const found = groups
    .flatMap((g) => g.shows)
    .filter((s) => normalize(s.name).includes(needle));

  return (
    <section aria-label={label} className="space-y-3">
      <h3 className="text-sm font-semibold">
        {label} <span className="font-normal text-muted">· {hint}</span>
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {groups.map(({ title, hint, color, shows }, i) => (
          <ThemePile
            key={title}
            title={title}
            hint={hint}
            color={color}
            covers={shows.map((s) => SHOW_COVERS[s.id])}
            active={shows.filter((s) => !disabledSet.has(s.id)).length}
            total={shows.length}
            selected={needle === "" && i === openIndex}
            onSelect={() => {
              onSelect();
              setOpen(openIndex === i && needle === "" ? null : i);
            }}
          />
        ))}
      </div>
      {/* Recherche : le bac montre les résultats de tous les thèmes. */}
      {needle !== "" ? (
        found.length > 0 && (
          <div className="crate" style={{ "--c": "#e6edf7" } as CSSProperties}>
            <ShowGroup title="Résultats" shows={found} {...common} />
          </div>
        )
      ) : (
        current && (
          <div className="crate" style={{ "--c": current.color } as CSSProperties}>
            <ShowGroup
              title={current.title}
              hint={current.hint}
              shows={current.shows}
              {...common}
            />
          </div>
        )
      )}
    </section>
  );
};
