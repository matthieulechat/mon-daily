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
  const status = useSettingsStore((s) => s.status);
  const dirty = useSettingsStore(selectIsDirty);
  const patch = useSettingsStore((s) => s.patch);

  return (
    <Card className="flex items-center gap-5">
      <div className="amp-display min-w-0 flex-1">
        <p className="text-[9px] tracking-[0.2em] opacity-70">DURÉE MAXIMALE</p>
        <p
          className="font-mono text-4xl leading-tight font-bold tracking-wider"
          aria-live="polite"
        >
          <span key={maxDurationMinutes} className="tick">
            {formatDuration(maxDurationMinutes)}
          </span>
        </p>
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
