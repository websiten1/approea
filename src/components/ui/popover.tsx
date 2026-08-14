import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { mergeStyles } from '@/lib/style';

/** Drives a mount/enter/exit Animated progress value (0..1) from an `open` boolean, since RN's
 *  Modal has no built-in exit-animation support — we keep it mounted until the close animation finishes. */
function useOpenAnimation(open: boolean, duration = 150) {
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

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: Anchor | null;
  setAnchor: (a: Anchor) => void;
  triggerRef: React.RefObject<View | null>;
  anchorRef: React.RefObject<View | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover.* must be used within <Popover>');
  return ctx;
}

interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ open: openProp, defaultOpen = false, onOpenChange, children }: PropsWithChildren<PopoverProps>) {
  const [openState, setOpenState] = useState(defaultOpen);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);
  const anchorRef = useRef<View>(null);
  const open = openProp ?? openState;
  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };
  return (
    <PopoverContext.Provider value={{ open, onOpenChange: setOpen, anchor, setAnchor, triggerRef, anchorRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverAnchor({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { anchorRef } = usePopoverContext();
  return (
    <View ref={anchorRef} style={style}>
      {children}
    </View>
  );
}

export function PopoverTrigger({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { onOpenChange, setAnchor, triggerRef, anchorRef } = usePopoverContext();

  const handlePress = () => {
    const node = anchorRef.current ?? triggerRef.current;
    node?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      onOpenChange(true);
    });
  };

  return (
    <Pressable ref={triggerRef} onPress={handlePress} style={style}>
      {children}
    </Pressable>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, 280);
const MARGIN = spacing.sm;

interface PopoverContentProps {
  style?: ViewStyle;
  sideOffset?: number;
}

export function PopoverContent({ children, style, sideOffset = 6 }: PropsWithChildren<PopoverContentProps>) {
  const { open, onOpenChange, anchor } = usePopoverContext();
  const { mounted, progress } = useOpenAnimation(open);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  if (!mounted || !anchor) return null;

  let left = anchor.x;
  left = Math.max(MARGIN, Math.min(left, SCREEN_WIDTH - CONTENT_WIDTH - MARGIN));

  let top = anchor.y + anchor.height + sideOffset;
  if (measuredHeight > 0 && top + measuredHeight > SCREEN_HEIGHT - MARGIN) {
    // Not enough room below — flip above the trigger.
    top = Math.max(MARGIN, anchor.y - sideOffset - measuredHeight);
  }

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => onOpenChange(false)}>
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
