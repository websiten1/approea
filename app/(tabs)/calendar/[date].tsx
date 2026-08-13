import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Divider } from '../../../src/components/Divider';
import { OrthodoxCross } from '../../../src/components/OrthodoxCross';
import { EventCard } from '../../../src/components/EventCard';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { type as textType, fonts } from '../../../src/theme/typography';
import { getLiturgicalDay } from '../../../src/data/liturgicalCalendar';
import { EPARCHIAL_EVENTS } from '../../../src/data/eparchialEvents';
import { parseISODate, formatDataLunga } from '../../../src/utils/date';
import { fastingColor, fastingLabel, feastRankColor, isFeastDay } from '../../../src/utils/liturgicalDisplay';

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const iso = String(date);
  const day = getLiturgicalDay(iso);

  const dayEvents = useMemo(
    () => EPARCHIAL_EVENTS.filter((e) => e.date === iso),
    [iso]
  );

  if (!day) return null;

  const rankColor = feastRankColor(day.feastRank);
  const showCross = isFeastDay(day.feastRank);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.navRow}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Calendar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.dateText}>{formatDataLunga(parseISODate(iso))}</Text>

        <Divider />

        <View style={styles.feastBlock}>
          {showCross && (
            <View style={styles.crossRow}>
              <OrthodoxCross color={rankColor} size={30} strokeWidth={2} />
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
          <Text style={styles.sectionLabel}>EVENIMENTE EPARHIALE ÎN ACEASTĂ ZI</Text>
          {dayEvents.length === 0 ? (
            <Text style={styles.emptyText}>Nu sunt evenimente eparhiale programate în această zi.</Text>
          ) : (
            dayEvents.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backArrow: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.gold,
    marginRight: 4,
  },
  backLabel: {
    ...textType.body,
    color: colors.wine,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  dateText: {
    ...textType.label,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.sm,
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
