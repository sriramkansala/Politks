// /manifestos/[id] — Full manifesto view: header, download CTA, all promises
// grouped by category. Headline promises pinned at top.

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Download, ExternalLink, FileText, Star } from "lucide-react"
import { createPublicClient } from "@/lib/db/server"
import { statusMeta, type PromiseStatus } from "@/lib/tokens"
import type { Manifesto, Party, PromiseRow } from "@/lib/db/types"
import { formatTarget, formatIndianNumber } from "@/lib/format"
import { fontWeights } from "@/lib/font-weight"
import { AnimateIn } from "@/components/ui/animate-in"

export const revalidate = 21600

export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase.from("manifestos").select("id")
  return (data ?? []).map((m: { id: string }) => ({ id: m.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("manifestos")
    .select("title")
    .eq("id", id)
    .maybeSingle()
  const row = data as { title?: string } | null
  return { title: row?.title ? `${row.title} · BMW` : "Manifesto · BMW" }
}

function StatusPill({ status }: { status: PromiseStatus }) {
  const meta = statusMeta[status]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.04em] rounded-[2px]"
      style={{ color: meta.color, background: meta.bg, fontVariationSettings: fontWeights.medium }}
    >
      {meta.label}
    </span>
  )
}

function PromiseCard({
  p,
  partyColor,
}: {
  p: PromiseRow
  partyColor: string
}) {
  return (
    <article
      className="p-4 rounded-[var(--radius-card)] flex flex-col gap-2"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        // Linear-mono: headline status conveyed via the star icon + dot, not a thick border
      }}
      id={p.id}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {p.is_headline && (
            <Star size={11} style={{ color: partyColor }} fill={partyColor} />
          )}
          <h3
            className="text-[14px] leading-tight min-w-0"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
          >
            {p.title}
          </h3>
        </div>
        <StatusPill status={p.status} />
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {p.text}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 mt-1">
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-[2px] uppercase tracking-[0.05em]"
          style={{
            background: "var(--bg-elevated-2)",
            color: "var(--text-tertiary)",
            border: "1px solid var(--border)",
          }}
        >
          {p.category.replace(/_/g, " ")}
        </span>
        {p.tags?.slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded-[2px]"
            style={{
              color: "var(--text-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            {t}
          </span>
        ))}
        {p.target_metric && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-[2px] font-mono"
            style={{
              color: "var(--text-primary)",
              background: "var(--bg-elevated-2)",
              border: "1px solid var(--border)",
            }}
            title={`Quantified target: ${formatIndianNumber(p.target_metric.value)} ${p.target_metric.unit}`}
          >
            {formatTarget(
              p.target_metric.value,
              p.target_metric.unit,
              p.target_metric.deadline_year ?? null
            )}
          </span>
        )}
        {p.page_ref != null && (
          <span className="text-[10px]" style={{ color: "var(--text-disabled)" }}>
            · p. {p.page_ref}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <Link
          href={`/promises/${p.id}`}
          className="text-[11px] inline-flex items-center gap-1 transition-colors"
          style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
        >
          View evidence →
        </Link>
      </div>
    </article>
  )
}

