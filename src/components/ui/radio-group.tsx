import { createContext, PropsWithChildren, useContext } from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';
import { Circle } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { spacing } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error('RadioGroupItem must be used within <RadioGroup>');
  return ctx;
}

interface RadioGroupProps extends RadioGroupContextValue {
  style?: ViewStyle;
}

export function RadioGroup({
  value,
  onValueChange,
  disabled,
  style,
  children,
}: PropsWithChildren<RadioGroupProps>) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View style={mergeStyles<ViewStyle>(styles.group, style)}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<PressableProps, 'style' | 'onPress'> {
  value: string;
  style?: ViewStyle;
}

export function RadioGroupItem({ value, disabled, style, ...props }: RadioGroupItemProps) {
  const ctx = useRadioGroupContext();
  const selected = ctx.value === value;
  const isDisabled = disabled ?? ctx.disabled;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => ctx.onValueChange?.(value)}
      style={mergeStyles<ViewStyle>(styles.item, isDisabled && styles.disabled, style)}
      {...props}
    >
      {selected && <Circle size={9} color={uiColors.primary} fill={uiColors.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  item: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: uiColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
