import { useRef } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTheme, View } from "tamagui";

import { MovieWebSvg } from "~/components/Icon";
import SvgTabBarIcon from "~/components/SvgTabBarIcon";
import TabBarIcon from "~/components/TabBarIcon";
import SearchTabContext from "../../components/ui/SearchTabContext";

export default function TabLayout() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const focusSearchInputRef = useRef(() => {});

  const theme = useTheme();

  return (
    <SearchTabContext.Provider value={{ focusSearchInputRef }}>
      <Tabs
        sceneContainerStyle={{
          backgroundColor: theme.screenBackground.val,
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
          tabBarActiveTintColor: theme.tabBarIconFocused.val,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground.val,
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
                top={2}
                height={56}
                width={56}
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                borderRadius={100}
                backgroundColor={
                  focused ? theme.tabBarIconFocused : theme.tabBarIcon
                }
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
