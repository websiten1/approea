import { StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { mergeStyles } from '@/lib/style';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View
      style={mergeStyles<ViewStyle>(
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style
      )}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: uiColors.border,
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
    backgroundColor: uiColors.border,
  },
});
