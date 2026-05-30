"use client"

/**
 * Neo Nīti Budget — Subsidies Decomposition (NŃ-Budget-330)
 *
 * Cleaned: SegmentedControl primitive, palette tokens, shared ChartTooltip,
 * DataProvenance footer.
 */

import { useState, useEffect, useRef } from "react"
import { motion, animate } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { SUBSIDY_SERIES } from "@/lib/budget/data"
import { hexColor, tokenColor, type BudgetCategory } from "@/lib/budget/palette"
import { MotionSection } from "@/components/ui/motion-section"
import { ChartTooltip } from "@/components/budget/_shared/ChartTooltip"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

type ChartType = "area" | "bar"
type ValueMode = "absolute" | "gdpPct"

const CATEGORIES = ["food", "fertiliser", "petroleum", "other"] as const
const CAT_TO_BUDGET: Record<typeof CATEGORIES[number], BudgetCategory> = {
  food: "food",
  fertiliser: "fertiliser",
  petroleum: "petroleum",
  other: "subOther",
}

const LABELS = {
  food:       "Food (NFSA/PMGKAY)",
  fertiliser: "Fertiliser",
  petroleum:  "Petroleum",
  other:      "Other",
}

// Pre-resolve hex colors for Recharts (can't use CSS vars in SVG attributes)
const CATEGORY_HEX = Object.fromEntries(
  CATEGORIES.map(c => [c, hexColor(CAT_TO_BUDGET[c])])
) as Record<typeof CATEGORIES[number], string>

