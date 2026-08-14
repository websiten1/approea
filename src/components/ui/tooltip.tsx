import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/** Web shadcn shows Tooltip on hover; touch has no hover, so we show it on long-press instead
 *  and auto-hide it after a short delay or when the press is released. */

// TooltipProvider is a no-op passthrough in the web version's Radix wiring (shared delay config);
// RN has no cross-component hover timing to coordinate, so this simply renders children.
export function TooltipProvider({ children }: PropsWithChildren<{}>) {
  return <>{children}</>;
}

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: Anchor | null;
  setAnchor: (a: Anchor) => void;
  triggerRef: React.RefObject<View | null>;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip.* must be used within <Tooltip>');
  return ctx;
}

export function Tooltip({ children }: PropsWithChildren<{}>) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);
  return (
    <TooltipContext.Provider value={{ open, setOpen, anchor, setAnchor, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  );
}

const AUTO_HIDE_MS = 1500;

export function TooltipTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { setOpen, setAnchor, triggerRef } = useTooltipContext();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setOpen(false), AUTO_HIDE_MS);
    });
  };

  const hide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(false);
  };

  return (
    <Pressable ref={triggerRef} onLongPress={show} onPressOut={hide} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MARGIN = spacing.sm;

export function TooltipContent({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { open, anchor, setOpen } = useTooltipContext();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: open ? 1 : 0, duration: 120, useNativeDriver: true }).start();
  }, [open]);

  if (!open || !anchor) return null;

  const left = Math.max(MARGIN, Math.min(anchor.x, SCREEN_WIDTH - 200 - MARGIN));
  const top = anchor.y - 36;

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View
          style={mergeStyles<ViewStyle>(styles.bubble, { left, top }, style, {
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
          } as ViewStyle)}
        >
          {typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    maxWidth: 200,
    borderRadius: radii.sm,
    backgroundColor: uiColors.foreground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: uiColors.background,
  },
});
