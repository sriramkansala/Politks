"use client"

/**
 * Budget Time-Machine — NŃ-322 v3.
 *
 * Redesign per design critique: small multiples beat a stacked composition bar.
 * Each head gets its own sparkline indexed to 100 at FY13 so the user sees
 *  - Capex tripled
 *  - Interest crowded out everything
 *  - Subsidies spiked in FY21 (COVID PMGKAY)
 * …in a single glance, not by reading a slider.
 *
 * Bottom strip retains the stacked composition bars (year-by-year) for the
 * user who wants the snapshot view as well.
 */

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { TIME_MACHINE } from "@/lib/budget/data"
import { tokenColor, type BudgetCategory } from "@/lib/budget/palette"
import { useUnits } from "@/lib/budget/units"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"
import { SegmentedControl } from "@/components/ui/segmented-control"

const HEADS: { key: keyof typeof TIME_MACHINE; cat: BudgetCategory; label: string }[] = [
  { key: "interest",    cat: "interest",    label: "Interest" },
  { key: "defence",     cat: "defence",     label: "Defence" },
  { key: "subsidies",   cat: "subsidies",   label: "Subsidies" },
  { key: "capex",       cat: "capex",       label: "Capex" },
  { key: "centSchemes", cat: "centSchemes", label: "Centre schemes" },
  { key: "cssTrans",    cat: "cssTrans",    label: "CSS transfers" },
]

type ViewMode = "indexed" | "composition"

