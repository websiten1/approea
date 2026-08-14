import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface LabelProps {
  style?: TextStyle;
}

export function Label({ style, children }: PropsWithChildren<LabelProps>) {
  return <Text style={mergeStyles<TextStyle>(styles.label, style)}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: uiColors.foreground,
  },
});
