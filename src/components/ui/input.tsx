import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface InputProps extends Omit<TextInputProps, 'style'> {
  style?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ style, onFocus, onBlur, editable, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <TextInput
        ref={ref}
        editable={editable}
        placeholderTextColor={uiColors.mutedForeground}
        style={mergeStyles<TextStyle>(
          styles.base,
          focused && styles.focused,
          editable === false && styles.disabled,
          style
        )}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const styles = StyleSheet.create({
  base: {
    height: 40,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.background,
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    color: uiColors.foreground,
  },
  focused: {
    borderColor: uiColors.ring,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
