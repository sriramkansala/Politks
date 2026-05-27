"use client"

/**
 * Neo Nīti Budget — State Net-Position (NŃ-Federal-323)
 * Sortable table with spring-animated ratio bars.
 * Choropleth map is Wave 2 after CBGA methodology endorsement.
 */

import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { ArrowUpDown, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip } from "@/components/ui/tooltip"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { STATE_NET_POSITIONS, FC_FORMULA, type StateNetPosition } from "@/lib/budget/data"

type SortKey = "ratio" | "gsdpSharePct" | "net" | "stateName"
type SortDir = "asc" | "desc"

// ── Animated ratio bar ────────────────────────────────────────────────────────
function RatioBar({ ratio, max, delay }: { ratio: number; max: number; delay: number }) {
  const pct = Math.min((ratio / max) * 100, 100)
  const color =
    ratio < 0.8  ? "var(--status-broken)"    :
    ratio < 1.2  ? "var(--status-compromise)" :
                   "var(--status-kept)"

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated-3)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...springs.gentle, delay }}
        />
        {/* We need to set width, not scaleX, for correct fill. Use width animation: */}
      </div>
      <span className="text-[11px] tabular-nums w-8 text-right shrink-0"
        style={{ color, fontVariationSettings: fontWeights.semibold }}>
        {ratio.toFixed(2)}
      </span>
    </div>
  )
}

