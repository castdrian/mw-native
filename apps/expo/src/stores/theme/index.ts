import { setAppIcon } from "expo-dynamic-app-icon";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { getTheme, saveTheme } from "~/settings";

export type ThemeStoreOption = "main" | "blue" | "gray" | "red" | "teal";

export interface ThemeStore {
  theme: ThemeStoreOption;
  setTheme(v: ThemeStoreOption): void;
}

export const useThemeStore = create(
  immer<ThemeStore>((set) => {
    void getTheme().then((savedTheme) => {
      set((s) => {
        s.theme = savedTheme;
      });
    });

    return {
      theme: "main",
      setTheme: (newTheme) => {
        saveTheme(newTheme)
          .then(() => {
            set((s) => {
              s.theme = newTheme;
              setAppIcon(newTheme);
            });
          })
          .catch((error) => {
            console.error("Failed to save theme:", error);
          });
      },
    };
  }),
);
