import { statusMeta, type PromiseStatus } from "@/lib/tokens"
import { cn } from "@/lib/utils"
import { fontWeights } from "@/lib/font-weight"

interface StatusPillProps {
  status: PromiseStatus
  /** Render variant. `dot` = Linear-monochrome dot+label (default).
   *  `chip` = legacy full-colour chip for status-emphasis surfaces. */
  variant?: "dot" | "chip"
  className?: string
}

// Linear-monochrome status indicator: 6px coloured dot + uppercase label in
// muted grey. The full-colour chip variant is opt-in (e.g. an active table
// status header where the chip itself is the data, not the row).
export function StatusPill({ status, variant = "dot", className }: StatusPillProps) {
  const meta = statusMeta[status]

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-[0.04em] shrink-0",
          className
        )}
        style={{
          color: meta.color,
          background: meta.bg,
          borderRadius: "var(--radius-tag)",
          fontVariationSettings: fontWeights.medium,
        }}
      >
        {meta.label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.04em] shrink-0",
        className
      )}
      style={{
        color: "var(--text-tertiary)",
        fontVariationSettings: "'wght' 510",
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: meta.color }}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  )
}
