// @ts-expect-error - no types
import nativewind from 'nativewind/preset';
import type { Config } from 'tailwindcss';
import colors from './app/constants/Colors';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [
    nativewind,
    {
      theme: {
        extend: {
          colors,
          fontFamily: {
            sans: ['OpenSansRegular'],
            thin: ['OpenSansLight'],
            normal: ['OpenSansRegular'],
            medium: ['OpenSansMedium'],
            semibold: ['OpenSansSemiBold'],
            bold: ['OpenSansBold'],
            extrabold: ['OpenSansExtra'],
          },
        },
      },
    },
  ],
} satisfies Config;
