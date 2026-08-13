/**
 * Modelul zilei liturgice ortodoxe.
 *
 * NOTĂ IMPORTANTĂ PENTRU PRODUCȚIE:
 * Datele din src/data/liturgicalCalendar.ts sunt un set DEMO, generat din
 * cunoaștere ortodoxă generală (sărbători fixe, sfinți principali, posturi
 * calculate față de Paști). NU sunt preluate de pe calendar.patriarhia.ro
 * (conținut protejat, proprietatea Patriarhiei Române) și nu sunt garantat
 * exacte zi cu zi. Pentru lansare, sursa oficială trebuie agreată cu
 * Episcopia (fie API/export oficial, fie introducere manuală de către
 * cineva desemnat de Episcopie).
 */

export type FeastRank =
  | 'praznic-imparatesc' // sărbătoare mare, cruce roșie în cerc (Paști, Crăciun, Bobotează...)
  | 'sarbatoare-mare' // sărbătoare importantă cu cruce roșie
  | 'sfant-important' // sfânt cu cruce neagră, pomenire însemnată
  | 'zi-obisnuita';

export type FastingType =
  | 'aspru' // post aspru (fără ulei)
  | 'ulei' // dezlegare la ulei și vin
  | 'peste' // dezlegare la pește
  | 'harti' // harți (dezlegare totală, săptămâna albă etc.)
  | 'fara-post';

export interface LiturgicalDay {
  /** format ISO: YYYY-MM-DD */
  date: string;
  /** sfinții și pomenirile zilei, în ordinea importanței */
  saints: string[];
  /** titlul sărbătorii, dacă e cazul (ex: "Nașterea Domnului") */
  feastName?: string;
  feastRank: FeastRank;
  fasting: FastingType;
  /** numele perioadei de post din care face parte ziua, dacă e cazul */
  fastingPeriod?: string;
  /** zi de post cu dezlegare specială / harți (Bobotează, Crăciun etc.) */
  isHarti?: boolean;
}
