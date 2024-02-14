import type { ExpoConfig } from "expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "movie-web",
  slug: "mw-mobile",
  scheme: "dev.movieweb.app",
  version: "0.1.0",
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
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    permissions: ["WRITE_SETTINGS"],
  },
  web: {
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
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
  ],
});

export default defineConfig;
