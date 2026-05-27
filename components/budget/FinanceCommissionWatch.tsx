"use client"

/**
 * Neo Nīti Budget — NŃ-327 16th Finance Commission Watch
 * 14th vs 15th vs 16th FC formula comparison + state deltas + disaster grants.
 */

import { useState } from "react"
import { motion, LayoutGroup } from "framer-motion"
import { Info, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { FC_HISTORY, DISASTER_GRANTS_16TH, STATE_NET_POSITIONS } from "@/lib/budget/data"

type FcKey = keyof typeof FC_HISTORY

export function FinanceCommissionWatch() {
  const [activeFc, setActiveFc] = useState<FcKey>("16th FC")
  const fc = FC_HISTORY[activeFc]
  const formulaEntries = Object.entries(fc.formula).filter(([, v]) => v > 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Vertical-devolution banner */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(FC_HISTORY) as FcKey[]).map((key, i) => {
          const f = FC_HISTORY[key]
          const isActive = key === activeFc
          return (
            <motion.button
              key={key}
              onClick={() => setActiveFc(key)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.05 + i * 0.05 }}
              className="text-left"
            >
              <Card style={{
                background: isActive ? "color-mix(in srgb, var(--accent) 10%, var(--bg-elevated))" : "var(--bg-elevated)",
                border: `1px solid ${isActive ? "color-mix(in srgb, var(--accent) 40%, var(--border))" : "var(--border)"}`,
              }}>
                <CardContent className="p-3.5">
                  <p className="text-[11px] uppercase tracking-[0.06em] mb-1"
                    style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                    {key}
                  </p>
                  <p className="text-[22px] leading-none tabular-nums"
                    style={{ color: isActive ? "var(--accent)" : "var(--text-primary)",
                             fontVariationSettings: fontWeights.bold, letterSpacing: "-0.025em" }}>
                    {f.vertical}%
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                    Vertical devolution · {f.period}
                  </p>
                </CardContent>
              </Card>
            </motion.button>
          )
        })}
      </div>

      {/* Formula breakdown */}
      <div>
        <p className="text-[12px] mb-2"
          style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.semibold }}>
          {activeFc} horizontal formula
        </p>
        <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <CardContent className="p-4">
            <LayoutGroup id="fc-formula">
              <div className="flex flex-col gap-2.5">
                {formulaEntries.map(([k, v]) => (
                  <motion.div key={k} layout className="flex items-center gap-3">
                    <span className="text-[12px] w-[140px] shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {k}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--bg-elevated-3)" }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${(v / 50) * 100}%` }}
                        transition={springs.gentle}
                        style={{ background: "var(--accent)" }} />
                    </div>
                    <span className="text-[12px] tabular-nums w-[42px] text-right"
                      style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                      {v}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </LayoutGroup>
          </CardContent>
        </Card>
      </div>

      {/* Per-state delta (15th vs 16th FC) */}
      <div>
        <p className="text-[12px] mb-2"
          style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.semibold }}>
          Per-state share — 15th FC → 16th FC delta
        </p>
        <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
              {STATE_NET_POSITIONS.map((s, i) => {
                const d = s.fcShare16th - s.fcShare15th
                const up = d > 0
                return (
                  <motion.div key={s.stateCode}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springs.gentle, delay: 0.02 * i }}
                    className="flex items-center justify-between gap-2 py-1 px-1.5 rounded">
                    <span className="text-[12px]" style={{ color: "var(--text-primary)" }}>{s.stateName}</span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {s.fcShare15th.toFixed(2)}% → {s.fcShare16th.toFixed(2)}%
                      </span>
                      <span className="text-[11px] inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                        style={{
                          background: up
                            ? "color-mix(in srgb, var(--status-kept) 12%, transparent)"
                            : "color-mix(in srgb, var(--status-broken) 12%, transparent)",
                          color: up ? "var(--status-kept)" : "var(--status-broken)",
                          fontVariationSettings: fontWeights.semibold,
                        }}>
                        {up ? <TrendingUp size={9} strokeWidth={2.5} /> : <TrendingDown size={9} strokeWidth={2.5} />}
                        {d > 0 ? "+" : ""}{d.toFixed(2)}pp
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disaster grants */}
      <div>
        <p className="text-[12px] mb-2"
          style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.semibold }}>
          16th FC — Disaster Risk Grants
        </p>
        <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.06em]"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>Total corpus</p>
              <p className="text-[18px] tabular-nums"
                style={{ color: "var(--accent)", fontVariationSettings: fontWeights.bold }}>
                ₹{DISASTER_GRANTS_16TH.totalCorpus} LC
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>FY27 – FY31</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.06em]"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>NDRF share</p>
              <p className="text-[18px] tabular-nums"
                style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.bold }}>
                {DISASTER_GRANTS_16TH.ndrfShare}%
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>National pool</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.06em]"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>SDRF share</p>
              <p className="text-[18px] tabular-nums"
                style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.bold }}>
                {DISASTER_GRANTS_16TH.sdrfShare}%
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>State pool</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.06em]"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>Risk weighting</p>
              <p className="text-[14px] mt-0.5"
                style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                {DISASTER_GRANTS_16TH.recurrenceWeight}/{DISASTER_GRANTS_16TH.riskWeight}
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Recurrence / Risk index</p>
            </div>
          </CardContent>
        </Card>
        <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>
          Centre : State split — {DISASTER_GRANTS_16TH.centreStateSplit}
        </p>
      </div>

      <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        <Info size={11} strokeWidth={1.5} className="shrink-0 mt-0.5" />
        <span>{DISASTER_GRANTS_16TH.source}. Click any FC card to view its formula. The 16th FC's GDP Contribution parameter (10%) is new — rewards states with higher GSDP share.</span>
      </div>
    </div>
  )
}
