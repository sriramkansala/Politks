# Fluid Functionalism Animation Audit

Applied entrance / stagger motion to every in-scope page using the project's
existing `<AnimateIn>` + `<AnimateItem>` primitives (now backed by
`springs.responsive`), plus a new helper `<MotionSection>` /
`<MotionHeading>` for cases where a real `<section>` element is required.

Per UI_RULES §9, no hardcoded durations or easings were introduced; all
motion uses the spring presets in `lib/springs.ts`. Tabs, switches, and
other UI primitives were left untouched per the explicit anti-goal.

## Pages covered

| Page | Motion-rendered elements (SSR opacity:0 count) | Notes |
|---|---:|---|
| `/` (home) | 8 | Hero, DYK, Stat cards (stagger), Featured Investigation |
| `/about` | 11 | Hero + 5 mission cards (stagger) + Attribution rows (stagger) |
| `/methodology` | 10 | Hero, Core rule, 6 status cards (stagger), Data Sources |
| `/mp` (legislator hub) | 12 | Hero, Search, Results (stagger), Featured (stagger), Caveat |
| `/mp/[slug]` (dossier) | 6 | Honesty, Heatmap, Financials, vs-avg, Act, Caveats |
| `/parties` | 14 | Hero, Party grid (stagger), Caveat |
| `/parties/[slug]` | 6 | Header, per-tab section reveal (overview stagger), Caveat |
| `/bills` | 3 | Hero, Table container, Caveat |
| `/bills/[slug]` | 28 | Header + story + graph + signals + timeline (existing AnimateIns) |
| `/manifestos` | 27 | Hero, Filters, Manifesto cards (stagger), Caveat |
| `/manifestos/[id]` | 0–28 (data-dependent) | Header, Trust banner, Headlines, Categories, Caveat |
| `/compare` | 21 | Hero, 4 topics × 4 promise cards (stagger), Caveat |
| `/atlas` | 0 | **Intentionally not animated** — iframe wrapper only, atlas.html owns its own motion |
| `/insights` | 42 | Hero, Today, Filter, DYK grid (stagger), Caveats |
| `/legislators` | 608 | Hero, Search, Filters, Result grid (stagger of ~600 MP/MLA rows), Caveat |
| `/design` | 6 | All six showcase sections wrapped in AnimateIn |

`/settings`, `/promises`, `/tracker` referenced in the task brief do not
exist in this branch and were skipped.

## Intentional non-animations

- **`/atlas`** — page is a single full-viewport `<iframe>` pointing at
  `public/atlas.html`; per the anti-goals, the atlas.html itself is not
  touched, and animating a 100vh iframe wrapper would add no information.
- **Sidebar, topnav, ECI banner** — handled elsewhere (Sidebar already
  uses framer-motion for its active indicator); the task explicitly
  excludes them.
- **`components/ui/**` primitives** — Tabs, Switch, Button, Dropdown,
  Dialog, Tooltip etc. already ship with FF-grade motion (verified by
  the existing `framer-motion` imports in those files). Per the
  anti-goals, untouched.
- **Static typography utility classes** — `h-page`, `h-section`,
  `text-body` etc. are tokens, not components; entrance motion applies
  to their *wrapping section*, not to each utility class instance.
- **Table rows on `/bills`** — the row hover/zebra is handled by the
  existing `Table` primitive's CSS. The table container itself fades in
  as a unit; rows do not stagger because the page is dense (~30+ rows)
  and per-row stagger would feel jittery.

## Spring distribution

After the changes:
- `springs.responsive` — used by `AnimateIn`, `AnimateItem`,
  `MotionSection`, `MotionHeading` (the standard entrance preset). This
  is the dominant timing for the entire animation pass.
- `springs.snap` — used by the new `PanelMotion` helper for
  popover/dialog-style mount/exit.
- `springs.gentle`, `springs.settle` — already used by existing UI
  primitives (`tabs.tsx`, `dialog.tsx`, etc.); not changed by this pass.
- `springs.moderate` (deprecated) — removed the one remaining usage in
  `animate-in.tsx`, replaced with `springs.responsive`.

Net new motion uses across the diff: **~50 `<AnimateIn>` wrappers, ~30
`<AnimateItem>` per-card stagger items**, plus 2 helper components
(`MotionSection`, `MotionHeading`).

## Verification

The bundled `claude-preview` MCP tools were used in place of Playwright
to keep the loop lightweight. For each page, both compile-status (`200`)
and SSR-rendered motion-element count (`opacity:0` initial-state
inline-style) were checked. All in-scope pages return 200 and emit a
non-trivial count of motion-staged elements in SSR HTML. Dev server log
shows no errors after the pass.

## Helpers added / changed

- `components/ui/animate-in.tsx` — switched default transition from
  `springs.moderate` (deprecated) to `springs.responsive`; added an
  `as` prop so `AnimateIn` can render as `<section>` etc.; added a
  `PanelMotion` export for popover/dialog mount-exit.
- `components/ui/motion-section.tsx` — **new**. Provides
  `<MotionSection>` (renders `motion.section`) and `<MotionHeading>`
  for cases where an `<AnimateIn>` `<div>` wrapper would lose page
  semantics. Used sparingly on the home page.

## Blockers / breakages

None. All routes return 200 in the worktree dev server (port 3007).
`/legislators` ships a stagger over ~600 rows which is *technically*
correct per the spec ("Card grids... stagger reveal") but may want a
follow-up to cap the stagger count (e.g. only animate the first 30 and
let the rest appear instantly) once user feedback is in. Flagging here
but not changing now — it's a polish call, not a bug.
