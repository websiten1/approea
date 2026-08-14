import {
  Children,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { mergeStyles } from '@/lib/style';

type CarouselOrientation = 'horizontal' | 'vertical';

interface CarouselContextValue {
  orientation: CarouselOrientation;
  scrollRef: React.RefObject<ScrollView | null>;
  pageSize: number;
  index: number;
  setIndex: (index: number) => void;
  count: number;
  setCount: (count: number) => void;
  scrollToIndex: (index: number) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel.* must be used within <Carousel>');
  return ctx;
}

interface CarouselProps {
  orientation?: CarouselOrientation;
  style?: ViewStyle;
  /** Size (width for horizontal, height for vertical) of one page. Defaults to the screen size. */
  pageSize?: number;
}

export function Carousel({
  orientation = 'horizontal',
  pageSize,
  style,
  children,
}: PropsWithChildren<CarouselProps>) {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  const resolvedPageSize =
    pageSize ?? (orientation === 'horizontal' ? Dimensions.get('window').width : Dimensions.get('window').height);

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(nextIndex, Math.max(0, count - 1)));
      setIndex(clamped);
      const offset = clamped * resolvedPageSize;
      scrollRef.current?.scrollTo(
        orientation === 'horizontal' ? { x: offset, y: 0, animated: true } : { x: 0, y: offset, animated: true }
      );
    },
    [count, orientation, resolvedPageSize]
  );

  return (
    <CarouselContext.Provider
      value={{ orientation, scrollRef, pageSize: resolvedPageSize, index, setIndex, count, setCount, scrollToIndex }}
    >
      <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>
    </CarouselContext.Provider>
  );
}

interface CarouselContentProps {
  style?: ViewStyle;
}

export function CarouselContent({ children, style }: PropsWithChildren<CarouselContentProps>) {
  const { orientation, scrollRef, pageSize, setIndex, setCount } = useCarouselContext();
  const childCount = Children.count(children);

  useEffect(() => {
    setCount(childCount);
  }, [childCount, setCount]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset =
      orientation === 'horizontal' ? event.nativeEvent.contentOffset.x : event.nativeEvent.contentOffset.y;
    const nextIndex = pageSize > 0 ? Math.round(offset / pageSize) : 0;
    setIndex(nextIndex);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal={orientation === 'horizontal'}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      style={style}
    >
      {children}
    </ScrollView>
  );
}

interface CarouselItemProps {
  style?: ViewStyle;
}

export function CarouselItem({ children, style }: PropsWithChildren<CarouselItemProps>) {
  const { orientation, pageSize } = useCarouselContext();
  const sizeStyle: ViewStyle =
    orientation === 'horizontal' ? { width: pageSize } : { height: pageSize };
  return <View style={mergeStyles<ViewStyle>(styles.item, sizeStyle, style)}>{children}</View>;
}

interface CarouselNavButtonProps {
  style?: ViewStyle;
}

export function CarouselPrevious({ style }: CarouselNavButtonProps) {
  const { index, scrollToIndex } = useCarouselContext();
  const disabled = index <= 0;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => scrollToIndex(index - 1)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(
          styles.navButton,
          disabled && styles.navButtonDisabled,
          pressed && styles.navButtonPressed,
          style
        )
      }
    >
      <ArrowLeft size={16} color={uiColors.foreground} />
    </Pressable>
  );
}

export function CarouselNext({ style }: CarouselNavButtonProps) {
  const { index, count, scrollToIndex } = useCarouselContext();
  const disabled = index >= count - 1;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => scrollToIndex(index + 1)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(
          styles.navButton,
          disabled && styles.navButtonDisabled,
          pressed && styles.navButtonPressed,
          style
        )
      }
    >
      <ArrowRight size={16} color={uiColors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  item: {
    flexShrink: 0,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: uiColors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonPressed: {
    opacity: 0.7,
  },
});
