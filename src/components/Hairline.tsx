import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  style?: ViewStyle;
}

/** Plain 1px separator — a lighter-weight alternative to the ornamental Divider. */
export function Hairline({ style }: Props) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});
