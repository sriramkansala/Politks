// Bill-outcome glyphs in Linear's circular visual grammar, drawn as SVG so they
// stay crisp and inherit the outcome colour (tokens from globals.css):
//   passed    → filled disc + check          (status-kept, green)
//   pending   → ring + partial pie           (status-inworks, cyan)
//   withdrawn → dashed ring                   (status-stalled, brown)
//   lapsed    → filled disc + ✕               (status-broken, red)
//   repealed  → ring + centre dot             (status-compromise, amber)
// Mirrors components/linear/StatusIcon.tsx so bills read in the same language as
// the issue list, without forcing bills into the issue-status enum.

export type BillOutcome = "passed" | "pending" | "withdrawn" | "lapsed" | "repealed"

export const OUTCOME_META: Record<BillOutcome, { label: string; color: string }> = {
  passed:    { label: "Passed",    color: "var(--status-kept)" },
  pending:   { label: "Pending",   color: "var(--status-inworks)" },
  withdrawn: { label: "Withdrawn", color: "var(--status-stalled)" },
  lapsed:    { label: "Lapsed",    color: "var(--status-broken)" },
  repealed:  { label: "Repealed",  color: "var(--status-compromise)" },
}

// Grouping / sort order: resolved-positive → pending → negative outcomes.
export const OUTCOME_ORDER: BillOutcome[] = [
  "passed",
  "pending",
  "withdrawn",
  "lapsed",
  "repealed",
]

export function normalizeOutcome(outcome: string | null | undefined): BillOutcome {
  return (outcome ?? "pending") in OUTCOME_META ? (outcome as BillOutcome) ?? "pending" : "pending"
}

const PIE_R = 2.1
const PIE_C = 2 * Math.PI * PIE_R

interface BillStatusIconProps {
  outcome: BillOutcome
  size?: number
  className?: string
}

export function BillStatusIcon({ outcome, size = 16, className }: BillStatusIconProps) {
  const color = OUTCOME_META[outcome].color

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      role="img"
      aria-label={OUTCOME_META[outcome].label}
    >
      {outcome === "withdrawn" && (
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="1.6 2.25"
          strokeLinecap="round"
        />
      )}

      {outcome === "pending" && (
        <>
          <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
          <circle
            cx="8"
            cy="8"
            r={PIE_R}
            fill="none"
            stroke={color}
            strokeWidth={PIE_R * 2}
            strokeDasharray={`${(0.5 * PIE_C).toFixed(3)} ${PIE_C.toFixed(3)}`}
            transform="rotate(-90 8 8)"
          />
        </>
      )}

      {outcome === "repealed" && (
        <>
          <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2.1" fill={color} />
        </>
      )}

      {(outcome === "passed" || outcome === "lapsed") && (
        <>
          <circle cx="8" cy="8" r="7" fill={color} />
          {outcome === "passed" ? (
            <path
              d="M5 8.4 L7 10.4 L11.2 5.8"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M5.6 5.6 L10.4 10.4 M10.4 5.6 L5.6 10.4"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </>
      )}
    </svg>
  )
}
