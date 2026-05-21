// /legislators — Browse all MPs (Lok Sabha + Rajya Sabha) and ruling-party MLAs.
// Filters: house · state · party · search.

import { STATIC_MPS_ALL } from "@/lib/db/staticMps"
import { STATIC_MLAS, type Mla } from "@/lib/db/staticMlas"
import type { Mp } from "@/lib/db/types"
import { MpRow, MlaRow } from "@/components/mp/LegislatorRow"
import { FilterDropdown } from "@/components/mp/FilterDropdown"
import { LegislatorSearchForm } from "@/components/legislators/LegislatorSearchForm"
import { partyColor } from "@/lib/partyColors"

export const metadata = { title: "Legislators · Bharat Manifesto Watch" }
export const revalidate = 21600

type Row =
  | { kind: "mp"; mp: Mp }
  | { kind: "mla"; mla: Mla }

interface PageProps {
  searchParams: Promise<{ house?: string; state?: string; party?: string; q?: string }>
}

export default async function LegislatorsPage({ searchParams }: PageProps) {
  const { house, state, party, q } = await searchParams

  const allRows: Row[] = [
    ...STATIC_MPS_ALL.map((mp): Row => ({ kind: "mp", mp })),
    ...STATIC_MLAS.map((mla): Row => ({ kind: "mla", mla })),
  ]

  const filtered = allRows.filter((r) => {
    if (house === "lok_sabha" && !(r.kind === "mp" && r.mp.house === "lok_sabha")) return false
    if (house === "rajya_sabha" && !(r.kind === "mp" && r.mp.house === "rajya_sabha")) return false
    if (house === "mla" && r.kind !== "mla") return false
    if (state) {
      const rowState =
        r.kind === "mp" ? r.mp.state_code : r.mla.state_code
      if (rowState !== state) return false
    }
    if (party) {
      const rowParty =
        r.kind === "mp" ? r.mp.party_name : r.mla.party
      if ((rowParty ?? "").toLowerCase() !== party.toLowerCase()) return false
    }
    if (q) {
      const needle = q.toLowerCase()
      const text =
        r.kind === "mp"
          ? `${r.mp.name} ${r.mp.constituency ?? ""}`
          : `${r.mla.name} ${r.mla.constituency} ${r.mla.cabinet_role ?? ""}`
      if (!text.toLowerCase().includes(needle)) return false
    }
    return true
  })

  // Aggregations for filter chips
  const states = Array.from(
    new Set(
      allRows
        .map((r) => (r.kind === "mp" ? r.mp.state_code : r.mla.state_code))
        .filter(Boolean)
    )
  ).sort() as string[]

  const parties = Array.from(
    new Set(
      allRows
        .map((r) => (r.kind === "mp" ? r.mp.party_name : r.mla.party))
        .filter(Boolean)
    )
  ).sort() as string[]

  const mpCount = allRows.filter((r) => r.kind === "mp").length
  const mlaCount = allRows.filter((r) => r.kind === "mla").length

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
      {/* Hero */}
      <section>
        <h1 className="text-heading-xl mb-2" style={{ color: "var(--text-primary)" }}>
          Legislators
        </h1>
        <p className="text-[15px] max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {mpCount} MPs · {mlaCount} ruling-party MLAs · all major Indian states.
          Search by name or constituency, or filter by house, state and party.
        </p>
      </section>

      {/* Search */}
      <section>
        <LegislatorSearchForm defaultQ={q} house={house} state={state} party={party} />
      </section>

      {/* Filter row — three FilterDropdowns, consistent with /manifestos. */}
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          paramKey="house"
          label="House"
          value={house ?? null}
          options={[
            { value: "lok_sabha",   label: "Lok Sabha" },
            { value: "rajya_sabha", label: "Rajya Sabha" },
            { value: "mla",         label: "MLAs" },
          ]}
          preserveParams={{ state, party, q }}
          allLabel="All houses"
        />
        <FilterDropdown
          paramKey="state"
          label="State"
          value={state ?? null}
          options={states.map((s) => ({ value: s, label: s }))}
          preserveParams={{ house, party, q }}
          allLabel="All states"
        />
        <FilterDropdown
          paramKey="party"
          label="Party"
          value={party ?? null}
          options={parties.map((p) => ({
            value: p,
            label: p,
            color: partyColor(p),
          }))}
          preserveParams={{ house, state, q }}
          allLabel="All parties"
        />
      </div>

      {/* Results */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.map((row, i) =>
            row.kind === "mp" ? (
              <MpRow key={i} mp={row.mp} />
            ) : (
              <MlaRow key={i} mla={row.mla} />
            )
          )}
        </div>
        {filtered.length === 0 && (
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            No legislators match these filters.
          </p>
        )}
      </section>

      {/* Coverage caveat */}
      <section
        className="rounded-[6px] p-4 text-[12px] leading-relaxed"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>Coverage.</strong>{" "}
        MP list shows the 25 marquee 18th Lok Sabha members hand-seeded from the
        BMW-130 spec — the full 543-MP roster is currently being ingested by{" "}
        <code style={{ color: "var(--text-tertiary)" }}>scripts/scrape-prs-mps.mjs</code> and will appear
        once the PRS scrape finishes (~100 min). MLA coverage spans 10 states'
        ruling parties (Maharashtra, Karnataka, Tamil Nadu, West Bengal, Delhi,
        UP, MP, AP, Telangana, Kerala) — opposition MLAs and remaining states
        land in a later phase. Per BMW-130 caveats, UP/Bihar/MP publish little
        digital assembly data — we mark those records "medium" or "low" confidence.
      </section>
    </div>
  )
}

// LegislatorCard / FilterChip / buildHref removed — replaced by
// <MpRow>/<MlaRow> and three <FilterDropdown>s.
