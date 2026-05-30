"use client"

import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { tokens } from "@/lib/tokens"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import type { BillVersion } from "@/lib/db/types"
import type { ClausePair, DiffType } from "@/app/api/bills/[slug]/diff/route"

// ── Diff color system — uses existing status vars only ────────────────────────

const DIFF_STYLE: Record<DiffType, { bgFrom: string; bgTo: string; labelColor: string; label: string }> = {
  unchanged: {
    bgFrom: "transparent",
    bgTo:   "transparent",
    labelColor: tokens.color.textDisabled,
    label: "unchanged",
  },
  added: {
    bgFrom: "transparent",
    bgTo:   `color-mix(in oklab, ${tokens.status.kept} 8%, transparent)`,   // green tint
    labelColor: tokens.status.kept,
    label: "added",
  },
  removed: {
    bgFrom: `color-mix(in oklab, ${tokens.status.broken} 8%, transparent)`, // red tint
    bgTo:   "transparent",
    labelColor: tokens.status.broken,
    label: "removed",
  },
  modified: {
    bgFrom: `color-mix(in oklab, ${tokens.status.compromise} 6%, transparent)`, // amber tint
    bgTo:   `color-mix(in oklab, ${tokens.status.compromise} 6%, transparent)`,
    labelColor: tokens.status.compromise,
    label: "modified",
  },
}

// ── TimeMachineSlider ─────────────────────────────────────────────────────────

interface TimeMachineSliderProps {
  versions: BillVersion[]
  fromVersion: BillVersion
  toVersion: BillVersion
  billSlug: string
}

export function TimeMachineSlider({
  versions,
  fromVersion,
  toVersion,
  billSlug,
}: TimeMachineSliderProps) {
  if (versions.length < 2) return null

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: tokens.color.bgElevated, border: `1px solid ${tokens.color.border}` }}
    >
      <p className="text-[11px] uppercase tracking-wider mb-3" style={{ color: tokens.color.textTertiary, fontVariationSettings: fontWeights.semibold }}>
        Bill versions
      </p>
      <div className="relative">
        {/* Track */}
        <div
          className="absolute top-3 left-0 right-0 h-[1px]"
          style={{ background: tokens.color.border }}
        />
        <div className="flex justify-between relative">
          {versions.map((v) => {
            const isFrom = v.id === fromVersion.id
            const isTo   = v.id === toVersion.id
            const isActive = isFrom || isTo
            const year = v.version_date.slice(0, 4)

            return (
              <div key={v.id} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full border-2 z-10 relative"
                  style={{
                    background: isActive ? tokens.color.textPrimary : tokens.color.bgElevated,
                    borderColor: isActive ? tokens.color.textPrimary : tokens.color.border,
                  }}
                />
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="text-[11px] text-center"
                    style={{
                      color: isActive ? tokens.color.textPrimary : tokens.color.textDisabled,
                      fontVariationSettings: isActive ? fontWeights.semibold : fontWeights.normal,
                    }}
                  >
                    {year}
                  </span>
                  {isFrom && (
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: tokens.status.stalled }}>
                      from
                    </span>
                  )}
                  {isTo && (
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: tokens.status.kept }}>
                      to
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px]" style={{ color: tokens.color.textSecondary }}>
          {fromVersion.version_label}
        </span>
        <span style={{ color: tokens.color.textDisabled }}>→</span>
        <span className="text-[12px]" style={{ color: tokens.color.textSecondary }}>
          {toVersion.version_label}
        </span>
      </div>
    </div>
  )
}

// ── Attribution Chain ─────────────────────────────────────────────────────────

interface AttributionChainProps {
  note: string
  clauseTitle: string | null
}

