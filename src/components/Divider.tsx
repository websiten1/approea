import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/** Plain hairline separator, matching the live app (no ornamental decoration). */
export function Divider() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
});
