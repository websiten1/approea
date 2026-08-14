import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Check, Circle } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

// Self-contained: does not import from popover.tsx, even though the anchored-Modal mechanics
// are conceptually similar — kept independent per this component's own trigger/content shape.

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: Anchor | null;
  setAnchor: (a: Anchor) => void;
  triggerRef: React.RefObject<View | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu.* must be used within <DropdownMenu>');
  return ctx;
}

export function DropdownMenu({ children }: PropsWithChildren<{}>) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, anchor, setAnchor, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { setOpen, setAnchor, triggerRef } = useDropdownMenuContext();

  const handlePress = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  return (
    <Pressable ref={triggerRef} onPress={handlePress} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, 260);
const MARGIN = spacing.sm;

interface DropdownMenuContentProps {
  style?: ViewStyle;
  sideOffset?: number;
}

export function DropdownMenuContent({ children, style, sideOffset = 6 }: PropsWithChildren<DropdownMenuContentProps>) {
  const { open, setOpen, anchor } = useDropdownMenuContext();
  const progress = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    Animated.timing(progress, { toValue: open ? 1 : 0, duration: 130, useNativeDriver: true }).start();
  }, [open]);

  if (!open || !anchor) return null;

  const left = Math.max(MARGIN, Math.min(anchor.x, SCREEN_WIDTH - CONTENT_WIDTH - MARGIN));
  let top = anchor.y + anchor.height + sideOffset;
  if (measuredHeight > 0 && top + measuredHeight > SCREEN_HEIGHT - MARGIN) {
    top = Math.max(MARGIN, anchor.y - sideOffset - measuredHeight);
  }

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)}>
        <Animated.View
          onLayout={(e) => setMeasuredHeight(e.nativeEvent.layout.height)}
          style={mergeStyles<ViewStyle>(styles.content, { left, top, width: CONTENT_WIDTH }, style, {
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
          } as ViewStyle)}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function DropdownMenuGroup({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={style}>{children}</View>;
}

export function DropdownMenuLabel({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.label, style)}>{children}</Text>;
}

export function DropdownMenuSeparator({ style }: { style?: ViewStyle }) {
  return <View style={mergeStyles<ViewStyle>(styles.separator, style)} />;
}

export function DropdownMenuShortcut({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.shortcut, style)}>{children}</Text>;
}

interface DropdownMenuItemProps {
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  style?: ViewStyle;
  closeOnPress?: boolean;
}

export function DropdownMenuItem({
  children,
  onPress,
  disabled,
  destructive,
  closeOnPress = true,
  style,
}: PropsWithChildren<DropdownMenuItemProps>) {
  const { setOpen } = useDropdownMenuContext();
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        onPress?.();
        if (closeOnPress) setOpen(false);
      }}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, disabled && styles.itemDisabled, style)
      }
    >
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.itemText, destructive && styles.itemTextDestructive)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

interface DropdownMenuCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function DropdownMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled,
  style,
}: PropsWithChildren<DropdownMenuCheckboxItemProps>) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, disabled && styles.itemDisabled, style)
      }
    >
      <View style={styles.indicatorSlot}>{checked && <Check size={14} color={uiColors.foreground} />}</View>
      {typeof children === 'string' ? <Text style={styles.itemText}>{children}</Text> : children}
    </Pressable>
  );
}

interface DropdownMenuRadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const DropdownMenuRadioGroupContext = createContext<DropdownMenuRadioGroupContextValue>({});

interface DropdownMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
}

export function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
  style,
}: PropsWithChildren<DropdownMenuRadioGroupProps>) {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <View style={style}>{children}</View>
    </DropdownMenuRadioGroupContext.Provider>
  );
}

interface DropdownMenuRadioItemProps {
  value: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function DropdownMenuRadioItem({
  children,
  value,
  disabled,
  style,
}: PropsWithChildren<DropdownMenuRadioItemProps>) {
  const { value: selected, onValueChange } = useContext(DropdownMenuRadioGroupContext);
  const checked = selected === value;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange?.(value)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, disabled && styles.itemDisabled, style)
      }
    >
      <View style={styles.indicatorSlot}>
        {checked && <Circle size={8} color={uiColors.foreground} fill={uiColors.foreground} />}
      </View>
      {typeof children === 'string' ? <Text style={styles.itemText}>{children}</Text> : children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.popover,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: uiColors.mutedForeground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: uiColors.border,
    marginVertical: spacing.xs,
  },
  shortcut: {
    marginLeft: 'auto',
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: uiColors.mutedForeground,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  itemPressed: {
    backgroundColor: uiColors.muted,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  itemTextDestructive: {
    color: uiColors.destructive,
  },
  indicatorSlot: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
