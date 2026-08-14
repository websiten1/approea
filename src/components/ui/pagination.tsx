import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface PaginationProps {
  style?: ViewStyle;
}

export function Pagination({ style, children }: PropsWithChildren<PaginationProps>) {
  return (
    <View accessibilityRole="none" style={mergeStyles<ViewStyle>(styles.root, style)}>
      {children}
    </View>
  );
}

interface PaginationContentProps {
  style?: ViewStyle;
}

export function PaginationContent({ style, children }: PropsWithChildren<PaginationContentProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.content, style)}>{children}</View>;
}

interface PaginationItemProps {
  style?: ViewStyle;
}

export function PaginationItem({ style, children }: PropsWithChildren<PaginationItemProps>) {
  return <View style={style}>{children}</View>;
}

interface PaginationLinkProps extends Omit<PressableProps, 'style' | 'onPress'> {
  onPress?: () => void;
  isActive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PaginationLink({
  children,
  onPress,
  isActive,
  style,
  textStyle,
  ...props
}: PropsWithChildren<PaginationLinkProps>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(styles.pill, isActive && styles.pillActive, pressed && styles.pillPressed, style)
      }
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          style={mergeStyles<TextStyle>(styles.pillText, isActive && styles.pillTextActive, textStyle)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

interface PaginationPrevNextProps extends Omit<PressableProps, 'style' | 'onPress'> {
  onPress?: () => void;
  label?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PaginationPrevious({
  onPress,
  label = 'Previous',
  disabled,
  style,
  textStyle,
  ...props
}: PaginationPrevNextProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go to previous page"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(
          styles.pill,
          styles.prevNext,
          (pressed || disabled) && styles.pillPressed,
          disabled && styles.pillDisabled,
          style
        )
      }
      {...props}
    >
      <ChevronLeft size={16} color={uiColors.foreground} />
      <Text style={mergeStyles<TextStyle>(styles.pillText, textStyle)}>{label}</Text>
    </Pressable>
  );
}

export function PaginationNext({
  onPress,
  label = 'Next',
  disabled,
  style,
  textStyle,
  ...props
}: PaginationPrevNextProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go to next page"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        mergeStyles<ViewStyle>(
          styles.pill,
          styles.prevNext,
          (pressed || disabled) && styles.pillPressed,
          disabled && styles.pillDisabled,
          style
        )
      }
      {...props}
    >
      <Text style={mergeStyles<TextStyle>(styles.pillText, textStyle)}>{label}</Text>
      <ChevronRight size={16} color={uiColors.foreground} />
    </Pressable>
  );
}

export function PaginationEllipsis({ style }: { style?: ViewStyle }) {
  return (
    <View accessibilityElementsHidden style={mergeStyles<ViewStyle>(styles.ellipsis, style)}>
      <MoreHorizontal size={16} color={uiColors.mutedForeground} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pill: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: uiColors.primary,
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillDisabled: {
    opacity: 0.4,
  },
  pillText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  pillTextActive: {
    fontFamily: fonts.sansBold,
    color: uiColors.primaryForeground,
  },
  prevNext: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  ellipsis: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
