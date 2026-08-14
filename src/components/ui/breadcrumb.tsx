import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface BreadcrumbProps {
  style?: ViewStyle;
}

export function Breadcrumb({ style, children }: PropsWithChildren<BreadcrumbProps>) {
  return (
    <View accessibilityRole="none" style={mergeStyles<ViewStyle>(styles.root, style)}>
      {children}
    </View>
  );
}

interface BreadcrumbListProps {
  style?: ViewStyle;
}

export function BreadcrumbList({ style, children }: PropsWithChildren<BreadcrumbListProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.list, style)}>{children}</View>;
}

interface BreadcrumbItemProps {
  style?: ViewStyle;
}

export function BreadcrumbItem({ style, children }: PropsWithChildren<BreadcrumbItemProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.item, style)}>{children}</View>;
}

interface BreadcrumbLinkProps extends Omit<PressableProps, 'style' | 'onPress'> {
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function BreadcrumbLink({
  children,
  onPress,
  style,
  textStyle,
  ...props
}: PropsWithChildren<BreadcrumbLinkProps>) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => mergeStyles<ViewStyle>(pressed && styles.linkPressed, style)}
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

interface BreadcrumbPageProps {
  style?: TextStyle;
}

export function BreadcrumbPage({ children, style }: PropsWithChildren<BreadcrumbPageProps>) {
  return (
    <Text accessibilityRole="text" style={mergeStyles<TextStyle>(styles.pageText, style)}>
      {children}
    </Text>
  );
}

interface BreadcrumbSeparatorProps {
  style?: ViewStyle;
}

export function BreadcrumbSeparator({ children, style }: PropsWithChildren<BreadcrumbSeparatorProps>) {
  return (
    <View accessibilityElementsHidden style={mergeStyles<ViewStyle>(styles.separator, style)}>
      {children ?? <ChevronRight size={14} color={uiColors.mutedForeground} />}
    </View>
  );
}

export function BreadcrumbEllipsis({ style }: { style?: ViewStyle }) {
  return (
    <View accessibilityElementsHidden style={mergeStyles<ViewStyle>(styles.ellipsis, style)}>
      <MoreHorizontal size={16} color={uiColors.mutedForeground} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.mutedForeground,
  },
  pageText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: uiColors.foreground,
  },
  separator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsis: {
    width: radii.lg,
    height: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
