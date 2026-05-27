"use client"

/**
 * Neo Nīti Budget — NŃ-332 GST IGST Settlement Map
 * Producer (origin) vs Consumer (destination) state — diverging bars.
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { GST_IGST } from "@/lib/budget/data"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

type Sort = "origin" | "consumption" | "ratio"

export function GstIgstMap() {
  const [sort, setSort] = useState<Sort>("ratio")
  const sorted = [...GST_IGST.states].sort((a, b) => {
    if (sort === "origin") return b.origination - a.origination
    if (sort === "consumption") return b.consumption - a.consumption
    return b.netRatio - a.netRatio
  })
  const maxOrig = Math.max(...GST_IGST.states.map(s => s.origination))
  const maxCons = Math.max(...GST_IGST.states.map(s => s.consumption))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
        IGST is collected at origin (where goods are produced) but settled to the destination state (where they're consumed) — the OECD-recommended destination principle. The chart shows each state's share of origin (left) vs consumption (right). Net ratio &gt; 1 means the state is a net beneficiary; &lt; 1 means a net contributor.
      </p>

      {/* Sort toggles */}
      <div className="flex items-center gap-2">
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Sort by</span>
        <SegmentedControl
          value={sort}
          onValueChange={(v) => setSort(v as Sort)}
          options={[
            { value: "ratio",       label: "Net ratio" },
            { value: "origin",      label: "Origin" },
            { value: "consumption", label: "Consumption" },
          ]}
          size="sm"
        />
      </div>

      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-3">
          {/* Header */}
          <div className="grid grid-cols-[1fr_3fr_3fr_70px] gap-2 px-2 pb-2 mb-1"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[10px] uppercase tracking-[0.06em]"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>State</span>
            <span className="text-[10px] uppercase tracking-[0.06em] text-right"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>← Origin share</span>
            <span className="text-[10px] uppercase tracking-[0.06em]"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>Consumption share →</span>
            <span className="text-[10px] uppercase tracking-[0.06em] text-right"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>Ratio</span>
          </div>

          <AnimatePresence mode="popLayout">
            {sorted.map((s, i) => {
              const isProducer = s.netRatio < 1
              const isConsumer = s.netRatio > 1
              return (
                <motion.div key={s.code} layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ ...springs.gentle, delay: 0.01 * i }}
                  className="grid grid-cols-[1fr_3fr_3fr_70px] gap-2 items-center py-1.5 px-2 rounded">
                  <span className="text-[12px]"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
                    {s.name}
                  </span>
                  {/* Origin bar (right-aligned, growing left) */}
                  <div className="flex justify-end">
                    <div className="relative h-4 w-full max-w-[200px] rounded-sm overflow-hidden"
                      style={{ background: "var(--bg-elevated-3)" }}>
                      <motion.div className="absolute top-0 right-0 h-full rounded-sm"
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.origination / maxOrig) * 100}%` }}
                        transition={{ ...springs.gentle, delay: 0.02 * i }}
                        style={{ background: "var(--status-kept)", opacity: 0.85 }} />
                      <span className="absolute right-1 top-0 text-[10px] leading-4 tabular-nums"
                        style={{ color: "var(--text-on-accent)", fontVariationSettings: fontWeights.semibold }}>
                        {s.origination.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {/* Consumption bar (left-aligned, growing right) */}
                  <div className="flex justify-start">
                    <div className="relative h-4 w-full max-w-[200px] rounded-sm overflow-hidden"
                      style={{ background: "var(--bg-elevated-3)" }}>
                      <motion.div className="absolute top-0 left-0 h-full rounded-sm"
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.consumption / maxCons) * 100}%` }}
                        transition={{ ...springs.gentle, delay: 0.02 * i + 0.1 }}
                        style={{ background: "var(--blue)", opacity: 0.85 }} />
                      <span className="absolute left-1 top-0 text-[10px] leading-4 tabular-nums"
                        style={{ color: "var(--text-on-accent)", fontVariationSettings: fontWeights.semibold }}>
                        {s.consumption.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {/* Ratio chip */}
                  <span className="text-[11px] tabular-nums text-right inline-flex items-center justify-end gap-0.5 px-1.5 py-0.5 rounded justify-self-end"
                    style={{
                      background: isProducer
                        ? "color-mix(in srgb, #10b981 14%, transparent)"
                        : isConsumer
                          ? "color-mix(in srgb, var(--blue) 14%, transparent)"
                          : "var(--bg-elevated-3)",
                      color: isProducer ? "var(--status-kept)" : isConsumer ? "var(--blue)" : "var(--text-tertiary)",
                      fontVariationSettings: fontWeights.semibold,
                    }}>
                    {s.netRatio.toFixed(2)}×
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-md px-3 py-2.5"
          style={{ background: "color-mix(in srgb, #10b981 7%, transparent)",
                   border: "1px solid color-mix(in srgb, #10b981 18%, transparent)" }}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowDown size={12} style={{ color: "var(--status-kept)" }} />
            <p className="text-[12px]" style={{ color: "var(--status-kept)", fontVariationSettings: fontWeights.semibold }}>
              Producer states (ratio &lt; 1)
            </p>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Maharashtra, Gujarat, Tamil Nadu, Haryana — origin share exceeds destination receipts.
          </p>
        </div>
        <div className="rounded-md px-3 py-2.5"
          style={{ background: "color-mix(in srgb, var(--blue) 7%, transparent)",
                   border: "1px solid color-mix(in srgb, var(--blue) 18%, transparent)" }}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp size={12} style={{ color: "var(--blue)" }} />
            <p className="text-[12px]" style={{ color: "var(--blue)", fontVariationSettings: fontWeights.semibold }}>
              Consumer states (ratio &gt; 1)
            </p>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            UP, Bihar, MP, West Bengal — destination receipts exceed origination. This is the OECD-recommended outcome.
          </p>
        </div>
      </div>

      <DataProvenance
        source={GST_IGST.source}
        note={`Total IGST FY25: ₹${GST_IGST.totalIgstFy25} LC settled — ₹${GST_IGST.settledToStates} LC to states, ₹${GST_IGST.settledToCentre} LC to Centre. Destination principle is constitutionally enshrined under Article 269A.`}
      />
    </div>
  )
}
