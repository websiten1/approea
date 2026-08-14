/**
 * Minimal class-variance-authority equivalent for React Native, where there is no
 * className to merge — variants resolve to StyleSheet-able objects instead.
 */
export function createVariants<V extends Record<string, Record<string, object>>>(config: {
  base?: object;
  variants: V;
  defaultVariants?: { [K in keyof V]?: keyof V[K] };
}) {
  type Props = { [K in keyof V]?: keyof V[K] };

  return function resolveVariants(props?: Props): object[] {
    const styles: object[] = [];
    if (config.base) styles.push(config.base);
    for (const key in config.variants) {
      const chosen = (props?.[key] ?? config.defaultVariants?.[key]) as string | undefined;
      const variantGroup = config.variants[key];
      if (chosen && variantGroup[chosen]) {
        styles.push(variantGroup[chosen]);
      }
    }
    return styles;
  };
}
