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

  // Named accents referenced by the legacy Masthead/Playful/SectionLabel components.
  sage: '#8A9A73',
  soliaBlue: '#3E6491',
  soliaRed: '#B23A2E',
} as const;

export type UiColorToken = keyof typeof uiColors;
