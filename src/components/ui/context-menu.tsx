import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Check, Circle } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

// Self-contained: does not import from dropdown-menu.tsx, despite sharing the same visual/menu
// structure — this is the touch adaptation of right-click, so the trigger uses onLongPress
// instead of onPress and the content is anchored at the long-press point rather than below the trigger.

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ContextMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: Anchor | null;
  setAnchor: (a: Anchor) => void;
  triggerRef: React.RefObject<View | null>;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error('ContextMenu.* must be used within <ContextMenu>');
  return ctx;
}

export function ContextMenu({ children }: PropsWithChildren<{}>) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);
  return (
    <ContextMenuContext.Provider value={{ open, setOpen, anchor, setAnchor, triggerRef }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { setOpen, setAnchor, triggerRef } = useContextMenuContext();

  // Long-press stands in for right-click: touch devices have no secondary click.
  const handleLongPress = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  return (
    <Pressable ref={triggerRef} onLongPress={handleLongPress} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, 260);
const MARGIN = spacing.sm;

interface ContextMenuContentProps {
  style?: ViewStyle;
}

export function ContextMenuContent({ children, style }: PropsWithChildren<ContextMenuContentProps>) {
  const { open, setOpen, anchor } = useContextMenuContext();
  const progress = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    Animated.timing(progress, { toValue: open ? 1 : 0, duration: 130, useNativeDriver: true }).start();
  }, [open]);

  if (!open || !anchor) return null;

  // Anchor near the middle of the pressed element rather than strictly below it, closer to how
  // a native context menu appears at the touch point.
  const anchorX = anchor.x + anchor.width / 2 - CONTENT_WIDTH / 2;
  const left = Math.max(MARGIN, Math.min(anchorX, SCREEN_WIDTH - CONTENT_WIDTH - MARGIN));
  let top = anchor.y + anchor.height + 6;
  if (measuredHeight > 0 && top + measuredHeight > SCREEN_HEIGHT - MARGIN) {
    top = Math.max(MARGIN, anchor.y - 6 - measuredHeight);
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

export function ContextMenuGroup({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={style}>{children}</View>;
}

export function ContextMenuLabel({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.label, style)}>{children}</Text>;
}

export function ContextMenuSeparator({ style }: { style?: ViewStyle }) {
  return <View style={mergeStyles<ViewStyle>(styles.separator, style)} />;
}

export function ContextMenuShortcut({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.shortcut, style)}>{children}</Text>;
}

interface ContextMenuItemProps {
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  style?: ViewStyle;
  closeOnPress?: boolean;
}

export function ContextMenuItem({
  children,
  onPress,
  disabled,
  destructive,
  closeOnPress = true,
  style,
}: PropsWithChildren<ContextMenuItemProps>) {
  const { setOpen } = useContextMenuContext();
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

interface ContextMenuCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function ContextMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled,
  style,
}: PropsWithChildren<ContextMenuCheckboxItemProps>) {
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

interface ContextMenuRadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const ContextMenuRadioGroupContext = createContext<ContextMenuRadioGroupContextValue>({});

interface ContextMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
}

export function ContextMenuRadioGroup({
  children,
  value,
  onValueChange,
  style,
}: PropsWithChildren<ContextMenuRadioGroupProps>) {
  return (
    <ContextMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <View style={style}>{children}</View>
    </ContextMenuRadioGroupContext.Provider>
  );
}

interface ContextMenuRadioItemProps {
  value: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function ContextMenuRadioItem({ children, value, disabled, style }: PropsWithChildren<ContextMenuRadioItemProps>) {
  const { value: selected, onValueChange } = useContext(ContextMenuRadioGroupContext);
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
