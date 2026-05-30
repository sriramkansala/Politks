"use client"

/**
 * BudgetHero — page-top personal strip.
 *
 * Big Bet #1 from the design critique: make the budget personal on first paint.
 * Two inputs (annual income, PIN) → one-sentence answer that scrolls the user
 * into the full tool. The full tools live inside the "You" tab; this is the hook.
 */

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, IndianRupee, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { formatINR } from "@/lib/format"

// ── Rough constants (placeholder — real model lives in WhereDoesMyTaxGo) ─────
const NEW_REGIME_SLABS: { upTo: number; rate: number }[] = [
  { upTo:  300_000, rate: 0.00 },
  { upTo:  600_000, rate: 0.05 },
  { upTo:  900_000, rate: 0.10 },
  { upTo: 1_200_000, rate: 0.15 },
  { upTo: 1_500_000, rate: 0.20 },
  { upTo: Infinity, rate: 0.30 },
]

function estimateIncomeTax(income: number): number {
  let tax = 0
  let lastSlab = 0
  for (const { upTo, rate } of NEW_REGIME_SLABS) {
    if (income <= lastSlab) break
    const slabBase = Math.min(income, upTo) - lastSlab
    tax += slabBase * rate
    lastSlab = upTo
  }
  // Standard deduction + rebate u/s 87A for income up to ₹7L → effectively zero
  if (income <= 700_000) return 0
  return Math.round(tax)
}

function estimateGst(income: number): number {
  // Crude: ~55% of disposable income consumed, ~10% effective blended GST
  // Real model lives in WhereDoesMyTaxGo
  return Math.round(Math.max(0, income - 100_000) * 0.55 * 0.10)
}

export function BudgetHero({ onJumpToYou }: { onJumpToYou: () => void }) {
  const [income, setIncome] = useState<string>("")
  const [pin, setPin] = useState<string>("")

  const numericIncome = useMemo(() => {
    const n = Number(income.replace(/[^\d]/g, ""))
    return Number.isFinite(n) ? n : 0
  }, [income])

  const hasIncome = numericIncome >= 100_000
  const incomeTax = useMemo(() => estimateIncomeTax(numericIncome), [numericIncome])
  const gst = useMemo(() => estimateGst(numericIncome), [numericIncome])
  const total = incomeTax + gst

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        background: "linear-gradient(135deg, color-mix(in oklab, var(--accent) 10%, var(--bg-elevated)) 0%, var(--bg-elevated) 60%)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="px-5 py-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">

        {/* ── Pitch ──────────────────────────────────── */}
        <div className="md:max-w-[260px]">
          <p
            className="text-[10px] uppercase tracking-[0.08em] mb-1"
            style={{ color: "var(--accent)", fontVariationSettings: fontWeights.semibold }}
          >
            Make it personal
          </p>
          <p
            className="text-[14px] leading-snug"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
          >
            Your ₹ in this budget.
          </p>
          <p className="text-[11px] leading-snug mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Annual income + PIN — see what you fund and what your constituency gets.
          </p>
        </div>

        {/* ── Inputs ─────────────────────────────────── */}
        <div className="flex gap-2 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Annual income (₹)"
              value={income}
              onChange={e => setIncome(e.target.value)}
              leadingIcon={IndianRupee}
              inputMode="numeric"
              aria-label="Annual income in rupees"
            />
          </div>
          <div className="w-[140px]">
            <Input
              placeholder="PIN code"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
              leadingIcon={MapPin}
              inputMode="numeric"
              maxLength={6}
              aria-label="PIN code"
            />
          </div>
        </div>

        {/* ── Live answer + CTA ──────────────────────── */}
        <motion.div
          className="flex items-center gap-3 shrink-0"
          animate={{ opacity: hasIncome ? 1 : 0.6 }}
          transition={springs.responsive}
        >
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase tracking-[0.07em]"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
              Your est. contribution
            </p>
            <p className="text-[18px] tabular-nums leading-none mt-0.5"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.bold }}>
              {hasIncome ? formatINR(total) : "—"}{" "}
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.normal }}>
                / year
              </span>
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            trailingIcon={ArrowRight}
            onClick={onJumpToYou}
            disabled={!hasIncome && !pin}
          >
            Explore
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
