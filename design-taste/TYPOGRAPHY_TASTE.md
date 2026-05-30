# Typography Taste System

> **Repo reality (read first).** This project's interface sans is **Inter
> Variable** (`@fontsource-variable/inter`), with a measured, Linear-derived
> scale already defined in `app/globals.css` (`.text-micro` … `.text-title1`,
> the `.h-*` heading helpers, and the `fontWeights` axis tokens in
> `lib/font-weight.ts`). That system is coherent — **preserve it.** Do not
> introduce Geist or any second family. The guidance below documents the
> *intended roles* of the system we already have; use it to validate usage,
> not to swap fonts.

## Desired Personality

The typography should feel:

- Precise
- Calm
- Technical
- Highly readable
- Slightly editorial only where appropriate
- Built for a serious product
- Distinctive without becoming theatrical

Avoid:

- Playful rounded fonts
- Loud display fonts inside operational screens
- Excessive use of bold weights
- Mixing fonts without clearly defined roles
- Large headings that overpower the product workflow
- Applying monospace fonts everywhere merely to make the product look technical

## Font Roles

### 1. Primary Interface Sans

Use for:

- Navigation
- Forms
- Lists
- Tables
- Buttons
- Settings
- Comments
- Dialogs
- Tooltips
- Product workflows
- Metadata where monospace is unnecessary

Desired traits:

- High readability at small sizes
- Neutral but not anonymous
- Strong regular and medium weights
- Compact spacing
- Clear numerals
- Good rendering in both light and dark modes

Preferred direction:

- Geist Sans
- Inter
- Or an equivalent restrained interface sans already used in the repository

**This repo's choice: Inter Variable.** Already loaded, tuned
(`font-feature-settings: 'cv01','ss03'`), and used everywhere. Keep it.

### 2. Monospace Accent

Use selectively for:

- Code
- URLs
- IDs
- Technical metadata
- Keyboard shortcuts
- Version numbers
- Developer-focused information
- Optional terminal-style visual accents

Preferred direction:

- Geist Mono
- Or a carefully chosen readable monospace already used in the repository

**This repo's choice:** `--font-mono` resolves to **Inter Variable with
`tabular-nums`** (see `globals.css` — no separate mono family is loaded). Pair
`.font-mono` / `.text-mono` with `tabular-nums` for aligned digits. Do not load
a second mono family unless a real code-rendering surface demands it.

Do not apply monospace to large sections of body text.

### 3. Editorial or Display Accent

Use sparingly for:

- Marketing hero sections
- Feature-introduction screens
- Editorial moments
- Carefully designed empty states
- Brand moments where a contrast is intentionally required

Never use it for:

- Dense tables
- Settings pages
- Button labels
- Form fields
- Operational dashboards
- Primary navigation

**This repo's choice:** the `.text-display` / `.h-display` / `.h-hero` classes
are the editorial register. They belong on the splash/landing surface only —
never inside `/settings`, `/mp`, `/bills`, tables, or admin.

## Typography Hierarchy

Establish hierarchy through role, weight, spacing, and contrast before dramatically increasing size.

Use no more than two or three font weights on a screen unless there is a clear reason.

Keep operational screen headings restrained.

Use sentence case by default.

Avoid all caps except for very small metadata labels where justified.

Use consistent line heights.

Use tabular numerals for financial values, analytics tables, counters, and aligned number columns when the selected font supports them.

## Suggested Product Scale

Use the existing design tokens if they are already coherent. Otherwise define a compact type scale similar to:

- Page title: 20–24px, medium or semibold
- Section title: 14–16px, medium or semibold
- Primary body: 13–15px, regular
- Compact row label: 13–14px, medium
- Supporting text: 12–14px, regular
- Metadata: 11–12px, regular or medium
- Button label: 13–14px, medium
- Input text: 13–14px, regular
- Monospace metadata: 11–13px

Do not blindly apply this scale. Adapt it to the repository's existing system while preserving the intended hierarchy.

**Repo mapping (already coherent — use these classes):**

| Role | Class | Size / weight |
|---|---|---|
| Page title | `.h-page` | 28px / 510 |
| Section title | `.h-section` | 18px / 510 |
| Sub-section | `.h-sub` | 15px / 510 |
| Card title | `.h-card` | 14px / 510 |
| Primary body | `.text-regular` / `.text-body` | 15px / 400 |
| Supporting text | `.text-small` | 13px / 400 |
| Metadata | `.text-mini` / `.text-caption` | 12px / 400 |
| Tiny label | `.lbl-tiny` | 11px / 510, uppercase |
| Mono metadata | `.text-mono` | 13px, tabular |

## Typography Validation

Before finalizing a font choice, test it using realistic product strings such as:

- Workspace settings
- Invite collaborators
- Comment synced 2 minutes ago
- ₹4,28,500.00
- https://dribbble.com/shots/123456
- Project archived
- Shift + Enter to send to Linear
- 12 unresolved comments
- Last updated 3 minutes ago
- Unable to sync changes

Evaluate:

- Small-label readability
- Dense table readability
- Currency and numeral clarity
- Button-label proportions
- Input-field readability
- Line-height quality in longer descriptions
- URL readability
- Light-mode rendering
- Dark-mode rendering
- Regular-weight rendering
- Medium-weight rendering

**Specimen location:** the `/design` route (`app/(app)/design/page.tsx`) renders
these strings across every role in both modes. Validate there before any
type-system change.
