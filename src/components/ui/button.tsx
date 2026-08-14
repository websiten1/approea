import { forwardRef, ReactNode } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { createVariants } from '@/lib/variants';
import { mergeStyles } from '@/lib/style';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const containerVariants = createVariants({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  variants: {
    variant: {
      default: { backgroundColor: uiColors.primary },
      destructive: { backgroundColor: uiColors.destructive },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: uiColors.border,
      },
      secondary: { backgroundColor: uiColors.secondary },
      ghost: { backgroundColor: 'transparent' },
      link: { backgroundColor: 'transparent' },
    },
    size: {
      default: { height: 40, paddingHorizontal: spacing.md },
      sm: { height: 34, paddingHorizontal: spacing.sm, borderRadius: radii.sm },
      lg: { height: 46, paddingHorizontal: spacing.lg },
      icon: { height: 40, width: 40, paddingHorizontal: 0 },
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

const textVariants = createVariants({
  base: { fontFamily: fonts.sansBold, fontSize: 14 },
  variants: {
    variant: {
      default: { color: uiColors.primaryForeground },
      destructive: { color: uiColors.destructiveForeground },
      outline: { color: uiColors.foreground },
      secondary: { color: uiColors.secondaryForeground },
      ghost: { color: uiColors.foreground },
      link: { color: uiColors.primary, textDecorationLine: 'underline' },
    },
    size: {
      default: {},
      sm: { fontSize: 13 },
      lg: { fontSize: 15 },
      icon: {},
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactNode;
}

export const Button = forwardRef<View, ButtonProps>(
  ({ variant = 'default', size = 'default', style, textStyle, children, disabled, ...props }, ref) => {
    const containerStyle = containerVariants({ variant, size });
    const labelStyle = textVariants({ variant, size });
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        style={({ pressed }) =>
          mergeStyles<ViewStyle>(...containerStyle, style, (pressed || disabled) && styles.pressed)
        }
        {...props}
      >
        {typeof children === 'string' ? (
          <Text style={mergeStyles<TextStyle>(...labelStyle, textStyle)}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
