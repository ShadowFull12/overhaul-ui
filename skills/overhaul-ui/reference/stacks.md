# Stack notes

Detect the stack before writing a line. `package.json`, lock file, config files,
`app/` vs `pages/`, `tailwind.config.*` vs `@import "tailwindcss"`.

---

## Tailwind CSS

**Which version?** `@import "tailwindcss"` in a CSS file → v4. `@tailwind base;` +
`tailwind.config.js` → v3. Getting this wrong wastes a whole edit cycle.

### v4 (CSS-first)
- Config lives in CSS via `@theme`. No `tailwind.config.js` unless you `@config` it in.
- `@theme { --color-accent: oklch(…); --font-display: …; }` generates both variables and utilities.
- `@utility` for custom utilities, `@variant` for custom variants, `@source` to add content paths.
- Built-in: container queries (`@container`, `@min-md:`), `starting:` variant for `@starting-style`, `not-*`, `nth-*`, `in-*`, colours in oklch by default, `text-shadow-*`, `mask-*`.
- Removed/renamed: `shadow-sm` → `shadow-xs`, `outline-none` → `outline-hidden`, opacity shorthands (`bg-black/50` still fine), `@apply` needs `@reference` in separate CSS modules.

### Both versions
- Order classes consistently — install `prettier-plugin-tailwindcss` and stop thinking about it.
- Extract a component when a class list repeats. Do not `@apply` your way to a second, invisible design system.
- Use `cn()` (`clsx` + `tailwind-merge`) so consumer classes can override.
- Variants via `cva`/`tailwind-variants`, not string concatenation.
- Arbitrary values (`w-[347px]`) are a smell. Add it to the scale or use a real token.
- Never leave the default `gray-*` palette untouched — see `reference/color.md`.

---

## React

- **Server Components by default** (Next App Router). `"use client"` only where interactivity lives — push it to the leaf, not the layout.
- **Composition over configuration.** Slots and `children` beat 20 props.
- **`data-*` state attributes** for styling (`data-state="open"`), so CSS handles states without prop drilling.
- **Keys are stable IDs**, never array indices. Index keys are the cause of most "the wrong row animated" bugs.
- **Performance:** `useDeferredValue` for filter/search results, `useTransition` for non-urgent state, memo only after measuring. React Compiler makes most manual memoisation unnecessary.
- **Forms:** `useActionState` + server actions, or React Hook Form + Zod. Uncontrolled inputs are faster and simpler than controlled ones for large forms.
- **Effects:** most `useEffect` calls that sync state are bugs. Derive during render, or use an event handler.
- **Refs:** forward them; a component whose root cannot receive a ref cannot be positioned, measured or focused by its consumer.
- **Portals** for overlays, or the native popover API to avoid stacking-context fights.
- **`useId`** for label/input associations in SSR.

---

## Next.js (App Router)

- `next/font` for zero-CLS self-hosted fonts with automatic metric fallbacks. Use it; do not hand-roll `@font-face` here.
- `next/image` with `priority` on the LCP image and correct `sizes`.
- `loading.tsx` skeletons that match the real layout; `error.tsx` per segment; `not-found.tsx`.
- Suspense boundaries around slow data so the shell streams immediately.
- Theme: set `data-theme` in a `<script>` inside `<head>` (or read a cookie in the server layout) to avoid a flash.
- `next/dynamic` for below-fold or interaction-gated components (editors, charts, maps).
- View Transitions: `@view-transition { navigation: auto }` for MPA-style navigations, or the experimental React support.

---

## Vue / Nuxt

- `<script setup>` with typed `defineProps`/`defineEmits`.
- Scoped styles by default; `:deep()` sparingly. CSS variables cross the scope boundary cleanly — use them for theming.
- `<Transition>`/`<TransitionGroup>` classes (`v-enter-from`, `v-enter-active`) map directly to the motion rules in `reference/motion.md`.
- `defineModel()` for two-way bindings. `v-memo` for large static lists.
- Nuxt: `@nuxt/image`, `@nuxt/fonts`, `useColorMode()` for theming, `<NuxtLink prefetch>`.

---

## Svelte / SvelteKit

- Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props`. Prefer `$derived` over `$effect` for computed values.
- Built-in `transition:`/`animate:` directives with `flip` are the cheapest correct list animation available in any framework. `crossfade` for shared-element moves.
- Component styles are scoped automatically; `:global()` only for third-party overrides.
- `+page.server.ts` load functions and progressive-enhancement forms (`use:enhance`) give you a working no-JS baseline for free.

---

## Astro

- Zero JS by default. `client:load` / `client:visible` / `client:idle` per island — `client:visible` for anything below the fold.
- `astro:assets` `<Image>` for optimisation and dimensions.
- View Transitions via `<ClientRouter />`, with `transition:name` for shared elements and `transition:persist` for state that must survive navigation.
- Ideal for content and marketing sites; the right choice when the JS budget matters.

---

## React Native / Expo

Different platform, same principles, different primitives.

- **No CSS.** Tokens are a TS object; theming via `useColorScheme()` and a context.
- **Layout:** flexbox only, no grid. `gap` is supported. `Dimensions`/`useWindowDimensions` for responsive branching.
- **Safe areas:** `react-native-safe-area-context`, `useSafeAreaInsets()`. Every fixed header, tab bar and bottom CTA.
- **Touch:** `Pressable` with `android_ripple` and an iOS opacity/scale press state. `hitSlop` for anything under 44pt. Never a bare `TouchableWithoutFeedback` for a primary action.
- **Motion:** `react-native-reanimated` v3+ — worklets run on the UI thread, so animation survives a busy JS thread. `withSpring` for gestures, `withTiming` + `Easing.bezier` for the durations in `reference/motion.md`. `react-native-gesture-handler` for drag, and `useAnimatedScrollHandler` for scroll-linked motion. Never animate with `setState`.
- **Lists:** `FlatList`/`FlashList` with `keyExtractor`, `getItemLayout` when heights are known, and stable `renderItem`. Never `.map()` a long array.
- **Text:** respect Dynamic Type / font scale. `allowFontScaling` stays true; test at the largest setting. `numberOfLines` + `ellipsizeMode`.
- **Accessibility:** `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint`. Test with VoiceOver and TalkBack.
- **Platform differences are not bugs.** Match the platform: iOS uses back-swipe and sheet modals, Android uses hardware back and ripples. `Platform.select` where it matters.
- **Shadows:** `shadowColor/Offset/Opacity/Radius` on iOS, `elevation` on Android. They do not look the same — set both.

---

## SwiftUI / Jetpack Compose (native)

- Follow the platform HIG first; a web-styled native app feels wrong to its users.
- SwiftUI: `.animation(.spring(duration:bounce:))`, `matchedGeometryEffect` for shared elements, `.accessibilityLabel`, Dynamic Type via semantic fonts (`.body`, `.headline`), materials for translucency.
- Compose: `animateContentSize()`, `AnimatedVisibility`, `Modifier.semantics`, Material 3 motion tokens, `WindowInsets` for safe areas.
- Same rules apply: no `ease-in` enters, exits faster, honour reduce-motion (`accessibilityReduceMotion` / `Settings.Global.ANIMATOR_DURATION_SCALE`).

---

## Styling approaches

| Approach | Use when | Watch for |
|---|---|---|
| Tailwind | Speed, consistency, team scale | Class soup; extract components |
| CSS Modules | Framework-agnostic, plain CSS | No cross-file token sharing without variables |
| Vanilla Extract / Panda | Type-safe tokens, zero runtime | Build complexity |
| styled-components / Emotion | Legacy React codebases | Runtime cost, RSC incompatibility. Don't start new projects here |
| Plain CSS + variables | Small sites, docs, maximum longevity | Discipline required for naming |
| StyleSheet (RN) | React Native | No cascade, no variables |

Never introduce a second styling system into an existing project. Work in what is
there.

---

## Component library baselines

| Library | Nature | Notes |
|---|---|---|
| **Radix Primitives** | Unstyled, accessible behaviour | The accessibility contract, solved. Maintained by WorkOS. MIT |
| **Base UI** | Unstyled, from the Radix/MUI/Floating UI authors | Newer, excellent `--transform-origin` and state attributes. MIT |
| **shadcn/ui** | Copy-in components over Radix/Base UI | You own the code — so you must actually restyle it. Default shadcn *is* a slop tell |
| **React Aria** | Adobe hooks + components | The most rigorous a11y and i18n behaviour available |
| **Ark UI** | Zag-based, cross-framework | React, Vue, Svelte, Solid |
| **MUI / Mantine / Chakra** | Styled systems | Fast to ship, hard to de-brand. Theme heavily or the origin shows |
| **Headless UI** | Tailwind Labs primitives | Smaller surface than Radix |

The rule with any copy-in kit: **restyle the tokens before shipping.** Default
shadcn + default Inter + default gray is the most recognisable AI stack on the web.
