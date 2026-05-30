"use client"

// Compact list of a party's manifestos — year, election type, page count,
// PDF link. Uses an explicit post-mount state flip to drive the cascade so
// the animation can't be skipped by SSR hydration optimisations.

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Download, ExternalLink } from "lucide-react"
import type { Manifesto } from "@/lib/db/types"
import { PartyEmptyState } from "./PartyEmptyState"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"

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
  const [shown, setShown] = useState(false)
  useEffect(() => {
    // Flip on the next frame so the DOM has the initial hidden state
    // committed before we transition to the visible state. Without the
    // rAF the browser can coalesce both states and you see nothing.
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!manifestos.length) return <PartyEmptyState section="Manifesto" />

  const sorted = [...manifestos].sort(
    (a, b) => b.election_year - a.election_year,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {sorted.map((m, i) => (
        <motion.article
          key={m.id}
          initial={{ opacity: 0, y: 24 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ ...springs.gentle, delay: i * 0.08 }}
          className="p-3 rounded-xl flex flex-col gap-2 h-full"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[var(--radius-tag)]"
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
              className="flex-1 h-8 px-2.5 rounded-xl text-[12px] inline-flex items-center justify-between border border-[var(--border)] bg-[var(--bg-elevated-2)] transition-colors duration-100 hover:bg-[var(--bg-elevated-3)] hover:border-[var(--border-strong)]"
              style={{
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
                className="h-8 px-2.5 rounded-xl text-[12px] inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--bg-elevated-2)] transition-colors duration-100 hover:bg-[var(--bg-elevated-3)] hover:border-[var(--border-strong)]"
                style={{
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
        </motion.article>
      ))}
    </div>
  )
}
