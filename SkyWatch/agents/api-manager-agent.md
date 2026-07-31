# API Manager Agent

**Owns:** `src/api/httpClient.ts`, `src/api/nasa.ts`, `src/api/mapper.ts`, `src/types/nasa.ts`,
`src/types/asteroid.ts`, `src/hooks/useAsteroids.ts`, react-query config in `src/app/_layout.tsx`.

**Read this when:** adding an endpoint, changing what the app requests, touching the NASA response
mapping, debugging a rate limit or a 4xx, or changing caching behavior.

## The layer contract

```
httpClient.get<T>()      URL building, api key injection, throw on !response.ok
      ↓
api/nasa.ts              one exported function per endpoint, returns domain types
      ↓
api/mapper.ts            NASA snake_case → our camelCase, rounding, sorting, label lookup
      ↓
hooks/useAsteroids.ts    react-query: key, fetch, then push into the store via effect
      ↓
store/asteroidStore.ts   what components actually read
```

Rules, in order of how often they get broken:

1. **Only `mapper.ts` knows `snake_case`.** No component, hook, store, or screen may reference
   `close_approach_data`, `is_potentially_hazardous_asteroid`, `estimated_diameter`, etc.
2. **Only `httpClient.ts` calls `fetch`.** Nothing else in the app, including the background task —
   it goes through `getNearEarthObjects` like everyone else.
3. **`nasa.ts` returns domain types, never `NasaApiResponse`.** It maps before returning.
4. **Components never import from `src/api/`.** They read the store; hooks bridge the two.

## Adding an endpoint

1. Add the raw response interface to `src/types/nasa.ts` (mirror NASA's field names exactly,
   `snake_case`). Add the domain type to `src/types/asteroid.ts` (or a new file re-exported from
   `src/types/index.ts`).
2. Add a mapper function to `mapper.ts` — `mapXToY(raw): Domain`.
3. Add one function to `nasa.ts`:
   ```ts
   export const getThing = async (id: string): Promise<Thing> => {
     const response = await httpClient.get<NasaThingResponse>(`/neo/${id}`);
     return mapThingResponse(response);
   };
   ```
4. Wrap it in a hook under `src/hooks/` with `useQuery`, a stable `queryKey` that includes every
   input, and (if the UI needs it globally) an effect that pushes into a store.

Base URL is `https://api.nasa.gov/neo/rest/v1` — `endpoint` strings are relative to that and start
with `/`.

## Current request shape

`useAsteroids` builds a window from `daysInPast` (settings, `2 | 4`): start = today − `daysInPast`,
end = start + 7 days, both as `YYYY-MM-DD` via `toISOString().split('T')[0]`. `queryKey` is
`['asteroids', startDate, endDate]`, so changing `daysInPast` refetches automatically.

NASA's `/feed` caps at **7 days** per request. The current window is start..start+7, which is on the
edge — widening it needs pagination or multiple requests, not a bigger delta.

The same window logic exists a second time in `src/tasks/asteroidBackgroundTask.ts` (it reads
settings via `getState()` because it runs outside React). **If you change the window rule, change
both.** See [notifications-agent](notifications-agent.md).

## The API key

Resolution order in `httpClient.get`:

1. `useSettingsStore.getState().apiKeyOverride` — user's own key, Settings → Advanced
2. `process.env.EXPO_PUBLIC_API_KEY` — inlined at build time by `babel-preset-expo`
3. `'DEMO_KEY'` — last-resort fallback

Facts that drive decisions here:

- `DEMO_KEY` allows ~10 requests/hour **per IP address**, shared with every other caller behind that
  IP. A shipped build that lands on it fails for users who did nothing wrong. A project key allows
  2000/hour.
- `EXPO_PUBLIC_*` is inlined into the JS bundle and is extractable from the shipped binary. Treat
  the NASA key as public. **Never put a billable or privileged secret behind an `EXPO_PUBLIC_`
  name.**
