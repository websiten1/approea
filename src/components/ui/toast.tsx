import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/**
 * Hand-rolled RN toast system standing in for `sonner` (web/DOM-only, not installed here).
 *
 * Two ways to use it:
 *  1. Imperative, sonner-style, callable from anywhere (even outside React):
 *       toast('Saved changes');
 *       toast.success('Profile updated');
 *       toast.error('Something went wrong');
 *       toast('Heads up', { title: 'Reminder', variant: 'default', duration: 5000 });
 *  2. Hook-based, old shadcn `use-toast`-style, for reading the live queue in a component:
 *       const { toasts, dismiss } = useToast();
 *
 * Mount <Toaster /> once near the app root to actually render the queue.
 */

export type ToastVariant = 'default' | 'destructive' | 'success';

export interface ToastOptions {
  title?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastRecord {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

const DEFAULT_DURATION = 3000;

/**
 * Module-level pub/sub store — deliberately NOT React state. `toast()` needs to be callable
 * from plain functions/event handlers/services outside of any component or hook, exactly like
 * sonner's own module-level `toast()`. We keep a plain array of ToastRecords plus a Set of
 * listener callbacks; any mutation calls `emit()`, which just re-invokes every subscribed
 * listener with the current snapshot so subscribers (namely `useToast`/`Toaster` via
 * `useSyncExternalStore`) know to re-render. No listeners means no work — the store still
 * happily queues toasts for whenever a <Toaster/> eventually mounts.
 */
let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toasts;
}

let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `toast-${Date.now()}-${idCounter}`;
}

function dismiss(id?: string) {
  toasts = id === undefined ? [] : toasts.filter((t) => t.id !== id);
  emit();
}

function show(message: string, options?: ToastOptions): string {
  const id = generateId();
  const record: ToastRecord = {
    id,
    title: options?.title,
    message,
    variant: options?.variant ?? 'default',
    duration: options?.duration ?? DEFAULT_DURATION,
  };
  toasts = [...toasts, record];
  emit();
  return id;
}

type ToastFn = ((message: string, options?: ToastOptions) => string) & {
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'variant'>) => string;
  dismiss: (id?: string) => void;
};

export const toast: ToastFn = Object.assign(show, {
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
    show(message, { ...options, variant: 'success' }),
  error: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
    show(message, { ...options, variant: 'destructive' }),
  dismiss,
});

export function useToast() {
  const activeToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { toasts: activeToasts, toast, dismiss };
}

interface ToastItemProps {
  record: ToastRecord;
}

function ToastItem({ record }: ToastItemProps) {
  const translateY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      dismiss(record.id);
    }, record.duration);

    return () => clearTimeout(timer);
  }, [record.id, record.duration, translateY, opacity]);

  const variantStyle = variantStyles[record.variant];

  return (
    <Animated.View
      style={[styles.item, variantStyle.container, { opacity, transform: [{ translateY }] }]}
    >
      <Pressable style={styles.itemBody} onPress={() => dismiss(record.id)}>
        {record.title ? <Text style={mergeStyles<TextStyle>(styles.title, variantStyle.text)}>{record.title}</Text> : null}
        <Text style={mergeStyles<TextStyle>(styles.message, variantStyle.text)}>{record.message}</Text>
      </Pressable>
    </Animated.View>
  );
}

interface ToasterProps {
  style?: ViewStyle;
}

export function Toaster({ style }: ToasterProps) {
  const activeToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (activeToasts.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={mergeStyles<ViewStyle>(styles.viewport, style)}>
      {activeToasts.map((record) => (
        <ToastItem key={record.id} record={record} />
      ))}
    </View>
  );
}

const variantStyles: Record<ToastVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: uiColors.card, borderColor: uiColors.border },
    text: { color: uiColors.cardForeground },
  },
  destructive: {
    container: { backgroundColor: uiColors.destructive, borderColor: uiColors.destructive },
    text: { color: uiColors.destructiveForeground },
  },
  success: {
    container: { backgroundColor: uiColors.primary, borderColor: uiColors.primary },
    text: { color: uiColors.primaryForeground },
  },
};

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.xxl,
    gap: spacing.sm,
  },
  item: {
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  itemBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs / 2,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  message: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },
});
