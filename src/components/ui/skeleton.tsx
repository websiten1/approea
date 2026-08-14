import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii } from '@/theme/spacing';

interface SkeletonProps {
  style?: ViewStyle;
}

export function Skeleton({ style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, { opacity }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    backgroundColor: uiColors.muted,
  },
});
