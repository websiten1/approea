import { StyleSheet, Text, View } from 'react-native';
import type { EparchialEvent, EparchialEventType } from '../types/eparhial';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/spacing';
import { type as textType, fonts } from '../theme/typography';
import { parseISODate } from '../utils/date';

const TYPE_LABELS: Record<EparchialEventType, string> = {
  hram: 'Hram',
  'vizita-episcopala': 'Vizită episcopală',
  hirotonie: 'Hirotonie',
  sfintire: 'Sfințire',
  sinaxa: 'Sinaxă',
  conferinta: 'Conferință',
  altele: 'Eveniment',
};

interface Props {
  event: EparchialEvent;
}

export function EventCard({ event }: Props) {
  const date = parseISODate(event.date);
  const day = date.getDate();
  const month = date.toLocaleDateString('ro-RO', { month: 'short' }).replace('.', '');

  return (
    <View style={styles.card}>
      <View style={styles.dateBox}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.month}>{month}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.type}>{TYPE_LABELS[event.type].toUpperCase()}</Text>
        <Text style={styles.title}>{event.title}</Text>
        {event.location ? <Text style={styles.location}>{event.location}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.ivory,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  dateBox: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
    paddingRight: spacing.md,
  },
  day: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.wine,
  },
  month: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    flex: 1,
  },
  type: {
    ...textType.caption,
    color: colors.goldDark,
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.serifRegular,
    fontSize: 16,
    lineHeight: 21,
    color: colors.ink,
    marginBottom: 2,
  },
  location: {
    ...textType.bodySmall,
    color: colors.inkSoft,
  },
});
