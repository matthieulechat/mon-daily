import { useMemo, useState } from "react";
import { PODCAST_SHOWS, isShowEnabled } from "@shared/config/podcast-shows";
import { ThemeSection, normalize } from "@/components/ThemeSection";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/settings.store";
import { ACTU_THEMES, SHOW_THEMES } from "@/lib/show-themes";

// Un flux mixte (actuTitleIncludes / alsoThematic) apparaît dans les deux
// sections : même id, donc même case activée des deux côtés.
const ACTU_SHOWS = PODCAST_SHOWS.filter(
  (s) => s.category === "actu" || s.actuTitleIncludes,
);
const THEMATIC_SHOWS = PODCAST_SHOWS.filter(
  (s) => s.category === "thematique" || s.alsoThematic,
);

export const ShowsPicker = () => {
  const settings = useSettingsStore((s) => s.settings);
  const setShowsEnabled = useSettingsStore((s) => s.setShowsEnabled);
  const [query, setQuery] = useState("");

  // Inactifs effectifs : désactivés à la main + `optIn` jamais activés.
  const disabledSet = useMemo(
    () =>
      new Set(
        PODCAST_SHOWS.filter((s) => !isShowEnabled(s, settings)).map(
          (s) => s.id,
        ),
      ),
    [settings],
  );
  const common = {
    needle: normalize(query),
    disabledSet,
    setShowsEnabled,
    onSelect: () => setQuery(""),
  };
  const activeCount = PODCAST_SHOWS.length - disabledSet.size;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Sources</span>
          <Badge>
            <span key={activeCount} className="tick">
              {activeCount}/{PODCAST_SHOWS.length}
            </span>{" "}
            actives
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

      <ThemeSection
        label="Actu du jour"
        hint="Journaux et flashs"
        themes={ACTU_THEMES}
        shows={ACTU_SHOWS}
        {...common}
      />
      <ThemeSection
        label="Thématiques"
        hint="Analyses, culture, sport"
        themes={SHOW_THEMES}
        shows={THEMATIC_SHOWS}
        {...common}
      />
    </Card>
  );
};
