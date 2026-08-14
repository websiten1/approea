import { forwardRef, ReactNode } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { createVariants } from '@/lib/variants';
import { mergeStyles } from '@/lib/style';

export type ToggleVariant = 'default' | 'outline';
export type ToggleSize = 'default' | 'sm' | 'lg';

const containerVariants = createVariants({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    gap: spacing.xs,
    backgroundColor: 'transparent',
  },
  variants: {
    variant: {
      default: {},
      outline: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: uiColors.border,
      },
    },
    size: {
      default: { height: 40, paddingHorizontal: spacing.sm, minWidth: 40 },
      sm: { height: 34, paddingHorizontal: spacing.xs, minWidth: 34 },
      lg: { height: 46, paddingHorizontal: spacing.md, minWidth: 46 },
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

const textVariants = createVariants({
  base: { fontFamily: fonts.sansBold, fontSize: 14 },
  variants: {
    variant: {
      default: { color: uiColors.foreground },
      outline: { color: uiColors.foreground },
    },
    size: {
      default: {},
      sm: { fontSize: 13 },
      lg: { fontSize: 15 },
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

interface ToggleProps extends Omit<PressableProps, 'style'> {
  variant?: ToggleVariant;
  size?: ToggleSize;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactNode;
}

export const Toggle = forwardRef<View, ToggleProps>(
  (
    {
      variant = 'default',
      size = 'default',
      pressed = false,
      onPressedChange,
      style,
      textStyle,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const containerStyle = containerVariants({ variant, size });
    const labelStyle = textVariants({ variant, size });
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ selected: pressed, disabled: disabled ?? undefined }}
        disabled={disabled}
        onPress={() => onPressedChange?.(!pressed)}
        style={mergeStyles<ViewStyle>(
          ...containerStyle,
          pressed && styles.pressed,
          disabled && styles.disabled,
          style
        )}
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
Toggle.displayName = 'Toggle';

const styles = StyleSheet.create({
  pressed: {
    backgroundColor: uiColors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
});
