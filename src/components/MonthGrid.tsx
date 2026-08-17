import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { getMonthGridDays, numeZiScurt, toISODate } from '../utils/date';
import { getLiturgicalDay } from '../data/liturgicalCalendar';
import { EPARCHIAL_EVENTS } from '../data/eparchialEvents';
import { isFeastDay, feastRankColor } from '../utils/liturgicalDisplay';

interface Props {
  year: number;
  month: number; // 0-11
  selectedIso: string;
  onSelect: (iso: string) => void;
}

const eventDates = new Set(EPARCHIAL_EVENTS.map((e) => e.date));

const WEEKDAY_LABELS = [0, 1, 2, 3, 4, 5, 6].map((mondayIdx) => numeZiScurt(((mondayIdx + 1) % 7)));

export function MonthGrid({ year, month, selectedIso, onSelect }: Props) {
  const cells = getMonthGridDays(year, month);
  const todayIso = toISODate(new Date());

  return (
    <View>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, idx) => (
          <Text key={idx} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map(({ date, inMonth }, idx) => {
          const iso = toISODate(date);
          const liturgical = getLiturgicalDay(iso);
          const isToday = iso === todayIso;
          const isSelected = iso === selectedIso;
          const isActive = isToday || isSelected;
          const feastColor = liturgical ? feastRankColor(liturgical.feastRank) : 'transparent';
          const hasFeast = liturgical ? isFeastDay(liturgical.feastRank) : false;
          const hasEvent = eventDates.has(iso);

          return (
            <Pressable
              key={idx}
              style={styles.cellWrap}
              onPress={() => onSelect(iso)}
              hitSlop={2}
            >
              <View style={[styles.cell, isActive && styles.cellActive]}>
                <Text
                  style={[
                    styles.cellText,
                    !inMonth && styles.cellTextMuted,
                    hasFeast && inMonth && { color: feastColor },
                  ]}
                >
                  {date.getDate()}
                </Text>
                <View style={styles.markRow}>
                  {hasFeast && inMonth && <View style={[styles.mark, { backgroundColor: feastColor }]} />}
                  {hasEvent && inMonth && (
                    <View style={[styles.mark, styles.eventMark, { backgroundColor: colors.gold }]} />
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.inkFaint,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellWrap: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    marginBottom: 4,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellActive: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.ink,
  },
  cellText: {
    fontFamily: fonts.serifRegular,
    fontSize: 15,
    color: colors.ink,
  },
  cellTextMuted: {
    color: colors.inkFaint,
    opacity: 0.5,
  },
  markRow: {
    flexDirection: 'row',
    height: 6,
    marginTop: 1,
  },
  mark: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  eventMark: {},
});
