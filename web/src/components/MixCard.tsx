import { SETTINGS_LIMITS } from "@shared/config/default-settings";
import { Card } from "@/components/ui/card";
import { selectIsDirty, useSettingsStore } from "@/lib/settings.store";
import { Knob } from "./Knob";
import { Waveform } from "./Waveform";

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} H ${String(m).padStart(2, "0")}`;
};

const STATUS_LABEL = {
  idle: "READY",
  loading: "LOADING",
  saving: "SAVING",
  saved: "SAVED",
  error: "ERROR",
} as const;

export const MixCard = () => {
  const maxDurationMinutes = useSettingsStore(
    (s) => s.settings.maxDurationMinutes,
  );
  const maxEpisodeMinutes = useSettingsStore(
    (s) => s.settings.maxEpisodeMinutes,
  );
  const status = useSettingsStore((s) => s.status);
  const dirty = useSettingsStore(selectIsDirty);
  const patch = useSettingsStore((s) => s.patch);

  return (
    <Card className="flex items-center gap-5">
      <div className="amp-display min-w-0 flex-1">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <div>
            <p className="text-[9px] tracking-[0.2em] opacity-70">
              DURÉE MAXIMALE
            </p>
            <p
              className="font-mono text-4xl leading-tight font-bold tracking-wider whitespace-nowrap"
              aria-live="polite"
            >
              <span key={maxDurationMinutes} className="tick">
                {formatDuration(maxDurationMinutes)}
              </span>
            </p>
          </div>
          <div className="sm:border-l sm:border-current/25 sm:pl-4">
            <p className="text-[9px] tracking-[0.2em] opacity-70">
              ÉPISODE MAX
            </p>
            <p
              className="font-mono text-2xl leading-tight font-bold tracking-wider whitespace-nowrap"
              aria-live="polite"
            >
              <span key={String(maxEpisodeMinutes)} className="tick">
                {maxEpisodeMinutes === null
                  ? "SANS"
                  : formatDuration(maxEpisodeMinutes)}
              </span>
            </p>
          </div>
        </div>
        <Waveform className="mt-2 mb-1 h-4" />
        <p className="flex justify-between text-[10px] tracking-[0.2em] opacity-85">
          <span>
            {dirty && status === "idle" ? "EDIT" : STATUS_LABEL[status]}
          </span>
          <span>DAILY</span>
        </p>
      </div>
      <Knob
        id="duration"
        label="DURÉE"
        {...SETTINGS_LIMITS.maxDurationMinutes}
        value={maxDurationMinutes}
        onValueChange={(v) => patch({ maxDurationMinutes: v })}
      />
    </Card>
  );
};
