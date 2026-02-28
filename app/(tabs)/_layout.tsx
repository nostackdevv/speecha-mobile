import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import { useColorScheme } from 'react-native';

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) => {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#2f95dc',
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="home" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="history" />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="users" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="user" />,
        }}
      />
    </Tabs>
  );
}
