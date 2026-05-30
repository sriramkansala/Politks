// Aggregate ADR/MyNeta personnel stats across a party's MPs (and MLAs, where
// available). Computed on the server from STATIC_MPS_ALL — we don't fabricate
// aggregates; if no MPs for the party have ADR fields populated, we say so.
//
// Stats shown:
//   - Total representatives
//   - % with any criminal cases declared
//   - % with serious criminal cases (IPC: murder, kidnap, etc.)
//   - Top offenders by case count (top 5)
//   - Crorepati share
//
// MyNeta is the underlying source; PRS aggregates / ADR analyses are linked
// in the page-level caveat block (so we don't repeat them here).

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { Mp } from "@/lib/db/types"
import { formatINR } from "@/lib/format"
import { PartyEmptyState } from "./PartyEmptyState"
import { fontWeights } from "@/lib/font-weight"

interface Props {
  mps: Mp[]
  partyColor: string
}

export function PartyPersonnelStats({ mps, partyColor }: Props) {
  const total = mps.length
  if (total === 0) return <PartyEmptyState section="Personnel" />

  const withAdr = mps.filter(
    (m) =>
      m.criminal_cases_any != null ||
      m.criminal_cases_serious != null ||
      m.assets_inr != null,
  )

  if (withAdr.length === 0) {
    return (
      <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
        ADR/MyNeta data not yet wired for this party's representatives. Tracking{" "}
        {total} MP{total === 1 ? "" : "s"} from PRS rosters; affidavit ingestion
        in progress.
      </p>
    )
  }

  const anyCases = withAdr.filter((m) => (m.criminal_cases_any ?? 0) > 0).length
  const seriousCases = withAdr.filter(
    (m) => (m.criminal_cases_serious ?? 0) > 0,
  ).length
  const crorepatis = withAdr.filter((m) => m.is_crorepati === true).length

  const anyPct = Math.round((anyCases / withAdr.length) * 100)
  const seriousPct = Math.round((seriousCases / withAdr.length) * 100)
  const crorepatiPct = Math.round((crorepatis / withAdr.length) * 100)

  const totalAssets = withAdr.reduce((s, m) => s + (m.assets_inr ?? 0), 0)
  const avgAssets = totalAssets / withAdr.length

  const topOffenders = [...withAdr]
    .filter((m) => (m.criminal_cases_any ?? 0) > 0)
    .sort((a, b) => (b.criminal_cases_any ?? 0) - (a.criminal_cases_any ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-5">
      {/* Top stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard label="Representatives" value={String(total)} hint="PRS roster" />
        <StatCard
          label="With criminal cases"
          value={`${anyPct}%`}
          hint={`${anyCases} of ${withAdr.length} with affidavits`}
          tone={anyPct >= 30 ? "var(--status-broken)" : undefined}
        />
        <StatCard
          label="Serious (IPC) cases"
          value={`${seriousPct}%`}
          hint={`${seriousCases} of ${withAdr.length}`}
          tone={seriousPct >= 15 ? "var(--status-broken)" : undefined}
        />
        <StatCard
          label="Crorepati share"
          value={`${crorepatiPct}%`}
          hint={`avg assets ${formatINR(avgAssets)}`}
        />
      </div>

      {/* Top offenders */}
      {topOffenders.length > 0 && (
        <section>
          <h3
            className="text-[11px] uppercase tracking-[0.06em] mb-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Top by declared case count
          </h3>
          <ul
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            {topOffenders.map((mp, i) => (
              <li
                key={mp.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                <span
                  className="text-[11px] font-mono w-6"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {mp.prs_slug ? (
                    <Link
                      href={`/mp?slug=${mp.prs_slug}`}
                      className="text-[13px]"
                      style={{
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        fontVariationSettings: fontWeights.medium,
                      }}
                    >
                      {mp.name}
                    </Link>
                  ) : (
                    <span
                      className="text-[13px]"
                      style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
                    >
                      {mp.name}
                    </span>
                  )}
                  <span
                    className="text-[11px] ml-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {mp.constituency ?? "—"}
                    {mp.state_code ? ` · ${mp.state_code}` : ""}
                  </span>
                </div>
                <span
                  className="text-[12px] font-mono shrink-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {mp.criminal_cases_any} case
                  {mp.criminal_cases_any === 1 ? "" : "s"}
                  {(mp.criminal_cases_serious ?? 0) > 0 && (
                    <>
                      {" "}
                      <span style={{ color: "var(--status-broken)" }}>
                        ({mp.criminal_cases_serious} serious)
                      </span>
                    </>
                  )}
                </span>
                {mp.myneta_url && (
                  <a
                    href={mp.myneta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}
                    title="MyNeta affidavit"
                  >
                    <ExternalLink size={11} strokeWidth={1.5} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {withAdr.length < total && (
        <p className="text-[11px]" style={{ color: "var(--text-disabled)" }}>
          Affidavit data available for {withAdr.length} of {total} representatives;
          coverage expands as MyNeta records are ingested.
        </p>
      )}

      <div className="hidden" data-party-color={partyColor} />
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone?: string
}) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.06em]"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </div>
      <div
        className="text-[20px] mt-0.5"
        style={{ color: tone ?? "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
      >
        {value}
      </div>
      {hint && (
        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          {hint}
        </div>
      )}
    </div>
  )
}
