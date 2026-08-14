import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/** Drives a mount/enter/exit Animated progress value (0..1) from an `open` boolean, since RN's
 *  Modal has no built-in exit-animation support — we keep it mounted until the close animation finishes. */
function useOpenAnimation(open: boolean, duration = 200) {
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

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog.* must be used within <Dialog>');
  return ctx;
}

interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ open: openProp, defaultOpen = false, onOpenChange, children }: PropsWithChildren<DialogProps>) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };
  return <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</DialogContext.Provider>;
}

interface DialogTriggerProps {
  style?: ViewStyle;
}

export function DialogTrigger({ children, style }: PropsWithChildren<DialogTriggerProps>) {
  const { onOpenChange } = useDialogContext();
  return (
    <Pressable onPress={() => onOpenChange(true)} style={style}>
      {children}
    </Pressable>
  );
}

interface DialogContentProps {
  style?: ViewStyle;
  showCloseButton?: boolean;
}

export function DialogContent({
  children,
  style,
  showCloseButton = true,
}: PropsWithChildren<DialogContentProps>) {
  const { open, onOpenChange } = useDialogContext();
  const { mounted, progress } = useOpenAnimation(open);

  if (!mounted) return null;

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onOpenChange(false)}>
          <Animated.View style={[styles.backdrop, { opacity: progress }]} />
        </Pressable>
        <Animated.View
          style={mergeStyles<ViewStyle>(styles.content, style, {
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
          } as ViewStyle)}
        >
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

export function DialogHeader({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function DialogFooter({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

export function DialogTitle({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.title, style)}>{children}</Text>;
}

export function DialogDescription({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

export function DialogClose({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange } = useDialogContext();
  return (
    <Pressable onPress={() => onOpenChange(false)} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: Math.min(SCREEN_WIDTH - spacing.lg * 2, 420),
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
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
