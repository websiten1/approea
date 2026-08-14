import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Menu } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/**
 * INTENTIONALLY SIMPLIFIED vs. the ~800-line shadcn/ui web sidebar.tsx.
 * This is a mobile-first slide-in drawer (Modal + backdrop) rather than a
 * responsive fixed column with cookie-persisted collapsed state, icon-only
 * collapse mode, or keyboard shortcuts (cmd/ctrl+b). No SidebarRail, no
 * SidebarInset, no collapsible="icon" mode. Fully self-contained — does not
 * import sheet.tsx/drawer.tsx from other batches.
 */

const SIDEBAR_WIDTH = 280;

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('Sidebar.* must be used within <SidebarProvider>');
  return ctx;
}

interface SidebarProviderProps {
  defaultOpen?: boolean;
}

export function SidebarProvider({ defaultOpen = false, children }: PropsWithChildren<SidebarProviderProps>) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen((prev) => !prev);

  return <SidebarContext.Provider value={{ open, setOpen, toggle }}>{children}</SidebarContext.Provider>;
}

interface SidebarProps {
  style?: ViewStyle;
}

/** Renders as a Modal-based slide-in drawer from the left, with a tap-out backdrop. */
export function Sidebar({ style, children }: PropsWithChildren<SidebarProps>) {
  const { open, setOpen } = useSidebarContext();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={styles.overlayRoot}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={mergeStyles<ViewStyle>(styles.drawer, style)}>{children}</View>
      </View>
    </Modal>
  );
}

interface SidebarTriggerProps {
  style?: ViewStyle;
}

export function SidebarTrigger({ style }: SidebarTriggerProps) {
  const { toggle } = useSidebarContext();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={toggle}
      style={({ pressed }) => mergeStyles<ViewStyle>(styles.trigger, pressed && styles.triggerPressed, style)}
    >
      <Menu size={20} color={uiColors.foreground} />
    </Pressable>
  );
}

export function SidebarHeader({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function SidebarFooter({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

export function SidebarContent({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <ScrollView style={mergeStyles<ViewStyle>(styles.content, style)} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function SidebarGroup({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.group, style)}>{children}</View>;
}

export function SidebarGroupLabel({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.groupLabel, style)}>{children}</Text>;
}

export function SidebarMenu({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.menu, style)}>{children}</View>;
}

export function SidebarMenuItem({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={style}>{children}</View>;
}

interface SidebarMenuButtonProps {
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SidebarMenuButton({
  active,
  onPress,
  style,
  textStyle,
  children,
}: PropsWithChildren<SidebarMenuButtonProps>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(
          styles.menuButton,
          active && styles.menuButtonActive,
          pressed && styles.menuButtonPressed,
          style
        )
      }
    >
      {typeof children === 'string' ? (
        <Text
          style={mergeStyles<TextStyle>(
            styles.menuButtonText,
            active && styles.menuButtonTextActive,
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

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  drawer: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: uiColors.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: uiColors.border,
  },
  trigger: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  triggerPressed: {
    opacity: 0.7,
  },
  header: {
    padding: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: uiColors.border,
  },
  footer: {
    padding: spacing.md,
    gap: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: uiColors.border,
  },
  content: {
    flex: 1,
  },
  group: {
    padding: spacing.sm,
    gap: 2,
  },
  groupLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: uiColors.mutedForeground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  menu: {
    gap: 2,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  menuButtonActive: {
    backgroundColor: uiColors.muted,
  },
  menuButtonPressed: {
    opacity: 0.7,
  },
  menuButtonText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  menuButtonTextActive: {
    fontFamily: fonts.sansBold,
    color: uiColors.primary,
  },
});

export { useSidebarContext as useSidebar };
