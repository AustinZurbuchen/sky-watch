# Component Agent

**Owns:** everything under `src/components/`, plus the props interfaces in `src/types/`.

**Read this when:** building a new component, editing an existing one, adding styles, or dealing
with a `.web.tsx` split.

## Folder layout

One folder per feature area, named for the area, lowercase:

```
components/
  animated/    animatedIcon.tsx | .web.tsx | .module.css  — splash overlay
  apptabs/     appTabs.tsx | .web.tsx                     — tab bar
  asteroid/    AsteroidCard.tsx
  daypill/     dayPill.tsx
  feedback/    loadingState.tsx, errorState.tsx, index.ts
  flyby/       flyby.tsx                                  — list for the selected date
  learn/       learnCard.tsx, link.tsx
  settings/    settingsComponents.tsx, settingsRow.tsx, settingsSection.tsx
  theme/       themedText.tsx, themedTitle.tsx, themedView.tsx
  ui/          scrollView.tsx
  watchlist/   emptyState.tsx
  week/        weekStrip.tsx, weekStats.tsx, statBox.tsx
  externalLink.tsx
```

New component that doesn't fit an existing area → new folder. Add a barrel `index.ts` only if the
folder exports several things used together (`feedback/` does).

Filenames are **camelCase** (`weekStrip.tsx`, `settingsRow.tsx`). `AsteroidCard.tsx` is the one
holdout; match camelCase for anything new.

## Component shape

```tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/theme/themedText';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { FooProps } from '@/types';

export const Foo = ({ title, isActive }: FooProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, isActive && styles.active]}>
      <ThemedText type="small">{title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  active: {
    opacity: 1,
  },
});
```

- Named `export const`, arrow function, destructured props. Screens under `src/app/` are
  `export default function` — that's the router's requirement, not a style preference.
- Props interfaces that are shared or non-trivial go in `src/types/` and import from the `@/types`
  barrel (`AsteroidCardProps` lives in `types/asteroid.ts`). Purely local one-off props may stay
  inline.
- `StyleSheet.create` at the **bottom** of the file, one per file.
- Conditional styles are array entries — `[styles.base, isX && styles.variant]` — never string
  concatenation or a ternary that builds an object inline.

## Styling rules

- Padding, margin, and `gap` use `Spacing` tokens from `@/constants/theme`
  (`half 2 · one 4 · two 8 · three 16 · four 24 · five 32 · six 64`). Raw numbers only for things
  Spacing doesn't model: `borderRadius`, `width`/`height`, `borderWidth`, `fontSize`.
- Colors come from `useTheme()` or `Colors.dark.*`, not hex literals. `AsteroidCard` has hardcoded
  card hexes (`#111627`, `#1e2340`, …) that predate the token set — don't add more; if you touch that
  file, prefer moving them into `Colors`. See [theming-agent](theming-agent.md).
- Text goes through `ThemedText` / `ThemedTitle`, containers through `ThemedView`. Raw `Text`/`View`
  from `react-native` is fine for layout wrappers with no color of their own.
- Screen-level layout uses `SafeAreaView` from `react-native-safe-area-context`, plus
  `BottomTabInset` and `MaxContentWidth` from the theme so the content clears the native tab bar and
  doesn't stretch on tablets/web.

## Reading data

Components read from zustand, never from `src/api/`:

```ts
const asteroidsByDate = useAsteroidStore((s) => s.asteroidsByDate);
```

Select one slice per call. Derived numbers come from `src/utils/utils.ts` (`getAsteroidCount`,
`getHazardousCount`, `getTodaysCount`, `getDays`) — add new derivations there rather than inlining
loops in JSX. See [state-agent](state-agent.md).

Loading and error states use `src/components/feedback/`; empty states are per-feature
(`watchlist/emptyState.tsx`).

## Settings controls

`ChevronValue` (`components/settings/settingsComponents.tsx`) cycles to the next value on tap while
showing a `>` chevron, which implies a drill-in screen that doesn't exist. Backlog item 2
([BACKLOG.md](../BACKLOG.md)) replaces it with a real picker. If you're adding a setting before that
lands, don't extend the cycling pattern to a third option — it stops being discoverable at all.

## Platform splits

A `.web.tsx` sibling overrides the native file on web — Metro picks it by extension. Existing splits:

| Native | Web | Why |
|---|---|---|
| `apptabs/appTabs.tsx` | `appTabs.web.tsx` | `expo-router/unstable-native-tabs` has no web implementation |
| `animated/animatedIcon.tsx` | `animatedIcon.web.tsx` (+ `.module.css`) | Reanimated splash vs. CSS animation |
| `hooks/useColorScheme.ts` | `useColorScheme.web.ts` | web needs a hydration-safe read |

**When you change one side, check the other.** The two files must export the same names with the
same props — a divergence typechecks fine and only breaks at runtime on one platform.

For small differences inside a shared file use `Platform.select` (as `Fonts` and `BottomTabInset` do)
instead of creating a split.

## The React Compiler

`reactCompiler` is enabled in `app.json`. It auto-memoizes, so **don't add `useMemo`, `useCallback`,
or `React.memo` by reflex** — they're usually noise now. It also enforces the rules of hooks
strictly: no conditional hooks, no mutating props or state objects in place, no reading a ref during
render. Code that violates those may fail to compile or behave differently than it did.

## Checklist

- [ ] `@/` imports, types from the `@/types` barrel
- [ ] Named `export const`, props destructured, `StyleSheet.create` at the bottom
- [ ] `Spacing` tokens for spacing, theme colors for color
- [ ] `ThemedText`/`ThemedView` instead of raw text/containers with color
- [ ] Store read as a single slice; no `fetch`, no `snake_case`
- [ ] `.web.tsx` counterpart updated if one exists
- [ ] No `console.log`
- [ ] `npm run lint` and `npx tsc --noEmit | grep '^src/'` clean

## Sync

Mirrors the **Conventions** section of `CLAUDE.md` (Files, Components, Styles, Platform splits).
Change either → update both, and check [theming-agent](theming-agent.md) for anything color- or
token-related.
