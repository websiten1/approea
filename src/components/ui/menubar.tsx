import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Check, Circle } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface MenubarMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null);

function useMenubarMenuContext() {
  const ctx = useContext(MenubarMenuContext);
  if (!ctx) throw new Error('Menubar.* must be used within <MenubarMenu>');
  return ctx;
}

interface MenubarProps {
  style?: ViewStyle;
}

export function Menubar({ style, children }: PropsWithChildren<MenubarProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>;
}

interface MenubarMenuProps {
  style?: ViewStyle;
}

export function MenubarMenu({ style, children }: PropsWithChildren<MenubarMenuProps>) {
  const [open, setOpen] = useState(false);
  return (
    <MenubarMenuContext.Provider value={{ open, setOpen }}>
      <View style={mergeStyles<ViewStyle>(styles.menu, style)}>{children}</View>
    </MenubarMenuContext.Provider>
  );
}

interface MenubarTriggerProps extends Omit<PressableProps, 'style' | 'onPress'> {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarTrigger({ children, style, textStyle, ...props }: PropsWithChildren<MenubarTriggerProps>) {
  const { open, setOpen } = useMenubarMenuContext();
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
    </Pressable>
  );
}

interface MenubarContentProps {
  style?: ViewStyle;
}

export function MenubarContent({ style, children }: PropsWithChildren<MenubarContentProps>) {
  const { open } = useMenubarMenuContext();
  if (!open) return null;
  return <View style={mergeStyles<ViewStyle>(styles.content, style)}>{children}</View>;
}

interface MenubarGroupProps {
  style?: ViewStyle;
}

export function MenubarGroup({ style, children }: PropsWithChildren<MenubarGroupProps>) {
  return <View style={style}>{children}</View>;
}

interface MenubarLabelProps {
  style?: TextStyle;
}

export function MenubarLabel({ children, style }: PropsWithChildren<MenubarLabelProps>) {
  return <Text style={mergeStyles<TextStyle>(styles.label, style)}>{children}</Text>;
}

interface MenubarItemProps extends Omit<PressableProps, 'style' | 'onPress'> {
  onPress?: () => void;
  destructive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarItem({
  children,
  onPress,
  destructive,
  disabled,
  style,
  textStyle,
  ...props
}: PropsWithChildren<MenubarItemProps>) {
  const { setOpen } = useMenubarMenuContext();
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ disabled: disabled ?? undefined }}
      disabled={disabled}
      onPress={() => {
        onPress?.();
        setOpen(false);
      }}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, disabled && styles.itemDisabled, style)
      }
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          style={mergeStyles<TextStyle>(styles.itemText, destructive && styles.itemTextDestructive, textStyle)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function MenubarSeparator({ style }: { style?: ViewStyle }) {
  return <View style={mergeStyles<ViewStyle>(styles.separator, style)} />;
}

interface MenubarCheckboxItemProps extends Omit<PressableProps, 'style' | 'onPress'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  style,
  textStyle,
  ...props
}: PropsWithChildren<MenubarCheckboxItemProps>) {
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ checked }}
      onPress={() => onCheckedChange?.(!checked)}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, style)}
      {...props}
    >
      <View style={styles.indicator}>
        {checked && <Check size={13} color={uiColors.foreground} strokeWidth={3} />}
      </View>
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.itemText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

interface MenubarRadioItemProps extends Omit<PressableProps, 'style' | 'onPress'> {
  value: string;
  checked?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function MenubarRadioItem({
  children,
  checked = false,
  onPress,
  style,
  textStyle,
  ...props
}: PropsWithChildren<MenubarRadioItemProps>) {
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, style)}
      {...props}
    >
      <View style={styles.indicator}>
        {checked && <Circle size={8} color={uiColors.foreground} fill={uiColors.foreground} />}
      </View>
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.itemText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function MenubarShortcut({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.shortcut, style)}>{children}</Text>;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    borderRadius: radii.md,
    padding: spacing.xs / 2,
    backgroundColor: uiColors.background,
  },
  menu: {
    position: 'relative',
  },
  trigger: {
    paddingHorizontal: spacing.sm,
    height: 32,
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  triggerActive: {
    backgroundColor: uiColors.muted,
  },
  triggerText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: uiColors.foreground,
  },
  content: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: spacing.xs,
    minWidth: 200,
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
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: uiColors.mutedForeground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  itemPressed: {
    backgroundColor: uiColors.muted,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  itemTextDestructive: {
    color: uiColors.destructive,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: uiColors.border,
    marginVertical: spacing.xs,
  },
  indicator: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcut: {
    marginLeft: 'auto',
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: uiColors.mutedForeground,
  },
});
