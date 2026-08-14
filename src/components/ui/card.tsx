import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface StyleProps {
  style?: ViewStyle;
}

export function Card({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.card, style)}>{children}</View>;
}

export function CardHeader({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function CardTitle({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.title, style)}>{children}</Text>;
}

export function CardDescription({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.description, style)}>{children}</Text>;
}

export function CardContent({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.content, style)}>{children}</View>;
}

export function CardFooter({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.card,
  },
  header: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: uiColors.cardForeground,
  },
  description: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: uiColors.mutedForeground,
  },
  content: {
    padding: spacing.md,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: 0,
  },
});
