import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';
import { getMonthGridDays, isSameDay, numeLuna, numeZiScurt } from '@/utils/date';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  style?: ViewStyle;
}

/** Generic month-grid date picker built on the shared getMonthGridDays helper. */
export function Calendar({ selected, onSelect, month, onMonthChange, style }: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(() => month ?? new Date());
  const displayedMonth = month ?? internalMonth;

  const changeMonth = (next: Date) => {
    if (month === undefined) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const goToPrevMonth = () => {
    changeMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    changeMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1));
  };

  const year = displayedMonth.getFullYear();
  const monthIndex = displayedMonth.getMonth();
  const cells = getMonthGridDays(year, monthIndex);
  const today = new Date();

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View style={mergeStyles<ViewStyle>(styles.root, style)}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={goToPrevMonth}
          style={({ pressed }) => mergeStyles<ViewStyle>(styles.navButton, pressed && styles.navButtonPressed)}
        >
          <ChevronLeft size={18} color={uiColors.foreground} />
        </Pressable>
        <Text style={styles.headerLabel}>
          {numeLuna(monthIndex)} {year}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={goToNextMonth}
          style={({ pressed }) => mergeStyles<ViewStyle>(styles.navButton, pressed && styles.navButtonPressed)}
        >
          <ChevronRight size={18} color={uiColors.foreground} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {[0, 1, 2, 3, 4, 5, 6].map((mondayFirstIndex) => {
          // numeZiScurt is JS-Sunday-indexed (0=Duminică); grid weeks start on Monday.
          const jsDow = (mondayFirstIndex + 1) % 7;
          return (
            <View key={mondayFirstIndex} style={styles.weekdayCell}>
              <Text style={styles.weekdayLabel}>{numeZiScurt(jsDow)}</Text>
            </View>
          );
        })}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((cell) => {
            const isSelected = selected ? isSameDay(cell.date, selected) : false;
            const isToday = isSameDay(cell.date, today);
            return (
              <Pressable
                key={cell.date.toISOString()}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelect?.(cell.date)}
                style={({ pressed }) =>
                  mergeStyles<ViewStyle>(
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    !isSelected && isToday && styles.dayCellToday,
                    pressed && styles.dayCellPressed
                  )
                }
              >
                <Text
                  style={mergeStyles<TextStyle>(
                    styles.dayText,
                    !cell.inMonth && styles.dayTextDimmed,
                    isSelected && styles.dayTextSelected
                  )}
                >
                  {cell.date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const CELL_SIZE = 36;

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: uiColors.foreground,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPressed: {
    opacity: 0.6,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekdayCell: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  weekdayLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: uiColors.mutedForeground,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: uiColors.primary,
  },
  dayCellToday: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: uiColors.ring,
  },
  dayCellPressed: {
    opacity: 0.7,
  },
  dayText: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: uiColors.foreground,
  },
  dayTextDimmed: {
    color: uiColors.mutedForeground,
    opacity: 0.5,
  },
  dayTextSelected: {
    fontFamily: fonts.sansBold,
    color: uiColors.primaryForeground,
  },
});
