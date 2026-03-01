import { Tabs } from 'expo-router';

import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.clarityBlue.DEFAULT,
        tabBarInactiveTintColor: COLORS.grey[400],
        tabBarLabelStyle: {
          fontFamily: 'SFProRounded-Medium',
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: COLORS.grey[200],
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="home" size={size} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="chart" size={size} />
          ),
          tabBarLabel: 'Progress',
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="users" size={size} />
          ),
          tabBarLabel: 'Friends',
        }}
      />
    </Tabs>
  );
}
