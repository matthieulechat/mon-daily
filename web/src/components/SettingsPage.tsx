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

// La génération tourne à 7h Europe/Paris toute l'année (cf. docs/AUTOMATION.md).
// ponytail: suppose un navigateur à l'heure de Paris ; passer par
// Intl.DateTimeFormat({ timeZone: "Europe/Paris" }) si l'app sort de France.
const nextRunLabel = (): string =>
  `${new Date().getHours() < 7 ? "aujourd'hui" : "demain"} à 7h`;

export const SettingsPage =({ session }: { session: Session }) => {
  const spotifyId = spotifyIdOf(session);
  const { status, error, load, save } = useSettingsStore();
  const dirty = useSettingsStore(selectIsDirty);
  // Renseignés par Supabase à partir du profil Spotify lors de l'OAuth.
  const { name, avatar_url: avatarUrl } = session.user.user_metadata as {
    name?: string;
    avatar_url?: string;
  };
  const displayName = name ?? spotifyId;

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
          <div className="user-chip flex min-w-0 items-center gap-2 text-xs">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="size-9 shrink-0 rounded-full bg-foreground/10 object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
              >
                {displayName?.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="flex min-w-0 flex-col items-start">
              <span className="max-w-32 truncate font-semibold text-foreground">
                {displayName}
              </span>
              <button
                type="button"
                onClick={() => void supabase.auth.signOut()}
                className="text-muted hover:text-foreground"
              >
                Se déconnecter
              </button>
            </div>
          </div>
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
              Appliqué à la prochaine génération, {nextRunLabel()}
            </div>
            <SaveButton onSave={() => void save(spotifyId)} />
          </div>
        </footer>
      </Card>
    </main>
  );
};
