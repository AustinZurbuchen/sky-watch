# Notifications Agent

**Owns:** `src/utils/notifications.ts`, `src/utils/testNotifications.ts`,
`src/tasks/asteroidBackgroundTask.ts`, `src/hooks/useNotifications.ts`, and the notification-related
config in `app.json` (`expo-notifications` plugin, `UIBackgroundModes`,
`BGTaskSchedulerPermittedIdentifiers`, Android permissions).

**Read this when:** changing notification content or timing, touching permissions, or debugging
"notifications don't fire."

## Where things run

| Piece | Runs | Notes |
|---|---|---|
| `utils/notifications.ts` | anywhere | pure-ish helpers: permission, content, schedule, cancel |
| `hooks/useNotifications.ts` | in React, mounted once from `_layout.tsx` | reacts to settings + data |
| `tasks/asteroidBackgroundTask.ts` | fresh JS context, woken by the OS | no React, no live stores |

`app/_layout.tsx` imports the task file for its side effect (`TaskManager.defineTask` must run at
module load) and mounts `<NotificationProvider />`, which only calls `useNotifications()`.

## Hard constraint: no Expo Go, no web

Notifications and background tasks require a **dev client or release build**. They do nothing in
Expo Go and nothing on web.

```bash
npm run ios       # expo run:ios — native build, what you need
npm run android
```

If you're testing in Expo Go and nothing arrives, that's the reason. Don't start changing the
scheduling code.

## Scheduling model

`scheduleAsteroidNotifications(asteroidsByDate)`:

1. **Cancels all** scheduled notifications first.
2. For each date group, builds content and schedules a CALENDAR trigger at **09:00 local**.
3. Skips any date already in the past.

It's a full replace, not a diff — cheap and idempotent, and it's why re-running on every data change
is safe. Preserve that property; a partial update would need per-notification identifiers and
bookkeeping that doesn't exist today.

`buildNotificationContent` produces:

- title: `"Today's Asteroid Flybys"`
- body: `"<n> flyby/flybys today | <h> potentially hazardous"` or `"| none hazardous"`

Singular/plural is handled inline (`total === 1 ? '' : 's'`). Keep pluralization there, not at call
sites.

`data: { date: group.date }` is the payload the tap handler reads to jump to the right day. The value
comes straight from NASA, so it's a **zero-padded `yyyy-MM-dd`** key — correct as written. Don't
"normalize" it to `yyyy-MM-d`; that's the format that breaks lookups (see
[api-manager-agent](api-manager-agent.md), B1). See [navigation-agent](navigation-agent.md) for the
handler.

The CALENDAR trigger is built from `group.date.split('-').map(Number)` with `month - 1` for the JS
`Date` check but the **1-based** `month` for the trigger object. Both are correct as written; they
are not interchangeable.

## The hook's three effects

1. On `hazardNotifications` change — if on: request permission, and if granted and data exists,
   schedule + register the background task. If off: cancel everything and unregister the task.
2. On `asteroidsByDate` change — reschedule if notifications are on. This is how fresh data updates
   pending notifications.
3. On mount — register the response listener, remove it on unmount.

The background task registers with `minimumInterval: 180` (seconds) — a *floor*, not a promise. iOS
decides when to actually run based on usage patterns; it can be hours, or never if the user
force-quits the app. Never write logic that assumes a run happened.

## The rehydration trap

The task wakes into a fresh JS context where `persist` rehydrates asynchronously. Reading the store
before that finishes yields defaults — `hazardNotifications: false` — and the task returns having
done nothing, so notifications never fire. Hence, first line inside the `try`:

```ts
await useSettingsStore.persist.rehydrate();
```

**Do not remove this or the comment above it.** Any new persisted store the task reads needs the same
treatment. See [state-agent](state-agent.md).

## Permissions and config

- `requestNotificationPermission()` checks existing status first and only prompts if not already
  granted. Call it before scheduling, from both the hook and the task.
- Android needs `RECEIVE_BOOT_COMPLETED` and `SCHEDULE_EXACT_ALARM` — already in `app.json`.
- iOS needs `UIBackgroundModes: ["processing"]` and
  `BGTaskSchedulerPermittedIdentifiers: ["com.expo.modules.backgroundtask.processing"]` — already in
  `app.json`. That identifier is Expo's, not ours; changing it breaks background execution.
- The `expo-notifications` plugin sets the notification icon and color.
- **All of this lives in `app.json`.** Never hand-edit `ios/` or `android/` — they're gitignored
  prebuild output and your change disappears on the next prebuild. Config changes require a rebuild
  (`npm run ios`), not just a reload.

`Notifications.setNotificationHandler` is called at module scope in `utils/notifications.ts` —
banner + list, no sound, no badge. It must stay at module scope so it's set before any notification
arrives.

## Debugging checklist, in order

1. Dev client or release build? (Expo Go and web are out.)
2. `hazardNotifications` on in Settings?
3. OS permission actually granted? (Denied once = silently no prompt again; check system settings.)
4. Is `asteroidsByDate` non-empty? Nothing schedules with no data.
5. Are the target dates in the future? Past dates are skipped, and 09:00 today is past by 09:01.
6. Background task registered? `TaskManager.isTaskRegisteredAsync(ASTEROID_BACKGROUND_TASK)`.
7. `src/utils/testNotifications.ts` exists for manual triggering, and Settings already exposes it
   behind a `__DEV__` guard (`settings.tsx:95`). Use that. Any new test affordance goes behind the
   same guard — ungated is a release blocker.

## Checklist

- [ ] Content changes keep pluralization inside `buildNotificationContent`
- [ ] `data.date` still the padded `yyyy-MM-dd` key straight from `group.date`
- [ ] Schedule remains cancel-all-then-reschedule
- [ ] Past dates still skipped
- [ ] `persist.rehydrate()` still first in the task
- [ ] Native config changed in `app.json` only, and rebuilt to verify
- [ ] Date-window logic matches `useAsteroids` (both compute start = today − `daysInPast`, end + 7)
- [ ] Verified on a real dev/release build, not Expo Go

## Sync

Mirrors the **Gotchas** entry about notifications/background tasks in `CLAUDE.md` and the
`src/tasks/` + `src/utils/` lines in the architecture tree. Change either → update both; window and
key logic is shared with [api-manager-agent](api-manager-agent.md), config with
[deployment-agent](deployment-agent.md).
