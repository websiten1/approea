import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';
import { OrthodoxCross } from '../../src/components/OrthodoxCross';
import { CalendarIcon, BookIcon, NewsIcon, SoliaIcon, EventsIcon, SettingsIcon } from '../../src/components/icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.wine,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.ivory,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheetHairline,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansRegular,
          fontSize: 11,
        },
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
          title: 'Cuvântul Episcopului',
          tabBarLabel: 'Cuvânt',
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

const StyleSheetHairline = 0.5;
