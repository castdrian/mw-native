import { Tabs } from 'expo-router';

import TabBarIcon from '@/components/TabBarIcon';
import Colors from '@/constants/Colors';

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
          borderTopColor: 'transparent',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
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
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="info-circle" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarLabel: '',
          tabBarIcon: () => (
            <TabBarIcon
              className=" bg-primary-400 flex aspect-[1/1] h-14 items-center justify-center rounded-full text-center text-2xl text-white"
              name="search"
              color="#FFF"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="cog" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="user" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
