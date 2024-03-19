import type { ExpoConfig } from "expo/config";

import { version } from "./package.json";

const defineConfig = (): ExpoConfig => ({
  name: "movie-web",
  slug: "mw-mobile",
  scheme: "movieweb",
  version,
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "dev.movieweb.app",
    supportsTablet: true,
    requireFullScreen: true,
  },
  android: {
    package: "dev.movieweb.app",
    permissions: ["WRITE_SETTINGS"],
  },
  web: {
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    [
      "expo-screen-orientation",
      {
        initialOrientation: "PORTRAIT_UP",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          packagingOptions: {
            pickFirst: [
              "lib/x86/libcrypto.so",
              "lib/x86_64/libcrypto.so",
              "lib/armeabi-v7a/libcrypto.so",
              "lib/arm64-v8a/libcrypto.so",
            ],
          },
        },
      },
    ],
    [
      "@config-plugins/react-native-dynamic-app-icon",
      {
        main: {
          image: "./assets/images/main.png",
          prerendered: true,
        },
        blue: {
          image: "./assets/images/blue.png",
          prerendered: true,
        },
        gray: {
          image: "./assets/images/gray.png",
          prerendered: true,
        },
        red: {
          image: "./assets/images/red.png",
          prerendered: true,
        },
        teal: {
          image: "./assets/images/teal.png",
          prerendered: true,
        },
      },
    ],
  ],
});

export default defineConfig;
