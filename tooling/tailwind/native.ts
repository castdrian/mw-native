import type { Config } from "tailwindcss";

import base from "./base";
import colors from "./colors";

export default {
  content: base.content,
  presets: [base],
  theme: {
    extend: {
      colors,
    },
  },
} satisfies Config;
