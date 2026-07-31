# Linting Agent

**Owns:** `eslint.config.js`, `tsconfig.json`, and the verify step of every change.

**Read this when:** running lint or typecheck, interpreting their output, or before any commit.

## The two commands

```bash
npm run lint
```

```bash
npx tsc --noEmit | grep '^src/'
```

Run both from `SkyWatch/`. There is no test runner — these plus running the app are the whole
verification story.

## Reading the typecheck output

`npx tsc --noEmit` reports **~9 errors inside `node_modules`** (expo-image, expo-asset,
expo-modules-core). Those packages point `main` at their TypeScript source, so tsc typechecks code
they never shipped types for. It is not our bug and it does not affect the build — Metro strips types
and never runs tsc.

**Only `src/` errors matter.** Always pipe through `grep '^src/'`. Reporting the node_modules count
as a regression, or "fixing" it by loosening `tsconfig.json`, is wrong.

A clean run prints nothing.

## Don't touch these tsconfig paths

```jsonc
"react-native/types/*":         ["./node_modules/react-native/types/*"],
"react-native/node_modules/*":  ["./node_modules/react-native/node_modules/*"]
```

React Native 0.81's own `.d.ts` files import these paths, but its `package.json` exports map blocks
them (`"./types/*": null`), so under `moduleResolution: "bundler"` they resolve to nothing. That
degrades `View`, `Text`, `FlatList` and friends into invalid JSX types across the entire app.

Deleting them floods the typecheck with **~110 bogus errors**. There's a comment on them in
`tsconfig.json` — read it before touching. Remove only once react-native ships a fixed exports map,
and prove it by running the typecheck after.

If you ever see ~110 errors all about JSX element types, this is the cause — someone removed the
paths or the react-native version changed.

## ESLint setup

Flat config, `eslint-config-expo/flat`, `dist/*` ignored. That's the whole file. It's deliberately
minimal.

Adding a rule means editing `eslint.config.js` — and it should be a real convention the team wants
enforced, not a preference. If a rule would flag a lot of existing code, either fix the code in the
same change or don't add the rule; a permanently-failing lint gets ignored and then everything gets
ignored.

Disabling a rule inline (`// eslint-disable-next-line …`) requires a comment on the line above
explaining why. No blanket `/* eslint-disable */` at the top of a file.

## Things lint won't catch — check by hand

- **`console.log`.** Not currently a lint error, and past commits have had to strip them.
  `console.error` in a catch block is fine and used intentionally in `useNotifications` and the
  background task.

  ```bash
  grep -rn 'console\.log' src/
  ```

- **Unused-looking side-effect imports.** `import '@/tasks/asteroidBackgroundTask'` in
  `src/app/_layout.tsx` and `import '@/global.css'` in `src/constants/theme.ts` look removable and
  are not. Removing the first breaks background execution entirely.
- **`.web.tsx` drift.** A native/web pair can diverge and both sides typecheck fine.
- **React Compiler rules.** `reactCompiler` is on; hook-order and mutation violations may surface as
  build or runtime issues rather than lint errors.

## Order of operations when something fails

1. `npm run lint` — fix real issues; don't suppress.
2. `npx tsc --noEmit | grep '^src/'` — fix in `src/` only.
3. If `src/` errors look absurd in volume or all mention JSX types, check the `tsconfig.json` paths
   above before changing any component.
4. Run the app (`npm start`, or `npm run ios` for anything touching notifications/background/native
   config). Lint and tsc do not catch layout, navigation, or scheduling bugs.

## Checklist

- [ ] `npm run lint` clean
- [ ] `npx tsc --noEmit | grep '^src/'` prints nothing
- [ ] `grep -rn 'console\.log' src/` prints nothing
- [ ] node_modules tsc noise not reported as a problem, config not loosened to hide it
- [ ] `tsconfig.json` `react-native/*` paths intact

## Sync

Mirrors the **Commands** section and the tsc / `tsconfig.json` **Gotchas** in `CLAUDE.md`. Change
either → update both. The pre-commit gate is repeated in [pr-agent](pr-agent.md).
