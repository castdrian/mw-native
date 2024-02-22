import { useRef } from "react";
import { Platform, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";

import Colors from "@movie-web/tailwind-config/colors";

import { MovieWebSvg } from "~/components/Icon";
import SvgTabBarIcon from "~/components/SvgTabBarIcon";
import TabBarIcon from "~/components/TabBarIcon";
import SearchTabContext from "./search/SearchTabContext";

export default function TabLayout() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const focusSearchInputRef = useRef(() => {});

  return (
    <SearchTabContext.Provider value={{ focusSearchInputRef }}>
      <Tabs
        sceneContainerStyle={{
          backgroundColor: Colors.background,
        }}
        screenListeners={({ route }) => ({
          tabPress: () => {
            void Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            );
            switch (route.name) {
              case "search":
                focusSearchInputRef.current();
                break;
            }
          },
        })}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary[100],
          tabBarStyle: {
            backgroundColor: Colors.secondary[700],
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
            title: "Search",
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <View
                className={`android:top-2 ios:top-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ${focused ? "bg-primary-300" : "bg-primary-400"} text-center align-middle text-2xl text-white`}
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
