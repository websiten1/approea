import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { numeLuna } from '../utils/date';

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNav({ year, month, onPrev, onNext }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onPrev} hitSlop={12} style={styles.arrowBtn}>
        <Text style={styles.arrow}>‹</Text>
      </Pressable>
      <Text style={styles.title}>
        {numeLuna(month)} {year}
      </Text>
      <Pressable onPress={onNext} hitSlop={12} style={styles.arrowBtn}>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 21,
    color: colors.ink,
    marginHorizontal: 24,
    minWidth: 170,
    textAlign: 'center',
  },
  arrowBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.gold,
  },
});
