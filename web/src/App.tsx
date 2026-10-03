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
      <svg
        className="tonearm"
        viewBox="0 0 300 420"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="tonearm-arm">
          {/* contrepoids */}
          <line
            x1="276"
            y1="370"
            x2="292"
            y2="408"
            stroke="#7686a0"
            strokeWidth="9"
          />
          {/* tube puis tête de lecture */}
          <path
            d="M276 370 L162 214 L134 180"
            stroke="#c4cfe0"
            strokeWidth="4"
          />
          <path d="M134 180 L121 168" stroke="#ffd23f" strokeWidth="8" />
        </g>
        {/* pivot */}
        <circle
          cx="276"
          cy="370"
          r="17"
          fill="#0e1826"
          stroke="#7686a0"
          strokeWidth="3"
        />
        <circle cx="276" cy="370" r="5" fill="#ffd23f" />
      </svg>
      {!ready ? null : session ? (
        <SettingsPage session={session} />
      ) : (
        <LoginScreen />
      )}
    </>
  );
};