// ── Count-up ──────────────────────────────────────────────────────────────────
function CountUp({ to, prefix = "", suffix = "", decimals = 2, delay = 0 }: {
  to: number; prefix?: string; suffix?: string; decimals?: number; delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const ctrl = animate(0, to, {
      ...springs.gentle,
      delay,
      onUpdate(v) { if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}` },
    })
    return ctrl.stop
  }, [to])
  return <span ref={ref}>{prefix}0{suffix}</span>
}

// ── KPI mini card ─────────────────────────────────────────────────────────────
function SubKpi({ category, value, pct, delay }: {
  category: typeof CATEGORIES[number]; value: number; pct: number; delay: number
}) {
  const swatch = tokenColor(CAT_TO_BUDGET[category])
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay }}
    >
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: swatch }} />
            <span
              className="text-[10px] uppercase tracking-[0.07em]"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}
            >
              {LABELS[category]}
            </span>
          </div>
          <p className="text-[18px] tabular-nums leading-none"
            style={{ color: swatch, fontVariationSettings: fontWeights.bold, letterSpacing: "-0.02em" }}>
            <CountUp to={value} prefix="₹" suffix=" L Cr" decimals={2} delay={delay + 0.12} />
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
            {pct.toFixed(0)}% of total subsidies · FY 2026-27 BE
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Tooltip ────────────────────────────────────────────────────────────────────
function makeTooltip(valueMode: ValueMode) {
  return function SubsidiesTooltip({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ dataKey: string; value: number }>
    label?: string
  }) {
    if (!active || !payload?.length) return null
    const fmt = (v: number) =>
      valueMode === "gdpPct" ? `${v.toFixed(2)}% GDP` : `₹${v.toFixed(2)} L Cr`
    return (
      <ChartTooltip
        title={`FY ${label}`}
        rows={payload.map(p => {
          const key = p.dataKey as typeof CATEGORIES[number]
          return {
            color: hexColor(CAT_TO_BUDGET[key]),
            label: LABELS[key] ?? String(p.dataKey),
            value: fmt(Number(p.value)),
          }
        })}
      />
    )
  }
}

// ── Shared chart axes ─────────────────────────────────────────────────────────
function ChartAxes({ fmt }: { fmt: (v: number) => string }) {
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis
        dataKey="fy"
        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
        axisLine={false}
        tickLine={false}
        dy={6}
      />
      <YAxis
        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
        axisLine={false}
        tickLine={false}
        tickFormatter={fmt}
        width={52}
      />
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function SubsidiesDecomposition() {
  const [chartType, setChartType] = useState<ChartType>("area")
  const [valueMode, setValueMode] = useState<ValueMode>("absolute")

  if (!SUBSIDY_SERIES.length) return null

  const latest = SUBSIDY_SERIES[SUBSIDY_SERIES.length - 1]

  const chartData = SUBSIDY_SERIES.map(e => ({
    fy: e.fy.slice(2),
    food:       valueMode === "gdpPct" ? (e.food / e.total) * e.gdpPct       : e.food,
    fertiliser: valueMode === "gdpPct" ? (e.fertiliser / e.total) * e.gdpPct : e.fertiliser,
    petroleum:  valueMode === "gdpPct" ? (e.petroleum / e.total) * e.gdpPct  : e.petroleum,
    other:      valueMode === "gdpPct" ? (e.other / e.total) * e.gdpPct      : e.other,
  }))

  const fmt = (v: number) =>
    valueMode === "gdpPct" ? `${v.toFixed(1)}%` : `₹${v.toFixed(1)}`

  const CustomTooltip = makeTooltip(valueMode)
  const tooltipProps = {
    content: <CustomTooltip />,
    cursor: { stroke: "var(--border-stronger)", strokeWidth: 1 },
  }

  return (
    <div className="flex flex-col gap-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((k, i) => (
          <SubKpi
            key={k} category={k}
            value={latest[k]}
            pct={(latest[k] / latest.total) * 100}
            delay={i * 0.07}
          />
        ))}
      </div>

      {/* Controls — single visual language */}
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          value={chartType}
          onValueChange={(v) => setChartType(v as ChartType)}
          options={[
            { value: "area", label: "Area" },
            { value: "bar",  label: "Stacked Bar" },
          ]}
        />
        <SegmentedControl
          value={valueMode}
          onValueChange={(v) => setValueMode(v as ValueMode)}
          options={[
            { value: "absolute", label: "₹ L Cr" },
            { value: "gdpPct",   label: "% of GDP" },
          ]}
        />
      </div>

      <MotionSection delay={0.1}>
        <ResponsiveContainer width="100%" height={260}>
          {chartType === "area" ? (
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                {CATEGORIES.map(c => (
                  <linearGradient key={c} id={`subsidy-${c}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CATEGORY_HEX[c]} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={CATEGORY_HEX[c]} stopOpacity={0.04} />
                  </linearGradient>
                ))}
              </defs>
              <ChartAxes fmt={fmt} />
              <Tooltip {...tooltipProps} />
              {CATEGORIES.map(c => (
                <Area
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stackId="1"
                  stroke={CATEGORY_HEX[c]}
                  strokeWidth={1.5}
                  fill={`url(#subsidy-${c})`}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <ChartAxes fmt={fmt} />
              <Tooltip {...tooltipProps} />
              {CATEGORIES.map(c => (
                <Bar
                  key={c}
                  dataKey={c}
                  stackId="1"
                  fill={CATEGORY_HEX[c]}
                  fillOpacity={0.85}
                  radius={c === "other" ? [2, 2, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </MotionSection>

      <Separator style={{ background: "var(--border)" }} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.3 }}
        className="rounded-[var(--radius-card)] px-4 py-3 text-[12px] leading-[1.7]"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
      >
        <strong style={{ color: "var(--text-primary)" }}>FY 2020-21 spike (₹7.34 lakh crore):</strong>{" "}
        PMGKAY free foodgrain to 80 crore beneficiaries during COVID lockdowns pushed food subsidy
        to 3.8% of GDP.{" "}
        <strong style={{ color: "var(--text-primary)" }}>FY 2022-23 fertiliser peak (₹2.25 lakh crore):</strong>{" "}
        Russia-Ukraine war sent urea/DAP prices to record highs; India absorbed the full differential.
        Post-2023: petroleum subsidy is negligible as LPG pricing is largely market-linked.
        Subsidies at ₹4.08 lakh crore in BE 2026-27 = 1.1% of GDP — lowest since FY18.
      </motion.div>

      <DataProvenance
        source="indiabudget.gov.in Statement of Subsidies; DFPD (food), Dept of Fertilisers, MoPNG"
        note="Off-budget subsidy via FCI-NSSF (pre-FY22) excluded — covered in Off-Budget Borrowings"
      />
    </div>
  )
}
