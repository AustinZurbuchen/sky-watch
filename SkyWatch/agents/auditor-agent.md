# Auditor Agent

**Owns:** reviewing diffs, hunting regressions, and the pre-release sweep. Read-only by default —
report findings, fix only what you're asked to fix.

**Read this when:** reviewing a change (yours or someone else's), chasing a regression, or checking a
branch before it ships.

## How to run an audit

1. Get the diff: `git diff master...HEAD` (or `git diff` for uncommitted work).
2. Run the mechanical checks below — they're cheap and catch most of it.
3. Read the diff against the checklist for each area it touches.
4. Report findings **most severe first**, each with a concrete failure scenario ("if X, then Y
   breaks"), not a style opinion. Distinguish "this is broken" from "this is unconventional."

**Where reports go:** `SkyWatch/audits/AUDIT-<YYYY-MM-DD>.md`. That folder is **gitignored** — a
report is a point-in-time snapshot that goes stale the moment someone fixes something, so it doesn't
belong in version control and tracked docs must not link to it. If a finding is durable enough that
future work needs to know about it, write the fact itself into `CLAUDE.md` and the owning agent file;
don't leave a pointer to a file that isn't in the repo.

Order findings by **consequence, not effort**. The bands used in the 2026-07-31 report work well:

| Band | Meaning |
|---|---|
| **B — Breaking** | Users see wrong or missing data right now |
| **F — Feature broken** | A shipped control does nothing, or dead-ends |
| **R — Fragile** | Correct today by luck; a routine edit breaks it |
| **Q — Degraded** | Real quality gaps, nothing visibly broken |
| **P — Polish & dead code** | Cosmetic, cleanup, lint |
| **E — Enhancements** | Not defects; worth building |

Lead with a ranked table of every finding carrying a *user-visible?* column, so the breaking-vs-
cosmetic split is readable without scrolling.

## Mechanical checks

```bash
npm run lint && npx tsc --noEmit | grep '^src/'
```

```bash
grep -rn 'console\.log' src/
```

```bash
grep -rn 'fetch(' src/ --include='*.ts' --include='*.tsx' | grep -v 'src/api/httpClient.ts'
```

```bash
grep -rnE '_[a-z]+' src/ --include='*.tsx' | grep -vE 'src/(api/mapper|types/nasa)\.ts'
```

```bash
grep -rn "from '\.\./\.\./" src/
```

```bash
git diff --name-only master...HEAD | grep -E '^(SkyWatch/)?(ios|android)/|\.env$'
```

The last one must print nothing — prebuild output and `.env` never belong in a diff.

## High-severity: things that fail silently

These are the failures this codebase actually produces. None of them throw; they just quietly do
nothing, so a reviewer has to catch them.

| Check | Why it matters |
|---|---|
| `import '@/tasks/asteroidBackgroundTask'` still first in `src/app/_layout.tsx` | Side-effect import runs `defineTask`. Removed → background execution dies entirely, no error. |
| `await useSettingsStore.persist.rehydrate()` still first in the task's `try` | Removed → task reads default `hazardNotifications: false` and no-ops forever. |
| `react-native/*` paths still in `tsconfig.json` | Removed → ~110 bogus JSX errors app-wide. |
| Date keys zero-padded `yyyy-MM-dd` — flag any `'yyyy-MM-d'` | NASA returns padded keys and the store holds them verbatim. An unpadded key misses every `.find()` on days 1–9 → empty flyby list, dead hazard dots, `0` in the Today stat. Three sites are currently wrong (B1). `grep -rn "yyyy-MM-d'" src/` |
| New `EXPO_PUBLIC_*` var added to EAS env | Missing → release silently falls back to `DEMO_KEY` (~10 req/hr per IP) and the app fails for real users while working locally. |
| `.web.tsx` counterpart updated | Diverged pair typechecks fine, breaks on one platform only. |
| New tab added to **both** `appTabs.tsx` and `appTabs.web.tsx` | Same. |
| New `Colors` key added to **both** `light` and `dark` | Only one side → key drops out of `ThemeColor`, `themeColor="x"` stops typechecking. |
| Persisted store field renamed/restructured without `migrate` | Existing installs get a broken object on update. |
| `import '@/global.css'` still in `theme.ts` | Looks unused, isn't. |
| `app.json` changed → PR says a rebuild is required | Otherwise reviewers test a stale binary and pass it. |

## Architecture review

- `fetch` only in `httpClient.ts`; `snake_case` only in `mapper.ts` / `types/nasa.ts`.
- `nasa.ts` returns domain types, not raw NASA shapes.
- Components import from stores/hooks, never from `src/api/`.
- Only `useAsteroids` (and the background task) write `asteroidStore`.
- Query keys include every input the query varies on — a missing input means stale data served
  forever.
- Derived values computed, not stored.
- Date-window logic identical in `useAsteroids.ts` and `asteroidBackgroundTask.ts`. **These two are
  duplicated by design and drift is easy** — check both on any change to either.

## Convention review

- `@/` imports; types from the `@/types` barrel.
- camelCase filenames; feature-named component folders.
- `StyleSheet.create` at the bottom; conditional styles as array entries.
- `Spacing` tokens for spacing; no new hex literals. ~45 legacy ones already exist across 10
  component files — flag *additions*, not the existing set, and welcome any diff that converts a
  folder to tokens.
- `ThemedText`/`ThemedView` instead of raw colored `Text`/`View`.
- Store slices selected individually in rendering components.
- `useMemo`/`useCallback` added without a stated reason (React Compiler makes them redundant).

## Correctness review

Read for these rather than grepping:

- Off-by-one in date math. `getWeekDates` does start = today − `daysInPast`, end = start + 7. NASA
  `/feed` caps at 7 days.
- Timezone assumptions. `toISOString()` is UTC; `date-fns format` is local. Mixing them shifts a day
  near midnight.
- Notification triggers: 1-based `month` in the trigger object vs. `month - 1` in the `Date`
  constructor — both appear in `scheduleAsteroidNotifications` and both are correct as written.
- Past-date notifications still skipped.
- Empty/loading/error states handled — `asteroidsByDate` is `[]` on first render, every time.
- `close_approach_data[0]` assumed non-empty (it is, for `/feed` — flag if a new endpoint reuses the
  mapper).
- Unhandled promise rejections in async handlers.

## Security and privacy review

- No secret behind an `EXPO_PUBLIC_` prefix — those are inlined into the bundle and extractable. The
  NASA key is fine because it's public and free; anything billable is not.
- Nothing sensitive written to AsyncStorage (unencrypted). `apiKeyOverride` is acceptable; a password
  wouldn't be.
- No user data in URLs or logs. NASA requests carry only dates and the key.
- `docs/privacy.html` still matches what the app does: no accounts, no analytics, watchlist and
  settings stored on device.
- External links open via `expo-web-browser` / `externalLink.tsx`, not by rendering arbitrary URLs.

## Reporting

Severity ladder:

1. **Breaks at runtime / ships broken to users** — silent-failure table above, layer violations with
   real consequences, missing env var.
2. **Will break later** — drifted duplicate logic, missing migration, diverged platform pair.
3. **Convention drift** — tokens, imports, naming, file placement.
4. **Nits** — formatting, comment wording. Mention briefly or not at all.

For each finding give the file and line, the concrete failure, and the fix. Don't pad the list —
a review with three real findings beats one with twenty where three are real.

## Sync

Draws on every other agent file; the silent-failure table mirrors the **Gotchas** in `CLAUDE.md`.
Adding a gotcha anywhere means adding it to `CLAUDE.md`, to the owning agent file, and to the table
above.
