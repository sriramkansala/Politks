"use client"

/**
 * Neo Nīti Budget — NŃ-335 Where Does My Tax Go?
 * Personal Sankey: enter income → see your tax → split across budget heads.
 * All computation client-side; nothing leaves the browser.
 */

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, animate } from "framer-motion"
import { Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { TAX_SLABS_NEW_REGIME, RUPEE_GOES_TO } from "@/lib/budget/data"
import { formatINR } from "@/lib/format"
import { DataProvenance } from "@/components/budget/_shared/DataProvenance"

function computeIncomeTax(annualIncome: number): { slabBreakdown: Array<{ slab: string; tax: number }>; total: number } {
  // Apply standard deduction of ₹75,000 (new regime FY26)
  const taxable = Math.max(0, annualIncome - 75_000)
  // Rebate u/s 87A if taxable income ≤ ₹7L (FY26 — rebate up to ₹25,000)
  let total = 0
  let prev = 0
  const breakdown: Array<{ slab: string; tax: number }> = []
  for (const slab of TAX_SLABS_NEW_REGIME) {
    const upper = Math.min(taxable, slab.upTo)
    if (upper > prev) {
      const inSlab = upper - prev
      const tax = inSlab * slab.rate
      total += tax
      if (slab.rate > 0) {
        const cap = slab.upTo === Infinity ? "∞" : `₹${(slab.upTo / 100_000).toFixed(0)}L`
        breakdown.push({ slab: `Up to ${cap} @ ${(slab.rate * 100).toFixed(0)}%`, tax })
      }
      prev = upper
    }
    if (taxable <= slab.upTo) break
  }
  // Rebate
  if (taxable <= 700_000) total = 0
  // Cess 4%
  total *= 1.04
  return { slabBreakdown: breakdown, total }
}

function CountUp({ to, prefix = "₹", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const ctrl = animate(0, to, {
      ...springs.gentle,
      onUpdate(v) { if (ref.current) ref.current.textContent = `${prefix}${Math.round(v).toLocaleString("en-IN")}${suffix}` },
    })
    return ctrl.stop
  }, [to, prefix, suffix])
  return <span ref={ref}>{prefix}0{suffix}</span>
}

export function WhereDoesMyTaxGo() {
  const [income, setIncome] = useState(1_200_000)
  const { total: incomeTax, slabBreakdown } = useMemo(() => computeIncomeTax(income), [income])

  // Effective tax to Centre. Add ~9% GST share on roughly 50% of disposable income (approx Centre's share)
  const disposable = income - incomeTax
  const gstApprox = disposable * 0.5 * 0.09 / 2  // approx CGST share at avg blended 9% rate
  const totalToCentre = incomeTax + gstApprox

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
        Move the slider to set your annual income. We compute your direct income tax (new regime, FY26 slabs) and an estimated GST share, then split that contribution across every paise of the Union Budget. <strong style={{ color: "var(--text-primary)" }}>Nothing leaves your browser.</strong>
      </p>

      {/* Income slider */}
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.06em]"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                Your annual income
              </p>
              <p className="text-[24px] tabular-nums leading-none"
                style={{ color: "var(--accent)", fontVariationSettings: fontWeights.bold, letterSpacing: "-0.02em" }}>
                {formatINR(income)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.06em]"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
                Estimated tax to Centre
              </p>
              <p className="text-[20px] tabular-nums leading-none"
                style={{ color: "var(--status-broken)", fontVariationSettings: fontWeights.bold }}>
                <CountUp to={Math.round(totalToCentre)} />
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                Income tax {formatINR(Math.round(incomeTax))} + GST share {formatINR(Math.round(gstApprox))}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <Slider
              value={income}
              onChange={v => setIncome(Array.isArray(v) ? v[0] : v)}
              min={200_000} max={5_000_000} step={50_000}
              aria-label="Annual income"
            />
            <div className="flex justify-between text-[10px] tabular-nums mt-1"
              style={{ color: "var(--text-tertiary)" }}>
              <span>₹2L</span><span>₹15L</span><span>₹30L</span><span>₹50L</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slab breakdown */}
      {slabBreakdown.length > 0 && income > 700_000 + 75_000 && (
        <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <CardContent className="p-4">
            <p className="text-[11px] uppercase tracking-[0.06em] mb-2"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
              Slab-by-slab income tax
            </p>
            <div className="flex flex-col gap-1.5">
              {slabBreakdown.map((s, i) => (
                <motion.div key={s.slab}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springs.gentle, delay: 0.04 * i }}
                  className="flex items-center justify-between text-[11.5px]">
                  <span style={{ color: "var(--text-secondary)" }}>{s.slab}</span>
                  <span className="tabular-nums"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                    {formatINR(Math.round(s.tax))}
                  </span>
                </motion.div>
              ))}
              <Separator className="my-1" style={{ background: "var(--border)" }} />
              <div className="flex items-center justify-between text-[12px]">
                <span style={{ color: "var(--text-secondary)" }}>+ 4% Health & Education Cess</span>
                <span className="tabular-nums"
                  style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                  {formatINR(Math.round(incomeTax - incomeTax / 1.04))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Where it goes */}
      <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={14} style={{ color: "var(--accent)" }} strokeWidth={2} />
            <p className="text-[13px]"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
              How your {formatINR(Math.round(totalToCentre))} gets spent
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {RUPEE_GOES_TO.map((head, i) => {
              const share = head.paisa / 100
              const amount = totalToCentre * share
              return (
                <motion.div key={head.head}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.04 * i }}
                  className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-[12px]"
                    style={{ color: "var(--text-secondary)" }}>{head.head}</span>
                  <div className="flex-1 h-5 rounded-sm overflow-hidden relative"
                    style={{ background: "var(--bg-elevated-3)" }}>
                    <motion.div className="absolute top-0 left-0 h-full rounded-sm"
                      initial={{ width: 0 }} animate={{ width: `${head.paisa}%` }}
                      transition={{ ...springs.gentle, delay: 0.05 * i + 0.2 }}
                      style={{ background: head.color, opacity: 0.85 }} />
                    <span className="absolute right-1 top-0 leading-5 text-[10px] tabular-nums"
                      style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                      {head.paisa} paise
                    </span>
                  </div>
                  <span className="w-24 text-right text-[12px] tabular-nums shrink-0"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                    {formatINR(Math.round(amount))}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <DataProvenance
        source="indiabudget.gov.in Budget at a Glance 2026-27 · CBDT new-regime FY26 slabs"
        note="Income tax: new regime FY26 slabs · standard deduction ₹75,000 · rebate u/s 87A for taxable ≤ ₹7L · 4% cess. GST share is approximate; actual depends on consumption mix. All computation client-side — no PII stored or transmitted."
      />
    </div>
  )
}