- The key lives in `.env` (gitignored) for local dev and must *also* exist as an EAS environment
  variable, or release builds silently fall through to `DEMO_KEY`. Verifying that is the
  [deployment agent](deployment-agent.md)'s job.

Debugging "it works locally, fails in TestFlight": that's almost always the missing EAS env var.

## Error handling

`httpClient` throws `Error("HTTP error: <status>")` on any non-2xx. react-query retries twice
(`retry: 2` in `_layout.tsx`), then surfaces `query.isError`. Screens render
`src/components/feedback/errorState.tsx`.

`429` means rate limit — the message is generic today, so if you improve error UX, thread the status
through instead of parsing the string in a component.

## Caching

Configured once in `src/app/_layout.tsx`:

```ts
new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } } })
```

Per-hook overrides are allowed but should be justified in a comment — NASA data changes slowly and
the rate limit is the real constraint. Don't lower `staleTime` casually.

## Mapper conventions

- Round for display at map time: distances `Math.round`, velocity to one decimal
  (`Math.round(x * 10) / 10`). The UI shouldn't be doing math on raw strings.
- NASA sends numbers as strings — `parseFloat` before rounding.
- `close_approach_data[0]` is the entry for the requested date. `/feed` only ever returns one.
- `orbital_data.orbit_class.orbit_class_type` is optional; the `ORBIT_CLASS_LABELS` lookup falls
  back to `'Unknown'`. Add new codes to that map, don't inline strings at call sites.
- Asteroids within a date are sorted by `missDistanceLD` ascending; dates are sorted chronologically.
  The UI relies on this order — keep sorting in the mapper, not in components.

## Date key format

The NASA feed keys `near_earth_objects` with **zero-padded `yyyy-MM-dd`**. Verified live:

```
keys: [ '2026-08-06', '2026-08-03', '2026-08-04', '2026-08-05' ]
```

`mapper.ts` uses those keys verbatim as `AsteroidsByDate.date` and `AsteroidFlyby.date`, so
**everything in the store is padded**. Any key you build for a `.find()` must be padded too:
`format(date, 'yyyy-MM-dd')`, or `toISOString().split('T')[0]`.

⚠️ **Open bug (B1).** `date-fns` `'yyyy-MM-d'` does *not* pad the day — it yields `2026-08-5`.
Three sites still use it and their lookups miss on days 1–9 of every month:

| Site | Effect on days 1–9 |
|---|---|
| `src/utils/utils.ts:15` (`getDays`) | week-strip hazard dots always `false` |
| `src/components/week/weekStrip.tsx:21-22` | `selectedDate` never matches → **flyby list empty** |
| `src/app/(tabs)/index.tsx:35` (`getTodaysCount`) | "Today" stat reads `0` |

`settings.tsx:36` and `testNotifications.ts:17` use `toISOString().split('T')[0]` and are correct.
The fix is a single shared `DATE_KEY_FORMAT = 'yyyy-MM-dd'` constant — three spellings of one concept
is what caused this. Tracked as B1 in the 2026-07-31 audit (`audits/`, gitignored).

## Checklist

- [ ] No `snake_case` outside `mapper.ts` / `types/nasa.ts`
- [ ] No `fetch` outside `httpClient.ts`
- [ ] New query has a key containing every input it varies on
- [ ] Date strings are zero-padded `yyyy-MM-dd` wherever they're used as lookup keys
- [ ] Window logic changed in *both* `useAsteroids.ts` and `asteroidBackgroundTask.ts`
- [ ] `npx tsc --noEmit | grep '^src/'` clean

## Sync

Mirrors the **Data flow**, **API key**, and **Server state vs. client state** sections of
`CLAUDE.md`. Change either → update both, plus [notifications-agent](notifications-agent.md) if the
date window or key resolution moved, and [deployment-agent](deployment-agent.md) if the env-var
contract moved.
