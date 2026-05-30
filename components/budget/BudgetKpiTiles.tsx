"use client"

/**
 * Budget KPI strip — flat, tabular, comparison-first.
 * Design rationale: Vercel/Plausible/Linear-style overview row.
 * Each tile carries: label · headline figure · YoY Δ · 6-yr micro-trend · context.
 * Semantic colour is reserved for Δ direction; headline numbers stay neutral.
 */

import { motion } from "framer-motion"
import { Tooltip } from "@/components/ui/tooltip"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { BUDGET_KPIS } from "@/lib/budget/data"

// ── Direction logic ───────────────────────────────────────────────────────────
type Direction = "up-good" | "down-good" | "neutral"

function deltaColour(current: number, prior: number, direction: Direction): string {
  if (direction === "neutral" || current === prior) return "var(--text-secondary)"
  const improved =
    direction === "up-good" ? current > prior : current < prior
  return improved ? "var(--status-kept)" : "var(--status-broken)"
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({
  series,
  endColour,
  height = 18,
}: {
  series: number[]
  endColour: string
  height?: number
}) {
  const w = 64
  const h = height
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w
    const y = h - ((v - min) / span) * (h - 4) - 2
    return [x, y] as const
  })
  const path = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ")
  const [lx, ly] = pts[pts.length - 1]

  return (
    <svg width={w} height={h} className="block overflow-visible">
      <path
        d={path}
        fill="none"
        stroke="var(--text-secondary)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
      <circle cx={lx} cy={ly} r={2.5} fill={endColour} />
    </svg>
  )
}

// ── Delta chip ────────────────────────────────────────────────────────────────
function Delta({
  current,
  prior,
  unit = "%",
  direction,
  precision = 1,
  asBps = false,
}: {
  current: number
  prior: number
  unit?: "%" | "bps"
  direction: Direction
  precision?: number
  asBps?: boolean
}) {
  const diff = asBps ? (current - prior) * 100 : ((current - prior) / prior) * 100
  const colour = deltaColour(current, prior, direction)
  const sign = diff > 0 ? "+" : ""
  const value = asBps
    ? `${sign}${diff.toFixed(0)} bps`
    : `${sign}${diff.toFixed(precision)}%`

  return (
    <span
      className="inline-flex items-center text-[11px] leading-none tabular-nums"
      style={{ color: colour, fontVariationSettings: fontWeights.semibold }}
    >
      {value}
      <span
        className="ml-1 text-[10px]"
        style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.normal }}
      >
        YoY
      </span>
    </span>
  )
}

// ── One tile ──────────────────────────────────────────────────────────────────
interface TileProps {
  label: string
  headline: React.ReactNode      // the BIG figure (already formatted)
  unit?: string                  // small muted unit (e.g. "L Cr", "of GDP")
  support?: string               // secondary figure under the unit row
  series: number[]
  current: number
  prior: number
  deltaUnit?: "%" | "bps"
  asBps?: boolean
  direction: Direction
  emphasised?: boolean
  tooltip: string
  delay?: number
  showRightHairline?: boolean
}

