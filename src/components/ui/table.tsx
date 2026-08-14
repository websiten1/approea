import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface StyleProps {
  style?: ViewStyle;
}

/** Wraps a horizontal ScrollView so wide tables can scroll in case columns overflow. */
export function Table({ children, style }: PropsWithChildren<StyleProps>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={mergeStyles<ViewStyle>(styles.table, style)}>{children}</View>
    </ScrollView>
  );
}

export function TableHeader({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.header, style)}>{children}</View>;
}

export function TableBody({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.body, style)}>{children}</View>;
}

export function TableFooter({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.footer, style)}>{children}</View>;
}

export function TableRow({ children, style }: PropsWithChildren<StyleProps>) {
  return <View style={mergeStyles<ViewStyle>(styles.row, style)}>{children}</View>;
}

interface CellProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TableHead({ children, style, textStyle }: PropsWithChildren<CellProps>) {
  return (
    <View style={mergeStyles<ViewStyle>(styles.head, style)}>
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.headText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function TableCell({ children, style, textStyle }: PropsWithChildren<CellProps>) {
  return (
    <View style={mergeStyles<ViewStyle>(styles.cell, style)}>
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.cellText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function TableCaption({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={mergeStyles<TextStyle>(styles.caption, style)}>{children}</Text>;
}

const styles = StyleSheet.create({
  table: {
    minWidth: '100%',
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: uiColors.border,
  },
  body: {},
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: uiColors.border,
    backgroundColor: uiColors.muted,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: uiColors.border,
  },
  head: {
    flex: 1,
    minWidth: 96,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  headText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: uiColors.mutedForeground,
  },
  cell: {
    flex: 1,
    minWidth: 96,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  cellText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  caption: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: uiColors.mutedForeground,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
