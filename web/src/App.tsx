import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LoginScreen } from "@/components/LoginScreen";
import { SettingsPage } from "@/components/SettingsPage";
import { supabase } from "@/lib/supabase";

export const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="groove-bg" aria-hidden="true" />
      {!ready ? null : session ? (
        <SettingsPage session={session} />
      ) : (
        <LoginScreen />
      )}
    </>
  );
};
