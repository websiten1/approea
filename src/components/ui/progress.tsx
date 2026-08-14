import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

interface ProgressProps {
  /** 0-100 */
  value?: number;
  style?: ViewStyle;
}

export function Progress({ value = 0, style }: ProgressProps) {
  const widthAnim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(widthAnim, { toValue: value, duration: 300, useNativeDriver: false }).start();
  }, [value, widthAnim]);

  return (
    <View style={mergeStyles<ViewStyle>(styles.track, style)}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: uiColors.muted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: uiColors.primary,
  },
});
