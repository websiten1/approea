/**
 * Base44 app params for Expo. The legacy web version resolved these from URL query
 * params + localStorage (browser-only); native/Expo has neither, and this client is
 * always constructed with `requiresAuth: false`, so there's no token/session to persist.
 * Expo's Metro bundler inlines `EXPO_PUBLIC_`-prefixed env vars into `process.env` at
 * build time on every platform (native + web) — no `expo-constants`/`app.config.ts` needed.
 */
export const appParams = {
  appId: process.env.EXPO_PUBLIC_BASE44_APP_ID ?? '',
  token: undefined as string | undefined,
  functionsVersion: process.env.EXPO_PUBLIC_BASE44_FUNCTIONS_VERSION,
  appBaseUrl: process.env.EXPO_PUBLIC_BASE44_APP_BASE_URL,
};
