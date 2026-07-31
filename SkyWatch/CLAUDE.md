@AGENTS.md

# SkyWatchNEO

Expo / React Native app (iOS, Android, web) that shows near-Earth asteroid flybys from
NASA's NeoWs API, with a watchlist, hazard notifications, and a learn section.

The app lives in `SkyWatch/` — the repo root is just a wrapper. Run every command from `SkyWatch/`.

## Commands

```bash
npm start          # expo start (dev server)
npm run ios        # expo run:ios — native build, required for notifications/background task
npm run android    # expo run:android
npm run web        # expo start --web
npm run lint       # expo lint (eslint-config-expo flat config)
npx tsc --noEmit   # typecheck — no test suite exists
```

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
only `mapper.ts` knows about `snake_case`.

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

## Conventions

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

**Strings/formatting** — `date-fns` `format` for display dates; the canonical date key format from
the NASA feed is `yyyy-MM-d`.

## Gotchas

- Notifications and the background task (`src/tasks/asteroidBackgroundTask.ts`) only work in a dev
  client or release build, not Expo Go and not web.
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
