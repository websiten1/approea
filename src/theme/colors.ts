export const colors = {
  // fundal
  cream: '#F7F1E4',
  creamAlt: '#EFE4CC',
  ivory: '#FBF8F1',

  // bordo / vișiniu — culoare principală, veșminte arhierești
  wine: '#5C1220',
  wineDark: '#3B0B15',
  wineSoft: '#7A2230',

  // auriu discret — accent, nu decorativ excesiv
  gold: '#B08A4E',
  goldLight: '#D3B675',
  goldDark: '#8C6B36',

  // albastru bizantin — accent secundar, folosit rar
  byzantine: '#1C2A45',
  byzantineSoft: '#2E3E5C',

  // text
  ink: '#241E19',
  inkSoft: '#6C5F4F',
  inkFaint: '#9A8C77',

  // linii, separatoare
  border: '#DCCEA9',
  borderSoft: '#E8DDBF',

  // stări
  white: '#FFFFFF',
  overlay: 'rgba(36, 30, 25, 0.55)',

  // marcaje calendar liturgic
  feastGreat: '#B08A4E', // praznic împărătesc / mare sărbătoare — cruce aurie
  feastMajor: '#5C1220', // sărbătoare importantă — roșu vișiniu
  feastMinor: '#9A8C77', // sfânt cu cruce neagră — discret
  fastStrict: '#5C1220', // post aspru
  fastOil: '#B08A4E', // dezlegare la ulei
  fastFish: '#1C2A45', // dezlegare la pește
  fastNone: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
