"use client"

/**
 * Neo Nīti Budget — NŃ-328 CSS Release Tracker
 * Per-state per-scheme release performance with election overlay.
 * Correlation ≠ causation guardrail built in.
 */

import { useState, Fragment } from "react"
import { motion, LayoutGroup, AnimatePresence } from "framer-motion"
import { Info, AlertTriangle, Vote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { CSS_RELEASES } from "@/lib/budget/data"

type FyKey = "fy24" | "fy25"

const STATES = Array.from(new Set(CSS_RELEASES.map(r => r.state)))
const SCHEMES = Array.from(new Set(CSS_RELEASES.map(r => r.scheme)))

function pctColor(pct: number): string {
  if (pct >= 90) return "var(--status-kept)"
  if (pct >= 75) return "var(--status-compromise)"
  return "var(--status-broken)"
}

export function CssReleaseTracker() {
  const [fy, setFy] = useState<FyKey>("fy25")
  const pctKey = fy === "fy24" ? "fy24Pct" : "fy25Pct"
  const lateKey = fy === "fy24" ? "fy24Late" : "fy25Late"

  const stateAvg = STATES.map(s => {
    const rows = CSS_RELEASES.filter(r => r.state === s)
    const avg = rows.reduce((sum, r) => sum + r[pctKey], 0) / rows.length
    const note = rows[0].note
    return { state: s, avg, note }
  }).sort((a, b) => a.avg - b.avg)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
        Monthly CSS releases per state per scheme. Election-year states sometimes see release delays; opposition-ruled states regularly allege withholding. The data shows the pattern; <strong style={{ color: "var(--text-primary)" }}>correlation is not causation</strong>.
      </p>

      {/* FY toggle */}
      <div className="flex justify-end">
        <LayoutGroup id="css-fy">
          <div className="flex items-center rounded-lg p-0.5 gap-0.5"
            style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}>
            {(["fy24", "fy25"] as FyKey[]).map(f => (
              <button key={f} onClick={() => setFy(f)}
                className="relative px-3 py-1.5 rounded-md text-[12px] outline-none"
                style={{
                  color: fy === f ? "var(--text-primary)" : "var(--text-tertiary)",
                  fontVariationSettings: fy === f ? fontWeights.semibold : fontWeights.medium,
                }}>
                {fy === f && (
                  <motion.div layoutId="css-pill" className="absolute inset-0 rounded-md"
                    style={{ background: "var(--bg-elevated-3)" }} transition={springs.responsive} />
                )}
                <span className="relative z-10 uppercase tabular-nums">{f}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* Heatmap */}
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <div className="grid gap-0.5 text-[11px]"
              style={{ gridTemplateColumns: `140px repeat(${SCHEMES.length}, 1fr)`, minWidth: "560px" }}>
              {/* Header */}
              <div></div>
              {SCHEMES.map(s => (
                <div key={s} className="px-2 py-1 text-center"
                  style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                  {s}
                </div>
              ))}

              {/* Rows */}
              {STATES.map((state, sIdx) => (
                <Fragment key={state}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springs.gentle, delay: 0.04 * sIdx }}
                    className="px-2 py-2 flex items-center"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
                    {state}
                  </motion.div>
                  {SCHEMES.map((scheme, scIdx) => {
                    const row = CSS_RELEASES.find(r => r.state === state && r.scheme === scheme)
                    if (!row) return <div key={`${state}-${scheme}`} />
                    const pct = row[pctKey]
                    const c = pctColor(pct)
                    return (
                      <motion.div key={`${state}-${scheme}`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springs.gentle, delay: 0.04 * sIdx + 0.03 * scIdx }}
                        className="rounded flex flex-col items-center justify-center py-2 px-1 cursor-help"
                        style={{
                          background: `color-mix(in srgb, ${c} ${20 + (pct / 100) * 40}%, var(--bg-elevated-3))`,
                          border: `1px solid color-mix(in srgb, ${c} 30%, transparent)`,
                        }}
                        title={`${state} · ${scheme}: ${pct}% released, ${row[lateKey].toFixed(1)} mo avg delay`}>
                        <span className="text-[12px] tabular-nums"
                          style={{ color: c, fontVariationSettings: fontWeights.bold }}>
                          {pct}%
                        </span>
                        <span className="text-[9px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                          {row[lateKey].toFixed(1)} mo late
                        </span>
                      </motion.div>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <Separator className="my-3" style={{ background: "var(--border)" }} />

          {/* State summary list with election flags */}
          <div className="flex flex-col gap-1.5">
            {stateAvg.map(s => {
              const row = CSS_RELEASES.find(r => r.state === s.state)!
              const c = pctColor(s.avg)
              return (
                <motion.div key={s.state}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.5 }}
                  className="flex items-center gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />
                  <span className="w-28 shrink-0"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
                    {s.state}
                  </span>
                  <span className="tabular-nums w-12"
                    style={{ color: c, fontVariationSettings: fontWeights.semibold }}>
                    {s.avg.toFixed(0)}%
                  </span>
                  <Vote size={11} style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />
                  <span style={{ color: "var(--text-tertiary)" }}>
                    Election {row.electionMonth}/{row.electionYear}
                  </span>
                  {s.note && (
                    <span className="text-[10.5px] italic ml-2" style={{ color: "var(--text-tertiary)" }}>
                      · {s.note}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Guardrail */}
      <div className="flex items-start gap-2 rounded-md px-3 py-2.5"
        style={{ background: "color-mix(in srgb, var(--accent) 7%, transparent)",
                 border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
        <AlertTriangle size={13} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <p className="text-[11.5px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--accent)" }}>Correlation ≠ causation.</strong> Release timing differences can be driven by state utilisation-certificate compliance, SNA SPARSH adoption, demand-side absorption capacity, or Centre-state political relations. The data shows the variance; assigning cause requires triangulation with PFMS releases, UC submissions, and audit reports.
        </p>
      </div>

      <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        <Info size={11} strokeWidth={1.5} className="shrink-0 mt-0.5" />
        <span>Sources: PFMS · SNA SPARSH (CGA Order 190, Feb 2026) · State Election Commission calendars. Releases per scheme per state, weighted by sanctioned allocation. Toggle FY24/FY25 to compare years.</span>
      </div>
    </div>
  )
}
