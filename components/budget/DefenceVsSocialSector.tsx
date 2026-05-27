"use client"

/**
 * Neo Nīti Budget — NŃ-329 Defence vs Social Sector.
 * Cleaned: palette tokens, SegmentedControl, DataProvenance, plus the analytical
 * fix called out in the critique — caveat about Union-only vs combined Union+State spend.
 */

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { SECTOR_GDP } from "@/lib/budget/data"
import { tokenColor } from "@/lib/budget/palette"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

const SERIES = [
  { key: "defence",    label: "Defence",     cat: "defence"   },
  { key: "health",     label: "Health",      cat: "health"    },
  { key: "education",  label: "Education",   cat: "education" },
  { key: "ruralDev",   label: "Rural Dev",   cat: "ruralDev"  },
  { key: "agri",       label: "Agriculture", cat: "agri"      },
] as const

type Mode = "stacked" | "lines"

export function DefenceVsSocialSector() {
  const [mode, setMode] = useState<Mode>("lines")
  const years = SECTOR_GDP.years
  const W = 720
  const H = 220
  const PAD = { l: 32, r: 12, t: 8, b: 22 }

  const series = SERIES.map(s => ({ ...s, color: tokenColor(s.cat) }))

  const maxStacked = Math.max(...years.map((_, i) =>
    series.reduce((s, ser) => s + SECTOR_GDP[ser.key][i], 0)
  ))
  const maxLine = Math.max(...series.flatMap(s => SECTOR_GDP[s.key]))
  const yMax = mode === "stacked" ? Math.ceil(maxStacked * 10) / 10 : Math.ceil(maxLine * 10) / 10

  const xFor = (i: number) => PAD.l + (i / (years.length - 1)) * (W - PAD.l - PAD.r)
  const yFor = (v: number) => H - PAD.b - (v / yMax) * (H - PAD.t - PAD.b)

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
          Defence has stayed near 1.8–2.0% of GDP. Health and Education rose post-COVID. Agriculture peaked in FY20 (PM-KISAN launch).
        </p>
        <SegmentedControl
          value={mode}
          onValueChange={(v) => setMode(v as Mode)}
          options={[
            { value: "lines",   label: "Lines" },
            { value: "stacked", label: "Stacked" },
          ]}
        />
      </div>

      {/* Chart */}
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {[0.25, 0.5, 0.75, 1.0].map(f => (
              <line key={f} x1={PAD.l} x2={W - PAD.r} y1={yFor(yMax * f)} y2={yFor(yMax * f)}
                stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
            ))}
            {[0, 0.5, 1.0].map(f => (
              <text key={f} x={PAD.l - 4} y={yFor(yMax * f) + 3} textAnchor="end"
                fontSize="9" fill="var(--text-tertiary)" className="tabular-nums">
                {(yMax * f).toFixed(1)}%
              </text>
            ))}
            {years.map((y, i) => i % 2 === 0 && (
              <text key={y} x={xFor(i)} y={H - 5} textAnchor="middle"
                fontSize="9" fill="var(--text-tertiary)" className="tabular-nums">{y}</text>
            ))}

            {mode === "lines" ? (
              series.map((ser, sIdx) => {
                const pts = years.map((_, i) => `${xFor(i)},${yFor(SECTOR_GDP[ser.key][i])}`).join(" ")
                return (
                  <motion.polyline key={ser.key}
                    points={pts} fill="none" stroke={ser.color} strokeWidth={1.8}
                    strokeLinejoin="round" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ ...springs.gentle, delay: sIdx * 0.06 }} />
                )
              })
            ) : (
              years.map((_, i) => {
                let acc = 0
                return series.map((ser, sIdx) => {
                  const v = SECTOR_GDP[ser.key][i]
                  const y0 = yFor(acc)
                  const y1 = yFor(acc + v)
                  acc += v
                  const barW = (W - PAD.l - PAD.r) / years.length - 1
                  return (
                    <rect key={`${i}-${ser.key}`}
                      x={xFor(i) - barW / 2} y={y1}
                      width={barW} height={y0 - y1} fill={ser.color} />
                  )
                })
              })
            )}
          </svg>

          <Separator className="my-3" style={{ background: "var(--border)" }} />

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {series.map(s => {
              const latest = SECTOR_GDP[s.key][years.length - 1]
              const first = SECTOR_GDP[s.key][0]
              const delta = latest - first
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
                  <span className="text-[10px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                    FY27 {latest.toFixed(2)}% · Δ {delta >= 0 ? "+" : ""}{delta.toFixed(2)}pp
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <DataProvenance
        source={SECTOR_GDP.source}
        note="% of nominal GDP. Health & Education are predominantly State subjects — these series are Union allocations only and understate combined Union+State spend (real Health spend ≈ 2.1% of GDP, Education ≈ 4.6%)."
      />
    </div>
  )
}
