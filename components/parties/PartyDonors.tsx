// Top declared donor receipts: electoral bonds, electoral trusts, corporate
// and individual contributions. Amounts Indianised via formatINR.
//
// Source field is rendered as a link if present, otherwise a small "pending"
// note — never a fabricated URL.

import { ExternalLink } from "lucide-react"
import type { PartyDonor } from "@/lib/db/partyProfile"
import { formatINR } from "@/lib/format"
import { PartyEmptyState } from "./PartyEmptyState"
import { fontWeights } from "@/lib/font-weight"

const KIND_LABELS: Record<PartyDonor["kind"], string> = {
  electoral_bond: "Electoral bond",
  electoral_trust: "Electoral trust",
  corporate: "Corporate",
  individual: "Individual",
  other: "Other",
}

export function PartyDonors({
  donors,
  partyColor,
}: {
  donors: PartyDonor[]
  partyColor: string
}) {
  if (!donors.length) return <PartyEmptyState section="Donor" />

  const sorted = [...donors].sort((a, b) => b.amount_inr - a.amount_inr)

  return (
    <div className="space-y-2">
      {sorted.map((d, i) => (
        <article
          key={`${d.donor}-${d.fy}-${i}`}
          className="p-3 rounded-[6px]"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[2px]"
                  style={{
                    color: partyColor,
                    background: `${partyColor}1A`,
                    border: `1px solid ${partyColor}55`,
                  }}
                >
                  {KIND_LABELS[d.kind]}
                </span>
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  FY {d.fy}
                </span>
              </div>
              <h3
                className="text-[14px] leading-snug"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.011em", fontVariationSettings: fontWeights.medium }}
              >
                {d.donor}
              </h3>
              {d.note && (
                <p
                  className="text-[12px] mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {d.note}
                </p>
              )}
              {d.source_url ? (
                <a
                  href={d.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] mt-1.5"
                  style={{ color: "var(--accent)", textDecoration: "none" }}
                >
                  Source <ExternalLink size={10} strokeWidth={1.5} />
                </a>
              ) : d.source_pending ? (
                <span
                  className="inline-block text-[10px] mt-1.5 uppercase tracking-wide"
                  style={{ color: "var(--text-disabled)" }}
                >
                  Source pending
                </span>
              ) : null}
            </div>
            <div
              className="text-[16px] font-mono shrink-0"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
            >
              {formatINR(d.amount_inr)}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
