// /mp/[slug] — Single MP dossier (BMW-130, 134, 138, 140, 281).
// Sections: HonestyCard → Attendance heatmap → Financials → Compare → Act.

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Mail, Share2 } from "lucide-react"
import { MP_BY_SLUG, STATIC_MPS_BMW } from "@/lib/db/staticMps"
import { HonestyCard } from "@/components/mp/HonestyCard"
import { AttendanceHeatmap } from "@/components/mp/AttendanceHeatmap"
import type { Mp } from "@/lib/db/types"

export async function generateStaticParams() {
  return STATIC_MPS_BMW.map((mp) => ({ slug: mp.prs_slug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mp = MP_BY_SLUG[slug]
  if (!mp) return { title: "MP not found · BMW" }
  return { title: `${mp.name} · ${mp.party_name} · BMW` }
}

import { formatINR as fmtINR } from "@/lib/format"
import { fontWeights } from "@/lib/font-weight"
import { AnimateIn } from "@/components/ui/animate-in"
// fmtINR is now provided by lib/format so /mp dossier shares the same
// Indian-numbering treatment as the rest of the app (no inline divergences).

function SectionCard({
  title,
  children,
  hint,
}: {
  title: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <section
      className="rounded-[6px] p-5"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-subheading" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        {hint && (
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

function ComparisonBar({
  label,
  value,
  reference,
  unit = "",
}: {
  label: string
  value: number | null | undefined
  reference: number | null | undefined
  unit?: string
}) {
  if (value == null || reference == null) return null
  const max = Math.max(value, reference) * 1.1 || 1
  const wA = Math.min(100, (value / max) * 100)
  const wB = Math.min(100, (reference / max) * 100)
  const tone = value >= reference ? "var(--status-kept)" : "var(--status-broken)"
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          MP <strong style={{ color: tone }}>{value}{unit}</strong> · nat avg {reference}{unit}
        </span>
      </div>
      <div className="space-y-1">
        <div className="h-2 rounded-[1px] overflow-hidden" style={{ background: "var(--bg-elevated-2)" }}>
          <div style={{ width: `${wA}%`, height: "100%", background: tone }} />
        </div>
        <div className="h-2 rounded-[1px] overflow-hidden" style={{ background: "var(--bg-elevated-2)" }}>
          <div style={{ width: `${wB}%`, height: "100%", background: "var(--border-strong)" }} />
        </div>
      </div>
    </div>
  )
}

function ActionTile({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: React.ElementType
  title: string
  desc: string
  href?: string
}) {
  const inner = (
    <div
      className="p-4 rounded-[var(--radius-card)] h-full flex flex-col gap-2 transition-colors hover:border-[var(--border-strong)]"
      style={{
        background: "var(--bg-elevated-2)",
        border: "1px solid var(--border)",
      }}
    >
      <Icon size={14} strokeWidth={1.5} style={{ color: "var(--text-tertiary)" }} />
      <div className="text-[13px]" style={{ color: "var(--text-primary)", fontVariationSettings: "'wght' 510" }}>
        {title}
      </div>
      <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        {desc}
      </div>
    </div>
  )
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    )
  }
  return <div>{inner}</div>
}

export default async function MpDossierPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const mp = MP_BY_SLUG[slug] as Mp | undefined
  if (!mp) notFound()

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/mp"
        className="inline-flex items-center gap-1 text-[12px] transition-colors hover:text-[var(--text-primary)]"
        style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
      >
        <ArrowLeft size={12} />
        All legislators
      </Link>

      {/* Honesty card — the headline */}
      <AnimateIn><HonestyCard mp={mp} /></AnimateIn>

      {/* Attendance heatmap */}
      <AnimateIn delay={0.05}><AttendanceHeatmap mp={mp} /></AnimateIn>

      {/* Financials */}
      <AnimateIn delay={0.1}><SectionCard title="Financials" hint="Self-declared affidavit + MPLADS portal">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="text-caption mb-1" style={{ color: "var(--text-tertiary)" }}>
              Declared assets
            </div>
            <div className="text-[18px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
              {fmtINR(mp.assets_inr)}
            </div>
          </div>
          <div>
            <div className="text-caption mb-1" style={{ color: "var(--text-tertiary)" }}>
              Liabilities
            </div>
            <div className="text-[18px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
              {fmtINR(mp.liabilities_inr)}
            </div>
          </div>
          <div>
            <div className="text-caption mb-1" style={{ color: "var(--text-tertiary)" }}>
              MPLADS released
            </div>
            <div className="text-[18px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
              {fmtINR(mp.mplads_released_inr)}
            </div>
          </div>
          <div>
            <div className="text-caption mb-1" style={{ color: "var(--text-tertiary)" }}>
              MPLADS unspent
            </div>
            <div
              className="text-[18px]"
              style={{
                color:
                  mp.mplads_unspent_inr != null && mp.mplads_unspent_inr >= 5_00_00_000
                    ? "var(--status-broken)"
                    : "var(--text-primary)",
                fontVariationSettings: fontWeights.semibold,
              }}
            >
              {fmtINR(mp.mplads_unspent_inr)}
            </div>
          </div>
        </div>
        <p className="text-[11px] mt-4" style={{ color: "var(--text-disabled)" }}>
          Asset figures are nominal (not CPI-adjusted). MPLADS distinguishes sanctioned,
          released and spent — we show released and unspent.
        </p>
      </SectionCard></AnimateIn>

      {/* Compare vs averages */}
      <AnimateIn delay={0.15}><SectionCard title="vs national average" hint="PRS 17th/18th LS aggregates">
        <ComparisonBar
          label="Attendance"
          value={mp.attendance_pct}
          reference={mp.national_avg_attendance}
          unit="%"
        />
        <ComparisonBar
          label="Questions asked"
          value={mp.questions_asked}
          reference={mp.national_avg_questions}
        />
        <ComparisonBar
          label="Debates participated"
          value={mp.debates_participated}
          reference={mp.national_avg_debates}
        />
      </SectionCard></AnimateIn>

      {/* Act tab */}
      <AnimateIn delay={0.2}><SectionCard title="Act" hint="BMW-211 to BMW-225">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ActionTile
            icon={Mail}
            title="Write to this MP"
            desc="Pre-filled letter with their PRS stats auto-attached."
            href={`/act?to=${slug}&template=letter`}
          />
          <ActionTile
            icon={Share2}
            title="Share Honesty Card"
            desc="Generate a 1080×1080 WhatsApp PNG with QR back to source."
            href={`/act?to=${slug}&template=share`}
          />
          <ActionTile
            icon={ExternalLink}
            title="Track this MP"
            desc="Weekly digest of speeches, questions, votes and scheme work."
            href={`/act?to=${slug}&template=subscribe`}
          />
          <ActionTile
            icon={Mail}
            title="File a Question Hour draft"
            desc="Draft a Question Hour query for this MP to file."
            href={`/act?to=${slug}&template=question`}
          />
        </div>
      </SectionCard></AnimateIn>

      {/* Caveats */}
      <AnimateIn delay={0.25} className="text-[11px] leading-relaxed">
        <p style={{ color: "var(--text-disabled)" }}>
          Coverage caveat: This MP is part of the BMW-130 marquee set. Full 543-MP
          coverage from PRS is being ingested. Where a stat is unavailable we show
          “—”, not a zero.
          {(mp.data_sources?.length ?? 0) > 0 && (
            <>
              {" "}Sources:{" "}
              {(mp.data_sources ?? []).map((url, i) => (
                <span key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {new URL(url).hostname}
                  </a>
                  {i < (mp.data_sources!.length - 1) ? " · " : ""}
                </span>
              ))}
              .
            </>
          )}
        </p>
      </AnimateIn>
    </div>
  )
}
