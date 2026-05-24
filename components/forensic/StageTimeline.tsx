"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import type { StageEvent } from "@/lib/db/types"

// ─── Stage labels ─────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<number, string> = {
  1:  "Draft Circulated",
  2:  "Cabinet Approval",
  3:  "Introduced — 1st Reading",
  4:  "2nd Reading & Debate",
  5:  "Referred to Committee",
  6:  "Committee Report",
  7:  "3rd Reading & Vote",
  8:  "Passed — House 1",
  9:  "Transmitted to House 2",
  10: "2nd House: 1st Reading",
  11: "2nd House: Committee",
  12: "2nd House: Passed",
  13: "Joint Session",
  14: "Presidential Assent",
  15: "Gazette Notification",
  16: "Notified & In Force",
}

// ─── Phase groupings ──────────────────────────────────────────────────────────

const PHASES: Array<{ label: string; stages: Set<number> }> = [
  { label: "Pre-Parliament", stages: new Set([1, 2]) },
  { label: "Lok Sabha",      stages: new Set([3, 4, 5, 6, 7, 8]) },
  { label: "Rajya Sabha",    stages: new Set([9, 10, 11, 12]) },
  { label: "Presidential",   stages: new Set([13, 14, 15, 16]) },
]

function getPhase(stage: number): string {
  return PHASES.find(p => p.stages.has(stage))?.label ?? ""
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StageTimelineProps {
  stageEvents: StageEvent[]
  currentStage: number | null
  coveredCount: number
}

// Flat item list — dividers and stage rows at the same depth so
// staggerChildren applies uniformly to both.
type TItem =
  | { kind: "divider"; phase: string; isFirst: boolean }
  | { kind: "stage"; stage: number; events: StageEvent[]; isCurrent: boolean; isLast: boolean }

// ─── Animation ────────────────────────────────────────────────────────────────

const containerVars = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.045, delayChildren: 0.03 } },
}

const itemVars = {
  hidden: { opacity: 0, x: -5 },
  show:   { opacity: 1, x: 0, transition: springs.responsive },
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
// A continuous 4px bar divided into 16 equal flex segments — instantly
// communicates coverage and position without taking up vertical space.
// Reference: Vercel build pipeline, GitHub Actions workflow steps.

function ProgressBar({
  stageEvents,
  currentStage,
}: {
  stageEvents: StageEvent[]
  currentStage: number | null
}) {
  const documented = new Set(stageEvents.map(e => e.stage))

  return (
    <div className="mb-6">
      <div className="flex gap-[2px]" style={{ maxWidth: 260 }}>
        {Array.from({ length: 16 }, (_, i) => i + 1).map(s => {
          const has    = documented.has(s)
          const isCur  = currentStage === s
          const isPast = currentStage !== null && s < currentStage

          return (
            <motion.div
              key={s}
              initial={{ opacity: 0 }}
              animate={{ opacity: has ? 1 : isPast ? 0.5 : 0.22 }}
              transition={{ ...springs.snap, delay: s * 0.018 }}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: has
                  ? "var(--accent)"
                  : isPast
                  ? "var(--border-stronger)"
                  : "var(--border)",
                // ring on the current stage segment when it has no events yet
                outline: isCur && !has ? "2px solid var(--accent)" : "none",
                outlineOffset: 2,
              }}
            />
          )
        })}
      </div>
      <p
        className="mt-1.5 text-[11px] tabular-nums"
        style={{
          color: "var(--text-disabled)",
          fontVariationSettings: fontWeights.normal,
        }}
      >
        {documented.size > 0
          ? `${documented.size} of 16 stages documented`
          : "No stages documented yet"}
      </p>
    </div>
  )
}

// ─── House label (inline, no badge chrome) ────────────────────────────────────
// Deliberately borderless — house is metadata, not status.

