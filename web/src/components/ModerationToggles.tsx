import type { CSSProperties } from "react";
import {
  MODERATION_TOPICS,
  MODERATION_TOPIC_IDS,
  type ModerationTopic,
} from "@shared/config/moderation";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/settings.store";

// Mêmes touches à voyant que la durée max, en cases à cocher : chaque sujet
// s'active indépendamment.
export const ModerationToggles = () => {
  const moderatedTopics = useSettingsStore((s) => s.settings.moderatedTopics);
  const patch = useSettingsStore((s) => s.patch);

  const toggle = (topic: ModerationTopic, on: boolean) =>
    patch({
      moderatedTopics: on
        ? [...moderatedTopics, topic]
        : moderatedTopics.filter((t) => t !== topic),
    });

  return (
    <Card>
      <fieldset aria-describedby="moderation-hint">
        <legend className="mb-2.5 flex w-full justify-between text-[9px] tracking-[0.2em] text-muted">
          <span>ÉCARTER LES SUJETS</span>
          <span aria-hidden="true">THÉMATIQUES</span>
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {MODERATION_TOPIC_IDS.map((topic, i) => (
            <label
              key={topic}
              className="preset show-item"
              style={{ "--i": i } as CSSProperties}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={moderatedTopics.includes(topic)}
                onChange={(e) => toggle(topic, e.target.checked)}
              />
              <span className="preset-led" aria-hidden="true" />
              <span>{MODERATION_TOPICS[topic].label.toUpperCase()}</span>
            </label>
          ))}
        </div>
        <p id="moderation-hint" className="mt-2.5 text-xs text-muted">
          Sur le titre des épisodes uniquement, l&apos;actu n&apos;est pas
          filtrée.
        </p>
      </fieldset>
    </Card>
  );
};
