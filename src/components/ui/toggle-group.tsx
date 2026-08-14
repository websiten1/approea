import { createContext, PropsWithChildren, useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';
import { Toggle, ToggleSize, ToggleVariant } from './toggle';

export type ToggleGroupType = 'single' | 'multiple';

interface ToggleGroupContextValue {
  type: ToggleGroupType;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error('ToggleGroupItem must be used within <ToggleGroup>');
  return ctx;
}

interface ToggleGroupProps extends ToggleGroupContextValue {
  style?: ViewStyle;
}

export function ToggleGroup({
  type,
  value,
  onValueChange,
  variant = 'default',
  size = 'default',
  disabled,
  style,
  children,
}: PropsWithChildren<ToggleGroupProps>) {
  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange, variant, size, disabled }}>
      <View style={mergeStyles<ViewStyle>(styles.group, style)}>{children}</View>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps {
  value: string;
  disabled?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function ToggleGroupItem({ value, disabled, style, children }: ToggleGroupItemProps) {
  const ctx = useToggleGroupContext();
  const isActive =
    ctx.type === 'multiple'
      ? Array.isArray(ctx.value) && ctx.value.includes(value)
      : ctx.value === value;
  const isDisabled = disabled ?? ctx.disabled;

  const handlePressedChange = () => {
    if (ctx.type === 'multiple') {
      const current = Array.isArray(ctx.value) ? ctx.value : [];
      const next = isActive ? current.filter((v) => v !== value) : [...current, value];
      ctx.onValueChange?.(next);
    } else {
      ctx.onValueChange?.(isActive ? '' : value);
    }
  };

  return (
    <Toggle
      variant={ctx.variant}
      size={ctx.size}
      pressed={isActive}
      onPressedChange={handlePressedChange}
      disabled={isDisabled}
      style={style}
    >
      {children}
    </Toggle>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
