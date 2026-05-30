"use client"

/**
 * Neo Nīti Budget — main tab container
 *
 * Page-level wiring:
 *  - UnitProvider scopes the global Real/Nominal/%GDP/per-capita lens
 *  - BudgetHero strip (PIN + income) sits above the tabs so the killer
 *    citizen-facing view is the first thing a visitor sees
 *  - SectionHeading.tag dropped (it was just echoing the parent tab name)
 */

import { useState } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { BudgetRoadmap } from "@/components/budget/BudgetRoadmap"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fontWeights } from "@/lib/font-weight"
import { UnitProvider } from "@/lib/budget/units"
import { UnitToggle } from "@/components/budget/_shared/UnitToggle"
import { BudgetHero } from "@/components/budget/BudgetHero"

// Wave 1
import { BudgetKpiTiles } from "@/components/budget/BudgetKpiTiles"
import { BudgetSankey } from "@/components/budget/BudgetSankey"
import { BeReActualsTracker } from "@/components/budget/BeReActualsTracker"
import { CessWedgeTracker } from "@/components/budget/CessWedgeTracker"
import { SubsidiesDecomposition } from "@/components/budget/SubsidiesDecomposition"
import { StateNetPositionMap } from "@/components/budget/StateNetPositionMap"

// Wave 2
import { BudgetTimeMachine } from "@/components/budget/BudgetTimeMachine"
import { DefenceVsSocialSector } from "@/components/budget/DefenceVsSocialSector"
import { OffBudgetBorrowings } from "@/components/budget/OffBudgetBorrowings"
import { FinanceCommissionWatch } from "@/components/budget/FinanceCommissionWatch"
import { GstIgstMap } from "@/components/budget/GstIgstMap"

// Wave 3
import { ManifestoToBudget } from "@/components/budget/ManifestoToBudget"
import { CssReleaseTracker } from "@/components/budget/CssReleaseTracker"
import { MyConstituency } from "@/components/budget/MyConstituency"
import { OutcomeBudgetIntegrity } from "@/components/budget/OutcomeBudgetIntegrity"
import { WhereDoesMyTaxGo } from "@/components/budget/WhereDoesMyTaxGo"

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ children, sub }: {
  children: React.ReactNode
  sub?: string
}) {
  return (
    <div className="mb-5">
      <h2
        className="text-[16px] leading-none mb-1"
        style={{
          color: "var(--text-primary)",
          fontVariationSettings: fontWeights.semibold,
          letterSpacing: "-0.015em",
        }}
      >
        {children}
      </h2>
      {sub && (
        <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{sub}</p>
      )}
    </div>
  )
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { value: "sankey",    label: "₹ Flow"    },
  { value: "trends",    label: "Trends"    },
  { value: "forensic",  label: "Forensics" },
  { value: "federal",   label: "Federal"   },
  { value: "subsidies", label: "Subsidies" },
  { value: "promises",  label: "Promises"  },
  { value: "you",       label: "You"       },
  { value: "roadmap",   label: "Roadmap"   },
] as const

