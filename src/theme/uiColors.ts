import { colors } from './colors';

/**
 * Semantic tokens for the src/components/ui/* primitive library (the RN port of shadcn/ui).
 * Layered on top of the existing liturgical palette in `colors.ts` — that file stays
 * untouched so nothing already built changes appearance.
 */
export const uiColors = {
  background: colors.cream,
  foreground: colors.ink,

  card: colors.ivory,
  cardForeground: colors.ink,

  popover: colors.white,
  popoverForeground: colors.ink,

  primary: colors.wine,
  primaryForeground: colors.ivory,

  secondary: colors.byzantine,
  secondaryForeground: colors.ivory,

  muted: colors.creamAlt,
  mutedForeground: colors.inkSoft,

  accent: colors.gold,
  accentForeground: colors.ink,

  destructive: '#B23A2E',
  destructiveForeground: colors.white,

  border: colors.border,
  input: colors.border,
  ring: colors.gold,

  // Named accents referenced by the Masthead/Playful/SectionLabel components — exact
  // values extracted from the live Base44 app (getComputedStyle on solia-faith-link.base44.app).
  sage: '#65834D',
  soliaBlue: '#244F7F',
  soliaRed: '#A6473B',
} as const;

export type UiColorToken = keyof typeof uiColors;
