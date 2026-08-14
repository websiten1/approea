import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { mergeStyles } from '@/lib/style';

/**
 * SCOPE NOTE: scoped to exactly two panels per ResizablePanelGroup (a "first" and a
 * "second" panel separated by one ResizableHandle), not arbitrary N-panel groups like
 * the web react-resizable-panels-based original.
 */

type ResizeDirection = 'horizontal' | 'vertical';

const MIN_PERCENT = 10;
const MAX_PERCENT = 90;

interface ResizableContextValue {
  direction: ResizeDirection;
  firstSize: number;
  setFirstSize: (size: number) => void;
  containerSize: number;
  setContainerSize: (size: number) => void;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizableContext() {
  const ctx = useContext(ResizableContext);
  if (!ctx) throw new Error('Resizable.* must be used within <ResizablePanelGroup>');
  return ctx;
}

interface ResizablePanelGroupProps {
  direction?: ResizeDirection;
  style?: ViewStyle;
}

export function ResizablePanelGroup({
  direction = 'horizontal',
  style,
  children,
}: PropsWithChildren<ResizablePanelGroupProps>) {
  const [firstSize, setFirstSize] = useState(50);
  const [containerSize, setContainerSize] = useState(0);

  return (
    <ResizableContext.Provider value={{ direction, firstSize, setFirstSize, containerSize, setContainerSize }}>
      <View
        style={mergeStyles<ViewStyle>(
          styles.group,
          { flexDirection: direction === 'horizontal' ? 'row' : 'column' },
          style
        )}
        onLayout={(e) => setContainerSize(direction === 'horizontal' ? e.nativeEvent.layout.width : e.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </ResizableContext.Provider>
  );
}

interface ResizablePanelProps {
  /** 0-100 percentage of the group's main-axis size. Only used for the first/second panel's initial sizing. */
  defaultSize?: number;
  /** Marks this panel as the second (trailing) panel, whose size is derived as 100 - first panel's size. */
  isSecondPanel?: boolean;
  style?: ViewStyle;
}

export function ResizablePanel({ defaultSize, isSecondPanel, style, children }: PropsWithChildren<ResizablePanelProps>) {
  const { firstSize, setFirstSize } = useResizableContext();

  useEffect(() => {
    if (defaultSize !== undefined && !isSecondPanel) {
      setFirstSize(defaultSize);
    }
    // Only apply the initial size once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flexBasisPercent = isSecondPanel ? 100 - firstSize : firstSize;

  return (
    <View style={mergeStyles<ViewStyle>(styles.panel, { flexBasis: `${flexBasisPercent}%` }, style)}>
      {children}
    </View>
  );
}

interface ResizableHandleProps {
  style?: ViewStyle;
}

export function ResizableHandle({ style }: ResizableHandleProps) {
  const { direction, firstSize, setFirstSize, containerSize } = useResizableContext();
  const startSizeRef = useRef(firstSize);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startSizeRef.current = firstSize;
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (containerSize <= 0) return;
        const delta = direction === 'horizontal' ? gestureState.dx : gestureState.dy;
        const deltaPercent = (delta / containerSize) * 100;
        const next = Math.max(MIN_PERCENT, Math.min(MAX_PERCENT, startSizeRef.current + deltaPercent));
        setFirstSize(next);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={mergeStyles<ViewStyle>(
        styles.handle,
        direction === 'horizontal' ? styles.handleHorizontal : styles.handleVertical,
        style
      )}
    >
      <View style={direction === 'horizontal' ? styles.handleGripHorizontal : styles.handleGripVertical} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
  },
  panel: {
    overflow: 'hidden',
  },
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: uiColors.border,
  },
  handleHorizontal: {
    width: 8,
  },
  handleVertical: {
    height: 8,
  },
  handleGripHorizontal: {
    width: 3,
    height: 24,
    borderRadius: 2,
    backgroundColor: uiColors.mutedForeground,
  },
  handleGripVertical: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: uiColors.mutedForeground,
  },
});
