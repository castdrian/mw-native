import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ThemeStoreOption = "main" | "blue" | "gray" | "red" | "teal";

export interface ThemeStore {
  theme: ThemeStoreOption;
  setTheme(v: ThemeStoreOption): void;
}

export const useThemeStore = create(
  immer<ThemeStore>((set) => ({
    theme: "main",
    setTheme(v) {
      set((s) => {
        s.theme = v;
      });
    },
  })),
);
