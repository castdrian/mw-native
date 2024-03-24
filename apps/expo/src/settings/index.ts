import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DownloadItem } from "~/hooks/DownloadManagerContext";
import type { ThemeStoreOption } from "~/stores/theme";

interface ThemeSettings {
  theme: ThemeStoreOption;
}

interface PlayerSettings {
  gestureControls: boolean;
}

interface Settings {
  themes?: ThemeSettings;
  player?: PlayerSettings;
}

const settingsKey = "settings";

const saveSettings = async (newSettings: Partial<Settings>) => {
  const settings = await loadSettings();
  const mergedSettings = { ...settings, ...newSettings };
  await AsyncStorage.setItem(settingsKey, JSON.stringify(mergedSettings));
};

const loadSettings = async (): Promise<Settings | null> => {
  const json = await AsyncStorage.getItem(settingsKey);
  return json ? (JSON.parse(json) as Settings) : null;
};

export const getTheme = async (): Promise<ThemeStoreOption> => {
  const settings = await loadSettings();
  return settings?.themes?.theme ?? "main";
};

export const saveTheme = async (newTheme: ThemeStoreOption) => {
  const existingSettings = await loadSettings();
  const settings: Settings = existingSettings?.themes?.theme
    ? {
        themes: { theme: newTheme },
      }
    : { themes: { theme: "main" } };
  await saveSettings(settings);
};

interface DownloadHistory {
  downloads: DownloadItem[];
}

const downloadHistoryKey = "downloadHistory";

export const saveDownloadHistory = async (downloads: DownloadItem[]) => {
  const json = await AsyncStorage.getItem(downloadHistoryKey);
  const settings = json
    ? (JSON.parse(json) as DownloadHistory)
    : { downloads: [] };
  settings.downloads = downloads;
  await AsyncStorage.setItem(downloadHistoryKey, JSON.stringify(settings));
};

export const loadDownloadHistory = async (): Promise<DownloadItem[]> => {
  const json = await AsyncStorage.getItem(downloadHistoryKey);
  const settings = json
    ? (JSON.parse(json) as DownloadHistory)
    : { downloads: [] };
  return settings.downloads;
};

export const getGestureControls = async (): Promise<boolean> => {
  const settings = await loadSettings();
  return settings?.player?.gestureControls ?? true;
};

export const saveGestureControls = async (gestureControls: boolean) => {
  const settings = (await loadSettings()) ?? {};

  if (!settings.player) {
    settings.player = { gestureControls: true };
  }

  settings.player.gestureControls = gestureControls;
  await saveSettings(settings);
};
