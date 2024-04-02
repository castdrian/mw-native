import { useEffect } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { Tabs, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTheme, View } from "tamagui";

import { MovieWebSvg } from "~/components/Icon";
import SvgTabBarIcon from "~/components/SvgTabBarIcon";
import TabBarIcon from "~/components/TabBarIcon";

export default function TabLayout() {
  const theme = useTheme();

  const router = useRouter();

  useEffect(() => {
    const handleOpenURL = (event: Linking.EventType) => {
      const { hostname, queryParams } = Linking.parse(event.url);
      if (hostname === "media") {
        router.push({
          pathname: "/videoPlayer",
          params: { data: JSON.stringify(queryParams) },
        });
      }
    };

    Linking.addEventListener("url", handleOpenURL);
  }, [router]);

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: theme.screenBackground.val,
      }}
      screenListeners={() => ({
        tabPress: () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
  );
}