// ── Main ──────────────────────────────────────────────────────────────────────
export function BudgetPageTabs() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value)

  return (
    <UnitProvider defaultMode="nominal">
      {/* ── Personal hero strip (the killer move) ─────────────────────────── */}
      <div className="mb-6">
        <BudgetHero onJumpToYou={() => setActiveTab("you")} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs + global unit toggle in the same row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList>
            {TABS.map(t => <TabItem key={t.value} value={t.value} label={t.label} />)}
          </TabsList>
          <UnitToggle />
        </div>

        {/* ── ₹ Flow ──────────────────────────────────────────────────────── */}
        <TabPanel value="sankey">
          <div className="flex flex-col gap-8 pt-4">
            <ErrorBoundary label="KPI tiles failed to load"><BudgetKpiTiles /></ErrorBoundary>
            <div>
              <SectionHeading sub="Where every rupee of the Union Budget comes from and where it goes — FY 2026-27 Budget Estimate">
                Union Budget Flow
              </SectionHeading>
              <ErrorBoundary label="Budget flow chart failed to render"><BudgetSankey /></ErrorBoundary>
            </div>
            <Card style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <CardContent className="px-4 py-3 text-[12px] leading-[1.7]"
                style={{ color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)" }}>How to read:</strong>{" "}
                Flow widths are proportional to ₹ value. Left = revenue sources. Middle = Centre's pool
                after 41% devolution to states (16th FC). Right = final uses. Hover any node for values
                and document citations.
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        {/* ── Trends ──────────────────────────────────────────────────────── */}
        <TabPanel value="trends">
          <div className="flex flex-col gap-10 pt-4">
            <div>
              <SectionHeading sub="Six expenditure heads, indexed to 100 at FY13. Capex tripling and interest crowding out everything else, in one glance.">
                Budget Time-Machine
              </SectionHeading>
              <ErrorBoundary label="Budget Time-Machine failed to render"><BudgetTimeMachine /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="Defence, Health, Education, Rural Development and Agriculture — toggle between % of GDP and absolute ₹. Caveat below on Union-only data.">
                Defence vs Social Sector
              </SectionHeading>
              <ErrorBoundary label="Defence vs Social chart failed to render"><DefenceVsSocialSector /></ErrorBoundary>
            </div>
          </div>
        </TabPanel>

        {/* ── Forensics ──────────────────────────────────────────────────── */}
        <TabPanel value="forensic">
          <div className="flex flex-col gap-10 pt-4">
            <div>
              <SectionHeading sub="Budget Estimate → Revised Estimate → Actuals. Forensic flags where RE falls ≥ 20% below BE.">
                Under-execution Tracker
              </SectionHeading>
              <ErrorBoundary label="Under-execution tracker failed to render"><BeReActualsTracker /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="Headline fiscal deficit plus off-balance-sheet borrowings — the true fiscal deficit. UPA and NDA eras, neutrally.">
                Off-Budget Borrowings
              </SectionHeading>
              <ErrorBoundary label="Off-budget borrowings failed to render"><OffBudgetBorrowings /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="Each scheme scored on output-outcome monitoring framework quality — CBGA-style rubric, four dimensions.">
                Outcome Budget Integrity Score
              </SectionHeading>
              <ErrorBoundary label="Outcome budget integrity failed to render"><OutcomeBudgetIntegrity /></ErrorBoundary>
            </div>
          </div>
        </TabPanel>

        {/* ── Federal ────────────────────────────────────────────────────── */}
        <TabPanel value="federal">
          <div className="flex flex-col gap-10 pt-4">
            <div>
              <SectionHeading sub="How cess and surcharge reduce the divisible pool shared with states — Articles 270 & 271.">
                Cess + Surcharge Wedge
              </SectionHeading>
              <ErrorBoundary label="Cess wedge chart failed to render"><CessWedgeTracker /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="How much does each state contribute vs receive? Heuristic estimates — methodology note at foot.">
                State Net-Position
              </SectionHeading>
              <ErrorBoundary label="State net-position table failed to render"><StateNetPositionMap /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="14th vs 15th vs 16th FC — vertical devolution, horizontal formula, per-state deltas, and the new ₹2.04 LC disaster grants corpus.">
                16th Finance Commission Watch
              </SectionHeading>
              <ErrorBoundary label="Finance Commission watch failed to render"><FinanceCommissionWatch /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="IGST origin-vs-destination by state — the producer vs consumer state debate, shown factually.">
                GST IGST Settlement
              </SectionHeading>
              <ErrorBoundary label="GST IGST chart failed to render"><GstIgstMap /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="Monthly Centrally Sponsored Scheme releases per state, with election-date overlay. Correlation ≠ causation.">
                CSS Release Tracker
              </SectionHeading>
              <ErrorBoundary label="CSS release tracker failed to render"><CssReleaseTracker /></ErrorBoundary>
            </div>
          </div>
        </TabPanel>

        {/* ── Subsidies ──────────────────────────────────────────────────── */}
        <TabPanel value="subsidies">
          <div className="flex flex-col gap-6 pt-4">
            <SectionHeading sub="Food · Fertiliser · Petroleum · Other — decomposed from FY 2017 to 2027.">
              Subsidies Decomposition
            </SectionHeading>
            <ErrorBoundary label="Subsidies chart failed to render"><SubsidiesDecomposition /></ErrorBoundary>
          </div>
        </TabPanel>

        {/* ── Promises ───────────────────────────────────────────────────── */}
        <TabPanel value="promises">
          <div className="flex flex-col gap-6 pt-4">
            <SectionHeading sub="2024 Lok Sabha manifesto promises cross-referenced with FY27 Budget allocations. AI-assisted match, editor-reviewed.">
              Manifesto-to-Budget Engine
            </SectionHeading>
            <ErrorBoundary label="Manifesto-to-budget engine failed to render"><ManifestoToBudget /></ErrorBoundary>
          </div>
        </TabPanel>

        {/* ── You ────────────────────────────────────────────────────────── */}
        <TabPanel value="you">
          <div className="flex flex-col gap-10 pt-4">
            <div>
              <SectionHeading sub="PIN-code → your MP's MPLADS spend, top works, and neighbouring constituencies.">
                My Constituency
              </SectionHeading>
              <ErrorBoundary label="My constituency failed to render"><MyConstituency /></ErrorBoundary>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            <div>
              <SectionHeading sub="Enter your income to see your estimated tax contribution split across every paise of the Union Budget. All computation client-side.">
                Where Does My Tax Go?
              </SectionHeading>
              <ErrorBoundary label="Where does my tax go failed to render"><WhereDoesMyTaxGo /></ErrorBoundary>
            </div>
          </div>
        </TabPanel>

        {/* ── Roadmap ────────────────────────────────────────────────────── */}
        <TabPanel value="roadmap">
          <div className="pt-4">
            <BudgetRoadmap onNavigate={setActiveTab} />
          </div>
        </TabPanel>
      </Tabs>
    </UnitProvider>
  )
}
