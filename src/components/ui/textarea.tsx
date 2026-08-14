import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface TextareaProps extends Omit<TextInputProps, 'style'> {
  style?: TextStyle;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ style, onFocus, onBlur, editable, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <TextInput
        ref={ref}
        editable={editable}
        multiline
        textAlignVertical="top"
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
Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  base: {
    minHeight: 80,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    color: uiColors.foreground,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: uiColors.ring,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