export default async function ManifestoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createPublicClient()

  const [{ data: manifesto }, { data: promisesRaw }] = await Promise.all([
    supabase.from("manifestos").select("*").eq("id", id).maybeSingle(),
    supabase.from("promises").select("*").eq("manifesto_id", id).order("is_headline", { ascending: false }),
  ])

  const m = manifesto as Manifesto | null
  if (!m) notFound()

  const { data: partyRaw } = await supabase.from("parties").select("*").eq("id", m.party_id).maybeSingle()
  const party = partyRaw as Party | null
  const partyColor = party?.color_hex ?? "var(--accent)"

  const promises = (promisesRaw ?? []) as PromiseRow[]
  const headline = promises.filter((p) => p.is_headline)
  const others = promises.filter((p) => !p.is_headline)

  // Group "others" by category
  const byCategory: Record<string, PromiseRow[]> = {}
  for (const p of others) {
    (byCategory[p.category] ??= []).push(p)
  }
  const categories = Object.keys(byCategory).sort()

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/manifestos"
        className="inline-flex items-center gap-1 text-[12px] transition-colors hover:text-[var(--text-primary)]"
        style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
      >
        <ArrowLeft size={12} /> All manifestos
      </Link>

      {/* Header */}
      <AnimateIn>
      <section
        className="rounded-[6px] overflow-hidden"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <div style={{ height: 4, background: partyColor }} />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {party && (
              <span
                className="text-[10px] uppercase tracking-[0.07em] px-2 py-0.5 rounded-[2px]"
                style={{
                  background: `${partyColor}22`,
                  color: partyColor,
                  border: `1px solid ${partyColor}55`,
                  fontVariationSettings: fontWeights.medium,
                }}
              >
                {party.short_name ?? party.name}
              </span>
            )}
            <span className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>
              {m.election_type === "lok_sabha" ? "Lok Sabha" : m.election_type} · {m.election_year}
            </span>
            <span className="text-[11px] font-mono" style={{ color: "var(--text-disabled)" }}>
              ·  {m.language.toUpperCase()}  ·  {m.pages ?? "?"} pages
            </span>
          </div>
          <h1
            className="text-heading-xl mb-2"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.022em" }}
          >
            {m.title}
          </h1>
          {party && (
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
              {party.name}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <div
              className="p-3 rounded-[6px]"
              style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                Total promises
              </div>
              <div className="text-[20px] mt-0.5" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                {promises.length}
              </div>
            </div>
            <div
              className="p-3 rounded-[6px]"
              style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                Headline
              </div>
              <div className="text-[20px] mt-0.5" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                {headline.length}
              </div>
            </div>
            <div
              className="p-3 rounded-[6px]"
              style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                Categories
              </div>
              <div className="text-[20px] mt-0.5" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                {new Set(promises.map((p) => p.category)).size}
              </div>
            </div>
            <div
              className="p-3 rounded-[6px]"
              style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>
                Quantified
              </div>
              <div className="text-[20px] mt-0.5" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
                {promises.filter((p) => p.target_metric).length}
              </div>
            </div>
          </div>

          {/* Download CTAs */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {m.source_url && (
              <>
                <a
                  href={m.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 rounded-[6px] text-[12px] inline-flex items-center gap-1.5 transition-colors"
                  style={{ background: "var(--accent)", color: "var(--text-on-accent)", textDecoration: "none", fontVariationSettings: fontWeights.medium }}
                >
                  {m.source_url.endsWith(".pdf") ? (
                    <>
                      <Download size={13} /> Download PDF
                    </>
                  ) : (
                    <>
                      <ExternalLink size={13} /> View source
                    </>
                  )}
                </a>
                <a
                  href={m.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 rounded-[6px] text-[12px] inline-flex items-center gap-1.5 transition-colors"
                  style={{
                    background: "var(--bg-elevated-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    fontVariationSettings: fontWeights.medium,
                  }}
                >
                  <FileText size={13} /> Read in browser
                </a>
              </>
            )}
            {party && (
              <Link
                href={`/parties/${party.slug}`}
                className="h-9 px-4 rounded-[6px] text-[12px] inline-flex items-center gap-1 transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Party page →
              </Link>
            )}
          </div>
        </div>
      </section>
      </AnimateIn>

      {/* Verification trust banner */}
      <AnimateIn delay={0.05}>
      <section
        className="rounded-[var(--radius-card)] p-4"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderLeft: `3px solid var(--status-compromise)`,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-block rounded-full"
            style={{ width: 8, height: 8, background: "var(--status-compromise)" }}
          />
          <span
            className="text-[11px] uppercase tracking-[0.08em]"
            style={{ color: "var(--text-secondary)", fontVariationSettings: "'wght' 590" }}
          >
            How we rate these promises
          </span>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Each promise's status (Kept / Broken / In the works / Compromise / Stalled) is set by an{" "}
          <strong style={{ color: "var(--text-primary)" }}>editorial overlay</strong> in{" "}
          <code style={{ color: "var(--text-tertiary)" }}>lib/db/promiseStatuses.ts</code>. Source URLs
          are checked automatically by{" "}
          <code style={{ color: "var(--text-tertiary)" }}>scripts/verify-promise-sources.mjs</code> — if
          a citation 404s or doesn't contain the claim keywords, the rating is{" "}
          <strong style={{ color: "var(--text-primary)" }}>reverted to Not Yet Rated</strong>. Click any
          promise to see its evidence quality (verified / unverified / no_evidence), the HTTP status of
          each source link, and whether the claim keywords were found on that page. AI-generated
          claims with no working source link should not be relied on without verification.
        </p>
      </section>
      </AnimateIn>

      {/* Headline promises */}
      {headline.length > 0 && (
        <AnimateIn delay={0.1}>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
              Headline promises
            </h2>
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {headline.length} flagship pledges
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {headline.map((p) => (
              <PromiseCard key={p.id} p={p} partyColor={partyColor} />
            ))}
          </div>
        </AnimateIn>
      )}

      {/* By category */}
      {categories.length > 0 && (
        <AnimateIn delay={0.15} className="space-y-6">
          <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
            All promises by category
          </h2>
          {categories.map((cat) => (
            <div key={cat}>
              <h3
                className="text-[12px] uppercase tracking-[0.07em] mb-2"
                style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
              >
                {cat.replace(/_/g, " ")} · {byCategory[cat].length}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {byCategory[cat].map((p) => (
                  <PromiseCard key={p.id} p={p} partyColor={partyColor} />
                ))}
              </div>
            </div>
          ))}
        </AnimateIn>
      )}

      {/* Empty state */}
      {promises.length === 0 && (
        <AnimateIn>
        <section
          className="rounded-[6px] p-6 text-[13px]"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-tertiary)" }}
        >
          No promises extracted for this manifesto yet. Download the source PDF
          above to read the document directly.
        </section>
        </AnimateIn>
      )}

      {/* Caveat */}
      <AnimateIn delay={0.2}>
      <section
        className="rounded-[6px] p-4 text-[12px] leading-relaxed"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>Sourcing.</strong>{" "}
        Promises are extracted verbatim or in lightly-paraphrased form from the
        party's official source document, with page references where available.
        Status ratings (Kept / Broken / In the works / Compromise / Stalled)
        follow the PolitiFact taxonomy and are updated as evidence emerges.
        Every promise links to a dedicated evidence page where sources are
        listed.
      </section>
      </AnimateIn>
    </div>
  )
}
