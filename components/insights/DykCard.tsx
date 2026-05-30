// BMW-226–250 — "Did You Know" daily card.
// Used standalone (large) on /insights and as a smaller variant on home.

"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { Fact } from "@/lib/insights/facts"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"

// UI_RULES.md §2 — every category label uses an existing token (no bespoke
// hex). "gender" was previously #b27dd6; reusing --accent-hover so it sits in
// the purple/violet family without inventing a one-off token.
const CATEGORY_COLORS: Record<string, string> = {
  parliamentary: "var(--accent)",
  financial: "var(--status-compromise)",
  electoral: "var(--status-inworks)",
  criminal: "var(--status-broken)",
  gender: "var(--accent-hover)",
  attendance: "var(--status-stalled)",
  trust: "var(--info)",
}

export function DykCard({
  fact,
  size = "default",
}: {
  fact: Fact
  size?: "default" | "compact"
}) {
  const accent = CATEGORY_COLORS[fact.category] ?? "var(--accent)"
  const isCompact = size === "compact"

  return (
    <motion.article
      className="rounded-[var(--radius-card)] flex flex-col overflow-hidden h-full"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        // Linear discipline: no heavy left border on every card. The category
        // is conveyed by the small uppercase label colour at the top instead.
      }}
      whileHover={{ y: -1, boxShadow: "var(--shadow-s3)" }}
      transition={springs.responsive}
    >
      <div className={isCompact ? "p-4" : "p-5"}>

        <p
          className={
            isCompact
              ? "text-[14px] leading-snug"
              : "text-[18px] leading-snug"
          }
          style={{ color: "var(--text-primary)", letterSpacing: "-0.011em", fontVariationSettings: fontWeights.medium }}
        >
          {fact.text}
        </p>

        {fact.caveat && (
          <p
            className="mt-3 text-[11px] italic"
            style={{ color: "var(--text-tertiary)" }}
          >
            Caveat: {fact.caveat}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            Source: {fact.source}
          </span>
          <div className="flex items-center gap-2">
            {fact.source_url && (
              <a
                href={fact.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                Source <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
