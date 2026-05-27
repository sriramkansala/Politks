/**
 * Budget chart palette — single source of truth.
 *
 * Three views of the same logical category:
 *   - `tokenVar`   for HTML/CSS/SVG via `var(--*)` (preferred everywhere)
 *   - `tremorName` for <AreaChart colors={...}> (must be in globals.css @source inline list)
 *   - `hex`        for SVG attributes that can't resolve CSS vars
 *                  and for Tremor-custom-tooltip dots that must match
 *                  Tremor's rendered Tailwind hex
 *
 * If you find yourself reaching for a literal `#xxxxxx` inside
 * `components/budget/*`, add a category here instead.
 */

export type BudgetCategory =
  // Flow / Sankey categories
  | "borrowing"
  | "tax_direct"
  | "tax_indirect"
  | "non_tax"
  | "transfer"
  | "centre"
  | "obligatory"
  | "scheme"
  | "other"
  // Expenditure heads (Time-Machine, Defence-vs-Social)
  | "interest"
  | "defence"
  | "subsidies"
  | "capex"
  | "centSchemes"
  | "cssTrans"
  | "health"
  | "education"
  | "ruralDev"
  | "agri"
  // Subsidies decomposition
  | "food"
  | "fertiliser"
  | "petroleum"
  | "subOther"
  // Cess & surcharge
  | "cess"
  | "surcharge"
  // Federal flows
  | "producer"
  | "consumer"
  | "neutral"
  // Era overlays (OffBudgetBorrowings)
  | "era_upa"
  | "era_nda"
  // Outcome / promise verdicts
  | "kept"
  | "broken"
  | "partial"

interface PaletteEntry {
  tokenVar: string
  tremorName: string // Tailwind base color name; must be safelisted in globals.css
  hex: string        // Resolved hex for SVG-attribute fills & Tremor-tooltip dots
}

export const PALETTE: Record<BudgetCategory, PaletteEntry> = {
  // ── Sankey ─────────────────────────────────────────────
  borrowing:    { tokenVar: "var(--status-broken)",     tremorName: "rose",    hex: "#eb5757" },
  tax_direct:   { tokenVar: "var(--accent)",            tremorName: "indigo",  hex: "#7170ff" },
  tax_indirect: { tokenVar: "var(--blue)",              tremorName: "blue",    hex: "#4ea7fc" },
  non_tax:      { tokenVar: "var(--status-inworks)",    tremorName: "cyan",    hex: "#02b8cc" },
  transfer:     { tokenVar: "var(--status-compromise)", tremorName: "amber",   hex: "#f2c94c" },
  centre:       { tokenVar: "var(--status-kept)",       tremorName: "emerald", hex: "#4cb782" },
  obligatory:   { tokenVar: "var(--status-stalled)",    tremorName: "amber",   hex: "#b08968" },
  scheme:       { tokenVar: "var(--blue-marketing)",    tremorName: "sky",     hex: "#56cdff" },
  other:        { tokenVar: "var(--status-unrated)",    tremorName: "slate",   hex: "#62666d" },

  // ── Expenditure heads ──────────────────────────────────
  interest:    { tokenVar: "var(--status-broken)",     tremorName: "rose",    hex: "#eb5757" },
  defence:     { tokenVar: "var(--status-kept)",       tremorName: "emerald", hex: "#4cb782" },
  subsidies:   { tokenVar: "var(--status-compromise)", tremorName: "amber",   hex: "#f2c94c" },
  capex:       { tokenVar: "var(--accent)",            tremorName: "indigo",  hex: "#7170ff" },
  centSchemes: { tokenVar: "var(--status-inworks)",    tremorName: "cyan",    hex: "#02b8cc" },
  cssTrans:    { tokenVar: "var(--blue)",              tremorName: "blue",    hex: "#4ea7fc" },
  health:      { tokenVar: "var(--status-kept)",       tremorName: "emerald", hex: "#4cb782" },
  education:   { tokenVar: "var(--accent)",            tremorName: "indigo",  hex: "#7170ff" },
  ruralDev:    { tokenVar: "var(--status-inworks)",    tremorName: "cyan",    hex: "#02b8cc" },
  agri:        { tokenVar: "var(--status-compromise)", tremorName: "amber",   hex: "#f2c94c" },

  // ── Subsidies decomposition ────────────────────────────
  food:       { tokenVar: "var(--blue)",              tremorName: "blue",    hex: "#4ea7fc" },
  fertiliser: { tokenVar: "var(--status-kept)",       tremorName: "emerald", hex: "#4cb782" },
  petroleum:  { tokenVar: "var(--status-compromise)", tremorName: "amber",   hex: "#f2c94c" },
  subOther:   { tokenVar: "var(--status-unrated)",    tremorName: "slate",   hex: "#62666d" },

  // ── Cess & surcharge ───────────────────────────────────
  cess:      { tokenVar: "var(--status-broken)",     tremorName: "rose",  hex: "#eb5757" },
  surcharge: { tokenVar: "var(--status-compromise)", tremorName: "amber", hex: "#f2c94c" },

  // ── Federal positions ──────────────────────────────────
  producer: { tokenVar: "var(--status-kept)",    tremorName: "emerald", hex: "#4cb782" },
  consumer: { tokenVar: "var(--blue)",           tremorName: "blue",    hex: "#4ea7fc" },
  neutral:  { tokenVar: "var(--text-tertiary)",  tremorName: "slate",   hex: "#62666d" },

  // ── Era overlays ───────────────────────────────────────
  era_upa: { tokenVar: "var(--status-stalled)", tremorName: "amber",  hex: "#b08968" },
  era_nda: { tokenVar: "var(--accent)",         tremorName: "indigo", hex: "#7170ff" },

  // ── Verdicts ───────────────────────────────────────────
  kept:    { tokenVar: "var(--status-kept)",       tremorName: "emerald", hex: "#4cb782" },
  broken:  { tokenVar: "var(--status-broken)",     tremorName: "rose",    hex: "#eb5757" },
  partial: { tokenVar: "var(--status-compromise)", tremorName: "amber",   hex: "#f2c94c" },
}

export function tokenColor(cat: BudgetCategory): string {
  return PALETTE[cat].tokenVar
}

export function tremorColor(cat: BudgetCategory): string {
  return PALETTE[cat].tremorName
}

export function hexColor(cat: BudgetCategory): string {
  return PALETTE[cat].hex
}
