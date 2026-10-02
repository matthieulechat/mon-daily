import { create } from "zustand";
import { DEFAULT_SETTINGS } from "@shared/config/default-settings";
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

const isDirty = (a: UserSettings, b: UserSettings): boolean =>
  JSON.stringify({ ...a, disabledShowIds: [...a.disabledShowIds].sort() }) !==
  JSON.stringify({ ...b, disabledShowIds: [...b.disabledShowIds].sort() });

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
      set({ status: "error", error: e instanceof Error ? e.message : String(e) });
    }
  },

  save: async (platformUserId) => {
    set({ status: "saving", error: null });
    try {
      await saveSettings(platformUserId, get().settings);
      set({ saved: get().settings, status: "saved" });
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : String(e) });
    }
  },

  patch: (partial) =>
    set((s) => ({ settings: { ...s.settings, ...partial }, status: "idle" })),

  setShowsEnabled: (ids, enabled) =>
    set((s) => {
      const disabled = new Set(s.settings.disabledShowIds);
      ids.forEach((id) => (enabled ? disabled.delete(id) : disabled.add(id)));
      return {
        settings: { ...s.settings, disabledShowIds: [...disabled] },
        status: "idle",
      };
    }),
}));

export const selectIsDirty = (s: SettingsState): boolean =>
  isDirty(s.settings, s.saved);
