"use client"

/**
 * Neo Nīti Budget — Cess + Surcharge Wedge (NŃ-Federal-326).
 *
 * Cleaned: palette tokens, SegmentedControl, shared ChartTooltip,
 * DataProvenance. Adds the hero translation
 *   "States lost ₹X to cess/surcharge in FY27 BE — ₹Y per citizen, Z× MGNREGA."
 */

import { useEffect, useRef, useState } from "react"
import { motion, animate } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { CESS_SERIES } from "@/lib/budget/data"
import { hexColor, tokenColor } from "@/lib/budget/palette"
import { MotionSection } from "@/components/ui/motion-section"
import { ChartTooltip } from "@/components/budget/_shared/ChartTooltip"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

type ViewMode = "pct" | "absolute"

const SURCHARGE_HEX = hexColor("surcharge")
const CESS_HEX      = hexColor("cess")

// ── Count-up span ─────────────────────────────────────────────────────────────
function CountUp({ to, prefix = "", suffix = "", decimals = 1, delay = 0 }: {
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

// ── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({ label, to, prefix, suffix, decimals, sub, color, delay }: {
  label: string; to: number; prefix?: string; suffix?: string; decimals?: number
  sub: string; color: string; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay }}
    >
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.07em] mb-1.5"
            style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
            {label}
          </p>
          <p className="text-[20px] tabular-nums leading-none"
            style={{ color, fontVariationSettings: fontWeights.bold, letterSpacing: "-0.02em" }}>
            <CountUp to={to} prefix={prefix} suffix={suffix} decimals={decimals} delay={delay + 0.1} />
          </p>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Tooltip ────────────────────────────────────────────────────────────────────
