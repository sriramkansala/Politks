"use client"

/**
 * Neo Nīti Budget — NŃ-324 Manifesto-to-Budget Engine
 * Cross-references 2024 manifesto promises with FY27 BE allocations.
 * Each row has an explicit editorial status: kept / partial / on-track / not-funded.
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, CircleDashed, Clock, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { MANIFESTO_BUDGET } from "@/lib/budget/data"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

type Filter = "all" | "BJP" | "INC"

const STATUS_META = {
  kept:        { color: "var(--status-kept)",       label: "Kept",        Icon: CheckCircle2 },
  "on-track":  { color: "var(--blue)",              label: "On track",    Icon: Clock },
  partial:     { color: "var(--status-compromise)", label: "Partial",     Icon: CircleDashed },
  "not-funded":{ color: "var(--status-broken)",     label: "Not funded",  Icon: XCircle },
} as const

export function ManifestoToBudget() {
  const [filter, setFilter] = useState<Filter>("all")
  const rows = filter === "all" ? MANIFESTO_BUDGET : MANIFESTO_BUDGET.filter(r => r.party === filter)

  const counts = MANIFESTO_BUDGET.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex flex-col gap-4">
      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {(Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((s, i) => {
          const meta = STATUS_META[s]
          return (
            <motion.div key={s}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.05 * i }}>
              <Card style={{ background: "var(--bg-elevated)", border: `1px solid color-mix(in srgb, ${meta.color} 25%, var(--border))` }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <meta.Icon size={13} style={{ color: meta.color }} strokeWidth={2} />
                    <span className="text-[11px]"
                      style={{ color: meta.color, fontVariationSettings: fontWeights.semibold }}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-[18px] tabular-nums leading-none"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.bold }}>
                    {counts[s] || 0}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Party filter */}
      <div className="flex items-center gap-2">
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Filter</span>
        <SegmentedControl
          value={filter}
          onValueChange={(v) => setFilter(v as Filter)}
          options={[
            { value: "all", label: "All parties" },
            { value: "BJP", label: "BJP" },
            { value: "INC", label: "INC" },
          ]}
          size="sm"
        />
      </div>

      {/* Table */}
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-0">
          <AnimatePresence mode="popLayout">
            {rows.map((r, i) => {
              const meta = STATUS_META[r.status as keyof typeof STATUS_META]
              return (
                <motion.div key={r.id} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ ...springs.gentle, delay: 0.03 * i }}
                  className="px-4 py-3"
                  style={i < rows.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center pt-0.5 shrink-0">
                      <meta.Icon size={16} style={{ color: meta.color }} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <Badge color={r.party === "BJP" ? "amber" : "blue"} size="sm">{r.party}</Badge>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: "var(--bg-elevated-3)", color: "var(--text-tertiary)" }}>
                          {r.id}
                        </span>
                        <span className="text-[12px]"
                          style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                          {r.promise}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.05em]"
                            style={{ color: "var(--text-tertiary)" }}>Category</p>
                          <p className="text-[11.5px]" style={{ color: "var(--text-secondary)" }}>
                            {r.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.05em]"
                            style={{ color: "var(--text-tertiary)" }}>Budget head</p>
                          <p className="text-[11.5px]" style={{ color: "var(--text-secondary)" }}>
                            {r.budgetHead}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.05em]"
                            style={{ color: "var(--text-tertiary)" }}>FY27 allocation</p>
                          <p className="text-[11.5px] tabular-nums"
                            style={{ color: meta.color, fontVariationSettings: fontWeights.semibold }}>
                            {r.allocatedINR > 0 ? `₹${r.allocatedINR.toFixed(2)} LC` : "—"}
                            {typeof r.promisedINR === "number" && r.promisedINR > 0 && (
                              <span className="ml-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                                / promised ₹{r.promisedINR.toFixed(2)} LC
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] mt-2 italic" style={{ color: "var(--text-tertiary)" }}>
                        {r.note}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </CardContent>
      </Card>

      <DataProvenance
        source="2024 BJP & INC Lok Sabha manifestos · indiabudget.gov.in scheme allocations · PRS budget analyses"
        note="AI-assisted match, every status flag editor-reviewed. DMK / TMC / CPI(M) / AAP rows forthcoming."
      />
    </div>
  )
}
