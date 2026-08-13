import type { FastingType, FeastRank } from '../types/liturgical';

export interface FixedFeast {
  month: number; // 1-12
  day: number;
  feastName?: string;
  saints: string[];
  rank: FeastRank;
  fastingOverride?: FastingType;
  isHarti?: boolean;
}

/**
 * Sărbători și sfinți cu dată fixă, din cunoaștere ortodoxă generală.
 * Set DEMO — vezi nota din src/types/liturgical.ts.
 */
export const FIXED_FEASTS: FixedFeast[] = [
  { month: 1, day: 1, feastName: 'Tăierea împrejur cea după trup a Domnului', saints: ['Sf. Vasile cel Mare'], rank: 'praznic-imparatesc', isHarti: true },
  { month: 1, day: 6, feastName: 'Botezul Domnului (Boboteaza)', saints: ['Botezul Domnului'], rank: 'praznic-imparatesc', isHarti: true },
  { month: 1, day: 7, saints: ['Soborul Sf. Ioan Botezătorul'], rank: 'sarbatoare-mare', isHarti: true },
  { month: 1, day: 30, saints: ['Sfinții Trei Ierarhi: Vasile cel Mare, Grigorie Teologul, Ioan Gură de Aur'], rank: 'sarbatoare-mare' },
  { month: 2, day: 1, saints: ['Sf. Mc. Trifon'], rank: 'sfant-important' },
  { month: 2, day: 2, feastName: 'Întâmpinarea Domnului', saints: ['Întâmpinarea Domnului'], rank: 'praznic-imparatesc' },
  { month: 2, day: 10, saints: ['Sf. Sfințit Mc. Haralambie'], rank: 'sarbatoare-mare' },
  { month: 3, day: 9, saints: ['Sfinții 40 de Mucenici din Sevastia'], rank: 'sarbatoare-mare', fastingOverride: 'ulei' },
  { month: 3, day: 25, feastName: 'Buna Vestire', saints: ['Buna Vestire'], rank: 'praznic-imparatesc', fastingOverride: 'peste' },
  { month: 4, day: 23, saints: ['Sf. Mare Mc. Gheorghe, Purtătorul de Biruință'], rank: 'sarbatoare-mare' },
  { month: 5, day: 21, saints: ['Sf. Împărați Constantin și Elena'], rank: 'sarbatoare-mare' },
  { month: 6, day: 24, saints: ['Nașterea Sf. Ioan Botezătorul'], rank: 'sarbatoare-mare' },
  { month: 6, day: 29, saints: ['Sf. Apostoli Petru și Pavel'], rank: 'sarbatoare-mare' },
  { month: 7, day: 20, saints: ['Sf. Prooroc Ilie Tesviteanul'], rank: 'sarbatoare-mare' },
  { month: 7, day: 27, saints: ['Sf. Mare Mc. Pantelimon, Vindecătorul'], rank: 'sarbatoare-mare' },
  { month: 8, day: 6, feastName: 'Schimbarea la Față', saints: ['Schimbarea la Față a Domnului'], rank: 'praznic-imparatesc', fastingOverride: 'peste' },
  { month: 8, day: 15, feastName: 'Adormirea Maicii Domnului', saints: ['Adormirea Maicii Domnului'], rank: 'praznic-imparatesc', isHarti: true },
  { month: 8, day: 29, saints: ['Tăierea Capului Sf. Ioan Botezătorul'], rank: 'sarbatoare-mare', fastingOverride: 'aspru' },
  { month: 9, day: 8, feastName: 'Nașterea Maicii Domnului', saints: ['Nașterea Maicii Domnului'], rank: 'praznic-imparatesc' },
  { month: 9, day: 14, feastName: 'Înălțarea Sfintei Cruci', saints: ['Înălțarea Sfintei Cruci'], rank: 'praznic-imparatesc', fastingOverride: 'aspru' },
  { month: 10, day: 14, saints: ['Sf. Cuvioasă Parascheva'], rank: 'sarbatoare-mare' },
  { month: 10, day: 26, saints: ['Sf. Mare Mc. Dimitrie, Izvorâtorul de Mir'], rank: 'sarbatoare-mare' },
  { month: 11, day: 8, saints: ['Soborul Sf. Arhangheli Mihail și Gavriil'], rank: 'sarbatoare-mare' },
  { month: 11, day: 21, feastName: 'Intrarea în Biserică a Maicii Domnului', saints: ['Intrarea în Biserică a Maicii Domnului'], rank: 'praznic-imparatesc' },
  { month: 11, day: 30, saints: ['Sf. Apostol Andrei cel Întâi Chemat, Ocrotitorul României'], rank: 'sarbatoare-mare' },
  { month: 12, day: 4, saints: ['Sf. Mare Mc. Varvara'], rank: 'sfant-important' },
  { month: 12, day: 6, saints: ['Sf. Ierarh Nicolae, Arhiepiscopul Mirelor Lichiei'], rank: 'sarbatoare-mare' },
  { month: 12, day: 12, saints: ['Sf. Cuv. Spiridon al Trimitundei'], rank: 'sfant-important' },
  { month: 12, day: 20, saints: ['Sf. Sfințit Mc. Ignatie Teoforul'], rank: 'sfant-important' },
  { month: 12, day: 25, feastName: 'Nașterea Domnului', saints: ['Nașterea Domnului (Crăciunul)'], rank: 'praznic-imparatesc', isHarti: true },
  { month: 12, day: 26, saints: ['Soborul Maicii Domnului'], rank: 'sarbatoare-mare' },
  { month: 12, day: 27, saints: ['Sf. Întâi Mc. și Arhidiacon Ștefan'], rank: 'sarbatoare-mare' },
];

/** Sfinți de completare pentru zilele fără sărbătoare fixă majoră — set DEMO, ilustrativ. */
export const GENERIC_SAINTS_POOL: string[] = [
  'Sf. Mc. Iustin', 'Sf. Cuv. Antonie cel Mare', 'Sf. Ier. Atanasie cel Mare',
  'Sf. Mc. Ecaterina', 'Sf. Cuv. Sava cel Sfințit', 'Sf. Ier. Nifon Patriarhul',
  'Sf. Mc. Mina', 'Sf. Ap. Toma', 'Sf. Cuv. Paisie de la Neamț',
  'Sf. Ier. Calinic de la Cernica', 'Sf. Cuv. Ioan Iacob Hozevitul',
  'Sf. Mc. Filofteia de la Curtea de Argeș', 'Sf. Cuv. Dimitrie cel Nou',
  'Sf. Ier. Iosif cel Nou de la Partoș', 'Sf. Cuv. Antipa de la Calapodești',
  'Sf. Mc. Chiriac', 'Sf. Ier. Grigorie Palama', 'Sf. Cuv. Efrem Sirul',
  'Sf. Mc. Anastasia Izbăvitoarea de Otravă', 'Sf. Ap. Filip',
  'Sf. Cuv. Teodora de la Sihla', 'Sf. Mc. Vartolomeu', 'Sf. Cuv. Sofronie al Ierusalimului',
  'Sf. Ier. Chiril și Metodie, luminătorii slavilor', 'Sf. Mc. Iuliana',
  'Sf. Cuv. Simeon Stâlpnicul', 'Sf. Ier. Ioan cel Milostiv', 'Sf. Cuv. Macarie cel Mare',
  'Sf. Mc. Vlasie', 'Sf. Cuv. Sisoe cel Mare', 'Sf. Ier. Grigorie Decapolitul',
];
