import type { FastingType, FeastRank } from '../types/liturgical';
import { colors } from '../theme/colors';

export function fastingLabel(fasting: FastingType): string {
  switch (fasting) {
    case 'aspru': return 'Post aspru';
    case 'ulei': return 'Dezlegare la ulei';
    case 'peste': return 'Dezlegare la pește';
    case 'harti': return 'Harți — fără post';
    case 'fara-post': return 'Fără post';
  }
}

export function fastingColor(fasting: FastingType): string {
  switch (fasting) {
    case 'aspru': return colors.fastStrict;
    case 'ulei': return colors.fastOil;
    case 'peste': return colors.fastFish;
    case 'harti':
    case 'fara-post':
      return colors.fastNone;
  }
}

export function feastRankColor(rank: FeastRank): string {
  switch (rank) {
    case 'praznic-imparatesc': return colors.feastGreat;
    case 'sarbatoare-mare': return colors.feastMajor;
    case 'sfant-important': return colors.feastMinor;
    case 'zi-obisnuita': return 'transparent';
  }
}

export function isFeastDay(rank: FeastRank): boolean {
  return rank === 'praznic-imparatesc' || rank === 'sarbatoare-mare';
}
