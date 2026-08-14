import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
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

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('Drawer.* must be used within <Drawer>');
  return ctx;
}

interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Drawer({ open: openProp, defaultOpen = false, onOpenChange, children }: PropsWithChildren<DrawerProps>) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };
  return <DrawerContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</DrawerContext.Provider>;
}

export function DrawerTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange } = useDrawerContext();
  return (
    <Pressable onPress={() => onOpenChange(true)} style={style}>
      {children}
    </Pressable>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.5;

interface DrawerContentProps {
  style?: ViewStyle;
}

export function DrawerContent({ children, style }: PropsWithChildren<DrawerContentProps>) {
  const { open, onOpenChange } = useDrawerContext();
  const { mounted, progress } = useOpenAnimation(open);
  const dragY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => Math.abs(gestureState.dy) > 4,
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 0) dragY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const shouldDismiss = gestureState.dy > DISMISS_DISTANCE || gestureState.vy > DISMISS_VELOCITY;
        if (shouldDismiss) onOpenChange(false);
        Animated.spring(dragY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      },
    })
  ).current;

  if (!mounted) return null;

  const base = progress.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT, 0] });
  const translateY = Animated.add(base, dragY);

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onOpenChange(false)}>
          <Animated.View style={[styles.backdrop, { opacity: progress }]} />
        </Pressable>
        <Animated.View style={mergeStyles<ViewStyle>(styles.content, style, { transform: [{ translateY }] } as ViewStyle)}>
          {/* Drag handle — swipe down past ~120px or with enough velocity to dismiss, otherwise it springs back. */}
          <View {...panResponder.panHandlers} style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export function DrawerHeader({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function DrawerFooter({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

export function DrawerTitle({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.title, style)}>{children}</Text>;
}

export function DrawerDescription({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

export function DrawerClose({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange } = useDrawerContext();
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
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: uiColors.border,
  },
  header: {
    gap: spacing.xs,
  },
  footer: {
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
