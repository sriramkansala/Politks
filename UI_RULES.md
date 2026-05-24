# UI Rules — Neo Nīti

**Read this file before building any UI. Re-read it during audit.** This is not a style guide; it is a checklist of what NOT to do because we have been caught doing it.

## 1. Use the component library — always

Before writing markup for an interactive element, check if a shadcn/FF wrapper exists in `components/ui/`. If it does, use it.

| Element | Use | Do NOT use |
|---|---|---|
| Text input | `<Input>` from `components/ui/input.tsx` | bare `<input>`, `<label>` + raw input |
| Button | `<Button>` from `components/ui/button.tsx` | bare `<button>` with inline styles, `<a>` styled like a button |
| Filter / single-select | `<FilterDropdown>` from `components/mp/FilterDropdown.tsx` | chip strip (`<Link>` per option) |
| Multi-tab navigation | `<Tabs>` from `components/ui/tabs.tsx` (or URL-driven `PartyTabNav` pattern) | hand-rolled flex of buttons |
| Tooltip on hover | `<Tooltip>` from `components/ui/tooltip.tsx` | `title=""` attribute, `<span>` with custom hover state |
| Card container | `<Card>` from `components/ui/card.tsx`, or `.party-card` / `.stat-card` utility class | inline-styled div with `border`, `background`, `radius` props |
| Status pill | `<StatusPill>` from `components/promises/StatusPill.tsx` | inline span with status colour |
| Badge | `<Badge>` from `components/ui/badge.tsx` | hand-rolled chip |
| Table | `<Table>` family from `components/ui/table.tsx` | bare `<table>`, div-based grid masquerading as table |
| Search bar | `<Input leadingIcon={Search}>` | label + bare input + absolute-positioned icon |
| Accordion / Collapsible | `<Accordion>` from `components/ui/accordion.tsx` | hand-rolled summary/details or click-to-toggle div |
| Dialog / Modal | `<Dialog>` from `components/ui/dialog.tsx` | hand-rolled overlay div |
| Popover | `<Popover>` from `components/ui/popover.tsx` | absolute-positioned div with click-outside handler |
| Sheet (drawer) | `<Sheet>` from `components/ui/sheet.tsx` | hand-rolled side-panel |
| Dropdown menu | `<DropdownMenu>` from `components/ui/dropdown-menu.tsx` | bespoke menu with `useState(open)` |
| Switch / toggle | `<Switch>` from `components/ui/switch.tsx` | styled checkbox |
| Slider | `<Slider>` from `components/ui/slider.tsx` | bare `<input type="range">` |
| Radio group | `<RadioGroup>` from `components/ui/radio-group.tsx` | divs with onClick |
| Tooltip | `<Tooltip>` from `components/ui/tooltip.tsx` | `title=""` attribute, hover-only div |

**Filter strips are banned.** Even a 3-option filter goes through `FilterDropdown`. The only exception is the promise-significance row (`PromiseList.tsx`) where the chips double as a section breakdown count — and even that is up for review.

### Custom implementations of shadcn primitives

Sometimes a shadcn primitive can't be used directly — e.g. tabs that must be SSR-friendly with shareable URLs cannot use the client-only `<Tabs>` context. **When you build a custom version of a shadcn primitive, the custom version MUST:**

1. Use the same tokens and dimensions as the shadcn one (compare against the original side-by-side)
2. Use Fluid Functionalism motion for any animated state (Rule 11 below) — a tab underline must slide between tabs via `motion.div` + `layoutId`, not jump via `border-bottom` swap
3. Include a header comment explaining why the shadcn primitive couldn't be used
4. Be flagged in audit greps below

