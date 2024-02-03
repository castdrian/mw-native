import type { Config } from "tailwindcss";

import colors from "./colors";

export default {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
    },
  },
} satisfies Config;
