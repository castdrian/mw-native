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
  plugins: ["expo-router", [
	"expo-screen-orientation",
	{
	  initialOrientation: "DEFAULT"
	}
  ]
],
});

export default defineConfig;
