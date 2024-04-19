import { createAnimations } from "@tamagui/animations-moti";
import { config } from "@tamagui/config/v3";
import { createFont, createTamagui } from "tamagui";

import {
  blueTokens,
  grayTokens,
  mainTokens,
  redTokens,
  tealTokens,
} from "@movie-web/colors";

type Tokens =
  | typeof mainTokens
  | typeof blueTokens
  | typeof grayTokens
  | typeof redTokens
  | typeof tealTokens;

const createThemeConfig = (tokens: Tokens) => ({
  screenBackground: tokens.shade.c900,

  tabBarBackground: tokens.shade.c700,
  tabBarIcon: tokens.shade.c300,
  tabBarIconFocused: tokens.purple.c200,

  scrapingCard: tokens.shade.c700,
  scrapingLoading: tokens.purple.c200,
  scrapingNoResult: tokens.ash.c100,
  scrapingError: tokens.semantic.red.c200,
  scrapingSuccess: tokens.semantic.green.c200,

  playerSettingsBackground: tokens.ash.c900,
  playerSettingsUnactiveText: tokens.semantic.silver.c400,
  playerSettingsActiveText: tokens.shade.c100,

  subtitleSelectorBackground: tokens.ash.c500,

  pillBackground: tokens.shade.c300,
  pillHighlight: tokens.blue.c200,
  pillActiveBackground: tokens.shade.c300,

  sheetBackground: tokens.shade.c800,
  sheetItemBackground: tokens.shade.c600,
  sheetIcon: tokens.shade.c300,
  sheetText: tokens.shade.c100,
  sheetHandle: tokens.shade.c300,
  sheetItemSelected: tokens.purple.c200,

  videoSlider: tokens.ash.c50,
  videoSliderFilled: tokens.purple.c200,

  progressBackground: tokens.shade.c600,
  progressFilled: tokens.purple.c200,

  separatorBackground: tokens.ash.c600,

  loadingIndicator: tokens.purple.c200,

  switchActiveTrackColor: tokens.purple.c300,
  switchInactiveTrackColor: tokens.ash.c500,
  switchThumbColor: tokens.white,

  searchIcon: tokens.shade.c100,
  searchBackground: tokens.shade.c600,
  searchHoverBackground: tokens.shade.c600,
  searchFocused: tokens.shade.c400,
  searchPlaceholder: tokens.shade.c100,

  inputBackground: tokens.shade.c600,
  inputBorder: tokens.shade.c600,
  inputPlaceholderText: tokens.shade.c300,
  inputText: tokens.white,
  inputIconColor: tokens.shade.c50,

  red100: tokens.semantic.red.c100,
  red200: tokens.semantic.red.c200,
  red300: tokens.semantic.red.c300,
  red400: tokens.semantic.red.c400,

  green100: tokens.semantic.green.c100,
  green200: tokens.semantic.green.c200,
  green300: tokens.semantic.green.c300,
  green400: tokens.semantic.green.c400,

  silver100: tokens.semantic.silver.c100,
  silver200: tokens.semantic.silver.c200,
  silver300: tokens.semantic.silver.c300,
  silver400: tokens.semantic.silver.c400,

  yellow100: tokens.semantic.yellow.c100,
  yellow200: tokens.semantic.yellow.c200,
  yellow300: tokens.semantic.yellow.c300,
  yellow400: tokens.semantic.yellow.c400,

  rose100: tokens.semantic.rose.c100,
  rose200: tokens.semantic.rose.c200,
  rose300: tokens.semantic.rose.c300,
  rose400: tokens.semantic.rose.c400,

  blue50: tokens.blue.c50,
  blue100: tokens.blue.c100,
  blue200: tokens.blue.c200,
  blue300: tokens.blue.c300,
  blue400: tokens.blue.c400,
  blue500: tokens.blue.c500,
  blue600: tokens.blue.c600,
  blue700: tokens.blue.c700,
  blue800: tokens.blue.c800,
  blue900: tokens.blue.c900,

  purple50: tokens.purple.c50,
  purple100: tokens.purple.c100,
  purple200: tokens.purple.c200,
  purple300: tokens.purple.c300,
  purple400: tokens.purple.c400,
  purple500: tokens.purple.c500,
  purple600: tokens.purple.c600,
  purple700: tokens.purple.c700,
  purple800: tokens.purple.c800,
  purple900: tokens.purple.c900,

  ash50: tokens.ash.c50,
  ash100: tokens.ash.c100,
  ash200: tokens.ash.c200,
  ash300: tokens.ash.c300,
  ash400: tokens.ash.c400,
  ash500: tokens.ash.c500,
  ash600: tokens.ash.c600,
  ash700: tokens.ash.c700,
  ash800: tokens.ash.c800,
  ash900: tokens.ash.c900,

  shade50: tokens.shade.c50,
  shade100: tokens.shade.c100,
  shade200: tokens.shade.c200,
  shade300: tokens.shade.c300,
  shade400: tokens.shade.c400,
  shade500: tokens.shade.c500,
  shade600: tokens.shade.c600,
  shade700: tokens.shade.c700,
  shade800: tokens.shade.c800,
  shade900: tokens.shade.c900,
});

const openSansFace = {
  normal: { normal: "OpenSansRegular", italic: "OpenSansItalic" },
  bold: { normal: "OpenSansBold", italic: "OpenSansBoldItalic" },
  300: { normal: "OpenSansLight", italic: "OpenSansLightItalic" },
  500: { normal: "OpenSansRegular", italic: "OpenSansItalic" },
  600: { normal: "OpenSansSemiBold", italic: "OpenSansSemiBoldItalic" },
  700: { normal: "OpenSansBold", italic: "OpenSansBoldItalic" },
  800: { normal: "OpenSansExtraBold", italic: "OpenSansExtraBoldItalic" },
};

const headingFont = createFont({
  size: config.fonts.heading.size,
  lineHeight: config.fonts.heading.lineHeight,
  weight: {
    light: 300,
    normal: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  letterSpacing: config.fonts.heading.letterSpacing,
  face: openSansFace,
});

const bodyFont = createFont({
  size: config.fonts.body.size,
  lineHeight: config.fonts.body.lineHeight,
  weight: {
    light: 300,
    normal: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  letterSpacing: config.fonts.body.letterSpacing,
  face: openSansFace,
});

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: config.tokens,
  themes: {
    main: {
      ...config.themes.dark,
      ...createThemeConfig(mainTokens),
    },
    blue: {
      ...config.themes.dark,
      ...createThemeConfig(blueTokens),
    },
    gray: {
      ...config.themes.dark,
      ...createThemeConfig(grayTokens),
    },
    red: {
      ...config.themes.dark,
      ...createThemeConfig(redTokens),
    },
    teal: {
      ...config.themes.dark,
      ...createThemeConfig(tealTokens),
    },
  },
  animations: createAnimations({
    fast: {
      type: "spring",
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    bounce: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
    quicker: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
    static: {
      type: "decay",
      deceleration: 0.999,
    },
    lazy: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  }),
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}
