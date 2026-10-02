import { SETTINGS_LIMITS } from "@shared/config/default-settings";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSettingsStore } from "@/lib/settings.store";

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
};

export const MixCard = () => {
  const maxDurationMinutes = useSettingsStore(
    (s) => s.settings.maxDurationMinutes,
  );
  const patch = useSettingsStore((s) => s.patch);

  return (
    <Card>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor="duration" className="text-sm font-semibold">
          Durée maximale
        </label>
        <span className="font-mono text-sm text-accent" aria-live="polite">
          {formatDuration(maxDurationMinutes)}
        </span>
      </div>
      <Slider
        id="duration"
        {...SETTINGS_LIMITS.maxDurationMinutes}
        value={maxDurationMinutes}
        onValueChange={(v) => patch({ maxDurationMinutes: v })}
      />
      <p className="mt-3 text-xs text-muted">
        La playlist suit son gabarit habituel (actu, musique, thématique…) et
        s&apos;arrête dès que cette durée est atteinte.
      </p>
    </Card>
  );
};
