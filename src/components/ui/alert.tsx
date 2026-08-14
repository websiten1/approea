import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { createVariants } from '@/lib/variants';
import { mergeStyles } from '@/lib/style';

export type AlertVariant = 'default' | 'destructive';

const containerVariants = createVariants({
  base: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    gap: spacing.xs,
  },
  variants: {
    variant: {
      default: { borderColor: uiColors.border, backgroundColor: uiColors.background },
      destructive: { borderColor: uiColors.destructive, backgroundColor: uiColors.background },
    },
  },
  defaultVariants: { variant: 'default' },
});

interface AlertProps {
  variant?: AlertVariant;
  style?: ViewStyle;
}

export function Alert({ variant = 'default', style, children }: PropsWithChildren<AlertProps>) {
  return <View style={mergeStyles<ViewStyle>(...containerVariants({ variant }), style)}>{children}</View>;
}

export function AlertTitle({ style, children }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.title, style)}>{children}</Text>;
}

export function AlertDescription({ style, children }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: uiColors.foreground,
  },
  description: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.mutedForeground,
  },
});
