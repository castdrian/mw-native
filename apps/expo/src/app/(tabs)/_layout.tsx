import { useRef } from "react";
import { Platform, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

import { MovieWebSvg } from "~/components/Icon";
import SvgTabBarIcon from "~/components/SvgTabBarIcon";
import TabBarIcon from "~/components/TabBarIcon";
import { cn } from "~/lib/utils";
import SearchTabContext from "../../components/ui/SearchTabContext";

export default function TabLayout() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const focusSearchInputRef = useRef(() => {});

  return (
    <SearchTabContext.Provider value={{ focusSearchInputRef }}>
      <Tabs
        sceneContainerStyle={{
          backgroundColor: defaultTheme.extend.colors.background.main,
        }}
        screenListeners={({ route }) => ({
          tabPress: () => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            switch (route.name) {
              case "search":
                focusSearchInputRef.current();
                break;
            }
          },
          focus: () => {
            void ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT_UP,
            );
          },
        })}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: defaultTheme.extend.colors.tabBar.active,
          tabBarStyle: {
            backgroundColor: defaultTheme.extend.colors.tabBar.background,
            borderTopColor: "transparent",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingBottom: Platform.select({ ios: 100 }),
            height: 80,
          },
          tabBarItemStyle: {
            paddingVertical: 18,
            height: 82,
          },
          tabBarLabelStyle: [
            {
              marginTop: 2,
            },
          ],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="downloads"
          options={{
            title: "Downloads",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="download" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Home",
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <View
                className={cn(
                  `top-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-center align-middle text-2xl text-white ${focused ? "bg-tabBar-active" : "bg-tabBar-inactive"}`,
                  {
                    "bg-tabBar-active": focused,
                    "bg-tabBar-inactive": !focused,
                  },
                )}
              >
                <TabBarIcon name="search" color="#FFF" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="movie-web"
          options={{
            title: "movie-web",
            tabBarIcon: ({ focused }) => (
              <SvgTabBarIcon focused={focused}>
                <MovieWebSvg />
              </SvgTabBarIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="cog" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </SearchTabContext.Provider>
  );
}
