import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/** Custom tab bar: replicates the live app's per-tab active top-border (2px sage), which
 *  the stock `tabBarStyle` API can't express (it only styles the bar as a whole). */
export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const tint = focused ? colors.wine : colors.inkFaint;
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.item, focused && styles.itemActive]}
          >
            {options.tabBarIcon?.({ focused, color: tint, size: 20 })}
            <Text style={[styles.label, { color: tint }]}>{String(label)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.ivory,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 4 : 8,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  itemActive: {
    borderTopColor: colors.wine,
  },
  label: {
    fontFamily: fonts.sansRegular,
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
