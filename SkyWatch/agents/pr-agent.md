# PR Agent

**Owns:** branching, commits, and pull requests for `AustinZurbuchen/sky-watch`.

**Read this when:** committing, opening a PR, or writing a commit message.

## Repo facts

- Remote: `https://github.com/AustinZurbuchen/sky-watch.git`
- Default branch: **`master`** — PRs target this.
- Working branch: **`dev`**. The established flow is `dev` → PR → `master` (see the merge of PR #1).
- The repo root is a wrapper; the app is in `SkyWatch/`. Paths in PR descriptions should be
  repo-relative (`SkyWatch/src/...`).
- Use `gh` for anything GitHub-side.

**Only commit or push when asked.** If work is on `master`, branch before committing.

## Before every commit

```bash
npm run lint
```

```bash
npx tsc --noEmit | grep '^src/'
```

```bash
grep -rn 'console\.log' src/
```

All three must come back clean (see [linting-agent](linting-agent.md) for how to read tsc's
node_modules noise). Then run the app for anything touching UI, navigation, or notifications — there
is no test suite to catch what you missed.

Also confirm before staging:

- No `ios/` or `android/` files in the diff. They're gitignored prebuild output; if they show up,
  something removed them from `.gitignore`.
- No `.env`. It's gitignored and contains `EXPO_PUBLIC_API_KEY`. That key is extractable from shipped
  bundles anyway, but committing it invites accidental reuse for a billable secret later.
- No debug/scratch code and no commented-out blocks. `src/utils/testNotifications.ts` *is* wired into
  Settings, which is fine — it sits behind a `__DEV__` guard (`settings.tsx:95`). Keep any new test
  affordance behind that same guard; an ungated one is a blocker.

## Commit messages

Recent history is honest about being a solo project (`update`, `update json`) and also has good
examples (`App Store release prep: rename to SkyWatchNEO, fix notification path, own API key`).
Aim at the second kind.

- Imperative mood, one line, ~72 chars: `Fix week strip highlighting the wrong day`.
- Say *what changed and why*, not which files. The diff already lists files.
- Body only when the reason isn't obvious from the subject — wrap at 72.
- Keep native-config changes (`app.json`, `eas.json`) in their own commit or call them out
  explicitly; they require a rebuild and reviewers need to know.

End Claude-authored commit messages with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## Branching

```bash
git checkout -b feat/watchlist-sort
```

Prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `release/`. Keep a branch to one concern — a mixed
branch can't be reverted cleanly, and this project ships to the App Store where a clean revert
matters.

## Opening a PR

```bash
gh pr create --base master --head dev --title "..." --body "..."
```

Body structure:

```markdown
## What
One or two sentences on the change.

## Why
The problem or the ask.

## How
Notable implementation choices, anything a reviewer would otherwise have to reverse-engineer.

## Verification
- [ ] `npm run lint` clean
- [ ] `npx tsc --noEmit | grep '^src/'` clean
- [ ] Ran on iOS <simulator/device>
- [ ] Ran on Android / web (if touched)
- [ ] Notifications verified in a dev client (if touched)

## Notes
Requires a native rebuild (app.json changed) / needs an EAS env var / etc.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Flag these loudly when they apply, because they break things silently for anyone else building:

- `app.json` or `eas.json` changed → **native rebuild required**, an OTA-style reload isn't enough.
- A new `EXPO_PUBLIC_*` var → must be added as an **EAS environment variable** or release builds fall
  back to `DEMO_KEY`. See [deployment-agent](deployment-agent.md).
- A persisted store shape changed → existing installs need a `migrate`. See
  [state-agent](state-agent.md).
- Documentation: if the change alters anything documented, `CLAUDE.md` **and** the matching
  `agents/*.md` must both be updated in the same PR.

## Reviewing

Run [auditor-agent](auditor-agent.md) against the diff. At minimum verify: layer boundaries intact
(no `fetch` or `snake_case` outside `src/api/`), `.web.tsx` counterparts updated, `Spacing`/theme
tokens used, no `console.log`, and docs in sync.

## Checklist

- [ ] Branched off the right base; one concern per branch
- [ ] Lint, typecheck, `console.log` grep all clean
- [ ] App actually run for the affected platform
- [ ] No `ios/`, `android/`, or `.env` in the diff
- [ ] Commit message says what and why, with the `Co-Authored-By` trailer
- [ ] PR body has What / Why / How / Verification, plus rebuild or env-var warnings
- [ ] `CLAUDE.md` and `agents/` updated together if behavior or conventions changed

## Sync

Mirrors the **Commands** verification steps and the `console.log` / prebuild-output **Gotchas** in
`CLAUDE.md`. Change either → update both.
