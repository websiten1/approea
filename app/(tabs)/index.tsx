import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Divider } from '../../src/components/Divider';
import { OrthodoxCross } from '../../src/components/OrthodoxCross';
import { EventCard } from '../../src/components/EventCard';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { type as textType, fonts } from '../../src/theme/typography';
import { getLiturgicalDay } from '../../src/data/liturgicalCalendar';
import { EPARCHIAL_EVENTS } from '../../src/data/eparchialEvents';
import { toISODate, formatDataLunga } from '../../src/utils/date';
import { fastingColor, fastingLabel, feastRankColor, isFeastDay } from '../../src/utils/liturgicalDisplay';

export default function AziScreen() {
  const today = useMemo(() => new Date(), []);
  const iso = toISODate(today);
  const day = getLiturgicalDay(iso);

  const upcomingEvents = useMemo(
    () =>
      EPARCHIAL_EVENTS
        .filter((e) => e.date >= iso)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [iso]
  );

  if (!day) return null;

  const rankColor = feastRankColor(day.feastRank);
  const showCross = isFeastDay(day.feastRank);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ASTĂZI</Text>
        <Text style={styles.dateText}>{formatDataLunga(today)}</Text>
      </View>

      <Divider />

      <View style={styles.feastBlock}>
        {showCross && (
          <View style={styles.crossRow}>
            <OrthodoxCross color={rankColor} size={26} strokeWidth={2} />
          </View>
        )}
        {day.feastName ? (
          <Text style={[styles.feastName, { color: showCross ? colors.wine : colors.ink }]}>
            {day.feastName}
          </Text>
        ) : null}
        {day.saints.map((saint, idx) => (
          <Text key={idx} style={styles.saintName}>
            {saint}
          </Text>
        ))}
      </View>

      <View style={styles.fastingRow}>
        {day.fasting !== 'fara-post' && (
          <View style={[styles.fastingDot, { backgroundColor: fastingColor(day.fasting) }]} />
        )}
        <Text style={styles.fastingLabel}>
          {day.isHarti ? 'Harți — fără post' : fastingLabel(day.fasting)}
          {day.fastingPeriod ? ` · ${day.fastingPeriod}` : ''}
        </Text>
      </View>

      <Divider />

      <View style={styles.eventsSection}>
        <Text style={styles.sectionLabel}>EVENIMENTE EPARHIALE APROPIATE</Text>
        {upcomingEvents.length === 0 ? (
          <Text style={styles.emptyText}>Nu sunt evenimente programate în perioada următoare.</Text>
        ) : (
          upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  eyebrow: {
    ...textType.label,
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.ink,
  },
  feastBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  crossRow: {
    marginBottom: spacing.sm,
  },
  feastName: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  saintName: {
    fontFamily: fonts.serifRegular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
  },
  fastingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  fastingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  fastingLabel: {
    ...textType.bodySmall,
    color: colors.inkSoft,
  },
  eventsSection: {
    marginTop: spacing.sm,
  },
  sectionLabel: {
    ...textType.label,
    color: colors.byzantine,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...textType.bodySmall,
    color: colors.inkFaint,
  },
});
