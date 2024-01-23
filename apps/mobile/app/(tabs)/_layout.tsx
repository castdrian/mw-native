import { Tabs } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';

import TabBarIcon from '../../components/TabBarIcon';
import { globalStyles } from '../../styles/global';
import useTailwind from '../hooks/useTailwind';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function TabLayout() {
  const { colors } = useTailwind();
  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: '#000',
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple[100],
        tabBarStyle: {
          backgroundColor: colors.shade[700],
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
          globalStyles.fOpenSansMedium,
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
          tabBarLabelStyle: {
            display: 'none',
          },
          tabBarIconStyle: {},
          tabBarIcon: () => (
            <TabBarIcon
              style={{
                position: 'relative',
                top: -1,
                backgroundColor: colors.purple[400],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: 1,
                borderRadius: 100,
                textAlign: 'center',
                textAlignVertical: 'center',
                height: 56,
              }}
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
