export const colors = {
  // fundal — alb, ca în aplicația Base44
  cream: '#FFFFFF',
  creamAlt: '#FAFAFA',
  ivory: '#FFFFFF',

  // salvie — accent principal (fostă culoare "wine")
  wine: '#65834D',
  wineDark: '#4F6B3D',
  wineSoft: '#8CA377',

  // salvie — accent (fostă culoare "gold"; Base44 nu are un al treilea accent,
  // doar salvie + albastru, alternate pe secțiuni)
  gold: '#65834D',
  goldLight: '#8CA377',
  goldDark: '#4F6B3D',

  // albastru "solia" — accent secundar, folosit rar
  byzantine: '#244F7F',
  byzantineSoft: '#4A6F99',

  // text
  ink: '#000000',
  inkSoft: 'rgba(0, 0, 0, 0.55)',
  inkFaint: 'rgba(0, 0, 0, 0.4)',

  // linii, separatoare
  border: 'rgba(0, 0, 0, 0.15)',
  borderSoft: 'rgba(0, 0, 0, 0.08)',

  // stări
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // marcaje calendar liturgic — armonizate cu noua paletă alb/salvie/albastru
  feastGreat: '#B08A4E', // praznic împărătesc / mare sărbătoare — auriu
  feastMajor: '#A6473B', // sărbătoare importantă — roșu discret
  feastMinor: 'rgba(0, 0, 0, 0.4)', // sfânt cu pomenire însemnată — discret
  fastStrict: '#A6473B', // post aspru
  fastOil: '#B08A4E', // dezlegare la ulei
  fastFish: '#244F7F', // dezlegare la pește
  fastNone: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
