// Circular assignee avatar with initials fallback. Unassigned renders Linear's
// dashed ring + faint person glyph.

import { cn } from "@/lib/utils"
import { fontWeights } from "@/lib/font-weight"

interface AssigneeProps {
  name?: string | null
  color?: string
  size?: number
  className?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

export function Assignee({ name, color = "#5e6ad2", size = 20, className }: AssigneeProps) {
  if (!name) {
    return (
      <span
        className={cn("inline-flex items-center justify-center rounded-full shrink-0", className)}
        style={{ width: size, height: size, border: "1px dashed var(--border-stronger)" }}
        aria-label="Unassigned"
      >
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="5.5" r="2.6" stroke="var(--text-quaternary)" strokeWidth="1.3" />
          <path
            d="M3.4 13c0-2.6 2-4.2 4.6-4.2s4.6 1.6 4.6 4.2"
            stroke="var(--text-quaternary)"
            strokeWidth="1.3"
          />
        </svg>
      </span>
    )
  }

  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full shrink-0 text-white", className)}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.round(size * 0.42),
        fontVariationSettings: fontWeights.semibold,
      }}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </span>
  )
}
