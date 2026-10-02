import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Brand } from "./Brand";

export const LoginScreen = () => (
  <main className="relative z-10 mx-auto flex min-h-screen max-w-md items-center px-4">
    <Card tone="panel" className="w-full space-y-5 text-center">
      <div className="flex justify-center">
        <Brand />
      </div>
      <p className="text-sm text-muted">
        Connecte-toi avec le compte Spotify de ta playlist pour régler ton
        Daily.
      </p>
      <Button
        onClick={() =>
          void supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
              redirectTo: window.location.origin,
              // Force Spotify à réafficher l'écran d'autorisation : sans ça,
              // la session Spotify du navigateur reconnecte le même compte.
              queryParams: { show_dialog: "true" },
            },
          })
        }
      >
        Se connecter avec Spotify
      </Button>
    </Card>
  </main>
);
