/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import Colors from "@movie-web/tailwind-config/colors";

import "../styles/global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger this, so it's safe to ignore */
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    OpenSansRegular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    OpenSansLight: require("../../assets/fonts/OpenSans-Light.ttf"),
    OpenSansMedium: require("../../assets/fonts/OpenSans-Medium.ttf"),
    OpenSansBold: require("../../assets/fonts/OpenSans-Bold.ttf"),
    OpenSansSemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    OpenSansExtra: require("../../assets/fonts/OpenSans-ExtraBold.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {
        /* reloading the app might trigger this, so it's safe to ignore */
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          autoHideHomeIndicator: true,
          gestureEnabled: true,
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, autoHideHomeIndicator: true }}
        />
      </Stack>
    </ThemeProvider>
  );
}
