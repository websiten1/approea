import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/** Separator ornamental discret — linie cu romb auriu în centru. */
export function Divider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: colors.gold,
    marginHorizontal: 10,
    transform: [{ rotate: '45deg' }],
  },
});
