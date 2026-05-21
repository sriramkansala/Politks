import { StatusPill } from "@/components/promises/StatusPill"
import { Clock, FileText, ExternalLink } from "lucide-react"
import type { PromiseRow, PromiseStatus, Party, Manifesto } from "@/lib/db/types"
import { createPublicClient } from "@/lib/db/server"
import { getPromiseRating } from "@/lib/db/promiseStatuses"
import { getSourceVerification, type EvidenceQuality } from "@/lib/db/promiseSourceVerification"

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
  sources: Array<{
    title: string
    publisher: string
    url: string
    kind: string
    published_at: string
    /** HTTP status from automated verification (null = not checked). */
    http_status?: number | null
    /** Did URL resolve to 2xx/3xx on verification? */
    reachable?: boolean
    /** Did body text contain claim keywords? (null = no keywords to test) */
    keywords_match?: boolean | null
  }>
  /** Evidence-quality grade for the rating's source set, surfaced as banner. */
  evidence_quality?: EvidenceQuality | null
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

  // 1) Hardcoded sample lookup (legacy "aap-1" demo entries)
  let promise: (typeof SAMPLE_PROMISES)[string] | null = SAMPLE_PROMISES[id] ?? null

  // 2) Real DB lookup against STATIC_PROMISES via the mock supabase client
  if (!promise) {
    const supabase = createPublicClient()
    const { data: row } = await supabase.from("promises").select("*").eq("id", id).maybeSingle()
    if (row) {
      const p = row as PromiseRow
      const { data: m } = await supabase.from("manifestos").select("title,election_year").eq("id", p.manifesto_id!).maybeSingle()
      const { data: pa } = await supabase.from("parties").select("name,slug").eq("id", p.party_id!).maybeSingle()
      const manifesto = (m as Pick<Manifesto, "title" | "election_year"> | null)
      const party = (pa as Pick<Party, "name" | "slug"> | null)
      // Pull editorial source URLs from the rating overlay
      const rating = party?.slug && p.ordinal != null
        ? getPromiseRating(party.slug, p.ordinal)
        : null
      const verification = party?.slug && p.ordinal != null
        ? getSourceVerification(party.slug, p.ordinal)
        : null
      const sources = (rating?.sources ?? []).map((url) => {
        const detail = verification?.details.find((d) => d.url === url)
        return {
          title: new URL(url).hostname.replace(/^www\./, ""),
          publisher: detail?.page_title ?? new URL(url).hostname.replace(/^www\./, ""),
          url,
          kind: url.includes("pib.gov") || url.includes("eci.") || url.includes("gov.in")
            ? "gov_data"
            : "news_article",
          published_at: rating?.rated_at?.slice(0, 10) ?? "",
          http_status: detail?.status ?? null,
          reachable: detail?.reachable ?? false,
          keywords_match: detail?.keywords_match ?? null,
        }
      })
      // Build a minimal status history when we have a rating
      const status_history = rating
        ? [
            {
              from: "not_yet_rated" as PromiseStatus,
              to: rating.status,
              rationale: rating.rationale,
              date: rating.rated_at.slice(0, 10),
            },
          ]
        : []
      promise = {
        id: p.id,
        title: p.title,
        text: p.text,
        category: p.category,
        status: p.status,
        geography: p.geography,
        page_ref: p.page_ref,
        success_criteria:
          p.success_criteria ?? (rating?.rationale ?? "Awaiting editorial review — evidence collection in progress."),
        party: party?.name ?? "Unknown party",
        partySlug: party?.slug ?? "",
        manifesto: manifesto?.title ?? "",
        election_year: manifesto?.election_year ?? 2024,
        sources,
        status_history,
        evidence_quality: verification?.evidence_quality ?? null,
      }
    }
  }

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
          className="rounded-[var(--radius-card)] px-5 py-4"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            // Linear discipline: status is conveyed by the StatusPill, no
            // duplicate 3px accent on the verbatim block itself.
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
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
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

        {/* Evidence Quality banner */}
        {promise.evidence_quality && (
          <div
            className="rounded-[var(--radius-card)] p-4"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${
                promise.evidence_quality === "verified"
                  ? "var(--status-kept)"
                  : promise.evidence_quality === "unverified"
                    ? "var(--status-compromise)"
                    : "var(--status-broken)"
              }`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background:
                    promise.evidence_quality === "verified"
                      ? "var(--status-kept)"
                      : promise.evidence_quality === "unverified"
                        ? "var(--status-compromise)"
                        : "var(--status-broken)",
                }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.08em]"
                style={{ color: "var(--text-secondary)", fontVariationSettings: "'wght' 590" }}
              >
                Evidence quality: {promise.evidence_quality.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {promise.evidence_quality === "verified" && (
                <>
                  At least one cited source URL is reachable AND its page contains the claim keywords on
                  automated check. Click through to read the source directly.
                </>
              )}
              {promise.evidence_quality === "unverified" && (
                <>
                  Cited source URLs are reachable but their pages did NOT contain the claim keywords on
                  automated check. Treat this rating as provisional — the source domain exists but the
                  specific article may have moved or been written by AI from memory. Click through and
                  verify the claim yourself.
                </>
              )}
              {promise.evidence_quality === "no_evidence" && (
                <>
                  No cited source URL is reachable on automated check (all 404 / DNS-fail / timeout). The
                  rating has been reverted to "Not Yet Rated" pending editorial review. Any rationale shown
                  is AI-generated and not currently backed by a working source link.
                </>
              )}
            </p>
          </div>
        )}

        {/* Sources */}
        {promise.sources.length > 0 && (
          <div>
            <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
              Cited sources ({promise.sources.length})
            </h2>
            <div
              className="rounded-[var(--radius-card)] overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              {promise.sources.map((source, i) => {
                const isOk = source.reachable === true
                const kwOk = source.keywords_match === true
                const isDead = source.reachable === false
                return (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-4 py-3 transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
                    style={
                      i < promise.sources.length - 1
                        ? { borderBottom: "1px solid var(--border)" }
                        : undefined
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13px] truncate"
                        style={{
                          color: isDead ? "var(--text-tertiary)" : "var(--text-primary)",
                          textDecoration: isDead ? "line-through" : "none",
                        }}
                      >
                        {source.publisher || source.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                          {source.title}
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                          style={{
                            background: "var(--bg-elevated-2)",
                            color: "var(--text-tertiary)",
                            fontVariationSettings: "'wght' 510",
                          }}
                        >
                          {source.kind.replace(/_/g, " ")}
                        </span>
                        {/* HTTP status badge */}
                        {source.http_status != null && (
                          <span
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px]"
                            style={{
                              background: isOk
                                ? "color-mix(in oklab, var(--status-kept) 16%, transparent)"
                                : "color-mix(in oklab, var(--status-broken) 16%, transparent)",
                              color: isOk ? "var(--status-kept)" : "var(--status-broken)",
                            }}
                            title={
                              isOk ? "URL reachable" : "URL failed verification"
                            }
                          >
                            HTTP {source.http_status}
                          </span>
                        )}
                        {isDead && (
                          <span
                            className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                            style={{
                              background: "color-mix(in oklab, var(--status-broken) 16%, transparent)",
                              color: "var(--status-broken)",
                              fontVariationSettings: "'wght' 590",
                            }}
                          >
                            DEAD LINK
                          </span>
                        )}
                        {/* Keyword match badge */}
                        {kwOk && (
                          <span
                            className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                            style={{
                              background: "color-mix(in oklab, var(--status-kept) 16%, transparent)",
                              color: "var(--status-kept)",
                              fontVariationSettings: "'wght' 590",
                            }}
                            title="Claim keywords found on the source page"
                          >
                            ✓ KEYWORDS MATCH
                          </span>
                        )}
                        {source.reachable && source.keywords_match === false && (
                          <span
                            className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                            style={{
                              background: "color-mix(in oklab, var(--status-compromise) 16%, transparent)",
                              color: "var(--status-compromise)",
                              fontVariationSettings: "'wght' 590",
                            }}
                            title="URL works but the page did not contain claim keywords"
                          >
                            UNCONFIRMED
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink
                      size={13}
                      strokeWidth={1.5}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--text-tertiary)" }}
                    />
                  </a>
                )
              })}
            </div>
            <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>
              Source links are checked automatically by{" "}
              <code style={{ color: "var(--text-secondary)" }}>scripts/verify-promise-sources.mjs</code>{" "}
              against the live web. Status badges reflect the last verification run.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
