import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { selectIsDirty, useSettingsStore } from "@/lib/settings.store";
import { spotifyIdOf } from "@/lib/settings-api";
import { Brand } from "./Brand";
import { MixCard } from "./MixCard";
import { ShowsPicker } from "./ShowsPicker";
import { Waveform } from "./Waveform";

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
      <Card tone="panel">
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
        <Waveform />

        <div className="mb-4 flex items-center gap-2 text-xs text-muted">
          <span className="live-dot" aria-hidden="true" />
          Appliqué à la prochaine génération quotidienne
          <Badge tone="accent">Daily</Badge>
        </div>

        <div className="space-y-4">
          <MixCard />
          <ShowsPicker />
        </div>

        <footer className="mt-5 flex items-center justify-between gap-3">
          <p aria-live="polite" className="text-xs text-muted">
            {status === "loading" && "Chargement…"}
            {status === "saving" && "Enregistrement…"}
            {status === "saved" && (
              <span className="text-highlight">Enregistré ✓</span>
            )}
            {status === "error" && (
              <span className="text-accent">Erreur : {error}</span>
            )}
          </p>
          <Button
            disabled={!dirty || status === "saving"}
            onClick={() => void save(spotifyId)}
          >
            Enregistrer
          </Button>
        </footer>
      </Card>
    </main>
  );
};
