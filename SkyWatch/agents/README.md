# Agent Directory

Detailed playbooks for working on SkyWatchNEO. [`CLAUDE.md`](../CLAUDE.md) is the entry point —
it holds the project overview, commands, and the short version of every rule. The files here hold
the long version for one area each.

**Read `CLAUDE.md` first, then open the one agent file that matches the work.** Don't read all of
them; each is written to be self-sufficient for its own scope.

## Routing table

| Agent | Read it when | Owns |
|---|---|---|
| [api-manager](api-manager-agent.md) | Touching NASA requests, response shapes, the API key, caching | `src/api/`, `src/types/nasa.ts`, `src/hooks/useAsteroids.ts` |
| [state](state-agent.md) | Adding/changing a zustand store, persistence, hydration | `src/store/`, `src/hooks/useWatchlist.ts` |
| [component](component-agent.md) | Building or editing UI, styles, platform splits | `src/components/`, `src/constants/theme.ts` |
| [navigation](navigation-agent.md) | Routes, tabs, deep links, screen params | `src/app/`, `src/components/apptabs/`, `src/types/navigation.ts` |
| [notifications](notifications-agent.md) | Scheduling, permissions, the background task | `src/utils/notifications.ts`, `src/tasks/`, `src/hooks/useNotifications.ts` |
| [theming](theming-agent.md) | Colors, spacing, fonts, `Themed*` primitives | `src/constants/theme.ts`, `src/components/theme/`, `src/hooks/useTheme.ts`, `useColorScheme` |
| [linting](linting-agent.md) | Lint or typecheck output, before every commit | `eslint.config.js`, `tsconfig.json` |
| [pr](pr-agent.md) | Committing, branching, opening a PR | git workflow |
| [deployment](deployment-agent.md) | Builds, EAS, app config, store submission | `app.json`, `eas.json`, `docs/` |
| [best-practices](best-practices-agent.md) | Unsure how something should be written here | cross-cutting |
| [auditor](auditor-agent.md) | Reviewing a diff, hunting regressions, pre-release check | cross-cutting |

## The sync rule

`CLAUDE.md` and this folder are one document split in two. **Any change to one requires a matching
change to the other, in the same commit.**

- A rule in `CLAUDE.md` is the summary. The agent file is the detail. They must never disagree.
- Changing code that an agent file documents (its "Owns" paths) means updating that agent file, and
  updating `CLAUDE.md` if the summary-level rule changed too.
- Adding an agent file: add a row to the table above **and** a row to the agent table in
  `CLAUDE.md`.
- Deleting or renaming an agent file: remove/rename it in both tables and fix any `[[link]]`-style
  cross-references in sibling agent files.
- Every agent file ends with a **Sync** section listing what in `CLAUDE.md` it mirrors. Check it
  before you edit either side.

Quick check that nothing drifted — run from `SkyWatch/`. It prints the agent files on disk, the ones
`CLAUDE.md` links to, and the ones this README links to. All three lists must match.

```bash
ls agents/ | grep -- '-agent\.md' | sort; grep -o '[a-z][a-z-]*-agent\.md' CLAUDE.md | sort -u; grep -o '[a-z][a-z-]*-agent\.md' agents/README.md | sort -u
```

## House rules that apply to every agent

- Run every command from `SkyWatch/`, not the repo root.
- Read the versioned Expo docs at <https://docs.expo.dev/versions/v56.0.0/> before writing native or
  Expo-API code. Expo changes fast and stale answers compile but misbehave.
- `ios/` and `android/` are gitignored prebuild output. Never edit, never commit.
- No `console.log` in committed code (`console.error` in catch blocks is fine and already used).
- Imports go through the `@/` alias. Types come from the `@/types` barrel.
- There is no test suite. Verification means `npm run lint`, `npx tsc --noEmit | grep '^src/'`, and
  running the app.
