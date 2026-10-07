import type { CSSProperties } from "react";
import { EPISODE_MAX_PRESETS } from "@shared/config/default-settings";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/settings.store";

const presetLabel = (minutes: number | null): string => {
  if (minutes === null) return "SANS";
  if (minutes < 60) return `${minutes} MIN`;
  const rest = minutes % 60;
  return `${Math.floor(minutes / 60)} H${rest ? ` ${rest}` : ""}`;
};

// Touches d'ampli à voyant. De vrais boutons radio masqués restent la base
// accessible : flèches du clavier, lecteurs d'écran.
export const EpisodePresets = () => {
  const maxEpisodeMinutes = useSettingsStore(
    (s) => s.settings.maxEpisodeMinutes,
  );
  const patch = useSettingsStore((s) => s.patch);

  return (
    <Card>
      <p
        id="episode-presets-label"
        className="mb-2.5 flex justify-between text-[9px] tracking-[0.2em] text-muted"
      >
        <span>DURÉE MAX D&apos;UN ÉPISODE</span>
        <span aria-hidden="true">PODCASTS</span>
      </p>
      <div
        role="radiogroup"
        aria-labelledby="episode-presets-label"
        className="grid grid-cols-3 gap-2 sm:grid-cols-6"
      >
        {EPISODE_MAX_PRESETS.map((minutes, i) => (
          <label
            key={String(minutes)}
            className="preset show-item"
            style={{ "--i": i } as CSSProperties}
          >
            <input
              type="radio"
              name="max-episode"
              className="sr-only"
              aria-label={
                minutes === null ? "Sans limite" : `${minutes} minutes`
              }
              checked={maxEpisodeMinutes === minutes}
              onChange={() => patch({ maxEpisodeMinutes: minutes })}
            />
            <span className="preset-led" aria-hidden="true" />
            <span aria-hidden="true">{presetLabel(minutes)}</span>
          </label>
        ))}
      </div>
    </Card>
  );
};
