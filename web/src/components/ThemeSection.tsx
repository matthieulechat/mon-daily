import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PODCAST_SHOWS } from "@shared/config/podcast-shows";
import { SHOW_COVERS } from "@shared/config/show-covers";
import { ShowDisc } from "@/components/ShowDisc";
import { ThemePile } from "@/components/ThemePile";
import { Button } from "@/components/ui/button";
import type { ShowTheme } from "@/lib/show-themes";
import { cn } from "@/lib/utils";

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
          <li
            key={show.id}
            className="show-item flex justify-center"
            style={{ "--i": i } as CSSProperties}
          >
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
  const [closing, setClosing] = useState(false);
  const crateRef = useRef<HTMLDivElement>(null);

  // Le bac s'ouvre sous la grille : on le ramène dans la fenêtre si besoin.
  useEffect(() => {
    if (openIndex === null) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    crateRef.current?.scrollIntoView({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [openIndex]);

  const byId = new Map(shows.map((s) => [s.id, s]));
  const known = new Set(themes.flatMap((t) => t.ids));
  const groups = themes.map(({ ids, ...t }) => ({
    ...t,
    shows: ids.flatMap((id) => byId.get(id) ?? []),
  }));
  const others = shows.filter((s) => !known.has(s.id));
  if (others.length)
    groups.push({
      title: "Autres",
      hint: "Non classés",
      color: "#7686a0",
      shows: others,
    });

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
            index={i}
            selected={needle === "" && i === openIndex && !closing}
            onSelect={() => {
              onSelect();
              setClosing(false);
              // Re-clic sur la pile ouverte : le bac joue sa sortie avant de disparaître.
              if (openIndex === i && needle === "") setClosing(true);
              else setOpen(i);
            }}
          />
        ))}
        {/* Recherche : le bac montre les résultats de tous les thèmes. */}
        {needle !== ""
          ? found.length > 0 && (
              <div
                className="crate col-span-full"
                style={{ "--c": "#e6edf7" } as CSSProperties}
              >
                <ShowGroup title="Résultats" shows={found} {...common} />
              </div>
            )
          : current && (
              // Le bac s'insère juste sous la rangée de sa pile (2 colonnes en
              // mobile, 3 dès sm) : il s'ouvre là où on vient de cliquer.
              <div
                key={openIndex}
                ref={crateRef}
                className={cn(
                  "crate crate-slot col-span-full",
                  closing && "crate-out",
                )}
                style={
                  {
                    "--c": current.color,
                    "--row2": Math.floor((openIndex ?? 0) / 2) + 2,
                    "--row3": Math.floor((openIndex ?? 0) / 3) + 2,
                  } as CSSProperties
                }
                onAnimationEnd={(e) => {
                  if (closing && e.target === e.currentTarget) {
                    setOpen(null);
                    setClosing(false);
                  }
                }}
              >
                <ShowGroup
                  title={current.title}
                  hint={current.hint}
                  shows={current.shows}
                  {...common}
                />
              </div>
            )}
      </div>
    </section>
  );
};
