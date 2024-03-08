import type { Config } from "tailwindcss";
import themer from "tailwindcss-themer";

import { allThemes, defaultTheme, safeThemeList } from "./themes";

export default {
  content: ["src/**/*.{ts,tsx}"],
  safelist: safeThemeList,
  plugins: [
    themer({
      defaultTheme,
      themes: [
        {
          name: "default",
          selectors: [".theme-default"],
          ...defaultTheme,
        },
        ...allThemes,
      ],
    }),
  ],
} satisfies Config;
