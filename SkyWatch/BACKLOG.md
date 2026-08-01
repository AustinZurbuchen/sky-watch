# Backlog

Work parked for a future release. Not bugs — the app ships fine without these. Bugs and audit
findings are tracked separately in `audits/` (gitignored, local only).

Add an item as `## N. Short title` with what's wrong, why, and enough concrete detail to act on
without rediscovering it.

---

## 1. Raise the contrast between the background and the cards

**Why:** the cards are hard to distinguish from the background. The colours themselves are right —
they're just too close together in darkness.

Measured against the background `#0a0d1a`:

| Surface | Colour | Contrast |
|---|---|---|
| Card fill | `#111627` | **1.08:1** |
| Card border | `#1e2340` | 1.26:1 |
| Hazard card fill | `#130e0e` | **1.01:1** |
| Active day pill | `#1a2a4a` | 1.36:1 |

1.08:1 is essentially invisible — the card edge is doing all the work of separating them, and its
border is only 1.26:1 itself.

**Don't chase WCAG 3:1 on the fill.** Reaching it against this background needs a luminance around
0.113 — roughly `#5e5e5e` — which would destroy the dark look. 3:1 is the bar for boundaries that
carry meaning; a card surface is better served by a modest fill lift plus a border that genuinely
reads.

Fill ladder, for picking:

```
#111627  1.08:1   ← today
#161d33  1.16:1
#1b2340  1.25:1
#20294d  1.37:1
#25305a  1.52:1
#2a3767  1.70:1
```

Border against a `#1b2340` fill: `#2a3358` 1.26:1 · `#36436f` 1.61:1 · `#425188` 2.03:1.

**Do it together with the token cleanup.** Roughly 45 hardcoded hex literals across 10 component
files bypass `Colors` entirely (`AsteroidCard`, `dayPill`, `statBox`, `learnCard`, `learn/link`,
`emptyState`, `errorState`, `loadingState`, all three `settings/*`, `asteroid/[id]`). Changing the
card colour means touching every one of them anyway, so introduce `card`, `cardBorder`,
`cardHazard`, `cardHazardBorder` in **both** palettes and convert as you go. See
[agents/theming-agent.md](agents/theming-agent.md).

**While you're in there:** the muted text `#6b7599` (11 uses) is **4.27:1**, just under the 4.5:1
needed for body text. `#7d87ab` gets to 5.46:1.

**Check after changing:** the Safe/Hazardous card distinction has to stay obvious — the hazard card
is currently differentiated by a red-tinted fill that is itself only 1.01:1 against the background.

## 2. Make the Settings pickers selectable rather than cycling

**Why:** "Distance Units" and "Days in past" cycle to the other value on tap. With two options that
works, but nothing tells you what the options are before committing, and the `>` chevron implies
drilling into a screen that doesn't exist — the affordance lies about what happens.

**Where:** `ChevronValue` in `src/components/settings/settingsComponents.tsx`, used twice in
`src/app/(tabs)/settings.tsx` for `distanceUnit` (`'LD' | 'km'`) and `daysInPast` (`2 | 4`).

**Options:**

- **Segmented control** — both settings are binary today, both values visible at once, one tap. Best
  fit for exactly two options; doesn't scale past three or four.
- **Menu / action sheet** — tap opens a list, current value checked. Keeps the row compact, matches
  the chevron affordance, and scales if `daysInPast` ever grows (7 days, 14 days). Native feel via
  `ContextMenu`/`Menu` on iOS.

Menu is the safer choice if more options are likely; segmented is friendlier if it stays binary.

**Take the accessibility fix with it.** These controls have no `accessibilityRole`, no
`accessibilityLabel`, and no announced value — a screen reader reads them as unlabelled buttons.
Whatever replaces them should expose role, label, and current selection. The app has **no**
accessibility props anywhere today, so Settings is a reasonable place to start.

**Note:** `daysInPast` also drives the feed window, so changing it refetches. Whatever the new
control is, it should not fire on every highlight — only on commit.
