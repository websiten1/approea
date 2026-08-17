import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { uiColors } from '../theme/uiColors';
import { spacing } from '../theme/spacing';
import { type as textType, fonts } from '../theme/typography';
import { formatDataLunga } from '../utils/date';

interface Props {
  title?: string;
  subtitle?: string;
  date?: string;
  accent?: 'sage' | 'blue' | 'red';
  centered?: boolean;
}

/**
 * The "SOLIA" brand mark, styled after the live app's splash/loading screen — the only
 * place it's actually shown in Base44 (Azi/Calendar/placeholder screens have no persistent
 * masthead of their own).
 */
export function Masthead({
  title = 'SOLIA',
  subtitle = 'EPISCOPIA ORTODOXĂ ROMÂNĂ A AMERICII',
  date,
  accent = 'sage',
  centered = false,
}: Props) {
  const dateLine = date ?? formatDataLunga(new Date());
  const accentColor =
    accent === 'blue' ? uiColors.soliaBlue : accent === 'red' ? uiColors.soliaRed : uiColors.sage;

  return (
    <View style={[styles.row, centered && styles.rowCentered]}>
      {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
      <Image
        source={require('../../assets/icon.png')}
        style={[styles.logo, !centered && styles.logoInline]}
      />
      <View style={[styles.textCol, centered && styles.textColCentered]}>
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {date !== undefined || !centered ? <Text style={styles.date}>{dateLine}</Text> : null}
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
  rowCentered: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  logoInline: {
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  textColCentered: {
    flex: 0,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 24,
    letterSpacing: 8,
  },
  subtitle: {
    ...textType.label,
    color: colors.inkFaint,
    letterSpacing: 1.5,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  date: {
    ...textType.bodySmall,
    color: colors.inkSoft,
    marginTop: 2,
  },
});
