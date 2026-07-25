# Playbook — mobile app UI

React Native, Expo, or native. Different constraints from the web: no cascade, no hover,
platform conventions that users already know, and a device that is held in one hand.

---

## Platform first

Match the platform. A web-styled app feels wrong to its users, and an iOS-styled Android
app feels wrong to half of them.

| | iOS | Android |
|---|---|---|
| Back | Left-edge swipe + a back button in the header | Hardware/gesture back — **must** be handled |
| Modal | Sheet from the bottom, drag to dismiss | Full-screen or bottom sheet |
| Press feedback | Opacity/scale | Ripple from the touch point |
| Tabs | Bottom bar, max 5 | Bottom navigation, max 5 |
| Typography | SF Pro, 17px body | Roboto, 16sp body |
| Elevation | Subtle shadows, blur materials | Material elevation |
| Switch | iOS switch | Material switch |
| Haptics | Fine-grained (`impactLight` on selection) | Coarser |

`Platform.select` where it genuinely matters. Do not fork the whole design.

---

## Layout

- **Safe areas, always.** `useSafeAreaInsets()` on every header, tab bar and bottom CTA. Content under the notch or the home indicator is the most visible mobile defect
- 4/8dp spacing rhythm. Screen padding 16–20dp
- **Flexbox only** — no CSS grid in RN. `gap` is supported
- Thumb zone: primary actions in the lower half of the screen
- Scroll content needs bottom inset so it is not hidden behind a fixed CTA
- Test at 320dp (small Android), 390dp (iPhone), 430dp (Pro Max), and a tablet
- Landscape: at minimum, do not break

---

## Touch

- **44×44pt (iOS) / 48×48dp (Android) minimum.** Use `hitSlop` when the visual is smaller
- 8dp minimum between adjacent targets
- **Press feedback within 80–150ms**, always. A tap with no response reads as a broken app
- `Pressable` with `android_ripple` plus an iOS opacity/scale state. Never a bare `TouchableWithoutFeedback` on a primary action
- Press states must not shift layout
- One primary gesture per region. Nested tap/drag/swipe conflicts cause accidental actions
- Do not fight the OS back gesture with a horizontal swipe at the screen edge

---

## Typography

- Body 16–17, labels 13–15, captions 12
- **Respect Dynamic Type / font scale.** Keep `allowFontScaling` true and test at the largest setting — this is where fixed-height containers break
- Use `min-height`, never fixed heights, around text
- `numberOfLines` + `ellipsizeMode` on anything that can overflow
- No emoji as structural icons. Use `@expo/vector-icons`, `react-native-svg`, or SF Symbols

---

## Theming

- No CSS variables. A typed token object plus a `useTheme()` hook (`reference/design-tokens.md` §5)
- `useColorScheme()` for system theme; allow an explicit override
- Never hardcode a colour in a `StyleSheet`
- Both themes verified independently — dark mode on mobile is used more than on desktop
- Shadows differ per platform: `shadowColor/Offset/Opacity/Radius` on iOS, `elevation` on Android. Set both; they will not match exactly

---

## Motion

- **`react-native-reanimated` v3+.** Worklets run on the UI thread, so animation survives a busy JS thread. Never animate with `setState`
- `withSpring` for gestures and anything draggable; `withTiming` + `Easing.bezier` for standard transitions
- Durations and easing from `reference/motion.md` — the numbers transfer
- `react-native-gesture-handler` for drag; velocity-based dismissal (~0.11 px/ms) rather than a distance threshold; damping past boundaries
- Shared-element transitions for list→detail
- Honour reduce-motion: `AccessibilityInfo.isReduceMotionEnabled()`
- Do not animate navigation in a daily-use app

---

## Lists

The most common performance failure in RN.

- `FlatList` or `FlashList`, never `.map()` over a long array
- Stable `keyExtractor`, `getItemLayout` when heights are known, memoised `renderItem`
- `windowSize` and `initialNumToRender` tuned to the row height
- Pull-to-refresh where the data is user-refreshable
- Loading (skeleton rows), empty, and error states per list
- Preserve scroll position across navigation

---

## Offline and interruption

Mobile apps lose connectivity mid-action. This is normal, not exceptional.

- Detect and show connectivity state without being annoying about it
- Queue mutations and retry; tell the user you did
- Never lose entered data on backgrounding, a call, or a low-memory kill
- Handle the app returning to foreground: refresh stale data, restore state
- Cache what makes the app usable offline

---

## Accessibility

- `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint` on every control
- Focus order matches visual order
- Test with **VoiceOver** and **TalkBack** — they behave differently
- 44/48pt targets; Dynamic Type at maximum; reduce-motion; high-contrast
- Never colour-only encoding
- Announce async results (`AccessibilityInfo.announceForAccessibility`)

---

## Gate

- [ ] Safe areas respected on every fixed element
- [ ] Android hardware back handled on every screen
- [ ] All targets >= 44pt/48dp with press feedback under 150ms
- [ ] Platform conventions followed for back, modals, feedback and tabs
- [ ] Dynamic Type at the largest setting does not break any layout
- [ ] Both themes verified; shadows set for both platforms
- [ ] Long lists virtualised with stable keys
- [ ] Loading, empty and error states per list and per async surface
- [ ] Nothing lost on backgrounding or connectivity loss
- [ ] VoiceOver **and** TalkBack passes
- [ ] Reduce-motion honoured
- [ ] Tested at 320/390/430dp, tablet, and landscape
