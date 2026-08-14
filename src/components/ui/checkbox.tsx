import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

interface CheckboxProps extends Omit<PressableProps, 'style' | 'onPress'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
}

export function Checkbox({ checked = false, onCheckedChange, disabled, style, ...props }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: disabled ?? undefined }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={mergeStyles<ViewStyle>(
        styles.base,
        checked && styles.checked,
        disabled && styles.disabled,
        style
      )}
      {...props}
    >
      {checked && <Check size={13} color={uiColors.primaryForeground} strokeWidth={3} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 18,
    height: 18,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: uiColors.primary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: uiColors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
