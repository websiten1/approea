import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { uiColors } from '../theme/uiColors';
import { spacing } from '../theme/spacing';
import { type as textType, fonts } from '../theme/typography';
import { formatDataLunga } from '../utils/date';

interface Props {
  title?: string;
  date?: string;
  accent?: 'sage' | 'blue' | 'red';
}

export function Masthead({ title = 'SOLIA', date, accent = 'sage' }: Props) {
  const dateLine = date ?? formatDataLunga(new Date());
  const accentColor =
    accent === 'blue' ? uiColors.soliaBlue : accent === 'red' ? uiColors.soliaRed : uiColors.sage;

  return (
    <View style={styles.row}>
      {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dateLine}</Text>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: 1,
  },
  date: {
    ...textType.bodySmall,
    color: colors.inkSoft,
    marginTop: 2,
  },
  accentBar: {
    width: 32,
    height: 3,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
});
