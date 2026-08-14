import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

/** Web shadcn opens HoverCard on hover; touch has no hover, so we open it on long-press instead.
 *  It stays open until the user taps outside it or a longer auto-hide timeout elapses. */

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: Anchor | null;
  setAnchor: (a: Anchor) => void;
  triggerRef: React.RefObject<View | null>;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error('HoverCard.* must be used within <HoverCard>');
  return ctx;
}

export function HoverCard({ children }: PropsWithChildren<{}>) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);
  return (
    <HoverCardContext.Provider value={{ open, setOpen, anchor, setAnchor, triggerRef }}>
      {children}
    </HoverCardContext.Provider>
  );
}

const AUTO_HIDE_MS = 4000;

export function HoverCardTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { setOpen, setAnchor, triggerRef } = useHoverCardContext();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setOpen(false), AUTO_HIDE_MS);
    });
  };

  return (
    <Pressable ref={triggerRef} onLongPress={show} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, 300);
const MARGIN = spacing.sm;

export function HoverCardContent({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { open, setOpen, anchor } = useHoverCardContext();
  const progress = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    Animated.timing(progress, { toValue: open ? 1 : 0, duration: 150, useNativeDriver: true }).start();
  }, [open]);

  if (!open || !anchor) return null;

  const left = Math.max(MARGIN, Math.min(anchor.x, SCREEN_WIDTH - CONTENT_WIDTH - MARGIN));
  let top = anchor.y + anchor.height + 8;
  if (measuredHeight > 0 && top + measuredHeight > SCREEN_HEIGHT - MARGIN) {
    top = Math.max(MARGIN, anchor.y - 8 - measuredHeight);
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

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.popover,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
