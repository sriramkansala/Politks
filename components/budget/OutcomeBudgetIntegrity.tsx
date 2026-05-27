"use client"

/**
 * Neo Nīti Budget — NŃ-334 Outcome Budget Integrity Score
 * Scores schemes on 4 OOMF dimensions: indicator quality, target reporting, achievement, disaggregation.
 * Rubric inspired by CBGA / Accountability Initiative methodology.
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { OOMF_SCORES } from "@/lib/budget/data"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

type Sort = "total" | "name" | "ministry"

const GRADE_COLOR: Record<string, string> = {
  A: "var(--status-kept)",
  B: "var(--blue)",
  C: "var(--status-compromise)",
  D: "var(--status-broken)",
}

const DIMS = [
  { key: "indicatorQ",      label: "Indicator quality" },
  { key: "targetReporting", label: "Target reporting" },
  { key: "achievement",     label: "Achievement" },
  { key: "disaggregation",  label: "Disaggregation" },
] as const

export function OutcomeBudgetIntegrity() {
  const [sort, setSort] = useState<Sort>("total")
  const [expanded, setExpanded] = useState<string | null>(null)

  const rows = [...OOMF_SCORES].sort((a, b) => {
    if (sort === "total") return b.total - a.total
    if (sort === "name") return a.scheme.localeCompare(b.scheme)
    return a.ministry.localeCompare(b.ministry)
  })

  const avgTotal = OOMF_SCORES.reduce((s, r) => s + r.total, 0) / OOMF_SCORES.length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
        Each scheme's <strong style={{ color: "var(--text-primary)" }}>Output-Outcome Monitoring Framework</strong> entry scored 0–100 on four dimensions. The rubric is open and peer-reviewable; CBGA / Accountability Initiative methodology endorsement forthcoming.
      </p>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {(["A", "B", "C", "D"] as const).map((grade, i) => {
          const count = OOMF_SCORES.filter(s => s.grade === grade).length
          return (
            <motion.div key={grade}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.05 * i }}>
              <Card style={{ background: "var(--bg-elevated)", border: `1px solid color-mix(in srgb, ${GRADE_COLOR[grade]} 30%, var(--border))` }}>
                <CardContent className="p-3">
                  <p className="text-[10px] uppercase tracking-[0.06em] mb-1"
                    style={{ color: GRADE_COLOR[grade], fontVariationSettings: fontWeights.semibold }}>
                    Grade {grade}
                  </p>
                  <p className="text-[20px] tabular-nums leading-none"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.bold }}>
                    {count} <span className="text-[12px]"
                      style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>schemes</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 justify-between">
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Average score: <span className="tabular-nums" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>{avgTotal.toFixed(0)}/100</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Sort</span>
          <SegmentedControl
            value={sort}
            onValueChange={(v) => setSort(v as Sort)}
            options={[
              { value: "total",    label: "Score" },
              { value: "name",     label: "A→Z" },
              { value: "ministry", label: "Ministry" },
            ]}
            size="sm"
          />
        </div>
      </div>

      {/* Rows */}
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-0">
          <AnimatePresence mode="popLayout">
            {rows.map((r, i) => {
              const isOpen = expanded === r.scheme
              const c = GRADE_COLOR[r.grade]
              return (
                <motion.div key={r.scheme} layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ ...springs.gentle, delay: 0.02 * i }}
                  style={i < rows.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}>
                  <button onClick={() => setExpanded(isOpen ? null : r.scheme)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-elevated-2)]">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 tabular-nums"
                      style={{
                        background: `color-mix(in srgb, ${c} 14%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${c} 35%, transparent)`,
                        color: c,
                        fontVariationSettings: fontWeights.bold,
                      }}>
                      <span className="text-[14px]">{r.total}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] truncate"
                        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                        {r.scheme}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {r.ministry}
                      </p>
                    </div>
                    <Badge color={r.grade === "A" ? "green" : r.grade === "B" ? "blue" : r.grade === "C" ? "amber" : "red"} size="sm">
                      Grade {r.grade}
                    </Badge>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={springs.snap}>
                      <ChevronDown size={14} style={{ color: "var(--text-tertiary)" }} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springs.gentle}
                        className="overflow-hidden">
                        <div className="px-4 pb-3.5 pt-1">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {DIMS.map(d => {
                              const v = r[d.key]
                              return (
                                <div key={d.key} className="rounded-md px-2.5 py-2"
                                  style={{ background: "var(--bg-elevated-2)" }}>
                                  <p className="text-[10px] uppercase tracking-[0.05em]"
                                    style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                                    {d.label}
                                  </p>
                                  <div className="flex items-baseline gap-1.5 mt-1">
                                    <span className="text-[14px] tabular-nums"
                                      style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.bold }}>
                                      {v === null ? "—" : v}
                                    </span>
                                    {v !== null && (
                                      <span className="text-[10px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>/100</span>
                                    )}
                                  </div>
                                  {v !== null && (
                                    <div className="mt-1 h-1 rounded-full overflow-hidden"
                                      style={{ background: "var(--bg-elevated-3)" }}>
                                      <motion.div className="h-full"
                                        initial={{ width: 0 }} animate={{ width: `${v}%` }}
                                        transition={springs.gentle}
                                        style={{ background: c }} />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          {r.note && (
                            <p className="text-[11px] italic mt-2" style={{ color: "var(--text-tertiary)" }}>
                              {r.note}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </CardContent>
      </Card>

      <DataProvenance
        source="Output-Outcome Framework for Central Sector Schemes (NITI Aayog) · CAG Performance Audits · CBGA peer-review notes"
        note="Rubric: indicator quality, target reporting, achievement, disaggregation by state/gender/caste"
      />
    </div>
  )
}
