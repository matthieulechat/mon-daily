import { Button } from "@/components/ui/button";
import { selectIsDirty, useSettingsStore } from "@/lib/settings.store";

// Bouton d'enregistrement : spinner pendant la sauvegarde, puis flash vert avec
// coche tracée, qui retombe tout seul à l'état « rien à enregistrer ».
export const SaveButton = ({ onSave }: { onSave: () => void }) => {
  const status = useSettingsStore((s) => s.status);
  const dirty = useSettingsStore(selectIsDirty);
  const saving = status === "saving";
  const saved = status === "saved";

  return (
    <Button
      className="save-btn min-w-44"
      data-saved={saved}
      disabled={saving || (!dirty && !saved)}
      onClick={() => dirty && onSave()}
    >
      {saving ? (
        <>
          <span className="spinner" aria-hidden="true" />
          Enregistrement…
        </>
      ) : (
        <span className="save-label">
          <span className="save-idle">Enregistrer</span>
          <span className="save-done" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" pathLength="1" />
            </svg>
            Enregistré
          </span>
        </span>
      )}
    </Button>
  );
};
