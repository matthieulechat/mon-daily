import { create } from "zustand";
import { DEFAULT_SETTINGS } from "@shared/config/default-settings";
import { PODCAST_SHOWS } from "@shared/config/podcast-shows";
import type { UserSettings } from "@shared/types/index";
import { fetchSettings, saveSettings } from "./settings-api";

type Status = "idle" | "loading" | "saving" | "saved" | "error";

interface SettingsState {
  settings: UserSettings;
  saved: UserSettings;
  status: Status;
  error: string | null;
  load: (platformUserId: string) => Promise<void>;
  save: (platformUserId: string) => Promise<void>;
  patch: (partial: Partial<UserSettings>) => void;
  setShowsEnabled: (ids: string[], enabled: boolean) => void;
}

const OPT_IN_IDS = new Set(
  PODCAST_SHOWS.filter((s) => s.optIn).map((s) => s.id),
);

const sorted = (s: UserSettings): UserSettings => ({
  ...s,
  disabledShowIds: [...s.disabledShowIds].sort(),
  enabledShowIds: [...s.enabledShowIds].sort(),
});

const isDirty = (a: UserSettings, b: UserSettings): boolean =>
  JSON.stringify(sorted(a)) !== JSON.stringify(sorted(b));

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  saved: DEFAULT_SETTINGS,
  status: "idle",
  error: null,

  load: async (platformUserId) => {
    set({ status: "loading", error: null });
    try {
      const settings = await fetchSettings(platformUserId);
      set({ settings, saved: settings, status: "idle" });
    } catch (e) {
      set({
        status: "error",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  },

  save: async (platformUserId) => {
    set({ status: "saving", error: null });
    try {
      // Durée minimale : sinon l'état « Enregistrement… » clignote trop vite pour être lu.
      await Promise.all([
        saveSettings(platformUserId, get().settings),
        new Promise((resolve) => setTimeout(resolve, 900)),
      ]);
      set({ saved: get().settings, status: "saved" });
    } catch (e) {
      set({
        status: "error",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  },

  patch: (partial) =>
    set((s) => ({ settings: { ...s.settings, ...partial }, status: "idle" })),

  setShowsEnabled: (ids, enabled) =>
    set((s) => {
      // Un show `optIn` se suit par sa présence dans `enabledShowIds`, les
      // autres par leur absence de `disabledShowIds`.
      const disabled = new Set(s.settings.disabledShowIds);
      const optedIn = new Set(s.settings.enabledShowIds);
      ids.forEach((id) => {
        if (OPT_IN_IDS.has(id)) {
          if (enabled) optedIn.add(id);
          else optedIn.delete(id);
        } else if (enabled) disabled.delete(id);
        else disabled.add(id);
      });
      return {
        settings: {
          ...s.settings,
          disabledShowIds: [...disabled],
          enabledShowIds: [...optedIn],
        },
        status: "idle",
      };
    }),
}));

export const selectIsDirty = (s: SettingsState): boolean =>
  isDirty(s.settings, s.saved);
