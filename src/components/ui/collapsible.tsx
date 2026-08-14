import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View, ViewStyle } from 'react-native';
import { mergeStyles } from '@/lib/style';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error('Collapsible.* must be used within <Collapsible>');
  return ctx;
}

interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: ViewStyle;
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  style,
  children,
}: PropsWithChildren<CollapsibleProps>) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !open;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>
    </CollapsibleContext.Provider>
  );
}

interface CollapsibleTriggerProps {
  style?: ViewStyle;
}

export function CollapsibleTrigger({ children, style }: PropsWithChildren<CollapsibleTriggerProps>) {
  const { open, toggle } = useCollapsibleContext();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={toggle}
      style={({ pressed }) => mergeStyles<ViewStyle>(pressed && styles.pressed, style)}
    >
      {children}
    </Pressable>
  );
}

interface CollapsibleContentProps {
  style?: ViewStyle;
}

export function CollapsibleContent({ children, style }: PropsWithChildren<CollapsibleContentProps>) {
  const { open } = useCollapsibleContext();
  if (!open) return null;
  return <View style={mergeStyles<ViewStyle>(style)}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {},
  pressed: {
    opacity: 0.7,
  },
});
