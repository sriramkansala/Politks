// Current-leadership tree for a party, with a year selector to scrub through
// historical snapshots. The selector is URL-driven (FilterDropdown) so this
// component stays a server component — SSR-friendly, shareable as a link.
//
// Picks the snapshot whose year <= selectedYear (most recent <= selection).
// If no snapshots exist for the party, shows the shared empty state.

import { FilterDropdown } from "@/components/mp/FilterDropdown"
import type { PartyOrgSnapshot } from "@/lib/db/partyProfile"
import { PartyEmptyState } from "./PartyEmptyState"
import { PartyOrgChart } from "./PartyOrgChart"

interface Props {
  snapshots: PartyOrgSnapshot[]
  /** Year picked from ?org_year=… in the URL. */
  selectedYear?: string
  /** Tab name to preserve in URL when changing year. */
  preserveTab?: string
  /** Party brand color, used to tint avatar circles. */
  partyColor: string
}

export function PartyOrganisation({
  snapshots,
  selectedYear,
  preserveTab,
  partyColor,
}: Props) {
  if (!snapshots.length) return <PartyEmptyState section="Organisation" />

  const years = [...snapshots.map((s) => s.year)].sort((a, b) => b - a)
  const targetYear = selectedYear ? parseInt(selectedYear, 10) : years[0]

  // Most recent snapshot <= targetYear
  const eligible = snapshots
    .filter((s) => s.year <= targetYear)
    .sort((a, b) => b.year - a.year)
  const snap = eligible[0] ?? snapshots.sort((a, b) => a.year - b.year)[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.06em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Leadership as of {snap.year}
          </p>
          {snap.note && (
            <p
              className="text-[12px] mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {snap.note}
            </p>
          )}
        </div>
        <FilterDropdown
          paramKey="org_year"
          label="Year"
          value={selectedYear}
          allLabel={`Latest (${years[0]})`}
          preserveParams={{ tab: preserveTab }}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
        />
      </div>

      {/* Visual hierarchical org chart — pill cards + dashed connectors. */}
      <PartyOrgChart snap={snap} partyColor={partyColor} />
    </div>
  )
}
