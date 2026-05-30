// Timeline of party milestones since founding — ordered chronologically.
// Server-renderable: no client interactivity required, just a vertical rail
// with year dots and event cards.

import { ExternalLink } from "lucide-react"
import type { PartyHistoryEvent } from "@/lib/db/partyProfile"
import { PartyEmptyState } from "./PartyEmptyState"
import { fontWeights } from "@/lib/font-weight"

const KIND_LABELS: Record<PartyHistoryEvent["kind"], string> = {
  founded: "Founded",
  split: "Split",
  merger: "Merger",
  alliance: "Alliance",
  election_win: "Election win",
  election_loss: "Election loss",
  leadership: "Leadership",
  ideology: "Ideology",
  milestone: "Milestone",
  controversy: "Controversy",
}

const KIND_TONE: Record<PartyHistoryEvent["kind"], string> = {
  founded: "var(--status-kept)",
  election_win: "var(--status-kept)",
  election_loss: "var(--status-broken)",
  split: "var(--status-broken)",
  controversy: "var(--status-broken)",
  merger: "var(--status-inworks)",
  alliance: "var(--status-inworks)",
  leadership: "var(--status-inworks)",
  ideology: "var(--text-tertiary)",
  milestone: "var(--accent)",
}

export function PartyHistoryTimeline({
  events,
  partyColor,
}: {
  events: PartyHistoryEvent[]
  partyColor: string
}) {
  if (!events.length) return <PartyEmptyState section="History" />

  const sorted = [...events].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return (a.month ?? 0) - (b.month ?? 0)
  })

  return (
    <ol className="relative space-y-3 pl-6" style={{ borderLeft: "1px solid var(--border)" }}>
      {sorted.map((ev, i) => {
        const tone = KIND_TONE[ev.kind] ?? partyColor
        return (
          <li key={`${ev.year}-${i}`} className="relative">
            {/* Dot on the rail */}
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: -27,
                top: 6,
                width: 9,
                height: 9,
                background: tone,
                boxShadow: "0 0 0 3px var(--bg-base)",
              }}
            />
            <div
              className="p-3 rounded-xl"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {ev.year}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[var(--radius-tag)]"
                  style={{
                    color: tone,
                    background: `color-mix(in oklab, ${tone} 12%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${tone} 34%, transparent)`,
                  }}
                >
                  {KIND_LABELS[ev.kind]}
                </span>
              </div>
              <h3
                className="text-[14px] leading-snug"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.011em", fontVariationSettings: fontWeights.medium }}
              >
                {ev.title}
              </h3>
              <p
                className="text-[12px] mt-1 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {ev.description}
              </p>
              {ev.source_url ? (
                <a
                  href={ev.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] mt-1.5"
                  style={{ color: "var(--accent)", textDecoration: "none" }}
                >
                  Source <ExternalLink size={10} strokeWidth={1.5} />
                </a>
              ) : ev.source_pending ? (
                <span
                  className="inline-block text-[10px] mt-1.5 uppercase tracking-wide"
                  style={{ color: "var(--text-disabled)" }}
                >
                  Source pending
                </span>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
