import { BudgetPageTabs } from "@/components/budget/BudgetPageTabs"
import { fontWeights } from "@/lib/font-weight"

export const metadata = {
  title: "Budget · Neo Nīti",
  description:
    "Forensic Sankey for the Indian Union Budget. Track where every rupee comes from, where it goes, and what slips between the estimate and reality.",
}

export default function BudgetPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Page header */}
      <div
        className="px-6 pt-6 pb-5 shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-start gap-3.5">
          {/* ₹ icon badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: "color-mix(in srgb, var(--accent) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 28%, transparent)",
            }}
          >
            <span
              className="text-[16px] leading-none"
              style={{ color: "var(--accent)", fontVariationSettings: fontWeights.semibold }}
            >
              ₹
            </span>
          </div>

          <div>
            <h1 className="h-page" style={{ color: "var(--text-primary)" }}>
              Union Budget
            </h1>
            <p className="text-[13px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>
              Forensic Sankey · BE/RE/Actuals · Federal Flows · FY 2026-27
            </p>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 md:px-6 pt-4 pb-10 max-w-5xl w-full">
        <BudgetPageTabs />
      </div>
    </main>
  )
}
