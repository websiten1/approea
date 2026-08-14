import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

// Self-contained: CommandDialog implements its own minimal Modal below rather than importing
// dialog.tsx. CommandList uses a ScrollView over composed CommandGroup/CommandItem children
// (rather than a literal FlatList `data` prop) so usage reads the same as shadcn's JSX
// composition — filtering hides/shows those children instead of driving a separate data array.

interface CommandContextValue {
  search: string;
  setSearch: (s: string) => void;
  reportMatch: (id: string, matches: boolean) => void;
  anyMatch: boolean;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error('Command.* must be used within <Command>');
  return ctx;
}

function normalize(text: string) {
  return text.trim().toLowerCase();
}

interface CommandProps {
  style?: ViewStyle;
}

export function Command({ children, style }: PropsWithChildren<CommandProps>) {
  const [search, setSearch] = useState('');
  const matches = useRef(new Map<string, boolean>()).current;
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  const reportMatch = (id: string, doesMatch: boolean) => {
    const prev = matches.get(id);
    if (prev === doesMatch) return;
    matches.set(id, doesMatch);
    forceRender();
  };

  const anyMatch = useMemo(() => Array.from(matches.values()).some(Boolean), [search, matches.size, matches]);

  return (
    <CommandContext.Provider value={{ search, setSearch, reportMatch, anyMatch }}>
      <View style={mergeStyles<ViewStyle>(styles.root, style)}>{children}</View>
    </CommandContext.Provider>
  );
}

interface CommandInputProps {
  placeholder?: string;
  style?: ViewStyle;
}

export function CommandInput({ placeholder = 'Search...', style }: CommandInputProps) {
  const { search, setSearch } = useCommandContext();
  return (
    <View style={mergeStyles<ViewStyle>(styles.inputRow, style)}>
      <Search size={16} color={uiColors.mutedForeground} />
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={placeholder}
        placeholderTextColor={uiColors.mutedForeground}
        style={styles.input}
        autoCorrect={false}
      />
    </View>
  );
}

export function CommandList({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <ScrollView style={mergeStyles<ViewStyle>(styles.list, style)} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function CommandEmpty({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  const { anyMatch, search } = useCommandContext();
  if (!search || anyMatch) return null;
  return <Text style={mergeStyles<TextStyle>(styles.empty, style)}>{children}</Text>;
}

interface CommandGroupProps {
  heading?: string;
  style?: ViewStyle;
}

export function CommandGroup({ children, heading, style }: PropsWithChildren<CommandGroupProps>) {
  const { search } = useCommandContext();
  const hasVisibleChild = useMemo(() => groupHasMatch(children, search), [children, search]);

  if (!hasVisibleChild) return null;

  return (
    <View style={mergeStyles<ViewStyle>(styles.group, style)}>
      {heading && <Text style={styles.groupHeading}>{heading}</Text>}
      {children}
    </View>
  );
}

function groupHasMatch(children: ReactNode, search: string): boolean {
  if (!normalize(search)) return true;
  let found = false;
  const visit = (node: ReactNode) => {
    if (found) return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === 'object' && 'props' in node) {
      const props = (node as { props?: Record<string, unknown> }).props;
      if (props && ('value' in props || 'children' in props)) {
        const value = typeof props.value === 'string' ? props.value : undefined;
        const label = value ?? (typeof props.children === 'string' ? (props.children as string) : '');
        if (label && normalize(label).includes(normalize(search))) {
          found = true;
          return;
        }
      }
      if (props?.children) visit(props.children as ReactNode);
    }
  };
  visit(children);
  return found;
}

export function CommandSeparator({ style }: { style?: ViewStyle }) {
  return <View style={mergeStyles<ViewStyle>(styles.separator, style)} />;
}

export function CommandShortcut({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.shortcut, style)}>{children}</Text>;
}

interface CommandItemProps {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function CommandItem({ children, value, onSelect, disabled, style }: PropsWithChildren<CommandItemProps>) {
  const { search, reportMatch } = useCommandContext();
  const id = useId();

  const label = value ?? (typeof children === 'string' ? children : '');
  const matches = !normalize(search) || normalize(label).includes(normalize(search));

  useEffect(() => {
    reportMatch(id, matches);
    return () => reportMatch(id, false);
  }, [matches, id]);

  if (!matches) return null;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onSelect?.(value ?? label)}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.item, pressed && styles.itemPressed, disabled && styles.itemDisabled, style)
      }
    >
      {typeof children === 'string' ? <Text style={styles.itemText}>{children}</Text> : children}
    </Pressable>
  );
}

/** Drives a mount/enter/exit Animated progress value (0..1) from an `open` boolean, since RN's
 *  Modal has no built-in exit-animation support — we keep it mounted until the close animation finishes. */
function useOpenAnimation(open: boolean, duration = 200) {
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration, useNativeDriver: true }).start();
    } else if (mounted) {
      Animated.timing(progress, { toValue: 0, duration, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open]);

  return { mounted, progress };
}

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CommandDialog({ children, open, onOpenChange, style }: PropsWithChildren<CommandDialogProps>) {
  const { mounted, progress } = useOpenAnimation(open);

  if (!mounted) return null;

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <View style={styles.dialogOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onOpenChange(false)}>
          <Animated.View style={[styles.dialogBackdrop, { opacity: progress }]} />
        </Pressable>
        <Animated.View
          style={mergeStyles<ViewStyle>(styles.dialogContent, style, {
            opacity: progress,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
          } as ViewStyle)}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.popover,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    height: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: uiColors.border,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    color: uiColors.foreground,
  },
  list: {
    maxHeight: 320,
    padding: spacing.xs,
  },
  empty: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.mutedForeground,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  group: {
    paddingVertical: spacing.xs,
  },
  groupHeading: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: uiColors.mutedForeground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: uiColors.border,
    marginVertical: spacing.xs,
  },
  shortcut: {
    marginLeft: 'auto',
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: uiColors.mutedForeground,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
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
  dialogOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialogBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialogContent: {
    width: Math.min(SCREEN_WIDTH - spacing.lg * 2, 420),
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.popover,
    overflow: 'hidden',
  },
});
