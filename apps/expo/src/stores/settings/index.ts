import type { StateStorage } from "zustand/middleware";
import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { DownloadItem } from "~/hooks/DownloadManagerContext";
import type { ThemeStoreOption } from "~/stores/theme";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

interface ThemeStoreState {
  theme: ThemeStoreOption;
  setTheme: (theme: ThemeStoreOption) => void;
}

export const useThemeSettingsStore = create<
  ThemeStoreState,
  [["zustand/persist", ThemeStoreState]]
>(
  persist(
    (set) => ({
      theme: "main",
      setTheme: (theme: ThemeStoreOption) => set({ theme }),
    }),
    {
      name: "theme-settings",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

interface PlayerStoreState {
  gestureControls: boolean;
  setGestureControls: (enabled: boolean) => void;
}

export const usePlayerSettingsStore = create<
  PlayerStoreState,
  [["zustand/persist", PlayerStoreState]]
>(
  persist(
    (set) => ({
      gestureControls: Platform.select({
        ios: true,
        android: false,
        default: true,
      }),
      setGestureControls: (enabled: boolean) =>
        set({ gestureControls: enabled }),
    }),
    {
      name: "player-settings",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

interface DownloadHistoryStoreState {
  downloads: DownloadItem[];
  setDownloads: (downloads: DownloadItem[]) => void;
}

export const useDownloadHistoryStore = create<
  DownloadHistoryStoreState,
  [["zustand/persist", DownloadHistoryStoreState]]
>(
  persist(
    (set) => ({
      downloads: [],
      setDownloads: (downloads: DownloadItem[]) => set({ downloads }),
    }),
    {
      name: "download-history",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
