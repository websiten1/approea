export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

const LUNI_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];

const LUNI_RO_SCURT = [
  'ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'noi', 'dec',
];

const ZILE_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
const ZILE_RO_SCURT = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

export function numeLuna(monthIndex: number): string {
  return LUNI_RO[monthIndex];
}

export function numeLunaScurt(monthIndex: number): string {
  return LUNI_RO_SCURT[monthIndex];
}

export function numeZi(dayIndex: number): string {
  return ZILE_RO[dayIndex];
}

export function numeZiScurt(dayIndex: number): string {
  return ZILE_RO_SCURT[dayIndex];
}

export function formatDataLunga(date: Date): string {
  return `${numeZi(date.getDay())}, ${date.getDate()} ${numeLuna(date.getMonth())} ${date.getFullYear()}`;
}

export function formatDataScurta(date: Date): string {
  return `${date.getDate()} ${numeLunaScurt(date.getMonth())} ${date.getFullYear()}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Ziua săptămânii, cu Luni = 0 ... Duminică = 6 (convenție românească). */
function mondayIndex(jsDow: number): number {
  return (jsDow + 6) % 7;
}

export interface MonthGridCell {
  date: Date;
  inMonth: boolean;
}

/** Grid de 42 de zile (6 săptămâni, Luni-Duminică) pentru o lună dată. */
export function getMonthGridDays(year: number, month: number): MonthGridCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = mondayIndex(firstOfMonth.getDay());
  const gridStart = addDays(firstOfMonth, -startOffset);

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }
  return cells;
}
