# Taste Changelog

Record every meaningful design correction so the repository's design taste improves over time.

Use this format:

```
## YYYY-MM-DD — Screen or feature name

### Observed problem
Describe the visible problem clearly.

### Why it failed
Explain the underlying design mistake.

### New reusable rule
Write a rule that can prevent the same mistake in future screens.

### Applies to
List the relevant screen types, components, or workflows.
```

Whenever feedback is received on a UI, update this file with the reusable lesson instead of fixing only the immediate screen.

---

## 2026-05-30 — Card & control border-radius scale

### Observed problem
Cards, dropdowns, list rows, and inline tags rendered at a 6px / 4px / 2px
radius — visibly tighter and more "utility" than the rounded, product-grade
surfaces in the approved references.

### Why it failed
`--radius-card` was aliased to 6px. The whole surface language inherited a
hard, boxy feel that read as a config panel rather than a shipped product. Many
call sites also hardcoded `rounded-[6px]` / `rounded-[2px]` instead of the
token, so the scale couldn't be tuned centrally.

### New reusable rule
Card-level surfaces use `--radius-card` = 12px; inline tags use `--radius-tag`
= 4px; badges use `--radius-badge` = 6px. **Never hardcode pixel radii in
components** — always reference the token so the scale stays tunable.

### Applies to
All cards, dropdown menus, list rows, inline tags, skeletons, page containers.

---

## 2026-05-30 — Ban on fully-circular radius for non-circular elements

### Observed problem
Text badges, status tags, filter chips, and some buttons used
`rounded-full` / `--radius-pill`, producing stadium-shaped pills everywhere —
one of the listed anti-patterns ("too many pills", "excessively rounded
containers").

### Why it failed
`rounded-full` on a rectangular, text-bearing element is decorative rounding,
not structural. It made operational metadata read like marketing chips and
diluted the calm, technical character.

### New reusable rule
`rounded-full` is reserved for genuinely circular elements: dots, swatches,
avatars, progress tracks/fills, slider/switch/radio thumbs, scroll thumbs,
timeline nodes. Text badges → `rounded-md` (tag token). Buttons/controls →
`rounded-lg` / `rounded-xl` (card token). Filter chips → `--radius-8`.

### Applies to
Badges, status pills, filter chips, tags, buttons, dropdown triggers.

---

## 2026-05-30 — Dangling `px-` class from a destructive find-replace

### Observed problem
A multi-screen audit found ~14 tag/pill spans across 9 files (party-code pills,
category tags, status chips on /manifestos, /promises, /compare, /mp, party
components) rendering with **zero padding and square corners** — text flush
against a 1px border. They read as rendering glitches on otherwise polished
screens.

### Why it failed
A prior radius sweep used a `perl` one-liner with a greedy lookahead
(`s/(?<=px-).*rounded-full//`) that deleted everything from `px-` to the end of
the class string, truncating `px-1.5 py-0.5 rounded-…` down to a bare `px-`.
In Tailwind v4 a value-less `px-` compiles to nothing, so the padding silently
vanished. The damage wasn't caught because the grep used to spot-fix it
(`px- ` with a trailing space) missed the sites where `px-` sat at the very end
of the string (`px-"`).

### New reusable rule
Never apply a destructive regex (one that deletes a variable-length span) across
source files. Prefer explicit, anchored replacements. After ANY bulk
find-replace on classNames, grep for the dangling-utility signature
(`px-"`, `py-"`, `rounded-"`, ` -"`) and run the typecheck **and** a visual pass
before considering it done. Tailwind utilities must always carry a value.

### Applies to
Any sed/perl/codemod over `.tsx` className strings; all tag/badge/pill spans.

---

## 2026-05-30 — Invalid CSS from concatenating hex alpha onto a `var()` token

### Observed problem
Status tints across the forensic diff view, bill-outcome pill, poison-pill
badge, and party history/legal timelines silently failed to paint — coloured
backgrounds and borders were simply absent, leaving naked text.

### Why it failed
Code built tints by string-concatenating a 2-digit hex alpha onto a token:
`` `${tokens.status.kept}14` `` → `"var(--status-kept)14"`. The hex-alpha
suffix trick only works on a literal hex string; appended to a `var()` call it
is invalid CSS, so the browser drops the whole declaration. The bug hid because
the sibling `color:` (using the bare `var()`) still painted, so the element
wasn't fully invisible — just un-tinted.

### New reusable rule
Never suffix an alpha onto a `var()`-based colour. Build translucent tints with
`color-mix(in oklab, var(--token) N%, transparent)` — it works for both `var()`
tokens and literal hex, and is the repo's established idiom (see
`lib/tokens.ts` `statusMeta`). The `${hex}NN` shorthand is permitted ONLY when
the base is provably a literal hex string (e.g. a party `color_hex`).

### Applies to
Any status/party-tinted pill, badge, diff cell, timeline node, or chart fill.

---

## 2026-05-30 — Operational page titles drifted to the marketing register

### Observed problem
Six in-app screens (home `Overview`, manifesto detail, insights, budget, and
the three admin pages) titled their `<h1>` with editorial/legacy heading
classes (`.h-hero` 48px, `.text-heading-xl` 36px, `.text-heading` 24px, or a
hand-styled `wght 680`), while every other in-app page used `.h-page` (28px).

### Why it failed
The editorial type scale leaked into operational surfaces — the exact
"huge marketing-style headings inside product screens" anti-pattern. Each was a
local choice that never reconciled against the cross-screen page-title role.

### New reusable rule
In-app page titles are ALWAYS `.h-page` (28px / 510). The `.h-hero` / `.h-display`
editorial classes are reserved for the splash/landing surface only. Never
hand-style an `<h1>` weight/size; never use a `'wght'` literal outside the
`fontWeights` token scale.

### Applies to
Every `<h1>` inside the `(app)` and `admin` route groups.

---

## 2026-05-30 — Light mode introduction

### Observed problem
The product was dark-only. The dark theme leaned on inset white top-edge
highlights and heavy drop shadows for card depth.

### Why it failed
Those depth cues are dark-mode-specific; reused verbatim in light mode they
read as dirty edges and muddy halos.

### New reusable rule
Each mode owns its elevation language. Dark mode: inset highlight + deep
shadow. Light mode: clean, low-alpha drop shadows, no inset highlight. Drive
both from tokens (`--shadow-s1…s8`, surface ladder) under an `html.light`
override block so components never branch on theme themselves.

### Applies to
All elevated surfaces, cards, dropdowns, list rows, scrollbars, nav states.
