# Best Practices Agent

**Owns:** the cross-cutting conventions no single area owns.

**Read this when:** you're unsure how something should be written in this codebase, or you're about
to introduce a pattern that isn't already here.

## Read the versioned Expo docs first

`AGENTS.md` says it and it is the single most load-bearing rule in this repo:

> Read the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/> before writing any code.

Expo 54 / React Native 0.81 / React 19. APIs move between minor versions, and stale answers usually
*compile* — they just misbehave at runtime, on device, where you'll spend an hour finding them.
Check the version-pinned page before using any `expo-*` API you haven't used in this repo already.

## The dependency set is deliberate

Server state: `@tanstack/react-query`. Client state: `zustand`. Dates: `date-fns`. Storage:
`@react-native-async-storage/async-storage`. Routing: `expo-router`. Animation:
`react-native-reanimated`. Icons: `@expo/vector-icons` / `expo-symbols`.

Don't add a dependency that overlaps one of these. Don't add a styling library — the app uses
`StyleSheet` plus tokens, and `theme.ts`'s header comment listing NativeWind/Tamagui/unistyles is
Expo template boilerplate, not an invitation.

Before adding *any* package, check it supports Expo 54 / RN 0.81 and that it doesn't require native
code that would conflict with the config-plugin setup. Prefer the `expo-*` package when one exists.

## Layer discipline

The one-directional flow is the architecture:

```
httpClient → api/nasa → api/mapper → hooks → store → components
```

The rules that keep it honest:

- `fetch` only in `httpClient.ts`
- `snake_case` only in `mapper.ts` and `types/nasa.ts`
- components read stores, never `src/api/`
- derived values are computed (`src/utils/utils.ts`), never stored

Breaking a layer is the most expensive kind of change to undo, because it spreads. If a boundary
feels wrong, say so and propose moving it — don't route around it locally.

## Naming and imports

- Files: camelCase (`weekStrip.tsx`, `asteroidStore.ts`). `AsteroidCard.tsx` is a legacy exception.
- Components: named `export const Foo = ({ … }: FooProps) => …`. Screens under `src/app/` are
  `export default function` — router requirement.
- Stores: `useFooStore` in `store/fooStore.ts`, `interface FooStore`.
- Hooks: `useFoo` in `hooks/useFoo.ts`.
- Types: `PascalCase`, exported from `src/types/`, always imported from the `@/types` barrel — never
  the individual file.
- Imports: always the `@/` alias. Never `../../`. (A same-folder `./sibling` is fine; a couple of
  older components use `../theme/themedText` — new code uses `@/`.)

## Formatting

There's no Prettier config; match the surrounding file. In practice: 2-space indent, single quotes
in most files, semicolons, trailing commas in multi-line literals. Don't reformat a file you're
editing for one line — the diff noise hides the actual change and makes review and revert harder.

## Comments

The existing comments are good and worth imitating: they explain *why*, at exactly the places where
the obvious edit is wrong.

```ts
// The task wakes into a fresh JS context, where `persist` rehydrates from
// AsyncStorage asynchronously. Reading the store before that finishes yields the
// defaults — hazardNotifications: false — and the task would return below having
// done nothing, so notifications would never fire. Force the read to complete.
await useSettingsStore.persist.rehydrate();
```

Write that kind. Don't write comments restating what the line does. **Never delete a
"don't remove this" comment** — every one in this repo marks a trap someone already fell into
(the `tsconfig.json` paths, the rehydrate call, the side-effect import in `_layout.tsx`).

## Logging

No `console.log` in committed code. `console.error` inside a `catch` is the established pattern for
background/async failures that have no UI path. User-facing failures render
`src/components/feedback/errorState.tsx` instead.

## Async and errors

- `httpClient` throws on non-2xx; react-query catches, retries twice, and exposes `isError`. Don't
  add try/catch around a query.
- Fire-and-forget promises need a `.catch` or a `try/catch` — an unhandled rejection in a background
  task just vanishes.
- Everything that touches the network or AsyncStorage is async. Don't read a persisted store
  synchronously on a cold start and assume real values (see [state-agent](state-agent.md)).

## Performance

`reactCompiler` is on: it auto-memoizes, so `useMemo`/`useCallback`/`React.memo` are usually
unnecessary. Add one only with a measured reason, and note it in a comment.

What actually matters here:

- Select one store slice per `useFooStore(...)` call, not the whole store, in anything that renders.
- Keep sorting and mapping in `mapper.ts`, not in render.
- Long lists use `FlatList`, not a `ScrollView` of everything.

## Accessibility

`Pressable` targets should be at least 44×44. Give icon-only controls an `accessibilityLabel`.
Never encode meaning in color alone — `AsteroidCard` pairs its hazard color with a `⚠` glyph and a
"Hazardous"/"Safe" badge; keep that pattern.

## Cross-platform

The app targets iOS, Android, and web. Before finishing:

- Is there a `.web.tsx` sibling that needs the same change?
- Does this API exist on web? Notifications and background tasks don't.
- `Platform.select` for small differences, a `.web.tsx` file for structural ones.

## When you disagree with a convention

Say so, propose the change, and — if it's accepted — update `CLAUDE.md` **and** the owning
`agents/*.md` in the same commit. Don't quietly introduce a second pattern; two half-followed
conventions are worse than one imperfect one.

## Sync

Mirrors the **Conventions** section and `AGENTS.md` in `CLAUDE.md`. Change either → update both, and
push area-specific detail down into the owning agent file rather than duplicating it here.
