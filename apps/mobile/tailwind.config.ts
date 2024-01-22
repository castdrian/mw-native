import type { Config } from 'tailwindcss';

import colors from './constants/Colors';

export default {
  content: [],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
} satisfies Config;
