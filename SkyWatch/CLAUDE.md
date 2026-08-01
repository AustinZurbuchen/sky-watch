@AGENTS.md

# SkyWatchNEO

Expo / React Native app (iOS, Android, web) that shows near-Earth asteroid flybys from
NASA's NeoWs API, with a watchlist, hazard notifications, and a learn section.

The app lives in `SkyWatch/` — the repo root is just a wrapper. Run every command from `SkyWatch/`.

## Start here: pick an agent

This file is the index — project overview, commands, and the short version of every rule. The
detailed playbooks live in [`agents/`](agents/README.md), one per area. **Read this file, then open
the one agent file that matches your task.** Don't read all of them.

| Task | Agent |
|---|---|
| NASA requests, response mapping, the API key, caching | [agents/api-manager-agent.md](agents/api-manager-agent.md) |
| zustand stores, persistence, hydration | [agents/state-agent.md](agents/state-agent.md) |
| Building or editing UI, styles, platform splits | [agents/component-agent.md](agents/component-agent.md) |
| Routes, tabs, deep links, screen params | [agents/navigation-agent.md](agents/navigation-agent.md) |
| Notification scheduling, permissions, background task | [agents/notifications-agent.md](agents/notifications-agent.md) |
| Colors, spacing, fonts, `Themed*` primitives | [agents/theming-agent.md](agents/theming-agent.md) |
| Lint/typecheck output, pre-commit verification | [agents/linting-agent.md](agents/linting-agent.md) |
| Commits, branches, pull requests | [agents/pr-agent.md](agents/pr-agent.md) |
| Builds, EAS, `app.json`, store submission | [agents/deployment-agent.md](agents/deployment-agent.md) |
| "How should this be written here?" | [agents/best-practices-agent.md](agents/best-practices-agent.md) |
| Reviewing a diff, hunting regressions, pre-release sweep | [agents/auditor-agent.md](agents/auditor-agent.md) |

**Keep this file and `agents/` in sync.** They are one document split in two: the rule here is the
summary, the agent file is the detail. Any change to one requires the matching change to the other,
in the same commit — including adding a row above when you add an agent file. Each agent file ends
with a **Sync** section naming what it mirrors here. See [agents/README.md](agents/README.md).

Work parked for a future release lives in [BACKLOG.md](BACKLOG.md) — read it before starting
anything in theming or Settings, since two items there want to be done alongside related work.

## Commands

```bash
npm start           # expo start (dev server)
npm run ios         # expo run:ios — native build, required for notifications/background task
npm run ios:release # release build — no __DEV__ UI; use this for App Store screenshots
npm run android     # expo run:android
npm run web         # expo start --web
npm run lint        # expo lint (eslint-config-expo flat config)
npx tsc --noEmit    # typecheck — no test suite exists

npm run screenshots:flatten   # strip alpha from screenshots — App Store rejects it
```

Screenshots live in `screenshots/` at the **repo root** and must be captured from a Release build,
then alpha-flattened. Detail: [deployment](agents/deployment-agent.md).

There is no test runner. Verify changes by running the app.

`ios/` and `android/` are gitignored prebuild output — never commit them, and never hand-edit
files there. Native config belongs in `app.json` (`ios.infoPlist`, `android.permissions`, `plugins`).

## Architecture

```
src/
  app/          expo-router file routes — (tabs)/index|watchlist|learn|settings, asteroid/[id]
  api/          httpClient.ts → nasa.ts → mapper.ts
  store/        zustand stores, one per concern
  hooks/        react-query wrappers + shared UI hooks
  components/   one folder per feature area
  types/        domain + API types, re-exported through index.ts
  constants/    theme.ts (Colors, Spacing, Fonts), constants.ts
  tasks/        expo-task-manager background task
  utils/        pure helpers + notification scheduling
```

**Data flow is one direction:** `httpClient.get<T>()` (URL building, api key, error throw) →
`api/nasa.ts` (one function per endpoint) → `api/mapper.ts` (NASA's `snake_case` response →
our `camelCase` domain types) → `hooks/useAsteroids.ts` (react-query) → zustand store →
components read from the store.

Keep those layers separate. Components never call `fetch` or touch NASA's raw shapes;
only `mapper.ts` knows about `snake_case`. Detail: [api-manager](agents/api-manager-agent.md).

**API key:** `httpClient` resolves in this order — the user's own key from
`useSettingsStore.getState().apiKeyOverride` (Settings → Advanced), then
`process.env.EXPO_PUBLIC_API_KEY`, then `DEMO_KEY`.

`EXPO_PUBLIC_API_KEY` lives in `.env` (gitignored) for local dev and must also exist as an EAS
environment variable, or release builds silently fall through to `DEMO_KEY`. That matters: DEMO_KEY
is capped at ~10 requests/hour **per IP address**, shared with every other caller on that IP, so
shipped builds hitting it fail for users who have done nothing wrong. The project key allows
2000/hour. `EXPO_PUBLIC_*` values are inlined into the JS bundle at build time and are therefore
extractable from the binary — treat this key as public, and never put a billable secret here.

