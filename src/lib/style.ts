import type { StyleProp } from 'react-native';

/** Flattens/combines any mix of style objects, arrays, and falsy values into one array RN accepts. */
export function mergeStyles<T>(...styles: Array<StyleProp<T> | false | null | undefined>): StyleProp<T> {
  return styles.filter(Boolean) as StyleProp<T>;
}