// ── Indexed sparkline — line + endpoint dot + index value ────────────────────
function IndexedSparkline({
  values,
  color,
  label,
  unitFmt,
  isHovered,
  onHover,
  onLeave,
}: {
  values: number[]
  color: string
  label: string
  unitFmt: (v: number, i: number) => string
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const base = values[0] || 1
  const indexed = values.map(v => (v / base) * 100)
  const lastIdx = indexed[indexed.length - 1]
  const minI = Math.min(...indexed)
  const maxI = Math.max(...indexed)

  // SVG geometry
  const W = 200, H = 56
  const padX = 4, padY = 6
  const innerW = W - padX * 2
  const innerH = H - padY * 2

  const path = indexed
    .map((v, i) => {
      const x = padX + (i / (indexed.length - 1)) * innerW
      const y = padY + innerH - ((v - minI) / Math.max(1, maxI - minI)) * innerH
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")

  const endX = padX + innerW
  const endY = padY + innerH - ((lastIdx - minI) / Math.max(1, maxI - minI)) * innerH

  // Direction signal (green if up, red if down)
  const direction = lastIdx >= 100 ? "+" : "−"
  const deltaPct = Math.abs(lastIdx - 100)

  // FY27 absolute value for the row's secondary value
  const fy27Value = values[values.length - 1]
  const fy27Display = unitFmt(fy27Value, values.length - 1)

  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{ opacity: isHovered ? 1 : 0.95 }}
      transition={springs.responsive}
      className="grid grid-cols-[120px_1fr_88px] items-center gap-3 px-3 py-2 rounded-lg cursor-default"
      style={{
        background: isHovered ? "var(--bg-elevated)" : "transparent",
      }}
    >
      {/* Head label + index callout */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
        <span className="text-[12px] truncate"
          style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      </div>

      {/* Sparkline */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
          style={{ display: "block", overflow: "visible" }}>
          {/* Baseline at index=100 */}
          <line
            x1={padX} x2={W - padX}
            y1={padY + innerH - ((100 - minI) / Math.max(1, maxI - minI)) * innerH}
            y2={padY + innerH - ((100 - minI) / Math.max(1, maxI - minI)) * innerH}
            stroke="var(--border)" strokeDasharray="2 3" strokeWidth={1}
          />
          <motion.path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: [0.165, 0.84, 0.44, 1] }}
          />
          <circle cx={endX} cy={endY} r={3} fill={color} />
        </svg>
      </div>

      {/* Index + absolute */}
      <div className="text-right">
        <p className="text-[13px] tabular-nums leading-none"
          style={{ color, fontVariationSettings: fontWeights.bold }}>
          {Math.round(lastIdx)}
        </p>
        <p className="text-[10px] tabular-nums leading-none mt-1"
          style={{ color: "var(--text-tertiary)" }}>
          {direction}{deltaPct.toFixed(0)}% · {fy27Display}
        </p>
      </div>
    </motion.div>
  )
}

// ── Composition bars (auxiliary, year-by-year) ───────────────────────────────
function CompositionBars() {
  const years = TIME_MACHINE.years
  const totals = TIME_MACHINE.totalExp
  const maxTotal = Math.max(...totals)

  return (
    <div className="flex flex-col gap-1">
      {[...years].reverse().map((fy, displayIdx) => {
        const i = years.length - 1 - displayIdx
        const total = totals[i]
        const widthPct = (total / maxTotal) * 100
        const segs = HEADS.map(h => ({
          ...h,
          color: tokenColor(h.cat),
          // @ts-expect-error — narrowed
          value: TIME_MACHINE[h.key][i] as number,
        }))
        const segSum = segs.reduce((s, x) => s + x.value, 0)
        return (
          <div key={fy} className="grid grid-cols-[44px_1fr_88px] items-center gap-3">
            <span className="text-[10px] tabular-nums text-right"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
              {fy}
            </span>
            <div className="relative h-4">
              <div
                className="absolute inset-y-0 left-0 flex rounded-[3px] overflow-hidden gap-px"
                style={{ width: `${widthPct}%`, opacity: 0.85 }}
              >
                {segs.map(s => (
                  <div key={s.key as string} className="h-full"
                    title={`${s.label}: ${((s.value / segSum) * 100).toFixed(1)}%`}
                    style={{ flex: s.value, background: s.color, minWidth: 1 }} />
                ))}
              </div>
            </div>
            <span className="text-[10px] tabular-nums text-right"
              style={{ color: "var(--text-tertiary)" }}>
              ₹{total.toFixed(1)} L Cr
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function BudgetTimeMachine() {
  const [view, setView] = useState<ViewMode>("indexed")
  const [hovered, setHovered] = useState<string | null>(null)
  const units = useUnits()

  const rows = useMemo(() => HEADS.map(h => ({
    ...h,
    color: tokenColor(h.cat),
    // @ts-expect-error — narrowed at runtime
    values: TIME_MACHINE[h.key] as number[],
  })), [])

  return (
    <div className="flex flex-col gap-4">
      {/* View toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <SegmentedControl
          value={view}
          onValueChange={(v) => setView(v as ViewMode)}
          options={[
            { value: "indexed",     label: "Indexed (FY13 = 100)" },
            { value: "composition", label: "Composition" },
          ]}
        />
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          {view === "indexed"
            ? "Each head as a sparkline, indexed to FY13 = 100. Endpoint number = FY27 index."
            : "Stacked composition by year — bar length proportional to total expenditure."}
        </p>
      </div>

      {/* The chart */}
      {view === "indexed" ? (
        <div className="flex flex-col">
          {rows.map(r => (
            <IndexedSparkline
              key={r.key as string}
              values={r.values}
              color={r.color}
              label={r.label}
              unitFmt={(v, i) => units.format(v, i)}
              isHovered={hovered === r.key}
              onHover={() => setHovered(r.key as string)}
              onLeave={() => setHovered(null)}
            />
          ))}
          {/* X-axis labels */}
          <div className="grid grid-cols-[120px_1fr_88px] items-center gap-3 px-3 mt-1">
            <div />
            <div className="flex justify-between text-[9px] tabular-nums"
              style={{ color: "var(--text-disabled)" }}>
              <span>FY13</span><span>FY18</span><span>FY22</span><span>FY27</span>
            </div>
            <div />
          </div>
        </div>
      ) : (
        <CompositionBars />
      )}

      <DataProvenance
        source="PRS Union Budget Analyses FY13–FY27 · indiabudget.gov.in Statement of Expenditure"
        note="current rupees; toggle units in the page header for real-₹ / % of GDP / per-capita"
      />
    </div>
  )
}
