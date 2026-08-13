import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/colors';

export default function CalendarStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[date]" options={{ presentation: 'card' }} />
    </Stack>
  );
}
