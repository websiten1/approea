import { Tabs } from 'expo-router/js-tabs';
import { OrthodoxCross } from '../../src/components/OrthodoxCross';
import { CalendarIcon, BookIcon, NewsIcon, SoliaIcon, EventsIcon, SettingsIcon } from '../../src/components/icons';
import { BottomNav } from '../../src/components/BottomNav';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Azi',
          tabBarIcon: ({ color, focused }) => (
            <OrthodoxCross color={String(color)} size={20} strokeWidth={focused ? 2.1 : 1.6} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <CalendarIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="evenimente"
        options={{
          title: 'Evenimente',
          tabBarIcon: ({ color }) => <EventsIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="cuvantul"
        options={{
          title: 'Ierarhul',
          tabBarIcon: ({ color }) => <BookIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="stiri"
        options={{
          title: 'Știri',
          tabBarIcon: ({ color }) => <NewsIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="solia"
        options={{
          title: 'Solia',
          tabBarIcon: ({ color }) => <SoliaIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <SettingsIcon color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
