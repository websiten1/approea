export const fonts = {
  serifRegular: 'CormorantGaramond_400Regular',
  serifBold: 'PlayfairDisplay_400Regular',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  sansRegular: 'Cinzel_400Regular',
  sansBold: 'Cinzel_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.serifBold, fontSize: 48, lineHeight: 54 },
  h1: { fontFamily: fonts.serifBold, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fonts.serifBold, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.serifRegular, fontSize: 18, lineHeight: 24 },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 3,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  body: { fontFamily: fonts.serifRegular, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.serifRegular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.serifRegular, fontSize: 12, lineHeight: 16 },
} as const;
