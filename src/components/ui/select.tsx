import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Populated by SelectItem children mounting under SelectContent, keyed by value. */
  labels: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select.* must be used within <Select>');
  return ctx;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Select({ value, onValueChange, children }: PropsWithChildren<SelectProps>) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});

  const registerLabel = (itemValue: string, label: string) => {
    setLabels((prev) => (prev[itemValue] === label ? prev : { ...prev, [itemValue]: label }));
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, labels, registerLabel }}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function SelectTrigger({ style, children }: SelectTriggerProps) {
  const { setOpen } = useSelectContext();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => setOpen(true)}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.trigger, pressed && styles.triggerPressed, style)}
    >
      {children}
      <ChevronDown size={16} color={uiColors.mutedForeground} />
    </Pressable>
  );
}

interface SelectValueProps {
  placeholder?: string;
  style?: TextStyle;
}

export function SelectValue({ placeholder, style }: SelectValueProps) {
  const { value, labels } = useSelectContext();
  const label = value !== undefined ? (labels[value] ?? value) : undefined;
  return (
    <Text
      style={mergeStyles<TextStyle>(styles.value, !label && styles.placeholder, style)}
      numberOfLines={1}
    >
      {label ?? placeholder ?? ''}
    </Text>
  );
}

interface SelectContentProps {
  style?: ViewStyle;
}

/** Modal-based option list — self-contained, does not reuse dropdown-menu/popover primitives. */
export function SelectContent({ children, style }: PropsWithChildren<SelectContentProps>) {
  const { open, setOpen } = useSelectContext();
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
        <Pressable style={mergeStyles<ViewStyle>(styles.content, style)} onPress={(e) => e.stopPropagation()}>
          <ScrollView bounces={false}>{children}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface SelectItemProps {
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SelectItem({ value, children, style, textStyle }: PropsWithChildren<SelectItemProps>) {
  const ctx = useSelectContext();
  const selected = ctx.value === value;
  const label = typeof children === 'string' ? children : value;

  useEffect(() => {
    ctx.registerLabel(value, label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, label]);

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ selected }}
      onPress={() => {
        ctx.onValueChange?.(value);
        ctx.setOpen(false);
      }}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, style)}
    >
      <View style={styles.itemCheck}>
        {selected && <Check size={14} color={uiColors.primary} strokeWidth={3} />}
      </View>
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.itemText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function SelectGroup({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={style}>{children}</View>;
}

export function SelectLabel({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.groupLabel, style)}>{children}</Text>;
}

export function SelectSeparator({ style }: { style?: ViewStyle }) {
  return <View style={mergeStyles<ViewStyle>(styles.separator, style)} />;
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.background,
    gap: spacing.sm,
  },
  triggerPressed: {
    opacity: 0.7,
  },
  value: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
    flexShrink: 1,
  },
  placeholder: {
    color: uiColors.mutedForeground,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '70%',
    borderRadius: radii.lg,
    backgroundColor: uiColors.popover,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    paddingVertical: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  itemPressed: {
    backgroundColor: uiColors.muted,
  },
  itemCheck: {
    width: 16,
    alignItems: 'center',
  },
  itemText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  groupLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: uiColors.mutedForeground,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: uiColors.border,
    marginVertical: spacing.xs,
  },
});
