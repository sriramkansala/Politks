// /mp — Know Your Politician hub (BMW-130 entry point).
// Tab 1 "Find MP":  search by PIN / name / constituency → /mp/[slug].
// Tab 2 "Legislators": full browseable MP + MLA roster with filters.

import Link from "next/link"
import { findMpByPin, findMpByQuery, STATIC_MPS_ALL } from "@/lib/db/staticMps"
import { STATIC_MLAS, type Mla } from "@/lib/db/staticMlas"
import type { Mp } from "@/lib/db/types"
import { MpSearchForm } from "@/components/mp/MpSearchForm"
import { MpRow, MlaRow } from "@/components/mp/LegislatorRow"
import { MpHubTabs } from "@/components/mp/MpHubTabs"
import { FilterDropdown } from "@/components/mp/FilterDropdown"
import { partyColor } from "@/lib/partyColors"
import { fontWeights } from "@/lib/font-weight"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { stateName } from "@/lib/stateNames"

export const metadata = { title: "Know your politician · Neo Nīti" }

interface PageProps {
  searchParams: Promise<{
    q?: string
    pin?: string
    tab?: string
    house?: string
    state?: string
    party?: string
  }>
}

// ─── Legislators tab data ─────────────────────────────────────────────────────

type Row =
  | { kind: "mp"; mp: Mp }
  | { kind: "mla"; mla: Mla }

