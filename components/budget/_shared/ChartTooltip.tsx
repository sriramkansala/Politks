"use client"

/**
 * Shared dark-themed tooltip for Tremor `customTooltip` and similar use cases.
 * Replaces every hand-rolled tooltip card across the budget tab.
 */

import type { ReactNode } from "react"
import { fontWeights } from "@/lib/font-weight"

export interface ChartTooltipRow {
  label: ReactNode
  value: ReactNode
  color: string
}

export function ChartTooltip({
  title,
  rows,
  footnote,
}: {
  title?: ReactNode
  rows: ChartTooltipRow[]
  footnote?: ReactNode
}) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-[11px] shadow-lg min-w-[170px]"
      style={{ background: "var(--bg-elevated-3)", border: "1px solid var(--border)" }}
    >
      {title && (
        <p className="mb-1.5" style={{ color: "var(--text-tertiary)" }}>{title}</p>
      )}
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{r.label}</span>
          <span
            className="ml-auto pl-4 tabular-nums"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
          >
            {r.value}
          </span>
        </div>
      ))}
      {footnote && (
        <p className="mt-1.5 pt-1.5 border-t text-[10px] leading-snug"
          style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
          {footnote}
        </p>
      )}
    </div>
  )
}
