// /insights — BMW-226–250 + BMW-160–185 (Did You Know feed)
// Server component. Filter by category via ?category=parliamentary etc.

import { DykCard } from "@/components/insights/DykCard"
import { FilterDropdown } from "@/components/mp/FilterDropdown"
import {
  FACTS,
  FACT_CATEGORIES,
  pickDailyFact,
  type FactCategory,
} from "@/lib/insights/facts"

export const metadata = { title: "Insights · Bharat Manifesto Watch" }
export const revalidate = 21600

interface PageProps {
  searchParams: Promise<{ category?: FactCategory; era?: string }>
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const { category, era } = await searchParams

  const today = pickDailyFact()
  const filtered = FACTS.filter((f) => {
    if (category && f.category !== category) return false
    if (era && f.era !== era) return false
    return true
  })

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">
      <section>
        <h1 className="text-heading-xl mb-2" style={{ color: "var(--text-primary)" }}>
          Insights
        </h1>
        <p className="text-[15px] max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          One counter-intuitive fact about Indian politics, every day.
          Sourced from PRS, ADR, ECI, Lokniti-CSDS and Lok Sabha records.
        </p>
      </section>

      {/* Today's card — large */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
            Today
          </h2>
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <DykCard fact={today} />
      </section>

      {/* Category filter */}
      <section>
        <h2 className="text-subheading mb-3" style={{ color: "var(--text-primary)" }}>
          Browse {filtered.length} facts
        </h2>
        <FilterDropdown
          paramKey="category"
          label="Category"
          value={category ?? null}
          options={FACT_CATEGORIES.map(({ key, label }) => ({ value: key, label }))}
          preserveParams={{ era }}
          allLabel="All categories"
        />
      </section>

      {/* All facts grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((fact) => (
            <DykCard key={fact.id} fact={fact} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            No facts match this filter yet.
          </p>
        )}
      </section>

      {/* Caveats */}
      <section
        className="rounded-[6px] p-4 text-[12px] leading-relaxed"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>Reading these honestly.</strong>{" "}
        Criminal-case totals include any IPC case — many are protest-related
        (Section 144, unlawful assembly). The “serious” count tracks
        murder / rape / kidnap / similar. Asset figures are self-declared and
        nominal (not inflation-adjusted). Attendance percentages exclude
        Ministers and the Speaker, who are exempt from signing the register.
      </section>
    </div>
  )
}
