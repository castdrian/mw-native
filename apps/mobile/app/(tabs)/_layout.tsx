import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleProp, TextStyle } from 'react-native';

import Colors from '../../constants/Colors';
import { globalStyles } from '../../styles/global';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color?: string;
  focused?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <FontAwesome
      color={
        props.color ||
        (props.focused ? Colors.dark.purple300 : Colors.dark.shade300)
      }
      size={24}
      {...props}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: '#000',
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.purple100,
        tabBarStyle: {
          backgroundColor: Colors.dark.shade700,
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
            <TabBarIcon name="500px" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            display: 'none',
          },
          tabBarIconStyle: {},
          tabBarIcon: () => (
            <TabBarIcon
              style={{
                position: 'relative',
                top: -1,
                backgroundColor: Colors.dark.purple400,
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
