import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { selectIsDirty, useSettingsStore } from "@/lib/settings.store";
import { spotifyIdOf } from "@/lib/settings-api";
import { Brand } from "./Brand";
import { MixCard } from "./MixCard";
import { SaveButton } from "./SaveButton";
import { ShowsPicker } from "./ShowsPicker";

export const SettingsPage = ({ session }: { session: Session }) => {
  const spotifyId = spotifyIdOf(session);
  const { status, error, load, save } = useSettingsStore();
  const dirty = useSettingsStore(selectIsDirty);

  useEffect(() => {
    if (spotifyId) void load(spotifyId);
  }, [spotifyId, load]);

  if (!spotifyId) {
    return (
      <p className="relative z-10 p-8 text-sm text-muted">
        Impossible de lire l&apos;identifiant Spotify de ce compte.
      </p>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-8">
      <Card tone="amp">
        <header className="mb-5 flex items-center justify-between">
          <Brand />
          <nav className="flex items-center gap-4 text-xs text-muted">
            <span className="border-b-2 border-primary pb-1 font-semibold text-foreground">
              Réglages
            </span>
            <button
              type="button"
              onClick={() => void supabase.auth.signOut()}
              className="hover:text-foreground"
            >
              Se déconnecter
            </button>
          </nav>
        </header>
        <div className="enter space-y-4">
          <MixCard />
          <ShowsPicker />
        </div>

        <footer className="mt-5 flex items-center justify-between gap-3">
          <p aria-live="polite" className="text-xs text-muted">
            {status === "loading" && "Chargement…"}
            {/* La confirmation visuelle est dans le bouton ; ici, pour les lecteurs d'écran. */}
            {status === "saved" && <span className="sr-only">Enregistré</span>}
            {status === "error" && (
              <span className="text-accent">Erreur : {error}</span>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span
                key={status === "saved" ? "saved" : "idle"}
                className={cn(
                  "led",
                  dirty && "led-dirty",
                  status === "saved" && "led-pulse",
                )}
                aria-hidden="true"
              />
              Appliqué à la prochaine génération quotidienne
            </div>
            <SaveButton onSave={() => void save(spotifyId)} />
          </div>
        </footer>
      </Card>
    </main>
  );
};
