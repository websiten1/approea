import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { uiColors } from '../theme/uiColors';
import { type as textType } from '../theme/typography';

interface Props {
  color?: 'sage' | 'blue';
  style?: TextStyle;
}

export function SectionLabel({ children, color = 'sage', style }: PropsWithChildren<Props>) {
  const tint = color === 'blue' ? uiColors.soliaBlue : uiColors.sage;
  return <Text style={[styles.label, { color: tint }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    ...textType.label,
  },
});
