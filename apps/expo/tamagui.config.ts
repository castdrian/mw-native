import { createAnimations } from "@tamagui/animations-moti";
import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

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

  searchIcon: tokens.shade.c100,
  searchBackground: tokens.shade.c600,
  searchHoverBackground: tokens.shade.c600,
  searchFocused: tokens.shade.c400,
  searchPlaceholder: tokens.shade.c100,

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

  buttonSecondaryBackground: tokens.ash.c700,
  buttonSecondaryText: tokens.semantic.silver.c300,
  buttonSecondaryBackgroundHover: tokens.ash.c700,
  buttonPrimaryBackground: tokens.white,
  buttonPrimaryText: tokens.black,
  buttonPrimaryBackgroundHover: tokens.semantic.silver.c100,
  buttonPurpleBackground: tokens.purple.c500,
  buttonPurpleBackgroundHover: tokens.purple.c400,
  buttonCancelBackground: tokens.ash.c500,
  buttonCancelBackgroundHover: tokens.ash.c300,
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
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}
