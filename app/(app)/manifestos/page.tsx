// /manifestos — Browse all imported manifestos.
// Server-rendered grid; each card links to /manifestos/[id] for the full promise breakdown.

import Link from "next/link"
import { Download, FileText, ExternalLink, ArrowRight } from "lucide-react"
import { createPublicClient } from "@/lib/db/server"
import type { Manifesto, Party, PromiseRow } from "@/lib/db/types"
import { FilterDropdown } from "@/components/mp/FilterDropdown"
import { fontWeights } from "@/lib/font-weight"

export const revalidate = 21600
export const metadata = { title: "Manifestos · Bharat Manifesto Watch" }

interface PageProps {
  searchParams: Promise<{ year?: string; party?: string; level?: string }>
}

export default async function ManifestosPage({ searchParams }: PageProps) {
  const { year, party, level } = await searchParams
  const supabase = createPublicClient()

  const [{ data: manifestosRaw }, { data: partiesRaw }, { data: promisesRaw }] =
    await Promise.all([
      supabase.from("manifestos").select("*").order("election_year", { ascending: false }),
      supabase.from("parties").select("*"),
      supabase.from("promises").select("manifesto_id, is_headline"),
    ])

  const manifestos = (manifestosRaw ?? []) as Manifesto[]
  const parties = (partiesRaw ?? []) as Party[]
  const promises = (promisesRaw ?? []) as Pick<PromiseRow, "manifesto_id" | "is_headline">[]

  const partyById = Object.fromEntries(parties.map((p) => [p.id, p]))

  // Promise counts per manifesto
  const promiseCount: Record<string, { total: number; headline: number }> = {}
  for (const p of promises) {
    if (!p.manifesto_id) continue
    const m = (promiseCount[p.manifesto_id] ??= { total: 0, headline: 0 })
    m.total++
    if (p.is_headline) m.headline++
  }

  // Filters
  const years = Array.from(new Set(manifestos.map((m) => m.election_year))).sort((a, b) => b - a)
  // Only show parties that actually have a manifesto in the current set —
  // keeps the party dropdown short and meaningful.
  const partiesWithManifestos = parties.filter((p) =>
    manifestos.some((m) => m.party_id === p.id),
  )
  const filtered = manifestos.filter((m) => {
    if (year && String(m.election_year) !== year) return false
    if (party && partyById[m.party_id]?.slug !== party) return false
    if (level && partyById[m.party_id]?.level !== level) return false
    return true
  })

  const totalPromises = promises.length
  const totalPages = manifestos.reduce((s, m) => s + (m.pages ?? 0), 0)

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">
      {/* Hero */}
      <section>
        <h1 className="h-page mb-2" style={{ color: "var(--text-primary)" }}>
          Manifestos
        </h1>
        <p className="text-[15px] max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          Every party's central manifesto, indexed, classified by issue, and
          linked back to the official PDF. {manifestos.length} manifestos ·{" "}
          {totalPromises} promises · {totalPages} pages of source material.
        </p>
      </section>

      {/* Filters — three dropdowns. "All" is the default when no value is set. */}
      <section className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          paramKey="year"
          label="Year"
          value={year}
          allLabel="All years"
          preserveParams={{ party, level }}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
        />
        <FilterDropdown
          paramKey="level"
          label="Level"
          value={level}
          allLabel="Central + state"
          preserveParams={{ year, party }}
          options={[
            { value: "national", label: "Central (national)" },
            { value: "state",    label: "State / regional" },
          ]}
        />
        <FilterDropdown
          paramKey="party"
          label="Party"
          value={party}
          allLabel="All parties"
          preserveParams={{ year, level }}
          options={partiesWithManifestos.map((p) => ({
            value: p.slug,
            label: p.short_name ?? p.name,
            color: p.color_hex,
          }))}
        />
        {(year || party || level) && (
          <Link
            href="/manifestos"
            className="text-[11px] px-2 py-1 rounded-[3px]"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: "none",
            }}
          >
            Clear filters
          </Link>
        )}
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((m) => {
          const p = partyById[m.party_id]
          const counts = promiseCount[m.id] ?? { total: 0, headline: 0 }
          const partyColor = p?.color_hex ?? "var(--accent)"
          return (
            <article
              key={m.id}
              className="rounded-[6px] overflow-hidden flex flex-col"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Party color — 1px desaturated band (Linear discipline: tiny accent, not loud chrome) */}
              <div style={{ height: 1, background: partyColor, opacity: 0.7 }} />

              <div className="p-5 flex-1 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] uppercase tracking-[0.07em] px-1.5 py-0.5 rounded-[2px]"
                        style={{
                          background: `${partyColor}22`,
                          color: partyColor,
                          border: `1px solid ${partyColor}55`,
                          fontVariationSettings: fontWeights.medium,
                        }}
                      >
                        {p?.short_name ?? "—"}
                      </span>
                      <span
                        className="text-[11px] font-mono"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {m.election_type === "lok_sabha" ? "Lok Sabha" : m.election_type} ·{" "}
                        {m.election_year}
                      </span>
                    </div>
                    <h2
                      className="text-[15px] leading-snug"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.012em", fontVariationSettings: fontWeights.medium }}
                    >
                      {m.title}
                    </h2>
                    <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {p?.name}
                    </p>
                  </div>
                </div>

                {/* Stats row */}
                <div
                  className="grid grid-cols-3 gap-3 py-3"
                  style={{
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                      Promises
                    </div>
                    <div className="text-[16px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                      {counts.total}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                      Headline
                    </div>
                    <div className="text-[16px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                      {counts.headline}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                      Pages
                    </div>
                    <div className="text-[16px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                      {m.pages ?? "—"}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    href={`/manifestos/${m.id}`}
                    className="flex-1 h-9 px-3 rounded-[6px] text-[12px] inline-flex items-center justify-between transition-colors"
                    style={{
                      background: "var(--bg-elevated-2)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontVariationSettings: fontWeights.medium,
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FileText size={12} /> Read promises
                    </span>
                    <ArrowRight size={12} style={{ color: "var(--text-tertiary)" }} />
                  </Link>
                  {m.source_url && (
                    <a
                      href={m.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-[var(--radius-card)] text-[12px] inline-flex items-center gap-1.5 transition-colors"
                      style={{
                        // Linear discipline: tertiary monochrome button (not 12 accent buttons on screen).
                        background: "var(--bg-elevated-2)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontVariationSettings: fontWeights.medium,
                      }}
                      title={`Download or view the original PDF (${m.pages ?? "?"} pages)`}
                    >
                      {m.source_url.endsWith(".pdf") ? (
                        <>
                          <Download size={12} /> PDF
                        </>
                      ) : (
                        <>
                          <ExternalLink size={12} /> Source
                        </>
                      )}
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {filtered.length === 0 && (
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          No manifestos match this filter.
        </p>
      )}

      {/* Source caveat */}
      <section
        className="rounded-[6px] p-4 text-[12px] leading-relaxed"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>How this works.</strong>{" "}
        Every manifesto link goes to the party's official source PDF. Promises
        are extracted, categorised by issue, and tagged with their page
        reference back to the original document — so you can verify every line
        against the source material. Status ratings (Promise Kept / Broken /
        In the works / Compromise / Stalled) appear on individual promise
        pages once editorial review concludes.
      </section>
    </div>
  )
}
