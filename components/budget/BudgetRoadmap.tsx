"use client"

import { fontWeights } from "@/lib/font-weight"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { springs } from "@/lib/springs"

// ─── Data ─────────────────────────────────────────────────────────────────────

interface RoadmapItem {
  id: string
  title: string
  description: string
  cohort: 1 | 2 | 3
  tabValue: string
}

const TAB_LABEL: Record<string, string> = {
  sankey:    "₹ Flow",
  trends:    "Trends",
  forensic:  "Forensics",
  federal:   "Federal",
  subsidies: "Subsidies",
  promises:  "Promises",
  you:       "You",
}

const ITEMS: RoadmapItem[] = [
  // ── Cohort 1: Foundation ──
  { id: "NŃ-321", cohort: 1, tabValue: "sankey",    title: "Union Budget Sankey",         description: "Where every rupee comes from and where it goes — revenue, expenditure and devolution flows for FY 2026-27." },
  { id: "NŃ-325", cohort: 1, tabValue: "forensic",  title: "BE / RE / Actuals Tracker",   description: "Budget Estimate vs Revised Estimate vs Actuals across every demand for grants, with forensic flags on under-execution." },
  { id: "NŃ-326", cohort: 1, tabValue: "federal",   title: "Cess Wedge Tracker",          description: "How cess and surcharge collections shrink the divisible pool shared with states — the hidden fiscal wedge." },
  { id: "NŃ-323", cohort: 1, tabValue: "federal",   title: "State Net-Position",          description: "Per-state gives vs receives vs net ratio across all central transfers." },
  { id: "NŃ-330", cohort: 1, tabValue: "subsidies", title: "Subsidies Decomposition",     description: "Food, fertiliser and petroleum subsidies decomposed from FY 2017 to 2027 with economic classification." },

  // ── Cohort 2: Trends + Federal extension ──
  { id: "NŃ-322", cohort: 2, tabValue: "trends",    title: "Budget Time-Machine",         description: "Year slider FY13 → FY27 with stacked composition transitions across Interest, Defence, Capex, Subsidies and schemes." },
  { id: "NŃ-327", cohort: 2, tabValue: "federal",   title: "16th Finance Commission Watch", description: "14th vs 15th vs 16th FC vertical and horizontal devolution, per-state deltas, and the ₹2.04 LC disaster grants corpus." },
  { id: "NŃ-329", cohort: 2, tabValue: "trends",    title: "Defence vs Social Sector",    description: "Defence, Health, Education, Rural Dev and Agriculture as % of GDP — FY13 → FY27, lines or stacked." },
  { id: "NŃ-331", cohort: 2, tabValue: "forensic",  title: "Off-Budget Borrowings",       description: "True fiscal deficit = headline + OBBs. FCI-NSSF, IRFC and oil bonds across UPA and NDA eras, shown neutrally." },
  { id: "NŃ-332", cohort: 2, tabValue: "federal",   title: "GST IGST Settlement",         description: "Origin (producer) vs destination (consumer) state IGST shares — the destination-principle debate, shown factually." },

  // ── Cohort 3: Citizen + Outcome ──
  { id: "NŃ-324", cohort: 3, tabValue: "promises",  title: "Manifesto-to-Budget Engine",  description: "2024 BJP and INC manifesto promises cross-referenced with FY27 Budget allocations — AI-assisted, editor-reviewed." },
  { id: "NŃ-328", cohort: 3, tabValue: "federal",   title: "CSS Release Tracker",         description: "Monthly Centrally Sponsored Scheme releases per state, per scheme, with election-date overlay. Correlation ≠ causation." },
  { id: "NŃ-334", cohort: 3, tabValue: "forensic",  title: "Outcome Budget Integrity",    description: "Each scheme's OOMF entry scored on indicator quality, target reporting, achievement and disaggregation — CBGA-style rubric." },
  { id: "NŃ-333", cohort: 3, tabValue: "you",       title: "My Constituency",             description: "Enter a PIN-code and see your MP's MPLADS spend, top works, and neighbouring constituencies side-by-side." },
  { id: "NŃ-335", cohort: 3, tabValue: "you",       title: "Where Does My Tax Go?",       description: "Enter your income to see your estimated tax split across every paise of the Union Budget. All computation client-side." },
]

const COHORT_META = {
  1: { label: "Foundation",      sub: "The five viz that ship the BUDGET epic — Sankey, BE/RE/A, Cess, State Map, Subsidies." },
  2: { label: "Trends + Federal", sub: "Multi-year scrub, 16th Finance Commission, defence-vs-social composition, off-budget borrowings, GST IGST settlement." },
  3: { label: "Citizen + Outcome", sub: "Manifesto-to-Budget engine, CSS release tracker, outcome budget scoring, constituency lookup, and personal Sankey." },
} as const

// ─── Live card ────────────────────────────────────────────────────────────────

