import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../../src/components/Screen';
import { MonthNav } from '../../../src/components/MonthNav';
import { MonthGrid } from '../../../src/components/MonthGrid';
import { Divider } from '../../../src/components/Divider';
import { EventCard } from '../../../src/components/EventCard';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { type as textType, fonts } from '../../../src/theme/typography';
import { EPARCHIAL_EVENTS } from '../../../src/data/eparchialEvents';
import { toISODate } from '../../../src/utils/date';

export default function CalendarScreen() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const todayIso = toISODate(today);

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const monthEvents = useMemo(
    () =>
      EPARCHIAL_EVENTS
        .filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [year, month]
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CALENDAR LITURGIC</Text>
      </View>

      <MonthNav year={year} month={month} onPrev={goPrev} onNext={goNext} />

      <MonthGrid
        year={year}
        month={month}
        selectedIso={todayIso}
        onSelect={(iso) => router.push(`/calendar/${iso}`)}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.feastGreat }]} />
          <Text style={styles.legendText}>Praznic împărătesc</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.feastMajor }]} />
          <Text style={styles.legendText}>Sărbătoare mare</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
          <Text style={styles.legendText}>Eveniment eparhial</Text>
        </View>
      </View>

      <Divider />

      <View style={styles.eventsSection}>
        <Text style={styles.sectionLabel}>AGENDĂ — EVENIMENTE ÎN ACEASTĂ LUNĂ</Text>
        {monthEvents.length === 0 ? (
          <Text style={styles.emptyText}>Nu sunt evenimente eparhiale programate în această lună.</Text>
        ) : (
          monthEvents.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  eyebrow: {
    ...textType.label,
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    ...textType.caption,
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
