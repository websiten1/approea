import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/** Drives a mount/enter/exit Animated progress value (0..1) from an `open` boolean, since RN's
 *  Modal has no built-in exit-animation support — we keep it mounted until the close animation finishes. */
function useOpenAnimation(open: boolean, duration = 250) {
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration, useNativeDriver: true }).start();
    } else if (mounted) {
      Animated.timing(progress, { toValue: 0, duration, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open]);

  return { mounted, progress };
}

export type SheetSide = 'top' | 'bottom' | 'left' | 'right';

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('Sheet.* must be used within <Sheet>');
  return ctx;
}

interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({ open: openProp, defaultOpen = false, onOpenChange, children }: PropsWithChildren<SheetProps>) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };
  return <SheetContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</SheetContext.Provider>;
}

export function SheetTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange } = useSheetContext();
  return (
    <Pressable onPress={() => onOpenChange(true)} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SheetContentProps {
  side?: SheetSide;
  style?: ViewStyle;
  showCloseButton?: boolean;
}

export function SheetContent({
  children,
  side = 'right',
  style,
  showCloseButton = true,
}: PropsWithChildren<SheetContentProps>) {
  const { open, onOpenChange } = useSheetContext();
  const { mounted, progress } = useOpenAnimation(open);

  if (!mounted) return null;

  const offscreen =
    side === 'top' ? -SCREEN_HEIGHT : side === 'bottom' ? SCREEN_HEIGHT : side === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH;
  const translate = progress.interpolate({ inputRange: [0, 1], outputRange: [offscreen, 0] });
  const transform = side === 'top' || side === 'bottom' ? [{ translateY: translate }] : [{ translateX: translate }];

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onOpenChange(false)}>
          <Animated.View style={[styles.backdrop, { opacity: progress }]} />
        </Pressable>
        <Animated.View style={mergeStyles<ViewStyle>(styles.base, sideStyles[side], style, { transform } as ViewStyle)}>
          {children}
          {showCloseButton && (
            <Pressable style={styles.closeButton} onPress={() => onOpenChange(false)} hitSlop={8}>
              <X size={18} color={uiColors.mutedForeground} />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

export function SheetHeader({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function SheetFooter({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

export function SheetTitle({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.title, style)}>{children}</Text>;
}

export function SheetDescription({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

export function SheetClose({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange } = useSheetContext();
  return (
    <Pressable onPress={() => onOpenChange(false)} style={style}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  base: {
    position: 'absolute',
    backgroundColor: uiColors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
  },
  header: {
    gap: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: uiColors.foreground,
    paddingRight: spacing.lg,
  },
  description: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.mutedForeground,
  },
});

const sideStyles = StyleSheet.create({
  top: {
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: uiColors.border,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: uiColors.border,
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    width: Math.min(SCREEN_WIDTH * 0.8, 340),
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: uiColors.border,
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    width: Math.min(SCREEN_WIDTH * 0.8, 340),
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: uiColors.border,
  },
});
