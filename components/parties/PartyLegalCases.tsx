// Legal cases against the party itself (not its members) — ED/CBI/EC/SC
// petitions, deregistration threats, symbol disputes.
//
// Status pill tone driven by case status. Sources are real URLs only;
// pending cases mark themselves accordingly rather than inventing citations.

import { ExternalLink } from "lucide-react"
import type { PartyLegalCase } from "@/lib/db/partyProfile"
import { PartyEmptyState } from "./PartyEmptyState"
import { fontWeights } from "@/lib/font-weight"

const STATUS_TONE: Record<PartyLegalCase["status"], string> = {
  pending: "var(--status-in-progress)",
  ongoing: "var(--status-in-progress)",
  dismissed: "var(--status-kept)",
  closed: "var(--text-tertiary)",
  settled: "var(--text-tertiary)",
}

const STATUS_LABEL: Record<PartyLegalCase["status"], string> = {
  pending: "Pending",
  ongoing: "Ongoing",
  dismissed: "Dismissed",
  closed: "Closed",
  settled: "Settled",
}

export function PartyLegalCases({ cases }: { cases: PartyLegalCase[] }) {
  if (!cases.length) return <PartyEmptyState section="Legal-case" />

  const sorted = [...cases].sort((a, b) => b.year - a.year)

  return (
    <div className="space-y-2">
      {sorted.map((c, i) => {
        const tone = STATUS_TONE[c.status]
        return (
          <article
            key={`${c.year}-${c.title}-${i}`}
            className="p-3 rounded-[6px]"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[11px] font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {c.year}
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[2px]"
                style={{
                  color: tone,
                  background: `${tone}1A`,
                  border: `1px solid ${tone}55`,
                }}
              >
                {STATUS_LABEL[c.status]}
              </span>
              <span
                className="text-[11px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                {c.forum}
              </span>
            </div>
            <h3
              className="text-[14px] leading-snug"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.011em", fontVariationSettings: fontWeights.medium }}
            >
              {c.title}
            </h3>
            <p
              className="text-[12.5px] mt-1 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {c.description}
            </p>
            {c.source_url ? (
              <a
                href={c.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] mt-1.5"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                Source <ExternalLink size={10} strokeWidth={1.5} />
              </a>
            ) : c.source_pending ? (
              <span
                className="inline-block text-[10px] mt-1.5 uppercase tracking-wide"
                style={{ color: "var(--text-disabled)" }}
              >
                Source pending
              </span>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