function Tile({
  label,
  headline,
  unit,
  support,
  series,
  current,
  prior,
  deltaUnit = "%",
  asBps = false,
  direction,
  emphasised = false,
  tooltip,
  delay = 0,
  showRightHairline = false,
}: TileProps) {
  const endColour = deltaColour(current, prior, direction)

  return (
    <Tooltip content={tooltip} side="bottom">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay }}
        className="relative px-3.5 py-3 cursor-default"
        style={{
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Right hairline — terminates above the context line */}
        {showRightHairline && (
          <span
            aria-hidden
            className="hidden md:block absolute right-0 top-3 bottom-9 w-px"
            style={{ background: "var(--border)" }}
          />
        )}

        {/* Label */}
        <p
          className="text-[10px] uppercase leading-none mb-2.5 whitespace-nowrap"
          style={{
            color: "var(--text-tertiary)",
            letterSpacing: "0.08em",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          {label}
        </p>

        {/* Headline figure */}
        <div
          className="tabular-nums leading-none"
          style={{
            color: "var(--text-primary)",
            fontSize: emphasised ? 28 : 24,
            letterSpacing: "-0.025em",
            fontVariationSettings: fontWeights.bold,
          }}
        >
          {headline}
        </div>

        {/* Unit (own line — never wraps with headline) */}
        {unit && (
          <p
            className="text-[11px] leading-none mt-1.5"
            style={{
              color: "var(--text-tertiary)",
              fontVariationSettings: fontWeights.medium,
            }}
          >
            {unit}
          </p>
        )}

        {/* Delta + sparkline */}
        <div className="flex items-center justify-between gap-2 mt-3 mb-2.5">
          <Delta
            current={current}
            prior={prior}
            unit={deltaUnit}
            asBps={asBps}
            direction={direction}
          />
          <Sparkline series={series} endColour={endColour} />
        </div>

        {/* Support / context line */}
        {support && (
          <p
            className="text-[10px] leading-[1.45] tabular-nums"
            style={{ color: "var(--text-tertiary)" }}
          >
            {support}
          </p>
        )}
      </motion.div>
    </Tooltip>
  )
}

// ── Strip ─────────────────────────────────────────────────────────────────────
export function BudgetKpiTiles() {
  const k = BUDGET_KPIS
  const p = k.prior
  const t = k.trend

  const tiles: TileProps[] = [
    {
      label: "Total Expenditure",
      headline: `₹${k.totalExpenditure.toFixed(2)}`,
      unit: "L Cr",
      support: `vs ₹${p.totalExpenditure.toFixed(2)} L Cr · FY ${p.fy} BE`,
      series: t.totalExpenditure,
      current: k.totalExpenditure,
      prior: p.totalExpenditure,
      direction: "neutral",
      emphasised: true,
      tooltip: `Union Budget expenditure for FY ${k.fy} (Budget Estimate). Source: ${k.source}`,
      delay: 0,
      showRightHairline: true,
    },
    {
      label: "Fiscal Deficit",
      headline: k.fiscalDeficitPct.toFixed(1),
      unit: "% of GDP",
      support: `₹${k.fiscalDeficit.toFixed(2)} L Cr borrowed · target met`,
      series: t.fiscalDeficitPct,
      current: k.fiscalDeficitPct,
      prior: p.fiscalDeficitPct,
      asBps: true,
      deltaUnit: "bps",
      direction: "down-good",
      tooltip: `Target: 4.3% of GDP in FY ${k.fy} BE. Down from 5.1% in FY22-23. Source: ${k.source}`,
      delay: 0.05,
      showRightHairline: true,
    },
    {
      label: "States' Share",
      headline: `${k.statesTransfersPct.toFixed(0)}%`,
      unit: "of expenditure",
      support: `₹${k.statesTransfersTotal.toFixed(2)} L Cr to states · +12.2% vs RE`,
      series: t.statesTransfersPct,
      current: k.statesTransfersPct,
      prior: p.statesTransfersPct,
      asBps: true,
      deltaUnit: "bps",
      direction: "up-good",
      tooltip: `Devolution (41% pool) + FC grants + CSS releases. Up 12.2% over RE 2025-26. Source: ${k.source}`,
      delay: 0.1,
      showRightHairline: true,
    },
    {
      label: "Capex",
      headline: k.capexGdpPct.toFixed(1),
      unit: "% of GDP",
      support: `₹${k.capitalExpenditure.toFixed(2)} L Cr · pure Centre capex`,
      series: t.capexGdpPct,
      current: k.capexGdpPct,
      prior: p.capexGdpPct,
      asBps: true,
      deltaUnit: "bps",
      direction: "up-good",
      tooltip: `Pure Centre capex. Excludes grants for state capex. Source: ${k.source}`,
      delay: 0.15,
    },
  ]

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 rounded-lg overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
      }}
    >
      {tiles.map((t, i) => (
        <Tile key={t.label} {...t} showRightHairline={i < tiles.length - 1} />
      ))}
    </div>
  )
}
