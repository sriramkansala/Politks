"use client"

/**
 * Neo Nīti Budget — NŃ-331 Off-Budget Borrowings
 * Headline fiscal deficit + OBB stacked bars. UPA + NDA shown neutrally.
 */

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip } from "@/components/ui/tooltip"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { OBB_SERIES } from "@/lib/budget/data"

export function OffBudgetBorrowings() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const maxTotal = Math.max(...OBB_SERIES.map(d => d.headlineFd + d.obb)) * 1.05

  const W = 720
  const H = 220
  const PAD = { l: 32, r: 12, t: 12, b: 22 }
  const xFor = (i: number) => PAD.l + (i + 0.5) * ((W - PAD.l - PAD.r) / OBB_SERIES.length)
  const barW = (W - PAD.l - PAD.r) / OBB_SERIES.length * 0.7
  const yFor = (v: number) => H - PAD.b - (v / maxTotal) * (H - PAD.t - PAD.b)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
        Off-Budget Borrowings (OBB) — debt raised by FCI, IRFC, NHAI etc. on the Centre's behalf that doesn't appear in the headline fiscal deficit. CAG flagged the FY20 peak; UPA-era oil bonds had the same effect. The chart shows reported deficit (orange) plus OBB residual (red).
      </p>

      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
              <g key={f}>
                <line x1={PAD.l} x2={W - PAD.r} y1={yFor(maxTotal * f)} y2={yFor(maxTotal * f)}
                  stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
                <text x={PAD.l - 4} y={yFor(maxTotal * f) + 3} textAnchor="end"
                  fontSize="9" fill="var(--text-tertiary)" className="tabular-nums">
                  {(maxTotal * f).toFixed(0)}
                </text>
              </g>
            ))}

            {OBB_SERIES.map((d, i) => {
              const yHead = yFor(d.headlineFd)
              const yObb = yFor(d.headlineFd + d.obb)
              const isUpa = ["FY15","FY16"].includes(d.fy)
              return (
                <g key={d.fy}
                  onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}
                  style={{ cursor: "pointer" }}>
                  {/* Headline FD */}
                  <motion.rect
                    x={xFor(i) - barW / 2} width={barW} y={yHead}
                    height={H - PAD.b - yHead} fill="var(--accent)"
                    opacity={hoverIdx === null || hoverIdx === i ? 0.9 : 0.35}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: hoverIdx === null || hoverIdx === i ? 0.9 : 0.35 }}
                    style={{ transformOrigin: `0 ${H - PAD.b}px` }}
                    transition={{ ...springs.gentle, delay: 0.04 * i }} />
                  {/* OBB on top */}
                  <motion.rect
                    x={xFor(i) - barW / 2} width={barW} y={yObb}
                    height={yHead - yObb} fill="var(--status-broken)"
                    opacity={hoverIdx === null || hoverIdx === i ? 0.95 : 0.4}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: hoverIdx === null || hoverIdx === i ? 0.95 : 0.4 }}
                    style={{ transformOrigin: `0 ${yHead}px` }}
                    transition={{ ...springs.gentle, delay: 0.04 * i + 0.3 }} />
                  {/* Era underline */}
                  <line x1={xFor(i) - barW / 2} x2={xFor(i) + barW / 2}
                    y1={H - PAD.b + 1} y2={H - PAD.b + 1}
                    stroke={isUpa ? "var(--status-stalled)" : "var(--accent)"} strokeWidth={2} />
                  <text x={xFor(i)} y={H - 6} textAnchor="middle"
                    fontSize="9" fill="var(--text-tertiary)" className="tabular-nums">
                    {d.fy}
                  </text>
                </g>
              )
            })}
          </svg>

          <Separator className="my-3" style={{ background: "var(--border)" }} />

          {/* Tooltip card */}
          {hoverIdx !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={springs.snap}
              className="rounded-md px-3 py-2 text-[12px]"
              style={{ background: "var(--bg-elevated-3)", border: "1px solid var(--border)" }}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                  {OBB_SERIES[hoverIdx].fy}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Headline ₹{OBB_SERIES[hoverIdx].headlineFd.toFixed(2)} LC · OBB ₹{OBB_SERIES[hoverIdx].obb.toFixed(2)} LC
                </span>
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {OBB_SERIES[hoverIdx].sources}{OBB_SERIES[hoverIdx].note ? ` · ${OBB_SERIES[hoverIdx].note}` : ""}
              </p>
            </motion.div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--accent)" }} />
              <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Headline fiscal deficit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--status-broken)" }} />
              <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Off-Budget Borrowings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 rounded-md px-3 py-2.5"
        style={{ background: "color-mix(in srgb, var(--status-broken) 7%, transparent)",
                 border: "1px solid color-mix(in srgb, var(--status-broken) 20%, transparent)" }}>
        <AlertTriangle size={13} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: "var(--status-broken)" }} />
        <p className="text-[11.5px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--status-broken)" }}>FY20 peak:</strong> CAG flagged ₹2.27 LC OBB — true fiscal deficit was ~2.5 percentage points higher than reported. The FY21 budget began the glide path that brought FCI-NSSF on-budget. Both UPA-era oil bonds and NDA-era FCI loans use the same mechanism.
        </p>
      </div>

      <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        <Info size={11} strokeWidth={1.5} className="shrink-0 mt-0.5" />
        <span>Sources: CAG Audit Reports FY15–FY24 · 15th FC Vol II · indiabudget.gov.in. Values in ₹ lakh crore. OBB FY27 is an estimate based on residual NHAI / PSU recap commitments.</span>
      </div>
    </div>
  )
}
