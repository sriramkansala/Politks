import { notFound } from "next/navigation"
import { StatusPill } from "@/components/promises/StatusPill"
import { ExternalLink, Clock, FileText } from "lucide-react"
import type { PromiseStatus } from "@/lib/db/types"
import { statusMeta } from "@/lib/tokens"

export const revalidate = 21600

// Flattened sample data drawn from party pages for standalone promise detail
const SAMPLE_PROMISES: Record<string, {
  id: string
  title: string
  text: string
  category: string
  status: PromiseStatus
  geography: string
  page_ref: number | null
  success_criteria: string
  party: string
  partySlug: string
  manifesto: string
  election_year: number
  sources: Array<{ title: string; publisher: string; url: string; kind: string; published_at: string }>
  status_history: Array<{ from: PromiseStatus | null; to: PromiseStatus; rationale: string; date: string }>
}> = {
  "aap-1": {
    id: "aap-1",
    title: "Free 300 units of electricity per month to all households",
    text: "The AAP government will ensure that every Delhi household receives 300 units of electricity free every month, reducing the burden on the common family.",
    category: "energy",
    status: "promise_kept",
    geography: "DL",
    page_ref: 3,
    success_criteria: "Delhi government electricity bills show zero charges for first 200 units (stepped: 0 for ≤200 units, subsidised for 201–400), as verified by DERC tariff orders.",
    party: "Aam Aadmi Party",
    partySlug: "aap",
    manifesto: "AAP Delhi Manifesto 2020",
    election_year: 2020,
    sources: [
      {
        title: "Delhi electricity subsidy: DERC tariff order FY2022-23",
        publisher: "Delhi Electricity Regulatory Commission",
        url: "https://www.derc.gov.in",
        kind: "gov_data",
        published_at: "2022-06-01",
      },
      {
        title: "Free power in Delhi: 5 years on, has it delivered?",
        publisher: "The Hindu",
        url: "https://www.thehindu.com",
        kind: "news_article",
        published_at: "2025-03-10",
      },
    ],
    status_history: [
      { from: null, to: "not_yet_rated", rationale: "Promise indexed from manifesto.", date: "2020-02-01" },
      { from: "not_yet_rated", to: "in_the_works", rationale: "Subsidy scheme launched for households ≤200 units.", date: "2020-06-15" },
      { from: "in_the_works", to: "promise_kept", rationale: "Full 200-unit free slab in force; 201–400 unit slab at 50% subsidy. DERC order confirms policy operationalised.", date: "2022-09-01" },
    ],
  },
}

export default async function PromisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const promise = SAMPLE_PROMISES[id]

  if (!promise) {
    return (
      <>
        <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
          <div
            className="rounded-[6px] px-6 py-10 text-center"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <p className="text-body" style={{ color: "var(--text-secondary)" }}>
              Promise not found. It may not have been ingested yet.
            </p>
          </div>
        </div>
      </>
    )
  }

  const meta = statusMeta[promise.status]

  return (
    <>
      <div className="px-6 py-8 max-w-[860px] mx-auto space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1
              className="text-heading leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              {promise.title}
            </h1>
            <StatusPill status={promise.status} className="mt-1" />
          </div>
          <div className="flex items-center gap-3 text-caption" style={{ color: "var(--text-secondary)" }}>
            <span>{promise.party}</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>{promise.manifesto}</span>
            {promise.page_ref && (
              <>
                <span style={{ color: "var(--border-strong)" }}>·</span>
                <span className="flex items-center gap-0.5">
                  <FileText size={11} strokeWidth={1.5} /> p.{promise.page_ref}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Verbatim quote */}
        <div
          className="rounded-[6px] px-5 py-4"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderLeft: `3px solid ${meta.color}`,
          }}
        >
          <p className="text-caption uppercase tracking-wide mb-2" style={{ color: "var(--text-tertiary)" }}>
            Verbatim from manifesto
          </p>
          <p className="text-body italic" style={{ color: "var(--text-secondary)" }}>
            "{promise.text}"
          </p>
        </div>

        {/* Success criteria */}
        <div
          className="rounded-[6px] px-5 py-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <p className="text-caption uppercase tracking-wide mb-2" style={{ color: "var(--text-tertiary)" }}>
            Success Criteria
          </p>
          <p className="text-body" style={{ color: "var(--text-primary)" }}>
            {promise.success_criteria}
          </p>
        </div>

        {/* Status timeline */}
        <div>
          <h2 className="text-subheading mb-3" style={{ color: "var(--text-primary)" }}>
            Status History
          </h2>
          <div className="space-y-2">
            {promise.status_history.map((entry, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 rounded-[6px]"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <Clock size={13} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.from && <StatusPill status={entry.from} />}
                    {entry.from && <span style={{ color: "var(--text-tertiary)" }}>→</span>}
                    <StatusPill status={entry.to} />
                    <span className="text-caption ml-auto" style={{ color: "var(--text-tertiary)" }}>
                      {entry.date}
                    </span>
                  </div>
                  <p className="text-caption" style={{ color: "var(--text-secondary)" }}>
                    {entry.rationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        {promise.sources.length > 0 && (
          <div>
            <h2 className="text-subheading mb-3" style={{ color: "var(--text-primary)" }}>
              Evidence
            </h2>
            <div
              className="rounded-[6px] overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              {promise.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
                  style={i < promise.sources.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px]" style={{ color: "var(--text-primary)" }}>
                      {source.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-caption" style={{ color: "var(--text-secondary)" }}>
                        {source.publisher}
                      </span>
                      <span
                        className="text-[10px] uppercase font-[510] tracking-wide px-1.5 py-0.5 rounded-[2px]"
                        style={{ background: "var(--bg-elevated-2)", color: "var(--text-tertiary)" }}
                      >
                        {source.kind.replace(/_/g, " ")}
                      </span>
                      <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                        {source.published_at}
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={13} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
