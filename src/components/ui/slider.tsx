import { useRef } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

const THUMB_SIZE = 20;
const TRACK_HEIGHT = 6;

interface SliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Hand-built horizontal slider (no @react-native-community/slider dependency).
 * Drag tracking uses PanResponder + the track's measured layout width; value is fully
 * controlled via value/onValueChange, matching shadcn's Slider contract.
 */
export function Slider({
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  style,
}: SliderProps) {
  const trackWidth = useRef(0);

  const clampToStep = (raw: number) => {
    const stepped = Math.round((raw - min) / step) * step + min;
    return Math.min(max, Math.max(min, stepped));
  };

  const valueFromLocationX = (x: number) => {
    const width = trackWidth.current;
    if (width <= 0) return value;
    const ratio = Math.min(1, Math.max(0, x / width));
    return clampToStep(min + ratio * (max - min));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        onValueChange?.(valueFromLocationX(evt.nativeEvent.locationX));
      },
      onPanResponderMove: (evt) => {
        onValueChange?.(valueFromLocationX(evt.nativeEvent.locationX));
      },
    })
  ).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const clampedValue = Math.min(max, Math.max(min, value));
  const percent = max > min ? ((clampedValue - min) / (max - min)) * 100 : 0;

  return (
    <View
      style={mergeStyles<ViewStyle>(styles.wrapper, disabled && styles.disabled, style)}
      {...panResponder.panHandlers}
    >
      <View style={styles.track} onLayout={handleLayout}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
        <View style={[styles.thumb, { left: `${percent}%` }]} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: uiColors.muted,
    overflow: 'visible',
    justifyContent: 'center',
  },
  fill: {
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: uiColors.primary,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginLeft: -THUMB_SIZE / 2,
    backgroundColor: uiColors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: uiColors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