function AttributionChain({ note, clauseTitle }: AttributionChainProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      {/* UI_RULES.md §1 exception: 11px inline disclosure toggle nested inside
          a clause-diff cell. The smallest <Button> variant (sm = h-7 = 28px,
          12px text) is too tall and visually heavy — this reads as a chevron
          link in body copy, not a CTA. Keep as a bare <button> — documented
          exception. */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] transition-colors duration-80"
        style={{ color: open ? tokens.color.textSecondary : tokens.color.textTertiary }}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        Attribution chain
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={springs.fast}
            className="overflow-hidden"
          >
            <p
              className="mt-2 text-[12px] leading-relaxed pl-2"
              style={{
                color: tokens.color.textSecondary,
                borderLeft: `2px solid ${tokens.color.border}`,
              }}
            >
              {note}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Clause Row ────────────────────────────────────────────────────────────────

interface ClauseRowProps {
  pair: ClausePair
  showUnchanged: boolean
}

function ClauseRow({ pair, showUnchanged }: ClauseRowProps) {
  const style = DIFF_STYLE[pair.diffType]
  if (pair.diffType === "unchanged" && !showUnchanged) return null

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${pair.isPoisonPill ? tokens.status.broken : tokens.color.border}` }}
    >
      {/* Clause header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: tokens.color.bgElevated2,
          borderBottom: `1px solid ${tokens.color.border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono"
            style={{ color: tokens.color.textPrimary, fontVariationSettings: fontWeights.medium }}
          >
            Clause {pair.clauseNumber}
          </span>
          {pair.clauseTitle && (
            <span className="text-[11px]" style={{ color: tokens.color.textTertiary }}>
              — {pair.clauseTitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {pair.isPoisonPill && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-tag)] text-[10px] uppercase tracking-wider"
              style={{
                background: `color-mix(in oklab, ${tokens.status.broken} 14%, transparent)`,
                color: tokens.status.broken,
                fontVariationSettings: fontWeights.medium,
              }}
            >
              <AlertTriangle size={10} />
              Poison Pill
            </div>
          )}
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: style.labelColor, fontVariationSettings: fontWeights.medium }}
          >
            {style.label}
          </span>
        </div>
      </div>

      {/* Side-by-side clause text */}
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: tokens.color.border }}>
        {/* FROM (left) */}
        <div
          className="p-4 text-[13px] leading-relaxed"
          style={{
            background: style.bgFrom,
            color: pair.textFrom ? tokens.color.textSecondary : tokens.color.textDisabled,
            minHeight: 80,
          }}
        >
          {pair.textFrom ?? (
            <span className="italic text-[12px]">— not present in this version —</span>
          )}
          {pair.diffType === "removed" && pair.attributionNote && (
            <AttributionChain note={pair.attributionNote} clauseTitle={pair.clauseTitle} />
          )}
        </div>

        {/* TO (right) */}
        <div
          className="p-4 text-[13px] leading-relaxed"
          style={{
            background: style.bgTo,
            color: pair.textTo ? tokens.color.textPrimary : tokens.color.textDisabled,
            minHeight: 80,
          }}
        >
          {pair.textTo ?? (
            <span className="italic text-[12px]">— removed in this version —</span>
          )}
          {(pair.diffType === "added" || pair.diffType === "modified") && pair.attributionNote && (
            <AttributionChain note={pair.attributionNote} clauseTitle={pair.clauseTitle} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main BillDiffView ─────────────────────────────────────────────────────────

interface BillDiffViewProps {
  fromVersion: BillVersion
  toVersion: BillVersion
  allVersions: BillVersion[]
  pairs: ClausePair[]
  billSlug: string
  fromSourceUrl?: string | null
  toSourceUrl?: string | null
}

export function BillDiffView({
  fromVersion,
  toVersion,
  allVersions,
  pairs,
  billSlug,
  fromSourceUrl,
  toSourceUrl,
}: BillDiffViewProps) {
  const [showUnchanged, setShowUnchanged] = useState(false)

  const added    = pairs.filter((p) => p.diffType === "added").length
  const removed  = pairs.filter((p) => p.diffType === "removed").length
  const modified = pairs.filter((p) => p.diffType === "modified").length
  const poison   = pairs.filter((p) => p.isPoisonPill).length

  return (
    <div className="space-y-4">

      {/* Time-machine slider */}
      <TimeMachineSlider
        versions={allVersions}
        fromVersion={fromVersion}
        toVersion={toVersion}
        billSlug={billSlug}
      />

      {/* Summary stats */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl"
        style={{ background: tokens.color.bgElevated, border: `1px solid ${tokens.color.border}` }}
      >
        {[
          { label: "added",    count: added,    color: tokens.status.kept },
          { label: "removed",  count: removed,  color: tokens.status.broken },
          { label: "modified", count: modified, color: tokens.status.compromise },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="text-[18px] leading-none"
              style={{ color, letterSpacing: "-0.022em", fontVariationSettings: fontWeights.semibold }}
            >
              {count}
            </span>
            <span className="text-[12px]" style={{ color: tokens.color.textTertiary }}>
              {label}
            </span>
          </div>
        ))}
        {poison > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} style={{ color: tokens.status.broken }} />
            <span className="text-[12px]" style={{ color: tokens.status.broken, fontVariationSettings: fontWeights.medium }}>
              {poison} forensic signal{poison > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="ml-auto">
          {/* UI_RULES.md §1 exception: 11px toggle pill matching the summary
              row's compact 24px-tall stat-strip rhythm. The smallest <Button>
              variant (sm = h-7 = 28px, 12px text) breaks the visual balance
              with the inline added/removed/modified counters next to it.
              Keep as a bare <button> — documented exception. */}
          <button
            onClick={() => setShowUnchanged((v) => !v)}
            className="text-[11px] px-2.5 py-1 rounded-lg transition-colors duration-80"
            style={{
              color: showUnchanged ? tokens.color.textPrimary : tokens.color.textTertiary,
              background: showUnchanged ? tokens.color.bgElevated2 : "transparent",
              border: `1px solid ${tokens.color.border}`,
            }}
          >
            {showUnchanged ? "Hide unchanged" : "Show unchanged"}
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-0 text-[11px] uppercase tracking-wider px-1">
        <div className="flex items-center gap-2" style={{ color: tokens.status.stalled }}>
          {fromVersion.version_label}
          {fromSourceUrl && (
            <a href={fromSourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={10} style={{ color: tokens.color.textDisabled }} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 pl-4" style={{ color: tokens.status.kept }}>
          {toVersion.version_label}
          {toSourceUrl && (
            <a href={toSourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={10} style={{ color: tokens.color.textDisabled }} />
            </a>
          )}
        </div>
      </div>

      {/* Clause pairs */}
      <div className="space-y-3">
        {pairs.map((pair) => (
          <ClauseRow
            key={pair.clauseNumber}
            pair={pair}
            showUnchanged={showUnchanged}
          />
        ))}
      </div>

      <p
        className="text-[11px] text-center pt-2"
        style={{ color: tokens.color.textDisabled }}
      >
        Clause text sourced from PRS Legislative Research (CC-BY 4.0). Simplified for readability.
      </p>
    </div>
  )
}
