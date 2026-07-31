# Navigation Agent

**Owns:** `src/app/` (all routes), `src/components/apptabs/`, `src/types/navigation.ts`,
the `scheme` and `typedRoutes` entries in `app.json`.

**Read this when:** adding a screen, changing tabs, wiring a deep link, or passing params between
screens.

## Route map

expo-router is file-based; the path *is* the route.

```
src/app/
  _layout.tsx            root: QueryClientProvider → ThemeProvider(DarkTheme) → Stack
                         also imports the background task for its side effect
                         and mounts <NotificationProvider /> (calls useNotifications)
  (tabs)/
    _layout.tsx          renders <AppTabs />
    index.tsx            "This Week"  → /
    watchlist.tsx        "Watchlist"  → /watchlist
    learn.tsx            "Learn"      → /learn
    settings.tsx         "Settings"   → /settings
  asteroid/[id].tsx      detail       → /asteroid/123
```

`(tabs)` is a group — parentheses mean the segment doesn't appear in the URL. The tab screen for
`index.tsx` is `/`, not `/tabs`.

Screens are `export default function`. Everything else in the app is a named export; the router
requires the default.

## Adding a screen

**A new tab:**

1. Create `src/app/(tabs)/<name>.tsx` with a default-exported screen.
2. Add a matching `<NativeTabs.Trigger name="<name>">` to `src/components/apptabs/appTabs.tsx` with a
   `<Label>` and an `<Icon sf="…" drawable="…" />`. `name` must equal the filename.
3. **Add the same entry to `appTabs.web.tsx`.** The native and web tab bars are separate files and
   drift silently.
4. `sf` is an SF Symbols name (iOS); `drawable` is an Android drawable resource. Existing triggers
   all pass `drawable="custom_android_drawable"` — a placeholder. If you need distinct Android icons,
   they go in via an `app.json` plugin/asset config, never by hand-editing `android/`.

**A stack screen:** create the file (e.g. `src/app/thing/[id].tsx`) and, if it needs explicit
options, add `<Stack.Screen name="thing/[id]" />` in `src/app/_layout.tsx`. `headerShown: false` is
set globally on the Stack — screens draw their own headers via `ThemedTitle`.

## Typed routes

`experiments.typedRoutes` is on in `app.json`, so route strings are typechecked against generated
types in `.expo/types/`. A typo in `router.push('/watchlst')` is a compile error.

The generated types can go stale after adding or renaming a file. If a valid route reports as
invalid, restart the dev server (`npm start`) to regenerate — don't hand-edit `.expo/types/` and
don't cast the string.

## Navigating

```ts
import { router } from 'expo-router';

router.push('/asteroid/123');   // typed
router.back();
```

- Use `router.push` for forward navigation into detail, `router.back()` to return.
- Read route params with `useLocalSearchParams<{ id: string }>()` in the screen. Params arrive as
  strings — parse before using as a number.
- **Params carry ids, not objects.** The detail screen looks the asteroid up in `asteroidStore` /
  `watchlistStore` by id. Don't serialize an object into the URL.
- Navigating from outside a component (a notification handler, a task) uses the imported `router`
  singleton, not the `useRouter()` hook.

## Deep links and notification taps

The URL scheme is `skywatch` (`app.json` → `scheme`), so `skywatch://watchlist` opens that tab.

Notification taps are handled in `src/hooks/useNotifications.ts`, not by a link:

```ts
Notifications.addNotificationResponseReceivedListener((response) => {
  const date = response.notification.request.content.data?.date;
  if (typeof date === 'string') {
    useSelectedDateStore.getState().setSelectedDate(date);
    router.push('/');
  }
});
```

The pattern to preserve: **set the store first, then navigate.** The home screen renders from
`selectedDateStore`, so pushing before the date is set shows the wrong day for a frame. `data.date`
is a `yyyy-MM-d` key — see [api-manager-agent](api-manager-agent.md) on the date format and
[notifications-agent](notifications-agent.md) on where it's attached.

## Layout ordering

`src/app/_layout.tsx` order matters:

- `import '@/tasks/asteroidBackgroundTask'` is first and is a **side-effect import** — it runs
  `TaskManager.defineTask`, which must happen at module load before the OS can invoke the task.
  Never "clean up" this unused-looking import.
- `QueryClientProvider` wraps `ThemeProvider` wraps the `Stack`. Anything using `useQuery` must be
  inside the first; anything using navigation theme inside the second.
- `<NotificationProvider />` renders `null` and exists only to call `useNotifications()` inside the
  providers. Keep it after the `Stack` so navigation is mounted when the tap listener registers.

## Checklist

- [ ] Screen is `export default function`
- [ ] New tab added to **both** `appTabs.tsx` and `appTabs.web.tsx`, `name` matching the filename
- [ ] Route strings typecheck (restart dev server if types look stale)
- [ ] Params are ids/primitives, looked up from a store
- [ ] Store set before `router.push` when navigating from a handler
- [ ] Side-effect import of the background task still first in `_layout.tsx`

## Sync

Mirrors the **Architecture** (`src/app/`) and **Platform splits** notes in `CLAUDE.md`, plus the
`typedRoutes` gotcha. Change either → update both; tab UI changes also touch
[component-agent](component-agent.md).
