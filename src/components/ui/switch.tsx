import { useEffect, useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 22;
const THUMB_SIZE = 18;
const THUMB_PADDING = (TRACK_HEIGHT - THUMB_SIZE) / 2;

interface SwitchProps extends Omit<PressableProps, 'style' | 'onPress'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
}

export function Switch({ checked = false, onCheckedChange, disabled, style, ...props }: SwitchProps) {
  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: checked ? 1 : 0, duration: 150, useNativeDriver: false }).start();
  }, [checked, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_PADDING, TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING],
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [uiColors.muted, uiColors.primary],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: disabled ?? undefined }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={mergeStyles<ViewStyle>(styles.wrapper, disabled && styles.disabled, style)}
      {...props}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: uiColors.card,
  },
  disabled: {
    opacity: 0.5,
  },
});
