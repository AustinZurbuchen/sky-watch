# Theming Agent

**Owns:** `src/constants/theme.ts`, `src/components/theme/` (`themedText`, `themedTitle`,
`themedView`), `src/hooks/useTheme.ts`, `src/hooks/useColorScheme.ts` + `.web.ts`, `src/global.css`,
and the `userInterfaceStyle` / splash / adaptive-icon colors in `app.json`.

**Read this when:** adding a color, a text style, a spacing token, or anything that changes how the
app looks globally.

## Dark-only, but theme-aware

The app ships dark-only: `userInterfaceStyle: "dark"` in `app.json` and `DarkTheme` in
`src/app/_layout.tsx`. `Colors` still defines a full light palette and `useTheme()` picks by scheme,
so light mode is one config flip away.

**That only holds if you go through the primitives.** A hardcoded `color: '#fff'` is invisible today
and broken the day light mode turns on. Use `ThemedText` / `ThemedTitle` / `ThemedView`, or
`useTheme()` for a color you apply yourself.

## The token set

```ts
Colors.dark = {
  text:               '#ffffff',
  background:         '#0a0d1a',
  backgroundElement:  '#212225',
  backgroundSelected: '#2E3135',
  textSecondary:      '#B0B4BA',
  hazardColor:        '#ff6060',
}
```

`Colors.light` has the same keys — the object is `as const` and `ThemeColor` is derived as
`keyof Colors.light & keyof Colors.dark`, so **a key added to one side and not the other silently
disappears from `ThemeColor`** and `themeColor="yourNewKey"` stops typechecking. Always add to both.

```ts
Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 }
```

Use these for `padding`, `margin`, and `gap`. Raw numbers stay acceptable for `borderRadius`,
`borderWidth`, `fontSize`, and fixed dimensions — Spacing doesn't model those.

Also exported: `Fonts` (a `Platform.select` of ios/web/default families, `mono` used by
`ThemedText type="code"`), `BottomTabInset` (ios 50 / android 80 — add it to screen bottom padding so
content clears the native tab bar), `MaxContentWidth` (800 — keeps screens readable on tablet/web).

## `useTheme` and `useColorScheme`

```ts
export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme ?? 'dark'];
}
```

`useTheme()` returns the palette object; index it (`theme.textSecondary`). `useColorScheme` is
platform-split (`.ts` / `.web.ts`) because web needs a hydration-safe read — change one, check the
other.

Outside React, use `Colors.dark.*` directly. There's no hook available and the app is dark-only.

## `ThemedText`

```tsx
<ThemedText type="small" themeColor="textSecondary">…</ThemedText>
```

`type` selects a size/weight preset — `default` (16/500), `title` (32/700), `small` (14/500),
`smallBold` (14/700), `subtitle` (18/600, 50% opacity), `link`, `linkPrimary`, `code`. `themeColor`
picks a `Colors` key, defaulting to `text`. A `style` prop is applied last and wins.

**Adding a text variant:** add the string to the `type` union, add a branch to the style array *in
the same order as the union*, and add the entry to `StyleSheet.create`. Prefer a new variant over
one-off `fontSize` overrides scattered across components — that's how the type list earns its keep.

`linkPrimary` hardcodes `#3c87f7`. If you touch it, move it into `Colors` as `linkColor` (both
palettes) rather than adding another literal.

## Known hardcoded colors — the token set is mostly bypassed

This is bigger than it looks. **~45 hex literals across 10 component files** ignore `Colors`
entirely: `AsteroidCard`, `dayPill`, `statBox`, `learnCard`, `learn/link`, `emptyState`,
`errorState`, `loadingState`, all three `settings/*` files, and `asteroid/[id].tsx`. The accent
`#4a9eff` appears 14 times; the secondary text `#6b7599` 11 times.

```bash
grep -rn '#[0-9a-fA-F]\{6\}' src/components src/app | wc -l
```

Consequence: `useTheme()` is largely decorative today. Flipping `userInterfaceStyle` to light would
produce an unreadable app, and a brand color change is a 45-site find-and-replace.

**Don't add more literals anywhere.** The incremental fix: add `accent`, `textMuted`, `card`,
`cardBorder`, `badgeSafeBg`, `badgeHazardBg` to **both** palettes, then convert one component folder
per commit — as its own change, not smuggled into a feature commit.

**Do it together with backlog item 1** ([BACKLOG.md](../BACKLOG.md)): the card fill is only 1.08:1
against the background and is due to be lightened. Converting a component to tokens means touching
those exact colours, so pick the new values then rather than tokenising the current, too-dark ones
and editing every call site twice. That item carries the measured ratios and a candidate ladder.

`app.json` repeats `#0a0d1a` for the splash background and Android adaptive-icon background. Those
can't reference `theme.ts` (they're build-time config). If `Colors.dark.background` changes, change
them too, and rebuild — config changes don't hot-reload.

## Checklist

- [ ] New color key added to **both** `Colors.light` and `Colors.dark`
- [ ] Spacing/padding uses `Spacing` tokens
- [ ] No new hex literals in components
- [ ] New `ThemedText` type added to the union, the style array, and the stylesheet
- [ ] `useColorScheme.ts` and `.web.ts` still agree
- [ ] `app.json` colors updated if the background changed, and rebuilt

## Sync

Mirrors the **Theming** and **Styles** conventions in `CLAUDE.md`. Change either → update both;
component-level usage is in [component-agent](component-agent.md), and `app.json` color changes are
also a [deployment-agent](deployment-agent.md) concern.
