import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface NavigationMenuItemContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItemContext() {
  const ctx = useContext(NavigationMenuItemContext);
  if (!ctx) throw new Error('NavigationMenuTrigger/Content must be used within <NavigationMenuItem>');
  return ctx;
}

interface NavigationMenuProps {
  style?: ViewStyle;
}

export function NavigationMenu({ style, children }: PropsWithChildren<NavigationMenuProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>;
}

interface NavigationMenuListProps {
  style?: ViewStyle;
}

export function NavigationMenuList({ style, children }: PropsWithChildren<NavigationMenuListProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.list, style)}>{children}</View>;
}

interface NavigationMenuItemProps {
  style?: ViewStyle;
}

export function NavigationMenuItem({ style, children }: PropsWithChildren<NavigationMenuItemProps>) {
  const [open, setOpen] = useState(false);
  return (
    <NavigationMenuItemContext.Provider value={{ open, setOpen }}>
      <View style={mergeStyles<ViewStyle>(styles.item, style)}>{children}</View>
    </NavigationMenuItemContext.Provider>
  );
}

interface NavigationMenuTriggerProps extends Omit<PressableProps, 'style' | 'onPress'> {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function NavigationMenuTrigger({
  children,
  style,
  textStyle,
  ...props
}: PropsWithChildren<NavigationMenuTriggerProps>) {
  const { open, setOpen } = useNavigationMenuItemContext();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={() => setOpen(!open)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.trigger, (open || pressed) && styles.triggerActive, style)
      }
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.triggerText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
      <View style={open ? styles.chevronOpen : undefined}>
        <ChevronDown size={14} color={uiColors.mutedForeground} />
      </View>
    </Pressable>
  );
}

interface NavigationMenuContentProps {
  style?: ViewStyle;
}

export function NavigationMenuContent({ style, children }: PropsWithChildren<NavigationMenuContentProps>) {
  const { open } = useNavigationMenuItemContext();
  if (!open) return null;
  return <View style={mergeStyles<ViewStyle>(styles.content, style)}>{children}</View>;
}

interface NavigationMenuLinkProps extends Omit<PressableProps, 'style' | 'onPress'> {
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function NavigationMenuLink({
  children,
  onPress,
  style,
  textStyle,
  ...props
}: PropsWithChildren<NavigationMenuLinkProps>) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.link, pressed && styles.linkPressed, style)}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.linkText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 10,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  item: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radii.md,
  },
  triggerActive: {
    backgroundColor: uiColors.muted,
  },
  triggerText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: uiColors.foreground,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: spacing.xs,
    minWidth: 220,
    backgroundColor: uiColors.popover,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
  link: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  linkPressed: {
    backgroundColor: uiColors.muted,
  },
  linkText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
});
