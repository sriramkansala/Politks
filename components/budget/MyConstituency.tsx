"use client"

/**
 * Neo Nīti Budget — NŃ-333 My Constituency
 * PIN-code → MPLADS + district CSS releases + neighbour compare.
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Search, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { MPLADS_SAMPLE } from "@/lib/budget/data"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

export function MyConstituency() {
  const [pin, setPin] = useState("")
  const [activeIdx, setActiveIdx] = useState<number | null>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const idx = MPLADS_SAMPLE.findIndex(c => c.pin === pin.trim())
    if (idx >= 0) setActiveIdx(idx)
  }

  const active = activeIdx !== null ? MPLADS_SAMPLE[activeIdx] : null

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
        Enter a PIN code to see your MP's MPLADS utilisation, recent works, and how the constituency compares to its neighbours. All MPs get ₹17 crore over a 5-year Lok Sabha term under MPLADS.
      </p>

      {/* PIN input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="Try: 110001 · 560001 · 400001 · 600001 · 700001 · 226001"
            leadingIcon={Search}
            aria-label="PIN code"
          />
        </div>
        <Button type="submit" variant="secondary" size="md">Find</Button>
      </form>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-1.5">
        {MPLADS_SAMPLE.map((c, i) => (
          <button key={c.pin}
            onClick={() => { setActiveIdx(i); setPin(c.pin) }}
            className="text-[11px] px-2.5 py-1 rounded-lg transition-colors"
            style={{
              background: i === activeIdx
                ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                : "var(--bg-elevated)",
              border: i === activeIdx
                ? "1px solid color-mix(in srgb, var(--accent) 40%, transparent)"
                : "1px solid var(--border)",
              color: i === activeIdx ? "var(--accent)" : "var(--text-secondary)",
              fontVariationSettings: i === activeIdx ? fontWeights.semibold : fontWeights.medium,
            }}>
            {c.constituency}
          </button>
        ))}
      </div>

      {/* Result card */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active.pin}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={springs.gentle}>
            <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                    }}>
                    <MapPin size={16} style={{ color: "var(--accent)" }} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[16px] leading-none"
                        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                        {active.constituency}
                      </h3>
                      <Badge color="indigo" size="sm">PIN {active.pin}</Badge>
                    </div>
                    <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {active.state} · {active.sittingMP}
                    </p>
                  </div>
                </div>

                <Separator className="mb-4" style={{ background: "var(--border)" }} />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.06em] mb-0.5"
                      style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                      MPLADS · 5yr
                    </p>
                    <p className="text-[22px] tabular-nums leading-none"
                      style={{ color: "var(--accent)", fontVariationSettings: fontWeights.bold }}>
                      ₹{active.mplads5yr.toFixed(1)} Cr
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.06em] mb-0.5"
                      style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                      Utilised
                    </p>
                    <p className="text-[22px] tabular-nums leading-none"
                      style={{ color: active.utilisedPct >= 85 ? "var(--status-kept)" : "var(--status-compromise)",
                               fontVariationSettings: fontWeights.bold }}>
                      {active.utilisedPct}%
                    </p>
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden"
                      style={{ background: "var(--bg-elevated-3)" }}>
                      <motion.div className="h-full"
                        initial={{ width: 0 }} animate={{ width: `${active.utilisedPct}%` }}
                        transition={springs.gentle}
                        style={{ background: active.utilisedPct >= 85 ? "var(--status-kept)" : "var(--status-compromise)" }} />
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] uppercase tracking-[0.06em] mb-0.5"
                      style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                      Top works
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{active.topWork}</p>
                  </div>
                </div>

                <Separator className="mb-3" style={{ background: "var(--border)" }} />

                {/* Neighbours */}
                <p className="text-[11px] mb-1.5"
                  style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                  Neighbouring constituencies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {active.neighbours.map(n => (
                    <span key={n} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[var(--radius-tag)]"
                      style={{ background: "var(--bg-elevated-3)", color: "var(--text-secondary)" }}>
                      <Users size={9} strokeWidth={2} /> {n}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <DataProvenance
        source="Lok Sabha Secretariat 17th and 18th LS reports"
        note="Each MP receives ₹17 Cr over a 5-year term. Utilisation % includes sanctioned + completed works. Sample dataset shown — full PIN-to-constituency coverage requires ECI delimitation files + PFMS scrape."
      />
    </div>
  )
}
