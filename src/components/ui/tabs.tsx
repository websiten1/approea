import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used within <Tabs>');
  return ctx;
}

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
}

export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  style,
  children,
}: PropsWithChildren<TabsProps>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  style?: ViewStyle;
}

export function TabsList({ children, style }: PropsWithChildren<TabsListProps>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={mergeStyles<ViewStyle>(styles.list, style)}
    >
      {children}
    </ScrollView>
  );
}

interface TabsTriggerProps {
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TabsTrigger({ value, children, style, textStyle }: PropsWithChildren<TabsTriggerProps>) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const active = activeValue === value;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={() => onValueChange(value)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(
          styles.trigger,
          active ? styles.triggerActive : styles.triggerInactive,
          pressed && styles.triggerPressed,
          style
        )
      }
    >
      {typeof children === 'string' ? (
        <Text
          style={mergeStyles<TextStyle>(
            styles.triggerText,
            active ? styles.triggerTextActive : styles.triggerTextInactive,
            textStyle
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

interface TabsContentProps {
  value: string;
  style?: ViewStyle;
}

export function TabsContent({ value, children, style }: PropsWithChildren<TabsContentProps>) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;
  return <View style={mergeStyles<ViewStyle>(styles.content, style)}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {},
  list: {
    flexDirection: 'row',
    backgroundColor: uiColors.muted,
    borderRadius: radii.md,
    padding: 4,
    gap: 4,
  },
  trigger: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  triggerActive: {
    backgroundColor: uiColors.background,
    borderBottomColor: uiColors.primary,
  },
  triggerInactive: {
    backgroundColor: 'transparent',
  },
  triggerPressed: {
    opacity: 0.7,
  },
  triggerText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
  triggerTextActive: {
    color: uiColors.foreground,
  },
  triggerTextInactive: {
    color: uiColors.mutedForeground,
  },
  content: {
    marginTop: spacing.md,
  },
});
