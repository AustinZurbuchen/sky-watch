# State Agent

**Owns:** `src/store/asteroidStore.ts`, `src/store/watchlistStore.ts`, `src/store/settingsStore.ts`,
`src/store/selectedDateStore.ts`, `src/hooks/useWatchlist.ts`.

**Read this when:** adding a store, adding a field to one, dealing with persistence/hydration, or
deciding whether something belongs in zustand or react-query.

## The split

**react-query owns server state** — anything fetched from NASA: fetching, caching, retries, loading
and error flags. **zustand owns client state** — everything the UI reads and everything the user
sets. `useAsteroids` is the only bridge: an effect pushes `query.data` into `asteroidStore`.

Deciding where something goes:

| It is… | Goes in |
|---|---|
| Fetched from an API | react-query, mirrored into a store if many components need it |
| A user preference | `settingsStore` (persisted) |
| Saved user data | `watchlistStore` (persisted) |
| Ephemeral UI selection | a plain store (`selectedDateStore`) or local `useState` |
| Derived from other state | neither — compute it, e.g. `src/utils/utils.ts` |

Don't persist derived values. `hasHazardous` is computed in the mapper; `getHazardousCount` and
friends are computed at render.

## The four stores

**`asteroidStore`** — not persisted. `asteroidsByDate: AsteroidsByDate[]`, written only by
`useAsteroids` and by the background task. Everything on the home screen reads from here.

**`settingsStore`** — persisted as `settings-storage`. `distanceUnit: 'LD' | 'km'`,
`daysInPast: 2 | 4`, `hazardNotifications: boolean`, `apiKeyOverride: string`, plus `hasHydrated`.
Read outside React by `httpClient`, `utils.getDays`, and the background task.

**`watchlistStore`** — persisted as `watchlist-storage`. `savedAsteroids: AsteroidFlyby[]` with
`addAsteroid` / `removeAsteroid` / `isSaved`. It stores whole asteroid objects, not ids, so the
watchlist still renders when the flyby has aged out of the current feed window. Keep it that way.

**`selectedDateStore`** — not persisted. `selectedDate: string` in `yyyy-MM-d`. Written by the week
strip and by the notification tap handler in `useNotifications`.

## Shape convention

State and setters live in one interface, setters last:

```ts
interface FooStore {
  bar: string;
  setBar: (value: string) => void;
}

export const useFooStore = create<FooStore>((set) => ({
  bar: '',
  setBar: (value) => set({ bar: value }),
}));
```

Persisted stores wrap in `persist` with `createJSONStorage(() => AsyncStorage)` and a unique `name`.
Use `get()` for derived reads inside the store (`isSaved` does this) rather than duplicating state.

## Reading a store

**Inside React**, select a single slice so the component only re-renders when that slice changes:

```ts
const daysInPast = useSettingsStore((s) => s.daysInPast);
```

Destructuring the whole store (`const { hazardNotifications } = useSettingsStore()`) subscribes to
every field. `useNotifications` currently does this — it's an effect-only component so the cost is
nil, but don't copy the pattern into anything that renders.

**Outside React** — utils, `httpClient`, the background task — use `getState()`:

```ts
const { daysInPast } = useSettingsStore.getState();
```

`getState()` is a snapshot, not a subscription. Code that must react to changes needs the hook.

## Hydration

`persist` rehydrates from AsyncStorage **asynchronously**. Between first render and rehydration a
persisted store returns its defaults. Two consequences:

- `settingsStore` exposes `hasHydrated`, set by `onRehydrateStorage`. Gate anything that would write
  a default back over real data (a Settings toggle that fires on mount, for example) behind it.
- **The background task must force rehydration.** It wakes into a fresh JS context, so
  `asteroidBackgroundTask` calls `await useSettingsStore.persist.rehydrate()` before reading. Without
  it `hazardNotifications` reads `false` and the task silently no-ops. There's a comment on that line
  explaining it — don't delete it. See [notifications-agent](notifications-agent.md).

Any new persisted store read from a background/task context needs the same `await …persist.rehydrate()`.

## Adding a field to a persisted store

Old installs have JSON without the new key, so it arrives `undefined`.

1. Add it to the interface and give it a default in the initializer.
2. Assume the default is what old users get on first launch after the update — make it the safe
   value (`hazardNotifications: false`, `apiKeyOverride: ''`).
3. If the shape changes incompatibly (renamed or restructured field), bump `version` and add a
   `migrate` function to the `persist` options rather than leaving users with a broken object.
4. Never store a secret you wouldn't want in plaintext — AsyncStorage is not encrypted.
   `apiKeyOverride` is acceptable because a NASA key is already public; a password would not be.

## Checklist

- [ ] Server data stays in react-query; only `useAsteroids` writes `asteroidStore`
- [ ] Components select a slice, non-React code uses `getState()`
- [ ] New persisted field has a safe default; incompatible change has a `migrate`
- [ ] Anything read from the background task rehydrates first
- [ ] No derived/computed values stored

## Sync

Mirrors the **Stores** and **Server state vs. client state** sections of `CLAUDE.md`. Change either →
update both. Store reads from non-React contexts also touch
[api-manager-agent](api-manager-agent.md) and [notifications-agent](notifications-agent.md).
