// Compact list of a party's manifestos — year, election type, page count,
// PDF link. Data comes from the existing `manifestos` table filtered by
// party_id on the page server-component.

import Link from "next/link"
import { ArrowRight, Download, ExternalLink } from "lucide-react"
import type { Manifesto } from "@/lib/db/types"
import { PartyEmptyState } from "./PartyEmptyState"
import { fontWeights } from "@/lib/font-weight"

const ELECTION_LABEL: Record<string, string> = {
  lok_sabha: "Lok Sabha",
  vidhan_sabha: "Vidhan Sabha",
  local: "Local body",
}

export function PartyManifestoList({
  manifestos,
  partyColor,
}: {
  manifestos: Manifesto[]
  partyColor: string
}) {
  if (!manifestos.length) return <PartyEmptyState section="Manifesto" />

  const sorted = [...manifestos].sort(
    (a, b) => b.election_year - a.election_year,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {sorted.map((m) => (
        <article
          key={m.id}
          className="p-3 rounded-[6px] flex flex-col gap-2"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[2px]"
              style={{
                color: partyColor,
                background: `${partyColor}1A`,
                border: `1px solid ${partyColor}55`,
              }}
            >
              {ELECTION_LABEL[m.election_type] ?? m.election_type}
            </span>
            <span
              className="text-[11px] font-mono"
              style={{ color: "var(--text-tertiary)" }}
            >
              {m.election_year}
            </span>
            {m.state_code && (
              <span
                className="text-[11px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                · {m.state_code}
              </span>
            )}
            {m.pages != null && (
              <span
                className="text-[11px] ml-auto"
                style={{ color: "var(--text-tertiary)" }}
              >
                {m.pages} pages
              </span>
            )}
          </div>
          <h3
            className="text-[14px] leading-snug"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.011em", fontVariationSettings: fontWeights.medium }}
          >
            {m.title}
          </h3>
          <div className="flex items-center gap-2 mt-auto pt-1">
            <Link
              href={`/manifestos/${m.id}`}
              className="flex-1 h-8 px-2.5 rounded-[6px] text-[12px] inline-flex items-center justify-between"
              style={{
                background: "var(--bg-elevated-2)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                textDecoration: "none",
                fontVariationSettings: fontWeights.medium,
              }}
            >
              <span>Read promises</span>
              <ArrowRight size={12} style={{ color: "var(--text-tertiary)" }} />
            </Link>
            {m.source_url && (
              <a
                href={m.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-2.5 rounded-[6px] text-[12px] inline-flex items-center gap-1.5"
                style={{
                  background: "var(--bg-elevated-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                {m.source_url.endsWith(".pdf") ? (
                  <>
                    <Download size={11} /> PDF
                  </>
                ) : (
                  <>
                    <ExternalLink size={11} /> Source
                  </>
                )}
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
