# Deployment Agent

**Owns:** `app.json`, `eas.json`, `.env` / EAS environment variables, `assets/`, `docs/`
(the support and privacy pages), and App Store / Play Store submission.

**Read this when:** building, bumping a version, changing native config, or shipping a release.

## Identity

| | |
|---|---|
| Display name | SkyWatchNEO |
| Slug | `SkyWatch` |
| Bundle id / package | `com.austinzurbuchen.SkyWatch` |
| EAS project id | `2278565a-4661-4f41-8ace-7b36d4b24614` |
| Owner | `austinzurbuchen` |
| Scheme | `skywatch` |
| Version | `1.0.0` (`app.json` → `expo.version`) |

`slug` and `bundleIdentifier`/`package` are load-bearing — changing them after release orphans the
listing and every install. Don't.

## Native config lives in `app.json`

`ios/` and `android/` are **gitignored prebuild output**. Never edit them, never commit them. Every
native change goes through `app.json` (`ios.infoPlist`, `android.permissions`, `plugins`) or a config
plugin, then a rebuild regenerates the native projects.

What's currently configured and why:

- `userInterfaceStyle: "dark"` — the app is dark-only.
- `ios.infoPlist.ITSAppUsesNonExemptEncryption: false` — skips the App Store encryption
  questionnaire each submission.
- `ios.infoPlist.UIBackgroundModes: ["processing"]` +
  `BGTaskSchedulerPermittedIdentifiers: ["com.expo.modules.backgroundtask.processing"]` — required
  for the background task. That identifier is Expo's; changing it breaks background execution.
- `android.permissions: ["RECEIVE_BOOT_COMPLETED", "SCHEDULE_EXACT_ALARM"]` — notification
  scheduling.
- `android.predictiveBackGestureEnabled: false`.
- Plugins: `expo-router`, `expo-splash-screen` (bg `#0a0d1a`), `expo-notifications` (icon + color),
  `expo-font`.
- `experiments`: `typedRoutes`, `reactCompiler`.
- `web.output: "static"`.

**Any `app.json` change requires a rebuild.** A JS reload will not pick it up, and that's the usual
cause of "I set the permission and it still doesn't work."

## The environment variable that breaks releases

`EXPO_PUBLIC_API_KEY` must exist **in two places**:

1. `.env` in `SkyWatch/` (gitignored) — local dev.
2. An **EAS environment variable** for the build profile — CI/release.

Miss the second and the release build silently falls through to `DEMO_KEY`: ~10 requests/hour per IP,
shared across every caller on that IP. The app then fails for users who did nothing wrong, and it
looks fine on your machine. Verify before every production build:

```bash
npx eas env:list --environment production
```

`EXPO_PUBLIC_*` values are inlined into the JS bundle and extractable from the shipped binary. The
NASA key is fine there — it's public and free. **Never put a billable or privileged secret behind an
`EXPO_PUBLIC_` name.** A real secret needs a server, not a prefix.

Users can also supply their own key in Settings → Advanced (`apiKeyOverride`), which takes precedence
over the bundled one. See [api-manager-agent](api-manager-agent.md).

## Build profiles (`eas.json`)

| Profile | Config | Use |
|---|---|---|
| `development` | `developmentClient: true`, internal, iOS simulator | dev client — required for notifications and the background task |
| `preview` | internal distribution | TestFlight / internal testers |
| `production` | `autoIncrement: true` | store submission |

`cli.appVersionSource: "remote"` — **EAS owns the build number.** `production` auto-increments it.
Bump `expo.version` in `app.json` by hand for a user-visible version change (`1.0.0` → `1.0.1`);
don't hand-manage build numbers.

## Commands

Local native builds:

```bash
npm run ios
```

```bash
npm run android
```

EAS builds:

```bash
npx eas build --platform ios --profile production
```

```bash
npx eas build --platform android --profile production
```

Submission:

```bash
npx eas submit --platform ios --latest
```

Web export (`docs/` hosts the static support and privacy pages — check what's there before
overwriting):

```bash
npx expo export --platform web
```

Builds and submissions are outward-facing and cost money and store review time. **Confirm with the
user before running any `eas build` or `eas submit`.**

## Release checklist

1. [ ] `npm run lint` and `npx tsc --noEmit | grep '^src/'` clean
2. [ ] No `console.log` in `src/`
3. [ ] `expo.version` bumped if user-visible
4. [ ] `EXPO_PUBLIC_API_KEY` present in EAS env for the target profile — confirmed, not assumed
5. [ ] Ran a `preview` or local release build on a real device: data loads (not rate-limited),
       notifications fire, background task registers
6. [ ] Deep link works: `skywatch://watchlist`
7. [ ] Icons/splash render — `assets/images/nasa_sky_watch_icon_fixed.png`, `splash-icon.png`
8. [ ] `docs/index.html` (support) and `docs/privacy.html` still accurate — App Store review requires
       working URLs, and privacy text must match what the app actually collects
9. [ ] App Store privacy answers match reality: the app has no accounts and no analytics; NASA
       requests carry no user data; the watchlist and settings are stored **on device** only
10. [ ] `ITSAppUsesNonExemptEncryption: false` still correct (true unless you added crypto)
11. [ ] Screenshots current (`screenshots/` at the repo root)

## Checklist

- [ ] Native change made in `app.json`, not in `ios/`/`android/`
- [ ] Rebuilt after any `app.json` change, and verified on device
- [ ] EAS env vars verified for the profile being built
- [ ] `slug`, bundle id, package, and EAS project id untouched
- [ ] User confirmed before any build or submit

## Sync

Mirrors the prebuild-output rule and the **API key** section of `CLAUDE.md`. Change either → update
both; key-resolution details are in [api-manager-agent](api-manager-agent.md) and background/native
permissions in [notifications-agent](notifications-agent.md).
