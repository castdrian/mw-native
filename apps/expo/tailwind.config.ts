import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@movie-web/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [
    baseConfig,
    nativewind,
    {
      theme: {
        extend: {
          fontFamily: {
            sans: ["OpenSansRegular"],
            thin: ["OpenSansLight"],
            normal: ["OpenSansRegular"],
            medium: ["OpenSansMedium"],
            semibold: ["OpenSansSemiBold"],
            bold: ["OpenSansBold"],
            extrabold: ["OpenSansExtra"],
          },
        },
      },
    },
  ],
} satisfies Config;
