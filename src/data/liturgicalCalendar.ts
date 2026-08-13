import type { FastingType, LiturgicalDay } from '../types/liturgical';
import { FIXED_FEASTS, GENERIC_SAINTS_POOL } from './fixedFeasts';
import { getPaschaDate } from './pascha';
import { addDays, toISODate } from '../utils/date';

function isBetween(date: Date, start: Date, end: Date): boolean {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

/**
 * Generează calendarul liturgic complet pentru un an — set DEMO.
 * Vezi nota din src/types/liturgical.ts privind sursa oficială pentru producție.
 */
export function buildLiturgicalYear(year: number): Map<string, LiturgicalDay> {
  const pascha = getPaschaDate(year);

  const cleanMonday = addDays(pascha, -48);
  const lazarSaturday = addDays(pascha, -8);
  const floriiSunday = addDays(pascha, -7);
  const passionWeekStart = addDays(pascha, -6);
  const brightWeekEnd = addDays(pascha, 6);
  const pentecost = addDays(pascha, 49);
  const pentecostWeekEnd = addDays(pentecost, 6);
  const apostlesFastStart = addDays(pentecost, 7);
  const apostlesFastEnd = new Date(year, 5, 28);
  const dormitionFastStart = new Date(year, 7, 1);
  const dormitionFastEnd = new Date(year, 7, 14);
  const nativityFastStart = new Date(year, 10, 15);
  const nativityFastStrictStart = new Date(year, 11, 20);
  const nativityFastEnd = new Date(year, 11, 24);

  const result = new Map<string, LiturgicalDay>();

  let cursor = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  let dayIndex = 0;

  while (cursor.getTime() <= end.getTime()) {
    const iso = toISODate(cursor);
    const dow = cursor.getDay(); // 0 = duminică
    const fixed = FIXED_FEASTS.find((f) => f.month === cursor.getMonth() + 1 && f.day === cursor.getDate());

    let fasting: FastingType = dow === 3 || dow === 5 ? 'aspru' : 'fara-post';
    let fastingPeriod: string | undefined;
    let isHarti = false;

    if (isBetween(cursor, cleanMonday, addDays(pascha, -1))) {
      fastingPeriod = 'Postul Mare';
      if (isBetween(cursor, passionWeekStart, addDays(pascha, -1))) {
        fasting = 'aspru';
      } else if (dow === 0 || dow === 6) {
        fasting = 'ulei';
      } else {
        fasting = 'aspru';
      }
      if (toISODate(cursor) === toISODate(lazarSaturday) || toISODate(cursor) === toISODate(floriiSunday)) {
        fasting = 'peste';
      }
    } else if (isBetween(cursor, pascha, brightWeekEnd) || isBetween(cursor, pentecost, pentecostWeekEnd)) {
      fasting = 'fara-post';
      fastingPeriod = undefined;
      isHarti = true;
    } else if (isBetween(cursor, apostlesFastStart, apostlesFastEnd)) {
      fastingPeriod = 'Postul Sfinților Apostoli';
      fasting = dow === 3 || dow === 5 ? 'aspru' : 'ulei';
    } else if (isBetween(cursor, dormitionFastStart, dormitionFastEnd)) {
      fastingPeriod = 'Postul Adormirii Maicii Domnului';
      fasting = 'aspru';
    } else if (isBetween(cursor, nativityFastStart, nativityFastEnd)) {
      fastingPeriod = 'Postul Nașterii Domnului (Crăciunului)';
      fasting = cursor.getTime() >= nativityFastStrictStart.getTime()
        ? 'aspru'
        : (dow === 3 || dow === 5 ? 'aspru' : 'ulei');
    }

    let saints: string[];
    let feastName: string | undefined;
    let feastRank: LiturgicalDay['feastRank'] = 'zi-obisnuita';

    if (fixed) {
      saints = fixed.saints;
      feastName = fixed.feastName;
      feastRank = fixed.rank;
      if (fixed.fastingOverride) fasting = fixed.fastingOverride;
      if (fixed.isHarti) {
        isHarti = true;
        fasting = 'fara-post';
        fastingPeriod = undefined;
      }
    } else {
      saints = [GENERIC_SAINTS_POOL[dayIndex % GENERIC_SAINTS_POOL.length]];
      feastRank = dayIndex % 7 === 0 ? 'sfant-important' : 'zi-obisnuita';
    }

    result.set(iso, {
      date: iso,
      saints,
      feastName,
      feastRank,
      fasting,
      fastingPeriod,
      isHarti: isHarti || undefined,
    });

    cursor = addDays(cursor, 1);
    dayIndex += 1;
  }

  return result;
}

let cache: { year: number; data: Map<string, LiturgicalDay> } | null = null;

export function getLiturgicalYear(year: number): Map<string, LiturgicalDay> {
  if (cache && cache.year === year) return cache.data;
  const data = buildLiturgicalYear(year);
  cache = { year, data };
  return data;
}

export function getLiturgicalDay(iso: string): LiturgicalDay | undefined {
  const year = Number(iso.slice(0, 4));
  return getLiturgicalYear(year).get(iso);
}
