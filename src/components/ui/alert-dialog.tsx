import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';
import { Button } from './button';

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

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error('AlertDialog.* must be used within <AlertDialog>');
  return ctx;
}

interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AlertDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: PropsWithChildren<AlertDialogProps>) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };
  return <AlertDialogContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</AlertDialogContext.Provider>;
}

export function AlertDialogTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange } = useAlertDialogContext();
  return (
    <Pressable onPress={() => onOpenChange(true)} style={style}>
      {children}
    </Pressable>
  );
}

export function AlertDialogContent({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { open } = useAlertDialogContext();
  const { mounted, progress } = useOpenAnimation(open);

  if (!mounted) return null;

  return (
    // No onRequestClose-triggered dismiss and the backdrop below is a plain (non-Pressable) View:
    // destructive confirmations must only be closed via an explicit Action/Cancel button.
    <Modal transparent visible={mounted} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]} />
        <Animated.View
          style={mergeStyles<ViewStyle>(styles.content, style, {
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
          } as ViewStyle)}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export function AlertDialogHeader({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function AlertDialogFooter({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

export function AlertDialogTitle({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.title, style)}>{children}</Text>;
}

export function AlertDialogDescription({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

interface AlertDialogButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
}

export function AlertDialogAction({ children, onPress, style }: PropsWithChildren<AlertDialogButtonProps>) {
  const { onOpenChange } = useAlertDialogContext();
  return (
    <Button
      variant="default"
      style={style}
      onPress={() => {
        onPress?.();
        onOpenChange(false);
      }}
    >
      {children}
    </Button>
  );
}

export function AlertDialogCancel({ children, onPress, style }: PropsWithChildren<AlertDialogButtonProps>) {
  const { onOpenChange } = useAlertDialogContext();
  return (
    <Button
      variant="outline"
      style={style}
      onPress={() => {
        onPress?.();
        onOpenChange(false);
      }}
    >
      {children}
    </Button>
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
  },
  description: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.mutedForeground,
  },
});