// Fix: use motion.div width animation instead of scaleX for correct bar rendering
function AnimatedRatioBar({ ratio, max, delay }: { ratio: number; max: number; delay: number }) {
  const pct = Math.min((ratio / max) * 100, 100)
  const color =
    ratio < 0.8  ? "var(--status-broken)"    :
    ratio < 1.2  ? "var(--status-compromise)" :
                   "var(--status-kept)"

  return (
    <div className="flex items-center gap-2" style={{ minWidth: 120 }}>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated-3)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, width: `${pct}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ ...springs.gentle, delay }}
        />
      </div>
      <span className="text-[11px] tabular-nums shrink-0"
        style={{ color, fontVariationSettings: fontWeights.semibold, width: 32, textAlign: "right" }}>
        {ratio.toFixed(2)}
      </span>
    </div>
  )
}

// ── Ratio pill ────────────────────────────────────────────────────────────────
function RatioPill({ ratio }: { ratio: number }) {
  const color: Parameters<typeof Badge>[0]["color"] =
    ratio < 0.8  ? "red"    :
    ratio < 1.2  ? "amber"  :
                   "green"

  return (
    <Badge color={color} size="sm" className="tabular-nums">
      ₹{ratio.toFixed(2)}
    </Badge>
  )
}

// ── Sort button ───────────────────────────────────────────────────────────────
function SortBtn({ col, current, dir, onSort, label }: {
  col: SortKey; current: SortKey; dir: SortDir
  onSort: (k: SortKey) => void; label: string
}) {
  const active = current === col
  return (
    <button
      onClick={() => onSort(col)}
      className="flex items-center gap-1 text-left outline-none"
      style={{
        color: active ? "var(--text-primary)" : "var(--text-tertiary)",
        fontVariationSettings: active ? fontWeights.semibold : fontWeights.medium,
        fontSize: 11,
      }}
    >
      {label}
      <motion.span animate={{ rotate: active && dir === "asc" ? 180 : 0 }} transition={springs.snap}>
        {active ? (dir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : <ArrowUpDown size={10} />}
      </motion.span>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function StateNetPositionMap() {
  const [sortKey, setSortKey] = useState<SortKey>("ratio")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  function handleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(k); setSortDir("desc") }
  }

  const sorted = [...STATE_NET_POSITIONS].sort((a, b) => {
    const getVal = (s: StateNetPosition) => {
      switch (sortKey) {
        case "ratio":        return s.ratioReceivedPerRupee
        case "gsdpSharePct": return s.gsdpSharePct
        case "net":          return s.totalTransfers - s.taxContribEstimate
        case "stateName":    return 0
      }
    }
    if (sortKey === "stateName") {
      return sortDir === "asc"
        ? a.stateName.localeCompare(b.stateName)
        : b.stateName.localeCompare(a.stateName)
    }
    const av = getVal(a), bv = getVal(b)
    return sortDir === "asc" ? av - bv : bv - av
  })

  const maxRatio = Math.max(...STATE_NET_POSITIONS.map(s => s.ratioReceivedPerRupee))
  const fc16 = FC_FORMULA["16th FC"]

  return (
    <div className="flex flex-col gap-5">
      {/* Constitutional guardrail */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
        className="rounded-[var(--radius-card)] px-4 py-3 text-[12px] leading-[1.6]"
        style={{
          background: "color-mix(in srgb, var(--accent) 6%, transparent)",
          border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
          color: "var(--text-secondary)",
        }}
      >
        <strong style={{ color: "var(--text-primary)" }}>Constitutional mandate (Article 280):</strong>{" "}
        Redistribution from richer to poorer states is the express mandate of the Finance Commission.
        This table is <em>descriptive</em>, not prescriptive.
        "Contribution" uses PAN-based tax collection — see methodology note below.
      </motion.div>

      {/* 16th FC formula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.08 }}
      >
        <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <CardContent className="px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.07em] mb-3"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
              16th Finance Commission — Horizontal Formula (FY 2026-31)
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(fc16).filter(([, v]) => v > 0).map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springs.gentle, delay: 0.1 + i * 0.04 }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{ background: "var(--accent)", minWidth: 4 }}
                      initial={{ width: 4 }}
                      animate={{ width: Math.max(v * 2.4, 8) }}
                      transition={{ ...springs.gentle, delay: 0.2 + i * 0.04 }}
                    />
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{k}</span>
                    <span
                      className="text-[11px] tabular-nums"
                      style={{ color: "var(--accent)", fontVariationSettings: fontWeights.semibold }}
                    >
                      {v}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.15 }}
        className="rounded-[var(--radius-card)] overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Table header */}
        <div
          className="grid gap-2 px-4 py-2.5 text-left"
          style={{
            gridTemplateColumns: "1fr 80px 100px 90px 140px",
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <SortBtn col="stateName" current={sortKey} dir={sortDir} onSort={handleSort} label="State" />
          <SortBtn col="gsdpSharePct" current={sortKey} dir={sortDir} onSort={handleSort} label="GSDP %" />
          <div className="text-[11px]" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>16th FC share</div>
          <SortBtn col="net" current={sortKey} dir={sortDir} onSort={handleSort} label="Net (₹ L Cr)" />
          <SortBtn col="ratio" current={sortKey} dir={sortDir} onSort={handleSort} label="₹ returned / ₹1" />
        </div>

        {/* Rows */}
        <div style={{ background: "var(--bg-base)" }}>
          <AnimatePresence mode="popLayout">
            {sorted.map((s, i) => {
              const net = s.totalTransfers - s.taxContribEstimate
              const isPos = net >= 0
              return (
                <motion.div
                  key={s.stateCode}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ ...springs.gentle, delay: i * 0.025 }}
                  className="grid gap-2 px-4 py-2.5 items-center"
                  style={{
                    gridTemplateColumns: "1fr 80px 100px 90px 140px",
                    borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none",
                    background: i % 2 === 0 ? "var(--bg-base)" : "var(--bg-elevated)",
                  }}
                >
                  {/* State name */}
                  <div className="min-w-0">
                    <p className="text-[12px]"
                      style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
                      {s.stateName}
                    </p>
                    {s.note && (
                      <p className="text-[10px] leading-[1.3] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {s.note}
                      </p>
                    )}
                  </div>

                  {/* GSDP % */}
                  <span className="text-[12px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                    {s.gsdpSharePct.toFixed(1)}%
                  </span>

                  {/* 16th FC share */}
                  <span className="text-[12px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                    {s.fcShare16th.toFixed(2)}%
                  </span>

                  {/* Net */}
                  <span
                    className="text-[12px] tabular-nums"
                    style={{
                      color: isPos ? "var(--status-kept)" : "var(--status-broken)",
                      fontVariationSettings: fontWeights.semibold,
                    }}
                  >
                    {isPos ? "+" : ""}₹{net.toFixed(2)}
                  </span>

                  {/* Ratio bar */}
                  <AnimatedRatioBar ratio={s.ratioReceivedPerRupee} max={maxRatio} delay={0.1 + i * 0.025} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px]">
        {[
          { color: "var(--status-broken)", label: "< ₹0.80 returned — net contributor" },
          { color: "var(--status-compromise)", label: "₹0.80–₹1.20 — near-neutral" },
          { color: "var(--status-kept)", label: "> ₹1.20 — net recipient" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
            <span style={{ color: "var(--text-tertiary)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <Separator style={{ background: "var(--border)" }} />

      {/* Methodology note */}
      <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        <Info size={11} strokeWidth={1.5} className="shrink-0 mt-0.5" />
        <span>
          <strong style={{ color: "var(--text-secondary)" }}>Methodology caveat:</strong>{" "}
          "Contribution" uses PAN-based direct tax + imputed indirect share. Mumbai-HQ'd firms credit
          income tax to Maharashtra even if operations are national — this overstates MH's contribution.
          Ratios are heuristic estimates; Neo Nīti will compute authoritative ratios with CBGA/NIPFP
          methodology before the choropleth map launches.
          Sources: indiabudget.gov.in Receipts Budget Annexure 4A/4B; PRS 16th FC Summary (Feb 2026); MoSPI.
        </span>
      </div>
    </div>
  )
}
