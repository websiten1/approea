export const fonts = {
  serifRegular: 'PTSerif_400Regular',
  serifBold: 'PTSerif_700Bold',
  serifItalic: 'PTSerif_400Regular_Italic',
  sansRegular: 'PTSans_400Regular',
  sansBold: 'PTSans_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.serifBold, fontSize: 34, lineHeight: 40 },
  h1: { fontFamily: fonts.serifBold, fontSize: 26, lineHeight: 32 },
  h2: { fontFamily: fonts.serifBold, fontSize: 20, lineHeight: 26 },
  h3: { fontFamily: fonts.serifRegular, fontSize: 17, lineHeight: 23 },
  label: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1.2, lineHeight: 16 },
  body: { fontFamily: fonts.sansRegular, fontSize: 15, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.sansRegular, fontSize: 13, lineHeight: 19 },
  caption: { fontFamily: fonts.sansRegular, fontSize: 12, lineHeight: 16 },
} as const;
