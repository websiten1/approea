import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionType = 'single' | 'multiple';

interface AccordionContextValue {
  type: AccordionType;
  isItemOpen: (itemValue: string) => boolean;
  toggleItem: (itemValue: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion.* must be used within <Accordion>');
  return ctx;
}

const AccordionItemContext = createContext<{ value: string } | null>(null);

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionItem.* must be used within <AccordionItem>');
  return ctx;
}

interface AccordionSingleProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}

interface AccordionMultipleProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  style?: ViewStyle;
};

export function Accordion(props: PropsWithChildren<AccordionProps>) {
  const { children, style } = props;

  const [internalSingle, setInternalSingle] = useState<string>(
    props.type === 'single' ? (props.defaultValue ?? '') : ''
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(
    props.type === 'multiple' ? (props.defaultValue ?? []) : []
  );

  const isItemOpen = useMemo(() => {
    if (props.type === 'single') {
      const current = props.value !== undefined ? props.value : internalSingle;
      return (itemValue: string) => current === itemValue;
    }
    const current = props.value !== undefined ? props.value : internalMultiple;
    return (itemValue: string) => current.includes(itemValue);
  }, [props.type, props.value, internalSingle, internalMultiple]);

  const toggleItem = (itemValue: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (props.type === 'single') {
      const current = props.value !== undefined ? props.value : internalSingle;
      const collapsible = props.collapsible ?? false;
      const next = current === itemValue ? (collapsible ? '' : current) : itemValue;
      if (props.value === undefined) setInternalSingle(next);
      props.onValueChange?.(next);
      return;
    }

    const current = props.value !== undefined ? props.value : internalMultiple;
    const next = current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue];
    if (props.value === undefined) setInternalMultiple(next);
    props.onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={{ type: props.type, isItemOpen, toggleItem }}>
      <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  style?: ViewStyle;
}

export function AccordionItem({ value, children, style }: PropsWithChildren<AccordionItemProps>) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <View style={mergeStyles<ViewStyle>(styles.item, style)}>{children}</View>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AccordionTrigger({ children, style, textStyle }: PropsWithChildren<AccordionTriggerProps>) {
  const { isItemOpen, toggleItem } = useAccordionContext();
  const { value } = useAccordionItemContext();
  const open = isItemOpen(value);

  const rotation = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [open, rotation]);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={() => toggleItem(value)}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.trigger, pressed && styles.triggerPressed, style)}
    >
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.triggerText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
      <Animated.View style={{ transform: [{ rotate }] }}>
        <ChevronDown size={18} color={uiColors.mutedForeground} />
      </Animated.View>
    </Pressable>
  );
}

interface AccordionContentProps {
  style?: ViewStyle;
}

export function AccordionContent({ children, style }: PropsWithChildren<AccordionContentProps>) {
  const { isItemOpen } = useAccordionContext();
  const { value } = useAccordionItemContext();
  const open = isItemOpen(value);

  if (!open) return null;

  return <View style={mergeStyles<ViewStyle>(styles.content, style)}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {},
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: uiColors.border,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  triggerPressed: {
    opacity: 0.7,
  },
  triggerText: {
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: uiColors.foreground,
  },
  content: {
    paddingBottom: spacing.md,
  },
});
