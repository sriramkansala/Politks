// Linear label chip: colour dot + text inside a thin pill outline.

import { cn } from "@/lib/utils"
import { fontWeights } from "@/lib/font-weight"

interface LabelChipProps {
  label: string
  color: string
  className?: string
}

export function LabelChip({ label, color, className }: LabelChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[22px] pl-1.5 pr-2 text-[12px] whitespace-nowrap",
        className
      )}
      style={{
        color: "var(--text-secondary)",
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        borderRadius: "var(--radius-pill)",
        fontVariationSettings: fontWeights.medium,
      }}
    >
      <span
        aria-hidden
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ background: color }}
      />
      {label}
    </span>
  )
}