function buildLegislatorsData(filters: {
  house?: string
  state?: string
  party?: string
  q?: string
}) {
  const { house, state, party, q } = filters

  const allRows: Row[] = [
    ...STATIC_MPS_ALL.map((mp): Row => ({ kind: "mp", mp })),
    ...STATIC_MLAS.map((mla): Row => ({ kind: "mla", mla })),
  ]

  const filtered = allRows.filter((r) => {
    if (house === "lok_sabha"   && !(r.kind === "mp" && r.mp.house === "lok_sabha"))   return false
    if (house === "rajya_sabha" && !(r.kind === "mp" && r.mp.house === "rajya_sabha")) return false
    if (house === "mla"         && r.kind !== "mla") return false
    if (state) {
      const rowState = r.kind === "mp" ? r.mp.state_code : r.mla.state_code
      if (rowState !== state) return false
    }
    if (party) {
      const rowParty = r.kind === "mp" ? r.mp.party_name : r.mla.party
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

  const states = Array.from(
    new Set(allRows.map((r) => (r.kind === "mp" ? r.mp.state_code : r.mla.state_code)).filter(Boolean))
  ).sort() as string[]

  const parties = Array.from(
    new Set(allRows.map((r) => (r.kind === "mp" ? r.mp.party_name : r.mla.party)).filter(Boolean))
  ).sort() as string[]

  const mpCount  = allRows.filter((r) => r.kind === "mp").length
  const mlaCount = allRows.filter((r) => r.kind === "mla").length

  return { allRows, filtered, states, parties, mpCount, mlaCount }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MpHubPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const activeTab = sp.tab === "legislators" ? "legislators" : "find"

  // ── Find MP tab ──────────────────────────────────────────────────────────────
  const raw = (sp.q ?? sp.pin ?? "").trim()
  const isPin = /^\d{6}$/.test(raw)

  let resolved: ReturnType<typeof findMpByQuery> = []
  let notice: string | null = null

  if (raw && activeTab === "find") {
    if (isPin) {
      const pinMatch = findMpByPin(raw)
      if (pinMatch) {
        resolved = [pinMatch]
      } else {
        notice = `No MP currently mapped to PIN ${raw}. PIN→constituency mapping for the full 543-seat roster is still being wired in — try searching by name or constituency instead.`
      }
    } else {
      resolved = findMpByQuery(raw)
      if (resolved.length === 0) notice = `No MP found for "${raw}".`
    }
  }

  const featuredSlugs = [
    "manish-tewari", "praveen-patel", "rahul-gandhi", "nakul-nath",
    "abhishek-banerjee", "arvind-sawant", "priyanka-gandhi-vadra", "anant-kumar-singh",
  ]
  const featured = featuredSlugs
    .map((s) => STATIC_MPS_ALL.find((mp) => mp.prs_slug === s))
    .filter(Boolean) as typeof STATIC_MPS_ALL

  // ── Legislators tab ──────────────────────────────────────────────────────────
  const { house, state, party } = sp
  const legQ = activeTab === "legislators" ? sp.q : undefined
  const { filtered, states, parties, mpCount, mlaCount } = buildLegislatorsData({
    house, state, party, q: legQ,
  })

  // ── Panels ───────────────────────────────────────────────────────────────────

  const findPanel = (
    <AnimateIn stagger className="space-y-10">
      {/* Search notice — the search form itself now lives beside the page title. */}
      {notice && (
        <AnimateItem>
          <p className="text-[12px] max-w-2xl" style={{ color: "var(--text-tertiary)" }}>
            {notice}
          </p>
        </AnimateItem>
      )}

      {/* Results */}
      {resolved.length > 0 && (
        <AnimateItem>
          <section>
            <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
              {resolved.length === 1 ? "Match" : `${resolved.length} matches`}
            </h2>
            <AnimateIn stagger className="grid gap-2">
              {resolved.map((mp) => (
                <AnimateItem key={mp.id}>
                  <Link
                    href={`/mp/${mp.prs_slug}`}
                    className="flex items-center justify-between p-4 rounded-[var(--radius-card)] transition-colors hover:border-[var(--border-strong)]"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", textDecoration: "none" }}
                  >
                    <div>
                      <div className="text-[14px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
                        {mp.name}
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {mp.party_name} · {mp.constituency ?? "Rajya Sabha"}
                        {mp.state_code ? ` · ${mp.state_code}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                      {mp.attendance_pct != null ? (
                        <span>{mp.attendance_pct.toFixed(0)}% att.</span>
                      ) : (
                        <span>—</span>
                      )}
                      <span>→</span>
                    </div>
                  </Link>
                </AnimateItem>
              ))}
            </AnimateIn>
          </section>
        </AnimateItem>
      )}

      {/* Featured MPs */}
      <AnimateItem>
        <section>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            Featured MPs
          </h2>
          <p className="text-caption mb-4" style={{ color: "var(--text-tertiary)" }}>
            A handful of widely-covered 18th Lok Sabha members. Browse the full
            {" "}{STATIC_MPS_ALL.length}-MP roster in the{" "}
            <span style={{ color: "var(--accent)" }}>Legislators</span> tab above.
          </p>
          <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {featured.map((mp) => (
              <AnimateItem key={mp.id}>
                <MpRow mp={mp} />
              </AnimateItem>
            ))}
          </AnimateIn>
        </section>
      </AnimateItem>

      {/* Footer caveat */}
      <AnimateItem>
        <section className="caveat-block">
          <strong>How this works.</strong>{" "}
          Attendance, questions, debates and PMB counts come from{" "}
          <a href="https://prsindia.org/mptrack" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            PRS Legislative Research
          </a>
          . Assets and criminal cases are self-declared affidavits filed with the{" "}
          <a href="https://affidavit.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            Election Commission
          </a>
          . Ministers and the Speaker are exempt from signing the attendance
          register — flagged on individual cards.
        </section>
      </AnimateItem>
    </AnimateIn>
  )

  const legislatorsPanel = (
    <AnimateIn stagger className="space-y-6">
      <AnimateItem>
        <p className="text-[15px] max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {mpCount} MPs · {mlaCount} ruling-party MLAs · all major Indian states.
          Use the search in the page header above, or filter by house, state and party below.
        </p>
      </AnimateItem>

      {/* Filter dropdowns */}
      <AnimateItem>
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
            preserveParams={{ tab: "legislators", state, party, q: legQ }}
            allLabel="All houses"
          />
          <FilterDropdown
            paramKey="state"
            label="State"
            value={state ?? null}
            options={states
              .map((s) => ({ value: s, label: stateName(s) || s }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            preserveParams={{ tab: "legislators", house, party, q: legQ }}
            allLabel="All states"
          />
          <FilterDropdown
            paramKey="party"
            label="Party"
            value={party ?? null}
            options={parties.map((p) => ({ value: p, label: p, color: partyColor(p) }))}
            preserveParams={{ tab: "legislators", house, state, q: legQ }}
            allLabel="All parties"
          />
        </div>
      </AnimateItem>

      {/* Results */}
      <AnimateItem>
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </h2>
          </div>
          <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filtered.map((row, i) => (
              <AnimateItem key={i}>
                {row.kind === "mp" ? <MpRow mp={row.mp} /> : <MlaRow mla={row.mla} />}
              </AnimateItem>
            ))}
          </AnimateIn>
          {filtered.length === 0 && (
            <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              No legislators match these filters.
            </p>
          )}
        </section>
      </AnimateItem>

      {/* Coverage caveat */}
      <AnimateItem>
        <section
          className="rounded-[6px] p-4 text-[12px] leading-relaxed"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-tertiary)" }}
        >
          <strong style={{ color: "var(--text-secondary)" }}>Coverage.</strong>{" "}
          MP list shows the 25 marquee 18th Lok Sabha members hand-seeded from the
          BMW-130 spec — the full 543-MP roster is being ingested and will appear
          once the PRS scrape finishes. MLA coverage spans 10 states&apos;
          ruling parties. Opposition MLAs and remaining states land in a later phase.
        </section>
      </AnimateItem>
    </AnimateIn>
  )

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
      <AnimateIn>
        <section className="flex items-center justify-between gap-6 flex-wrap">
          <h1 className="h-page" style={{ color: "var(--text-primary)" }}>
            Know your politician
          </h1>
          <MpSearchForm defaultValue={raw} className="flex-1 min-w-[280px] max-w-xl" />
        </section>
      </AnimateIn>

      <MpHubTabs
        activeTab={activeTab}
        findPanel={findPanel}
        legislatorsPanel={legislatorsPanel}
        legislatorsLabel={`Legislators (${mpCount + mlaCount})`}
      />
    </div>
  )
}
