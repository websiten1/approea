import { forwardRef } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { mergeStyles } from '@/lib/style';

interface ScrollAreaProps extends ScrollViewProps {
  style?: ViewStyle;
  horizontal?: boolean;
}

/** Thin wrapper around RN's ScrollView — matches shadcn's ScrollArea API surface. */
export const ScrollArea = forwardRef<ScrollView, ScrollAreaProps>(
  ({ style, horizontal, showsVerticalScrollIndicator, showsHorizontalScrollIndicator, children, ...props }, ref) => {
    return (
      <ScrollView
        ref={ref}
        horizontal={horizontal}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? false}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator ?? false}
        persistentScrollbar
        style={mergeStyles<ViewStyle>(styles.root, style)}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);
ScrollArea.displayName = 'ScrollArea';

interface ScrollBarProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

/**
 * RN's native scrollbar styling is limited (no custom-styled thumb like the web
 * Radix ScrollArea), so this is an intentionally light passthrough kept only for
 * API-shape parity with shadcn's <ScrollBar />. ScrollArea above already renders
 * the platform scrollbar; this component is a no-op visual placeholder.
 */
export function ScrollBar({ style }: ScrollBarProps) {
  return <View style={mergeStyles<ViewStyle>(styles.bar, style)} />;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: uiColors.background,
  },
  bar: {
    width: 0,
    height: 0,
  },
});