**Server state vs. client state:** react-query owns fetching/caching (`staleTime` 5min, `retry` 2,
configured in `src/app/_layout.tsx`); zustand owns everything the UI reads. `useAsteroids` bridges
them with an effect that pushes `query.data` into `asteroidStore`.
Detail: [state](agents/state-agent.md).

## Conventions

Detail: [component](agents/component-agent.md), [theming](agents/theming-agent.md),
[best-practices](agents/best-practices-agent.md).

**Imports** — always the `@/` alias (`@/types`, `@/constants/theme`), never `../../`. Types come
from the `@/types` barrel, not the individual file.

**Files** — camelCase (`themedText.tsx`, `weekStrip.tsx`, `asteroidStore.ts`). Components live in a
folder named for their feature area.

**Components** — named `export const Foo = ({ ... }: FooProps) => (...)`. Screens under `src/app/`
are `export default function`. Props interfaces go in `src/types/`, not inline, when they're shared.

**Styles** — `StyleSheet.create` at the bottom of the file. Use `Spacing` tokens from
`@/constants/theme` for padding/gap rather than raw numbers, and `useTheme()` (or `Colors.dark.*`)
for colors. Conditional styles are array entries: `[styles.base, isX && styles.variant]`.

**Theming** — the app is dark-only (`userInterfaceStyle: "dark"`, `DarkTheme` in `_layout.tsx`), but
`Colors` still defines a light palette and `useTheme()` picks by scheme. Go through `ThemedText` /
`ThemedView` / `ThemedTitle` instead of raw `Text`/`View` so this keeps working.

**Stores** — `interface FooStore` with state and setters together, then
`create<FooStore>()(...)`. Persisted stores wrap in `persist` with `createJSONStorage(() => AsyncStorage)`.
In components select a single slice (`useFooStore((s) => s.bar)`); outside React use
`useFooStore.getState()`.

**Platform splits** — a `.web.tsx` / `.web.ts` sibling overrides the native file
(`appTabs.tsx` / `appTabs.web.tsx`, `animatedIcon`, `useColorScheme`). Native tabs come from
`expo-router/unstable-native-tabs`, which has no web implementation — that's why the split exists.
When you change one side, check the other.

**Strings/formatting** — `date-fns` `format` for display dates. The NASA feed keys
`near_earth_objects` with **zero-padded `yyyy-MM-dd`** (`2026-08-05`), and `mapper.ts` passes those
keys through unchanged, so every `date` in the store is padded.

Never spell that format inline. Build every lookup key with `toDateKey()` from `@/utils/utils`, which
formats through the single `DATE_KEY_FORMAT` constant in `@/constants/constants`. `date-fns` `'d'`
does **not** pad the day, so a hand-written `'yyyy-MM-d'` yields `2026-08-5` and matches nothing on
days 1–9 of a month — that was a real bug, fixed by routing all three call sites through one
constant.

The same applies to the feed window: `getFeedWindow()` in `@/utils/utils` is the single source for
the 8-day range, shared by `useAsteroids` and the background task. It formats in local time on
purpose — `toISOString()` is UTC and lands on a different calendar day for evening users west of
Greenwich.

## Gotchas

Every entry here is expanded, with the failure it causes, in the owning agent file — and mirrored in
the silent-failure table in [auditor](agents/auditor-agent.md).

- Notifications and the background task (`src/tasks/asteroidBackgroundTask.ts`) only work in a dev
  client or release build, not Expo Go and not web.
  ([notifications](agents/notifications-agent.md))
- The background task must `await useSettingsStore.persist.rehydrate()` before reading settings, and
  `src/app/_layout.tsx` must keep its side-effect import of the task file first. Both look removable;
  removing either kills notifications silently. ([state](agents/state-agent.md),
  [navigation](agents/navigation-agent.md))
- `reactCompiler` and `typedRoutes` are on in `app.json`. Route names are type-checked.
- Clean up `console.log` before committing — past commits have had to strip them.
- `npx tsc --noEmit` still reports ~9 errors inside `node_modules` (expo-image, expo-asset,
  expo-modules-core). Those packages set `main` to their TypeScript source, so tsc typechecks
  code they never shipped types for. Not our bug and it does not affect the build — Metro strips
  types and never runs tsc. Only `src/` errors matter:

  ```bash
  npx tsc --noEmit | grep '^src/'
  ```

- The two `react-native/*` entries in `tsconfig.json` `paths` are a workaround, not decoration.
  Deleting them silently degrades every React Native component to an invalid JSX type and floods
  the typecheck with ~110 bogus errors. See the comment there before touching them.
  ([linting](agents/linting-agent.md))

- `EXPO_PUBLIC_*` values are inlined into the bundle and extractable from the shipped binary. The
  NASA key is fine there; a billable secret never is. ([deployment](agents/deployment-agent.md))

- Date keys are **`yyyy-MM-dd`** — that's what NASA returns and what the store holds. Use
  `toDateKey()`; a hand-written `'yyyy-MM-d'` silently misses every lookup for days 1–9.
  ([api-manager](agents/api-manager-agent.md))
