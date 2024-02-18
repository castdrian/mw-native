import { Platform, View } from "react-native";
import { Tabs } from "expo-router";

import Colors from "@movie-web/tailwind-config/colors";

import TabBarIcon from "~/components/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: Colors.background,
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[100],
        tabBarStyle: {
          backgroundColor: Colors.secondary[700],
          borderTopColor: "transparent",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingBottom: Platform.select({ ios: 100, android: 0 }),
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
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="cog" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="user" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