function makeCessTooltip(view: ViewMode) {
  return function CessTooltip({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ dataKey: string; value: number }>
    label?: string
  }) {
    if (!active || !payload?.length) return null
    return (
      <ChartTooltip
        title={`FY ${label}`}
        rows={payload.map(p => ({
          color: p.dataKey === "cess" ? CESS_HEX : SURCHARGE_HEX,
          label: p.dataKey === "cess" ? "Cess" : "Surcharge",
          value: view === "pct"
            ? `${Number(p.value).toFixed(1)}%`
            : `₹${Number(p.value).toFixed(2)} L Cr`,
        }))}
      />
    )
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function CessWedgeTracker() {
  const [view, setView] = useState<ViewMode>("pct")
  const latest = CESS_SERIES[CESS_SERIES.length - 1]

  if (!latest) return null

  const chartData = CESS_SERIES.map(e => ({
    fy: e.fy.slice(2),
    surcharge: view === "pct" ? (e.surchargeTotal / e.totalGTR) * 100 : e.surchargeTotal,
    cess:      view === "pct" ? (e.cessTotal / e.totalGTR) * 100      : e.cessTotal,
  }))

  const fmt = (v: number) => view === "pct" ? `${v.toFixed(1)}%` : `₹${v.toFixed(1)}`
  const CustomTooltip = makeCessTooltip(view)

  // ── Hero translation ──────────────────────────────────────────────
  // States' lost share = cessAndSurcharge × (1 − devolution rate of ~41%)
  // We approximate states' "lost" claim as the full ₹ amount (the wedge keeps
  // states out of the divisible pool entirely).
  const lostLakhCr      = latest.cessAndSurcharge
  const POP_CRORE       = 143
  const perCitizen      = Math.round((lostLakhCr * 1_00_000) / POP_CRORE)
  // MGNREGA BE FY27 ≈ ₹0.86 L Cr (Min of Rural Dev). Used here as a context anchor.
  const MGNREGA_FY27    = 0.86
  const mgnregaMultiple = (lostLakhCr / MGNREGA_FY27).toFixed(1)

  return (
    <div className="flex flex-col gap-5">

      {/* Hero translation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
        className="rounded-xl px-4 py-3"
        style={{
          background: "color-mix(in oklab, var(--status-broken) 8%, var(--bg-elevated))",
          border: "1px solid color-mix(in oklab, var(--status-broken) 20%, var(--border))",
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.07em] mb-1.5"
          style={{ color: tokenColor("cess"), fontVariationSettings: fontWeights.semibold }}>
          Federalism translation
        </p>
        <p className="text-[14px] leading-[1.5]"
          style={{ color: "var(--text-primary)" }}>
          States lost{" "}
          <span className="tabular-nums" style={{ color: tokenColor("cess"), fontVariationSettings: fontWeights.bold }}>
            ₹{lostLakhCr.toFixed(2)} L Cr
          </span>{" "}
          to cess + surcharge in FY{latest.fy.slice(2)} —{" "}
          <span className="tabular-nums" style={{ fontVariationSettings: fontWeights.semibold }}>
            ₹{perCitizen.toLocaleString("en-IN")} per citizen
          </span>{" "}
          ·{" "}
          <span className="tabular-nums" style={{ fontVariationSettings: fontWeights.semibold }}>
            {mgnregaMultiple}× the MGNREGA budget
          </span>
          .
        </p>
      </motion.div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          label="Cess + Surcharge FY26 BE"
          to={latest.cessAndSurcharge}
          prefix="₹" suffix=" L Cr" decimals={1}
          sub={`${latest.pctOfGTR.toFixed(1)}% of Gross Tax Revenue`}
          color={tokenColor("cess")}
          delay={0}
        />
        <StatTile
          label="Non-shareable with States"
          to={latest.pctOfGTR}
          suffix="%" decimals={1}
          sub="Excluded from divisible pool (Art. 270 & 271)"
          color={tokenColor("cess")}
          delay={0.07}
        />
        <StatTile
          label="Divisible Pool Share"
          to={latest.divisiblePoolPct}
          suffix="%" decimals={1}
          sub="Down from ~87% in early 2010s"
          color="var(--status-inworks)"
          delay={0.14}
        />
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-3">
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Show as:</span>
        <SegmentedControl
          value={view}
          onValueChange={(v) => setView(v as ViewMode)}
          options={[
            { value: "pct",      label: "% of GTR" },
            { value: "absolute", label: "₹ Lakh Crore" },
          ]}
        />
      </div>

      <MotionSection delay={0.1}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="cess-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CESS_HEX} stopOpacity={0.22} />
                <stop offset="95%" stopColor={CESS_HEX} stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="surcharge-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SURCHARGE_HEX} stopOpacity={0.22} />
                <stop offset="95%" stopColor={SURCHARGE_HEX} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--border-stronger)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="surcharge"
              stackId="1"
              stroke={SURCHARGE_HEX}
              strokeWidth={1.5}
              fill="url(#surcharge-gradient)"
            />
            <Area
              type="monotone"
              dataKey="cess"
              stackId="1"
              stroke={CESS_HEX}
              strokeWidth={1.5}
              fill="url(#cess-gradient)"
            />
          </AreaChart>
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
        <strong style={{ color: "var(--text-primary)" }}>Constitutional basis:</strong>{" "}
        Under Articles 270 and 271, cesses and surcharges are{" "}
        <em>excluded</em> from the divisible pool shared with states — even at 41% devolution.
        The divisible pool fell from ~87% of Gross Tax Revenue in the early 2010s to a peak of 79%
        in FY21, recovering to ~86% in FY26.{" "}
        <strong style={{ color: "var(--text-primary)" }}>16th Finance Commission (Feb 2026)</strong> urged
        {" "}<em>"progressive reduction"</em> but did not recommend a statutory cap.
      </motion.div>

      <DataProvenance
        source="indiabudget.gov.in Receipts Budget (FY17–FY27); CAG Union Audit Reports; CSEP, NIPFP"
        note="Cess proceeds are earmarked — Health & Education Cess funds PMSSY, Samagra Shiksha, etc."
      />
    </div>
  )
}