function HouseLabel({ house }: { house: string }) {
  const label =
    house === "lok_sabha"     ? "LS"
    : house === "rajya_sabha" ? "RS"
    : house.slice(0, 2).toUpperCase()

  return (
    <span
      className="font-mono"
      style={{
        fontSize: 10,
        color: "var(--text-disabled)",
        fontVariationSettings: fontWeights.normal,
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StageTimeline({ stageEvents, currentStage, coveredCount }: StageTimelineProps) {
  // Group + sort by stage, then by date within stage
  const byStage = new Map<number, StageEvent[]>()
  for (const e of [...stageEvents].sort((a, b) =>
    a.stage !== b.stage
      ? a.stage - b.stage
      : (a.event_date ?? "").localeCompare(b.event_date ?? "")
  )) {
    byStage.set(e.stage, [...(byStage.get(e.stage) ?? []), e])
  }
  const stages = Array.from(byStage.keys())

  // Build flat item list — phase dividers inserted when phase changes
  const items: TItem[] = []
  stages.forEach((stage, idx) => {
    const prev        = idx > 0 ? stages[idx - 1] : null
    const phaseChange = getPhase(stage) !== getPhase(prev ?? -1)
    if (phaseChange) {
      items.push({ kind: "divider", phase: getPhase(stage), isFirst: idx === 0 })
    }
    items.push({
      kind:      "stage",
      stage,
      events:    byStage.get(stage)!,
      isCurrent: currentStage === stage,
      isLast:    idx === stages.length - 1,
    })
  })

  return (
    <section>
      {/* Header */}
      <h2
        className="text-subheading mb-0.5"
        style={{ color: "var(--text-primary)" }}
      >
        Stage Timeline
      </h2>
      <p
        className="text-[12px] mb-5"
        style={{
          color: "var(--text-tertiary)",
          fontVariationSettings: fontWeights.normal,
        }}
      >
        16-stage parliamentary lifecycle
      </p>

      {/* Progress bar — orientation at a glance, no scrolling required */}
      <ProgressBar stageEvents={stageEvents} currentStage={currentStage} />

      {/* Empty state */}
      {items.length === 0 && (
        <p
          className="text-[12px]"
          style={{
            color: "var(--text-disabled)",
            fontVariationSettings: fontWeights.normal,
          }}
        >
          No stages documented for this bill yet.
        </p>
      )}

      {/* Timeline — events only, no empty scaffolding */}
      {items.length > 0 && (
        <motion.div variants={containerVars} initial="hidden" animate="show">
          {items.map((item) => {

            // ── Phase divider ─────────────────────────────────────────────
            if (item.kind === "divider") {
              return (
                <motion.div
                  key={`div-${item.phase}`}
                  variants={itemVars}
                  className="flex items-center gap-3"
                  // 24px = 12px dot-column + 12px gap-3
                  style={{
                    paddingLeft: 24,
                    marginTop:  item.isFirst ? 0 : 20,
                    marginBottom: 8,
                  }}
                >
                  <span
                    className="uppercase shrink-0"
                    style={{
                      fontSize: 11,
                      // --text-tertiary = #8a8f98 — MEASURED from Linear's production DOM.
                      // This is intentionally NOT --text-disabled; phase headers must be
                      // legible navigation anchors, not decorative whispers.
                      color: "var(--text-tertiary)",
                      fontVariationSettings: fontWeights.semibold,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.phase}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--border-strong)" }}
                  />
                </motion.div>
              )
            }

            // ── Stage row ─────────────────────────────────────────────────
            const { stage, events, isCurrent, isLast } = item
            const isPast        = currentStage !== null && stage < currentStage
            const primaryDate   = events[0]?.event_date ?? null
            const primaryHouse  = events[0]?.house ?? null

            return (
              <motion.div
                key={`stg-${stage}`}
                variants={itemVars}
                className="flex items-stretch gap-3 -mx-2 px-2 rounded-[var(--radius-4)]"
                whileHover={{ backgroundColor: "var(--hover-row)" }}
                transition={{ duration: 0.08 }}
              >
                {/* Dot + vertical connector */}
                <div
                  className="flex flex-col items-center shrink-0"
                  style={{ width: 12 }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      marginTop: 5,
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      // Past events dim to signal "completed" vs "active"
                      opacity: isPast ? 0.38 : 1,
                      outline: isCurrent
                        ? "2px solid color-mix(in oklab, var(--accent) 40%, transparent)"
                        : "none",
                      outlineOffset: 3,
                      position: "relative",
                      zIndex: 10,
                    }}
                  />
                  {/* Connector line — var(--border-stronger) not var(--border);
                      the latter is #23252a on #08090a = invisible. */}
                  {!isLast && (
                    <div
                      className="flex-1 mt-[7px]"
                      style={{
                        width: 1,
                        minHeight: 20,
                        background: "var(--border-stronger)",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">

                  {/* Stage label row: [num · label · badge] ··········· [house · date] */}
                  <div
                    className="flex items-center justify-between gap-3"
                    style={{ marginBottom: 5 }}
                  >
                    {/* Left: number + label + "Current" badge */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="font-mono tabular-nums shrink-0"
                        style={{
                          fontSize: 10,
                          color: "var(--text-disabled)",
                          fontVariationSettings: fontWeights.normal,
                        }}
                      >
                        {String(stage).padStart(2, "0")}
                      </span>
                      <span
                        className="truncate"
                        style={{
                          fontSize: 13,
                          color: isCurrent
                            ? "var(--text-primary)"
                            : isPast
                            ? "var(--text-tertiary)"
                            : "var(--text-secondary)",
                          fontVariationSettings: isCurrent
                            ? fontWeights.semibold
                            : fontWeights.medium,
                          letterSpacing: "var(--tracking-body)",
                        }}
                      >
                        {STAGE_LABELS[stage] ?? `Stage ${stage}`}
                      </span>
                      {isCurrent && (
                        <span
                          className="shrink-0"
                          style={{
                            fontSize: 10,
                            padding: "1px 6px",
                            background: "var(--accent-tint)",
                            color: "var(--accent)",
                            borderRadius: "var(--radius-pill)",
                            border: "1px solid color-mix(in oklab, var(--accent) 22%, transparent)",
                            fontVariationSettings: fontWeights.medium,
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>

                    {/* Right: house + date — anchored to label line, not buried in content */}
                    {(primaryHouse || primaryDate) && (
                      <div className="shrink-0 flex items-center gap-2">
                        {primaryHouse && <HouseLabel house={primaryHouse} />}
                        {primaryDate && (
                          <span
                            className="font-mono tabular-nums"
                            style={{
                              fontSize: 11,
                              color: "var(--text-tertiary)",
                              fontVariationSettings: fontWeights.normal,
                            }}
                          >
                            {primaryDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Events — NO card chrome.
                      Box-in-a-box is the enemy of density. Typography and
                      spacing do the work instead. Reference: Linear issue
                      activity, GitHub PR milestone events, Stripe event log. */}
                  {events.map((event, eIdx) => (
                    <div
                      key={event.id}
                      style={{ marginTop: eIdx > 0 ? 12 : 0 }}
                    >
                      {/* Extra events at same stage get their own date header */}
                      {eIdx > 0 && (event.event_date || event.house) && (
                        <div
                          className="flex items-center gap-2"
                          style={{ marginBottom: 3 }}
                        >
                          {event.house && <HouseLabel house={event.house} />}
                          {event.event_date && (
                            <span
                              className="font-mono tabular-nums"
                              style={{
                                fontSize: 11,
                                color: "var(--text-tertiary)",
                                fontVariationSettings: fontWeights.normal,
                              }}
                            >
                              {event.event_date}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 12,
                          lineHeight: 1.5,
                          color: "var(--text-tertiary)",
                          fontVariationSettings: fontWeights.normal,
                        }}
                      >
                        {event.description}
                      </p>

                      {/* Verbatim quote */}
                      {event.verbatim_quote && (
                        <blockquote
                          style={{
                            marginTop: 8,
                            paddingLeft: 10,
                            fontSize: 11,
                            lineHeight: 1.55,
                            fontStyle: "italic",
                            color: "var(--text-quaternary)",
                            borderLeft: "2px solid var(--border-stronger)",
                          }}
                        >
                          &ldquo;{event.verbatim_quote}&rdquo;
                          {event.verbatim_speaker_name && (
                            <span
                              style={{
                                fontStyle: "normal",
                                marginLeft: 4,
                                color: "var(--text-disabled)",
                                fontVariationSettings: fontWeights.normal,
                              }}
                            >
                              — {event.verbatim_speaker_name}
                            </span>
                          )}
                        </blockquote>
                      )}

                      {/* Source link */}
                      {event.source_url && (
                        <a
                          href={event.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 w-fit transition-colors hover:text-[var(--text-secondary)]"
                          style={{
                            marginTop: 6,
                            fontSize: 10,
                            color: "var(--text-disabled)",
                            textDecoration: "none",
                            fontVariationSettings: fontWeights.normal,
                          }}
                        >
                          <ExternalLink size={9} />
                          {event.source_label ?? "Source"}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