function LiveCard({ item, onNavigate, idx }: {
  item: RoadmapItem
  onNavigate?: (tab: string) => void
  idx: number
}) {
  const tabLabel = TAB_LABEL[item.tabValue] ?? item.tabValue
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay: 0.03 * idx }}
      role="button"
      tabIndex={0}
      onClick={() => onNavigate?.(item.tabValue)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onNavigate?.(item.tabValue)}
      className="group cursor-pointer rounded-[10px] px-[14px] py-[12px] flex flex-col gap-[6px] outline-none focus-visible:ring-1 border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-100 hover:bg-[var(--bg-elevated-2)] hover:border-[var(--border-strong)]"
    >
      {/* Status row */}
      <div className="flex items-center gap-[6px]">
        <span className="flex items-center justify-center w-[8px] h-[8px] shrink-0">
          <span className="w-[6px] h-[6px] rounded-full"
            style={{ background: "var(--status-kept)" }} />
        </span>
        <span className="text-[10px] uppercase tracking-[0.07em]"
          style={{ color: "var(--status-kept)", fontVariationSettings: fontWeights.semibold }}>
          Live
        </span>
        <span className="ml-auto font-mono text-[9.5px]"
          style={{ color: "var(--text-tertiary)", opacity: 0.6 }}>
          {item.id}
        </span>
      </div>

      {/* Title */}
      <p className="text-[14px] leading-[19px]"
        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
        {item.title}
      </p>

      {/* Description */}
      <p className="text-[12px] leading-[16px]"
        style={{ color: "var(--text-tertiary)" }}>
        {item.description}
      </p>

      {/* CTA */}
      <div className="flex items-center gap-[4px] mt-[2px] text-[12px]"
        style={{ color: "var(--status-kept)", fontVariationSettings: fontWeights.medium }}>
        <span>Open {tabLabel}</span>
        <ArrowUpRight size={12}
          className="transition-transform duration-100 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
      </div>
    </motion.div>
  )
}

// ─── Cohort section ───────────────────────────────────────────────────────────

function CohortSection({ cohort, items, onNavigate, startIdx }: {
  cohort: 1 | 2 | 3
  items: RoadmapItem[]
  onNavigate?: (tab: string) => void
  startIdx: number
}) {
  const meta = COHORT_META[cohort]
  return (
    <section className="flex flex-col gap-[14px]">
      <div className="flex flex-col gap-[3px]">
        <div className="flex items-center gap-[8px]">
          <CheckCircle2 size={13} strokeWidth={2} style={{ color: "var(--status-kept)" }} />
          <h3 className="text-[15px] leading-none"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
            {meta.label}
          </h3>
          <span className="text-[10.5px] px-[7px] py-[2px] rounded-md tabular-nums"
            style={{
              background: "color-mix(in srgb, var(--status-kept) 12%, transparent)",
              color: "var(--status-kept)",
              fontVariationSettings: fontWeights.semibold,
            }}>
            {items.length}
          </span>
        </div>
        <p className="text-[12px] pl-[21px]" style={{ color: "var(--text-tertiary)" }}>
          {meta.sub}
        </p>
        <div className="mt-[6px]" style={{ height: "1px", background: "var(--border)" }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
        {items.map((item, i) => (
          <LiveCard key={item.id} item={item} onNavigate={onNavigate} idx={startIdx + i} />
        ))}
      </div>
    </section>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function BudgetRoadmap({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const c1 = ITEMS.filter(i => i.cohort === 1)
  const c2 = ITEMS.filter(i => i.cohort === 2)
  const c3 = ITEMS.filter(i => i.cohort === 3)

  return (
    <div className="flex flex-col gap-[30px]">
      {/* Hero — All 15 live banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
        className="rounded-[10px] px-[18px] py-[14px] flex items-start gap-[12px]"
        style={{
          background: "color-mix(in srgb, var(--status-kept) 7%, transparent)",
          border: "1px solid color-mix(in srgb, var(--status-kept) 22%, transparent)",
        }}
      >
        <CheckCircle2 size={18} strokeWidth={2} className="shrink-0 mt-[1px]"
          style={{ color: "var(--status-kept)" }} />
        <div>
          <p className="text-[14px]"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
            BUDGET Epic — all {ITEMS.length} features live
          </p>
          <p className="text-[12px] mt-[2px]" style={{ color: "var(--text-secondary)" }}>
            The full Indian Union Budget visualisation suite — Sankey, forensics, federal flows,
            time-machine, manifesto cross-reference, constituency lookup and personal tax calculator.
            Click any card to open the relevant section.
          </p>
        </div>
      </motion.div>

      <CohortSection cohort={1} items={c1} onNavigate={onNavigate} startIdx={0} />
      <CohortSection cohort={2} items={c2} onNavigate={onNavigate} startIdx={c1.length} />
      <CohortSection cohort={3} items={c3} onNavigate={onNavigate} startIdx={c1.length + c2.length} />
    </div>
  )
}
