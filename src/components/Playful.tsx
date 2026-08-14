import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { uiColors } from '../theme/uiColors';

function useLoop(duration: number) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [value, duration]);
  return value;
}

function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Decorative animated blobs, ported from the legacy framer-motion version using RN core Animated only. */
export function PlayfulBlobs() {
  const t1 = useLoop(7000);
  const t2 = useLoop(9000);
  const t3 = useLoop(5000);

  return (
    <View style={styles.blobsContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.blobA,
          { backgroundColor: withAlpha(uiColors.sage, 0.15) },
          {
            transform: [
              { translateY: t1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 18, 0] }) },
              { rotate: t1.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '20deg', '0deg'] }) },
              { scale: t1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.08, 1] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blobB,
          { backgroundColor: withAlpha(uiColors.soliaBlue, 0.12) },
          {
            transform: [
              { translateY: t2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -14, 0] }) },
              { translateX: t2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 10, 0] }) },
              { rotate: t2.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '-25deg', '0deg'] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: withAlpha(uiColors.soliaRed, 0.25) },
          {
            transform: [{ translateY: t3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 22, 0] }) }],
          },
        ]}
      />
    </View>
  );
}

export function PlayfulArcs() {
  const t1 = useLoop(18000);
  const t2 = useLoop(12000);
  const t3 = useLoop(6000);

  return (
    <View style={styles.arcsContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.ring,
          { transform: [{ rotate: t1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
        ]}
      />
      <Animated.View
        style={[
          styles.arcBlob,
          {
            transform: [
              { rotate: t2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] }) },
              { scale: t2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.12, 1] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.smallBlob,
          { backgroundColor: withAlpha(uiColors.sage, 0.15) },
          {
            transform: [
              { translateY: t3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -16, 0] }) },
              { rotate: t3.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '30deg', '0deg'] }) },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blobsContainer: {
    position: 'absolute',
    top: -48,
    left: -48,
    width: 240,
    height: 240,
  },
  blobA: {
    position: 'absolute',
    top: 8,
    left: 12,
    width: 112,
    height: 112,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 55,
    borderBottomLeftRadius: 45,
  },
  blobB: {
    position: 'absolute',
    top: 80,
    left: 96,
    width: 80,
    height: 80,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 50,
  },
  dot: {
    position: 'absolute',
    top: 24,
    left: 112,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  arcsContainer: {
    position: 'absolute',
    bottom: -56,
    right: -56,
    width: 256,
    height: 256,
  },
  ring: {
    position: 'absolute',
    bottom: 40,
    right: 32,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(62, 100, 145, 0.3)',
  },
  arcBlob: {
    position: 'absolute',
    bottom: 16,
    right: 96,
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: 'rgba(138, 154, 115, 0.25)',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  smallBlob: {
    position: 'absolute',
    bottom: 80,
    right: 80,
    width: 36,
    height: 36,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
});