**Existing legitimate custom implementations:**
- `components/parties/PartyTabNav.tsx` — SSR-friendly URL-driven tabs (shadcn `<Tabs>` is client-only)
- `components/mp/FilterDropdown.tsx` — URL-driven single-select (shadcn `<Select>`'s `onValueChange` is a client callback)
- `components/mp/MpSearchForm.tsx` — uses shadcn `<Input>` and `<Button>` with form-submit semantics
- `components/shell/AskBar.tsx` — composite chat input (icon-button + input + send button in one bordered bar); wrapping the inner field in `<Input>` would double-frame against the outer bar's border (§7)
- `components/compare/CompareShell.tsx` — `InlineSlotPicker` popover uses a compact bare `<input>` for in-popover search (32px `<Input>` would double-frame within the 240px popover); chip remove-X buttons and listbox option buttons inside the popover are bare for the same reason
- `.btn-primary-inverse` / `.btn-secondary` (in `app/globals.css`) — CSS utility classes for styling `<Link>` as a button in **server components**, where importing the client `<Button>` would force a needless RSC boundary (§10)

## 2. Tokens, not hex

| Need | Use | Do NOT use |
|---|---|---|
| Text colours | `var(--text-primary)` / `--text-secondary` / `--text-tertiary` / `--text-disabled` | hex codes, `text-white`, `text-gray-400` |
| Backgrounds | `var(--bg-base)` / `--bg-elevated)` / `--bg-elevated-2)` / `--bg-input)` | hex codes |
| Borders | `var(--border)` / `--border-strong)` | `accent/40`, hex |
| Accent | `var(--accent)` | hardcoded blue |
| Status | `var(--status-kept)` / `--status-broken)` etc. | red/green hex |
| Radius | `var(--radius-card)` / `--radius-pill)` / `--radius-tag)` | `rounded-md`, hex |

## 3. Numbers — Indianise

| Need | Use | Do NOT use |
|---|---|---|
| Counts | `formatIndianNumber(8_00_000)` → "8 lakh" | "800,000" |
| Currency | `formatINR(1_23_45_67_890)` → "₹1,234 crore" | "₹12,345,678,900", "$1.2B" |
| Targets | `formatTarget(value, unit)` | hand-rolled string concat |

All three are in `lib/format.ts`.

## 4. Weights — variation settings only

| Need | Use | Do NOT use |
|---|---|---|
| Font weight | `style={{ fontVariationSettings: fontWeights.medium }}` from `lib/font-weight.ts` | `font-medium`, `font-[510]`, `font-bold` |

This is non-negotiable. Tailwind's `font-*` utilities ship the wrong axis on variable fonts.

## 5. Sources — verify or omit

Every claim that says "this politician did X" or "this party received ₹Y" must carry a real source URL OR be explicitly marked `source_pending: true`.

| Need | Do | Do NOT |
|---|---|---|
| Cite a fact | Link to a real, fetchable page (eci.gov.in, prsindia.org, adrindia.org, official press release, archived court order) | Make up a URL because it sounds right |
| Don't know the source | Set `source_pending: true` and render "Source pending" in muted text | Skip the source entirely OR fabricate one |
| Quote a stat | Show denominator next to it ("1 of 2 rated", not "50%") when N is tiny | Round 1/96 to 0% |

The verifier at `scripts/verify-promise-sources.mjs` runs Playwright against every source URL — fabricated sources WILL be caught.

## 6. Caveats — every data section

Every list of rated/aggregated data ends with a small caveat block (Linear-discipline grey card) explaining:
1. Where the data came from (PRS / ADR / ECI / official PDFs / etc.)
2. What's known to be missing or self-declared
3. When applicable, the "ministers/Speaker exempt" or "self-reported" disclaimer

See `app/(app)/manifestos/page.tsx` and `app/(app)/mp/page.tsx` for the established pattern.

## 7. Linear discipline

| Need | Do | Do NOT |
|---|---|---|
| Buttons | One primary CTA per section. Everything else is a tertiary text button or pill. | Six accent-blue buttons stacked |
| Borders | 1px, always neutral (`var(--border)`) | 2px, accent-coloured, glow shadows |
| Card chrome | A 1px hairline accent at most (e.g. `.party-card__band`) | Solid coloured panels, gradient fills |
| Focus state | Single border-color change | Stacked border + inset shadow (double frame) |
| Hover state | Single subtle background change | Glow, scale, blur, accent ring |

## 8. Build-time checklist

Before submitting any PR or task completion:

1. **Component scan**: Grep for raw `<input` / `<button` / `<select` / `<table` in changed files. If found, replace with the wrapper.
2. **Token scan**: Grep for `#[0-9a-fA-F]{3,6}` in changed files. If found, replace with `var(--…)`.
3. **Font scan**: Grep for `font-medium` / `font-bold` / `font-\[` in changed files. If found, replace with `fontVariationSettings`.
4. **Number scan**: Grep for `\.toLocaleString` / hard-coded large integer literals in JSX. If found, replace with `formatIndianNumber` / `formatINR`.
5. **Source scan**: Grep for added URLs in `lib/db/` files. Spot-check at least one. If you generated it, run `node scripts/verify-promise-sources.mjs --target <slug>` first.
6. **Filter scan**: Grep for `<Link.*active=` in changed files. If you find a chip-strip filter, convert to `FilterDropdown` unless it's the documented exception.
7. **Shadcn-equivalent scan**: Grep for `role="tab"`, `role="dialog"`, `role="menu"`, `role="tooltip"`, `aria-selected=`, `aria-expanded=` in changed files. If found in code that isn't `components/ui/**`, verify the file uses the matching shadcn primitive OR is a documented custom implementation (see Rule 1).
8. **FF motion scan**: Grep for `transition.*border|border.*transition|className=.*active` in changed files. If you find a state change that swaps borders/classes WITHOUT a `motion` import, it likely violates Rule 9 (structural transitions must use `motion.div` + `layoutId` + `springs.*`).
9. **Re-read this file**.

## 9. Fluid Functionalism — motion is part of the UI contract

Every UI state change must use the project's motion system, not CSS `transition` alone. CSS transitions are fine for hover-colour shifts; structural state changes (active tab, modal open, drawer slide, list reorder) must use framer-motion.

| Need | Use | Do NOT use |
|---|---|---|
| Active indicator that moves (tab underline, filter pill bg) | `motion.div` with `layoutId="…"` + `transition={springs.moderate}` from `lib/springs.ts` | swap CSS class on the active item; `border-bottom` flip |
| Reveal / collapse | `AnimatePresence` + `motion.div` with `initial`/`animate`/`exit` | `display: none` + opacity transition |
| List reorder | `LayoutGroup` + `motion.li` with `layout` | DOM re-render with no animation |
| Hover scale / fade | CSS `transition` is fine for static elements; otherwise `motion.div whileHover` | none |
| Transition timing | `springs.*` constants from `lib/springs.ts` (snap/responsive/moderate/gentle/settle) | hardcoded `duration: 0.2` / `ease: 'easeInOut'` |

The spring constants are physics-based (stiffness/damping). Don't invent new ones — pick the closest from `lib/springs.ts`. If you need a new spring, add it there with a name that reflects intent (`snap`, `gentle`), not numeric duration.

**Audit greps for FF compliance:**
- `border.*solid.*var\(--text-primary\)` near a `Link` → likely a tab underline that should be `motion.div + layoutId`
- `transition-colors|transition-\[` outside a hover/focus state → may indicate a structural transition that should be FF
- Active-state class swapping with no `motion` import → static state change

## 10. RSC boundary — plain props only

Server components can pass **plain data** (strings, numbers, booleans, plain objects, arrays of plain values) to client components. They **cannot** pass:

- React components (including lucide-react icons like `leadingIcon={Search}`)
- Functions, classes, or anything with methods
- forwardRef / exotic component objects

Next 16 will throw at runtime: `"Only plain objects can be passed to Client Components from Server Components"`.

**Workaround pattern:** When a client component needs an icon/component as a prop, wrap the call site in a tiny `"use client"` component (see `components/legislators/LegislatorSearchForm.tsx`). The icon import then lives entirely on the client side.

**Or:** make the client component accept a string identifier (`leadingIcon="search"`) and resolve to a real component internally.

## 11. When uncertain

Ask the user before:
- Inventing a new colour or weight
- Adding a new accent-coloured surface
- Building a new card-pattern (existing ones: `.party-card`, `.stat-card`, `.caveat-block`)
- Skipping any of the above checks "just this once"

The cost of asking is one round-trip. The cost of being caught is a "How many times do I have to catch you" message and a lost-trust tax on everything that follows.
