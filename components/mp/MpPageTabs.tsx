"use client"

// MP dossier 6-tab layout: Overview · Questions · Criminal · Education · Financials · Interests
// Uses the project's custom Tabs/TabItem/TabPanel (fluid-functionalism + Radix).
// All colour tokens follow UI_RULES.md — no bespoke hex.

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { springs } from "@/lib/springs"
import { HonestyCard } from "@/components/mp/HonestyCard"
import { AttendanceHeatmap } from "@/components/mp/AttendanceHeatmap"
import { InterestsTab } from "@/components/mp/InterestsTab"
import { fontWeights } from "@/lib/font-weight"
import { formatINR } from "@/lib/format"
import type { Mp } from "@/lib/db/types"

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionHeading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
        {children}
      </h2>
      {sub && (
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function StatRow({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <div className="text-right">
        <span className="text-[14px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
          {value ?? "—"}
        </span>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</div>}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>{message}</p>
    </div>
  )
}

function ComparisonBar({
  label, value, reference, unit = "",
}: { label: string; value: number | null | undefined; reference: number | null | undefined; unit?: string }) {
  if (value == null || reference == null) return null
  const max = Math.max(value, reference) * 1.1 || 1
  const wA = Math.min(100, (value / max) * 100)
  const wB = Math.min(100, (reference / max) * 100)
  const tone = value >= reference ? "var(--status-kept)" : "var(--status-broken)"
  return (
    <div className="flex flex-col gap-1.5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          MP <strong style={{ color: tone }}>{value}{unit}</strong> · nat avg {reference}{unit}
        </span>
      </div>
      <div className="space-y-1">
        <div className="h-1.5 rounded-[1px] overflow-hidden" style={{ background: "var(--bg-elevated-2)" }}>
          <div style={{ width: `${wA}%`, height: "100%", background: tone }} />
        </div>
        <div className="h-1.5 rounded-[1px] overflow-hidden" style={{ background: "var(--bg-elevated-2)" }}>
          <div style={{ width: `${wB}%`, height: "100%", background: "var(--border-strong)" }} />
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ mp }: { mp: Mp }) {
  return (
    <AnimateIn stagger className="space-y-6">
      <AnimateItem><HonestyCard mp={mp} /></AnimateItem>
      <AnimateItem><AttendanceHeatmap mp={mp} /></AnimateItem>

      {/* vs national average */}
      <AnimateItem>
        <section>
          <SectionHeading sub="PRS 17th/18th LS aggregates">vs national average</SectionHeading>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <ComparisonBar label="Attendance" value={mp.attendance_pct} reference={mp.national_avg_attendance} unit="%" />
            <ComparisonBar label="Questions asked" value={mp.questions_asked} reference={mp.national_avg_questions} />
            <ComparisonBar label="Debates participated" value={mp.debates_participated} reference={mp.national_avg_debates} />
          </div>
        </section>
      </AnimateItem>
    </AnimateIn>
  )
}

// ─── Tab: Questions ───────────────────────────────────────────────────────────

function QuestionsTab({ mp }: { mp: Mp }) {
  const questions = mp.questions_detail ?? []

  return (
    <AnimateIn stagger className="space-y-4">
      <AnimateItem>
        <div className="flex items-baseline gap-3">
          <SectionHeading sub="Parliamentary questions tabled in Lok Sabha">
            Questions asked
          </SectionHeading>
          <span
            className="text-[11px] tabular-nums px-1.5 py-0.5 rounded-lg mb-4"
            style={{ background: "var(--bg-elevated-2)", color: "var(--text-tertiary)", border: "1px solid var(--border)" }}
          >
            {mp.questions_asked ?? questions.length} total
          </span>
        </div>
      </AnimateItem>

      <AnimateItem>
        {questions.length === 0 ? (
          <EmptyState message="Detailed question records being compiled for this MP." />
        ) : (
          <div className="space-y-0" style={{ borderTop: "1px solid var(--border)" }}>
            {questions.map((q, i) => (
              <motion.div
                key={i}
                whileHover={{ backgroundColor: "var(--hover-row)" }}
                transition={springs.snap}
                className="flex flex-col gap-1 py-3 px-1 rounded-lg"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="text-[13px] leading-snug flex-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {q.subject}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[var(--radius-tag)] shrink-0 whitespace-nowrap"
                    style={{
                      color: q.type === "starred" ? "var(--status-kept)" : "var(--text-tertiary)",
                      background: q.type === "starred"
                        ? "color-mix(in srgb, var(--status-kept) 12%, transparent)"
                        : "var(--bg-elevated-2)",
                      border: `1px solid ${q.type === "starred" ? "color-mix(in srgb, var(--status-kept) 30%, transparent)" : "var(--border)"}`,
                      fontVariationSettings: fontWeights.medium,
                    }}
                  >
                    {q.type === "starred" ? "★ Starred" : "Unstarred"}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    {q.ministry}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-disabled)" }}>·</span>
                  <span className="text-[11px] font-mono tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                    {q.date}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-disabled)" }}>·</span>
                  <span className="text-[11px]" style={{ color: "var(--text-disabled)" }}>
                    {q.session}
                  </span>
                  {q.source && (
                    <a
                      href={q.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[10px] ml-auto"
                      style={{ color: "var(--accent)", textDecoration: "none" }}
                    >
                      Source <ExternalLink size={9} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimateItem>

      {questions.length > 0 && questions.length < (mp.questions_asked ?? 0) && (
        <AnimateItem>
          <p className="text-[11px] text-center pt-2" style={{ color: "var(--text-disabled)" }}>
            Showing {questions.length} of {mp.questions_asked} questions · full list on PRS India
          </p>
        </AnimateItem>
      )}
    </AnimateIn>
  )
}

// ─── Tab: Criminal ────────────────────────────────────────────────────────────

function CriminalTab({ mp }: { mp: Mp }) {
  const cases = mp.criminal_cases_detail ?? []
  const totalAny = mp.criminal_cases_any ?? 0
  const totalSerious = mp.criminal_cases_serious ?? 0

  return (
    <AnimateIn stagger className="space-y-6">
      {/* Summary stat cards */}
      <AnimateItem>
        <AnimateIn stagger className="grid grid-cols-2 gap-3">
          <AnimateItem>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <div className="text-[11px] uppercase tracking-[0.07em] mb-1" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
                Total cases
              </div>
              <div
                className="text-[28px] leading-none"
                style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
              >
                {totalAny}
              </div>
              <div className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                self-declared affidavit
              </div>
            </div>
          </AnimateItem>
          <AnimateItem>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <div className="text-[11px] uppercase tracking-[0.07em] mb-1" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
                Serious cases
              </div>
              <div
                className="text-[28px] leading-none"
                style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
              >
                {totalSerious}
              </div>
              <div className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                murder · rape · kidnap
              </div>
            </div>
          </AnimateItem>
        </AnimateIn>
      </AnimateItem>

      {/* Case list */}
      <AnimateItem>
        <section>
          <SectionHeading sub="Declared in election affidavit — source: MyNeta / ECI">
            Case details
          </SectionHeading>
          {cases.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
                No criminal cases declared
              </p>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                As per self-declared affidavit filed with Election Commission
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cases.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className="text-[13px] leading-snug"
                      style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
                    >
                      {c.offence}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[var(--radius-tag)] shrink-0 whitespace-nowrap"
                      style={{
                        color: "var(--text-secondary)",
                        background: "var(--bg-elevated-2)",
                        border: "1px solid var(--border)",
                        fontVariationSettings: fontWeights.medium,
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {c.section && <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>§ {c.section}</span>}
                    {c.court && <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{c.court}</span>}
                    {c.year && <span className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>{c.year}</span>}
                    {c.is_serious && (
                      <span
                        className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[var(--radius-tag)]"
                        style={{
                          color: "var(--text-secondary)",
                          background: "var(--bg-elevated-2)",
                          border: "1px solid var(--border-strong)",
                        }}
                      >
                        Serious
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </AnimateItem>

      <AnimateItem>
        <p className="text-[11px]" style={{ color: "var(--text-disabled)" }}>
          Criminal records are self-declared by candidates in affidavits filed with the Election Commission of India.
          They reflect charges filed, not convictions. Source: MyNeta / ADR.
        </p>
      </AnimateItem>
    </AnimateIn>
  )
}

// ─── Tab: Education ───────────────────────────────────────────────────────────

function EducationTab({ mp }: { mp: Mp }) {
  const history = mp.education_history ?? []

  return (
    <AnimateIn stagger className="space-y-6">
      {/* Highest level badge */}
      {mp.education_level && (
        <AnimateItem>
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <span className="text-[11px] uppercase tracking-[0.07em]" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
              Highest qualification
            </span>
            <span className="text-[13px]" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
              {mp.education_level}
            </span>
          </div>
        </AnimateItem>
      )}

      <AnimateItem>
        <section>
          <SectionHeading sub="As declared in election affidavit — source: MyNeta / ECI">
            Education history
          </SectionHeading>

          {history.length === 0 ? (
            <EmptyState message="Detailed education history not yet available for this MP." />
          ) : (
            <div className="relative pl-5" style={{ borderLeft: "1px solid var(--border)" }}>
              {history.map((e, i) => (
                <motion.div
                  key={i}
                  className="relative mb-6 last:mb-0"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springs.gentle, delay: i * 0.05 }}
                >
                  {/* Timeline dot */}
                  <span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                      left: -21,
                      top: 5,
                      width: 8,
                      height: 8,
                      background: "var(--accent)",
                      boxShadow: "0 0 0 3px var(--bg-base)",
                    }}
                  />
                  <div
                    className="p-4 rounded-xl"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="text-[14px] leading-snug"
                        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
                      >
                        {e.degree}
                      </h3>
                      {e.year && (
                        <span className="text-[12px] font-mono tabular-nums shrink-0" style={{ color: "var(--text-tertiary)" }}>
                          {e.year}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {e.institution}
                    </p>
                    {e.field && (
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {e.field}
                      </p>
                    )}
                    {e.source && (
                      <a
                        href={e.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] mt-2"
                        style={{ color: "var(--accent)", textDecoration: "none" }}
                      >
                        Source <ExternalLink size={9} strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </AnimateItem>
    </AnimateIn>
  )
}

// ─── Asset Breakdown Chart ───────────────────────────────────────────────────

// Semantic status tokens (UI_RULES §2 — no bespoke hex): net worth reads as
// "kept" (green), liabilities as "broken" (red), gross assets as neutral info.
const ASSET_COLORS = {
  assets:      "var(--status-inworks)", // info — gross declared assets
  liabilities: "var(--status-broken)",  // red  — liabilities
  net:         "var(--status-kept)",     // green — net worth
} as const

function AssetIcon({ kind }: { kind: "assets" | "liabilities" | "net" }) {
  const bg = ASSET_COLORS[kind]

  if (kind === "assets") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full shrink-0"
        style={{ width: 22, height: 22, background: bg }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 2v6M2 5h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    )
  }
  if (kind === "liabilities") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full shrink-0"
        style={{ width: 22, height: 22, background: bg }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 5h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0"
      style={{ width: 22, height: 22, background: bg }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 5.5l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function AssetBreakdownChart({ mp }: { mp: Mp }) {
  const assets      = mp.assets_inr ?? 0
  const liabilities = mp.liabilities_inr ?? 0
  const net         = assets > 0 ? assets - liabilities : null

  // Stacked bar proportions (net-worth = green left, liabilities = amber right)
  const liabPct = assets > 0 ? Math.min(100, (liabilities / assets) * 100) : 0
  const netPct  = assets > 0 ? Math.max(0, 100 - liabPct) : 0

  const rows: { kind: "assets" | "liabilities" | "net"; label: string; value: number | null }[] = [
    { kind: "assets",      label: "Total declared assets",            value: mp.assets_inr ?? null    },
    { kind: "liabilities", label: "Total liabilities",                value: mp.liabilities_inr ?? null },
    { kind: "net",         label: "Net worth (assets − liabilities)", value: net              },
  ]

  return (
    <section>
      {/* Header: title + subtitle left, "Amount" label right */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-[15px] leading-tight"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold, letterSpacing: "-0.013em" }}
          >
            Asset breakdown
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Self-declared affidavit — MyNeta / ECI
          </p>
        </div>
        <span
          className="text-[13px]"
          style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
        >
          Amount
        </span>
      </div>

      {/* Stacked bar — 14px tall, gap-px + dark bg = thin dark divider between segments */}
      {assets > 0 && (
        <div
          className="flex gap-[2px] rounded-lg overflow-hidden mb-2"
          style={{ height: 14, background: "var(--bg-base)", border: "1px solid var(--border-strong)" }}
        >
          {netPct > 0 && (
            <div style={{ width: `${netPct}%`, background: ASSET_COLORS.net, flexShrink: 0 }} />
          )}
          {liabPct > 0 && (
            <div style={{ width: `${liabPct}%`, background: ASSET_COLORS.liabilities, flexShrink: 0 }} />
          )}
        </div>
      )}

      {/* Row list — py-3 matches the dossier StatRow rhythm, dashed separator */}
      <div>
        {rows.map(({ kind, label, value }, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3"
            style={{
              borderBottom: i < rows.length - 1 ? "1px dashed var(--border)" : undefined,
            }}
          >
            <div className="flex items-center gap-3.5">
              <AssetIcon kind={kind} />
              <span
                className="text-[13px]"
                style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}
              >
                {label}
              </span>
            </div>
            <span
              className="text-[14px] tabular-nums"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
            >
              {formatINR(value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Tab: Financials ──────────────────────────────────────────────────────────

function FinancialsTab({ mp }: { mp: Mp }) {
  const unspentWarning =
    mp.mplads_unspent_inr != null && mp.mplads_unspent_inr >= 5_00_00_000

  return (
    <AnimateIn stagger className="space-y-6">
      {/* Asset headline */}
      <AnimateItem>
        <AnimateIn stagger className="grid grid-cols-2 gap-3">
          <AnimateItem>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <div className="text-[11px] uppercase tracking-[0.07em] mb-1" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
                Declared assets
              </div>
              <div
                className="text-[28px] leading-none"
                style={{ color: "var(--status-compromise)", fontVariationSettings: fontWeights.semibold }}
              >
                {formatINR(mp.assets_inr)}
              </div>
              {mp.is_crorepati && (
                <div className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>Crorepati</div>
              )}
            </div>
          </AnimateItem>
          <AnimateItem>
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <div className="text-[11px] uppercase tracking-[0.07em] mb-1" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
                Liabilities
              </div>
              <div
                className="text-[28px] leading-none"
                style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
              >
                {formatINR(mp.liabilities_inr)}
              </div>
            </div>
          </AnimateItem>
        </AnimateIn>
      </AnimateItem>

      {/* Detailed breakdown — Issues-Status style */}
      <AnimateItem>
        <AssetBreakdownChart mp={mp} />
      </AnimateItem>

      {/* MPLADS */}
      <AnimateItem>
        <section>
          <SectionHeading sub="Member of Parliament Local Area Development Scheme">
            MPLADS spending
          </SectionHeading>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <StatRow label="Sanctioned" value={formatINR(mp.mplads_sanctioned_inr)} />
            <StatRow label="Released" value={formatINR(mp.mplads_released_inr)} />
            <StatRow label="Spent" value={formatINR(mp.mplads_spent_inr)} />
            <StatRow
              label="Unspent"
              value={
                <span style={{ color: unspentWarning ? "var(--status-broken)" : "var(--text-primary)" }}>
                  {formatINR(mp.mplads_unspent_inr)}
                </span>
              }
              sub={unspentWarning ? "High unspent balance" : undefined}
            />
          </div>
          {unspentWarning && (
            <p className="text-[11px] mt-3" style={{ color: "var(--status-broken)" }}>
              ⚠ Unspent MPLADS funds exceed ₹5 Cr — review recommended.
            </p>
          )}
        </section>
      </AnimateItem>

      <AnimateItem>
        <p className="text-[11px]" style={{ color: "var(--text-disabled)" }}>
          Asset figures are nominal (not CPI-adjusted). MPLADS distinguishes sanctioned, released and spent —
          we show released and unspent. All figures self-declared; not audited.
        </p>
      </AnimateItem>
    </AnimateIn>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const TABS = [
  { value: "overview",   label: "Overview"  },
  { value: "questions",  label: "Questions" },
  { value: "criminal",   label: "Criminal"  },
  { value: "education",  label: "Education" },
  { value: "financials", label: "Financials"},
  { value: "interests",  label: "Interests" },
] as const

export function MpPageTabs({ mp }: { mp: Mp }) {
  return (
    <Tabs defaultValue="overview">
      {/* Tab strip */}
      <div className="mb-8">
        <TabsList className="bg-transparent p-0 gap-1">
          {TABS.map((tab) => (
            <TabItem key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsList>
      </div>

      <TabPanel value="overview">   <OverviewTab   mp={mp} /> </TabPanel>
      <TabPanel value="questions">  <QuestionsTab  mp={mp} /> </TabPanel>
      <TabPanel value="criminal">   <CriminalTab   mp={mp} /> </TabPanel>
      <TabPanel value="education">  <EducationTab  mp={mp} /> </TabPanel>
      <TabPanel value="financials"> <FinancialsTab mp={mp} /> </TabPanel>
      <TabPanel value="interests">  <InterestsTab  mp={mp} /> </TabPanel>
    </Tabs>
  )
}
