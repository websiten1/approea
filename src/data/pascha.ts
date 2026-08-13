/**
 * Datele Paștelui ortodox (stil vechi, calculat după Pascalia bisericească),
 * pentru anii acoperiți de datele demo. Sursă: cunoaștere generală ortodoxă.
 * A se verifica/înlocui cu sursă oficială înainte de producție.
 */
const PASCHA_DATES: Record<number, [month: number, day: number]> = {
  2025: [3, 20], // 20 aprilie 2025
  2026: [3, 12], // 12 aprilie 2026
  2027: [4, 2], // 2 mai 2027
};

export function getPaschaDate(year: number): Date {
  const entry = PASCHA_DATES[year];
  if (!entry) {
    throw new Error(`Data Paștelui nu este configurată pentru anul ${year}`);
  }
  const [month, day] = entry;
  return new Date(year, month, day);
}
