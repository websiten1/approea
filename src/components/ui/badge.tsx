import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { createVariants } from '@/lib/variants';
import { mergeStyles } from '@/lib/style';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const containerVariants = createVariants({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  variants: {
    variant: {
      default: { backgroundColor: uiColors.primary },
      secondary: { backgroundColor: uiColors.secondary },
      destructive: { backgroundColor: uiColors.destructive },
      outline: { backgroundColor: 'transparent', borderColor: uiColors.border },
    },
  },
  defaultVariants: { variant: 'default' },
});

const textVariants = createVariants({
  base: { fontFamily: fonts.sansBold, fontSize: 11 },
  variants: {
    variant: {
      default: { color: uiColors.primaryForeground },
      secondary: { color: uiColors.secondaryForeground },
      destructive: { color: uiColors.destructiveForeground },
      outline: { color: uiColors.foreground },
    },
  },
  defaultVariants: { variant: 'default' },
});

interface BadgeProps {
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ variant = 'default', style, textStyle, children }: PropsWithChildren<BadgeProps>) {
  return (
    <View style={mergeStyles<ViewStyle>(...containerVariants({ variant }), style)}>
      <Text style={mergeStyles<TextStyle>(...textVariants({ variant }), textStyle)}>{children}</Text>
    </View>
  );
}
