/**
 * shadcn/ui projects typically keep a separate `sonner.tsx` that configures the `sonner`
 * package's <Toaster/> with the app's theme. There's no `sonner` package here (web/DOM-only,
 * not installed) — our RN toast system in `./toast` already covers that role, so this file
 * just re-exports it under the `sonner` import path for parity with shadcn's file layout:
 * both `@/components/ui/toast` and `@/components/ui/sonner` resolve to the same
 * `Toaster`/`toast`/`useToast`.
 */
export { Toaster, toast, useToast } from './toast';
