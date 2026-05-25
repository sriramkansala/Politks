"use client"

// ─── StageTimeline ──────────────────────────────────────────────────────────
//
// Reference class: NOT a chat-log "vertical timeline." A bill's 16-stage
// lifecycle is a fixed-structure forensic record with sparse events.
//
// Borrowed patterns:
//   - Vercel build pipeline: horizontal stage rail as a *map* of the journey.
//   - Stripe dispute timeline: no dots, no connector — typography does the
//     timeline work; verbatim evidence with a 2px left border.
//   - Linear project sections: phases as real chapters (semibold tracked
//     headers, --text-tertiary, hairline rule above), not tiny dividers.
//   - Notion docs: the bill IS a forensic document; let it read like one.
//
// Two layers, two jobs:
//   1) Phase-grouped rail at top   →  "Where in the lifecycle is this bill?"
//   2) Chapter-style phase blocks  →  "What actually happened, with sources?"
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, ArrowDown } from "lucide-react"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import type { StageEvent } from "@/lib/db/types"

// ─── Stage labels & phase groupings ──────────────────────────────────────────

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

interface Phase {
  label: string
  short: string
  stages: number[]
}

const PHASES: Phase[] = [
  { label: "Pre-Parliament", short: "Pre-Parl",     stages: [1, 2] },
  { label: "Lok Sabha",      short: "Lok Sabha",    stages: [3, 4, 5, 6, 7, 8] },
  { label: "Rajya Sabha",    short: "Rajya Sabha",  stages: [9, 10, 11, 12] },
  { label: "Presidential",   short: "Presidential", stages: [13, 14, 15, 16] },
]

// ─── Props ───────────────────────────────────────────────────────────────────

interface StageTimelineProps {
  stageEvents: StageEvent[]
  currentStage: number | null
  coveredCount: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: string | null): string | null {
  if (!d) return null
  // YYYY-MM-DD → DD MMM YYYY (forensic preference: unambiguous, compact)
  const [y, m, day] = d.split("-")
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const mi = parseInt(m, 10) - 1
  if (isNaN(mi) || mi < 0 || mi > 11) return d
  return `${day} ${months[mi]} ${y}`
}

function houseLabel(house: string | null): string | null {
  if (!house) return null
  if (house === "lok_sabha") return "LS"
  if (house === "rajya_sabha") return "RS"
  return house.slice(0, 2).toUpperCase()
}

// Days between first and last documented event — story-telling stat
// ("constitutional amendment passed in 10 days" matters).
function passageWindow(events: StageEvent[]): string | null {
  const dates = events.map(e => e.event_date).filter((d): d is string => !!d).sort()
  if (dates.length < 2) return null
  const start = new Date(dates[0]).getTime()
  const end   = new Date(dates[dates.length - 1]).getTime()
  if (isNaN(start) || isNaN(end)) return null
  const days = Math.round((end - start) / 86400000)
  if (days <= 0) return null
  if (days < 31)  return `${days}-day passage`
  if (days < 365) return `${Math.round(days / 30)}-month passage`
  return `${(days / 365).toFixed(1)}-year passage`
}

// ─── Pipeline rail (phase-grouped) ───────────────────────────────────────────
// The rail = the MAP. Four phase groups separated by visible gaps; each group's
// segments are individually visualized per stage. Documented stages are filled
// with accent; current stage gets an outline ring; past-but-undocumented are
// dim border; future stages are very faint.
//
// Inspiration: Vercel build pipeline + Cron grouped quarter rail.

function PipelineRail({
  stageEvents,
  currentStage,
}: {
  stageEvents: StageEvent[]
  currentStage: number | null
}) {
  const documented = new Set(stageEvents.map(e => e.stage))

  return (
    <div
      className="mb-7"
      style={{
        // Subtle elevated panel — distinct affordance from prose below,
        // but NOT a card around the events. This frames just the map.
        padding: "12px 14px 10px",
        borderRadius: "var(--radius-4)",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-end" style={{ gap: 14 }}>
        {PHASES.map((phase) => {
          const phaseDocCount = phase.stages.filter(s => documented.has(s)).length
          const phaseHasCurrent =
            currentStage !== null && phase.stages.includes(currentStage)
          return (
            <div
              key={phase.label}
              className="flex flex-col"
              style={{ flex: phase.stages.length, minWidth: 0, gap: 6 }}
            >
              {/* Phase caption */}
              <div className="flex items-baseline justify-between" style={{ gap: 6 }}>
                <span
                  className="uppercase truncate"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.09em",
                    color: phaseDocCount > 0 || phaseHasCurrent
                      ? "var(--text-tertiary)"
                      : "var(--text-disabled)",
                    fontVariationSettings: fontWeights.semibold,
                  }}
                >
                  {phase.short}
                </span>
                <span
                  className="font-mono tabular-nums shrink-0"
                  style={{
                    fontSize: 9,
                    color: "var(--text-disabled)",
                    fontVariationSettings: fontWeights.normal,
                  }}
                >
                  {phaseDocCount}/{phase.stages.length}
                </span>
              </div>

              {/* Segment row */}
              <div className="flex" style={{ gap: 2 }}>
                {phase.stages.map(s => {
                  const has    = documented.has(s)
                  const isCur  = currentStage === s
                  const isPast = currentStage !== null && s < currentStage

                  let bg = "var(--border)"
                  if (has)         bg = "var(--accent)"
                  else if (isPast) bg = "var(--border-stronger)"

                  return (
                    <motion.div
                      key={s}
                      className="relative"
                      initial={{ opacity: 0, scaleY: 0.4 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ ...springs.snap, delay: 0.02 * s }}
                      style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 1.5,
                        background: bg,
                        outline: isCur ? "1.5px solid var(--accent)" : "none",
                        outlineOffset: 2,
                        transformOrigin: "bottom",
                      }}
                    />
                  )
                })}
              </div>

              {/* Stage number anchors at group endpoints */}
              <div className="flex justify-between">
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 9,
                    color: "var(--text-disabled)",
                    fontVariationSettings: fontWeights.normal,
                  }}
                >
                  {phase.stages[0]}
                </span>
                {phase.stages.length > 1 && (
                  <span
                    className="font-mono tabular-nums"
                    style={{
                      fontSize: 9,
                      color: "var(--text-disabled)",
                      fontVariationSettings: fontWeights.normal,
                    }}
                  >
                    {phase.stages[phase.stages.length - 1]}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Animation ───────────────────────────────────────────────────────────────

const containerVars = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
}

const itemVars = {
  hidden: { opacity: 0, y: 4 },
  show:   { opacity: 1, y: 0, transition: springs.responsive },
}

// ─── Main component ──────────────────────────────────────────────────────────

export function StageTimeline({ stageEvents, currentStage }: StageTimelineProps) {
  const documented = new Set(stageEvents.map(e => e.stage))

  const sorted = [...stageEvents].sort((a, b) =>
    a.stage !== b.stage
      ? a.stage - b.stage
      : (a.event_date ?? "").localeCompare(b.event_date ?? "")
  )

  const byStage = new Map<number, StageEvent[]>()
  for (const e of sorted) {
    byStage.set(e.stage, [...(byStage.get(e.stage) ?? []), e])
  }

  const phaseSections = PHASES.map((phase, pi) => {
    const phaseStages = phase.stages.filter(s => byStage.has(s))
    return {
      phase,
      index: pi + 1,
      stages: phaseStages,
      hasEvents: phaseStages.length > 0,
    }
  }).filter(s => s.hasEvents)

  const windowStat = passageWindow(stageEvents)

  return (
    <section>
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <header className="mb-4">
        <h2
          className="text-subheading"
          style={{
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Stage Timeline
        </h2>
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.normal,
          }}
        >
          {documented.size} of 16 stages documented
          {windowStat && (
            <>
              <span style={{ margin: "0 8px", color: "var(--text-disabled)" }}>·</span>
              {windowStat}
            </>
          )}
        </p>
      </header>

      {/* ─── Pipeline rail (the map) ─────────────────────────────────── */}
      <PipelineRail stageEvents={stageEvents} currentStage={currentStage} />

      {/* ─── Empty state ─────────────────────────────────────────────── */}
      {phaseSections.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-disabled)",
            fontVariationSettings: fontWeights.normal,
          }}
        >
          No stages documented for this bill yet.
        </p>
      )}

      {/* ─── Phase chapters (the story) ──────────────────────────────── */}
      {phaseSections.length > 0 && (
        <motion.div variants={containerVars} initial="hidden" animate="show">
          {phaseSections.map((section, si) => {
            const phaseDocCount   = section.stages.length
            const phaseTotalCount = section.phase.stages.length

            return (
              <motion.div
                key={section.phase.label}
                variants={itemVars}
                style={{ marginTop: si === 0 ? 0 : 28 }}
              >
                {/* Chapter header — number + name + coverage. Hairline rule
                    above acts as a real chapter divider, not decoration. */}
                <div
                  style={{
                    paddingTop: si === 0 ? 0 : 16,
                    borderTop: si === 0 ? "none" : "1px solid var(--border)",
                    marginBottom: 10,
                  }}
                >
                  <div
                    className="flex items-baseline"
                    style={{ gap: 10 }}
                  >
                    <span
                      className="font-mono tabular-nums"
                      style={{
                        fontSize: 10,
                        color: "var(--text-disabled)",
                        fontVariationSettings: fontWeights.normal,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {String(section.index).padStart(2, "0")}
                    </span>
                    <h3
                      className="uppercase"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        // --text-tertiary measured from Linear's production DOM
                        color: "var(--text-tertiary)",
                        fontVariationSettings: fontWeights.semibold,
                      }}
                    >
                      {section.phase.label}
                    </h3>
                    <span
                      className="font-mono tabular-nums"
                      style={{
                        fontSize: 10,
                        color: "var(--text-disabled)",
                        fontVariationSettings: fontWeights.normal,
                        marginLeft: "auto",
                      }}
                    >
                      {phaseDocCount} of {phaseTotalCount} documented
                    </span>
                  </div>
                </div>

                {/* Stages within phase */}
                {section.stages.map((stage, stIdx) => {
                  const events    = byStage.get(stage)!
                  const isCurrent = currentStage === stage
                  const isPast    = currentStage !== null && stage < currentStage
                  const isLastInPhase = stIdx === section.stages.length - 1

                  return (
                    <div
                      key={stage}
                      style={{
                        paddingTop: 10,
                        paddingBottom: 12,
                        borderBottom: isLastInPhase
                          ? "none"
                          : "1px dashed var(--border)",
                      }}
                    >
                      {/* Stage label row */}
                      <div
                        className="flex items-baseline"
                        style={{ gap: 10, marginBottom: 4 }}
                      >
                        <span
                          className="font-mono tabular-nums shrink-0"
                          style={{
                            fontSize: 11,
                            color: isCurrent
                              ? "var(--accent)"
                              : "var(--text-disabled)",
                            fontVariationSettings: isCurrent
                              ? fontWeights.semibold
                              : fontWeights.normal,
                            letterSpacing: "0.04em",
                            width: 18,
                          }}
                        >
                          {String(stage).padStart(2, "0")}
                        </span>

                        <span
                          className="flex-1 min-w-0 truncate"
                          style={{
                            fontSize: 13,
                            color: isCurrent
                              ? "var(--text-primary)"
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
                            className="shrink-0 uppercase"
                            style={{
                              fontSize: 9.5,
                              padding: "1px 6px",
                              background: "var(--accent-tint)",
                              color: "var(--accent)",
                              borderRadius: "var(--radius-pill)",
                              border: "1px solid color-mix(in oklab, var(--accent) 24%, transparent)",
                              fontVariationSettings: fontWeights.semibold,
                              letterSpacing: "0.06em",
                            }}
                          >
                            Current
                          </span>
                        )}

                        {(events[0]?.house || events[0]?.event_date) && (
                          <span
                            className="shrink-0 flex items-baseline"
                            style={{ gap: 8 }}
                          >
                            {events[0].house && (
                              <span
                                className="font-mono"
                                style={{
                                  fontSize: 10,
                                  color: "var(--text-disabled)",
                                  fontVariationSettings: fontWeights.normal,
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {houseLabel(events[0].house)}
                              </span>
                            )}
                            {events[0].event_date && (
                              <span
                                className="font-mono tabular-nums"
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-tertiary)",
                                  fontVariationSettings: fontWeights.normal,
                                }}
                              >
                                {formatDate(events[0].event_date)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Events for this stage — NO card chrome, NO dots */}
                      {events.map((event, eIdx) => (
                        <div
                          key={event.id}
                          style={{
                            // Indent prose under the stage label so the spine
                            // (stage numbers) reads as a quiet left margin.
                            paddingLeft: 28,
                            marginTop: eIdx === 0 ? 2 : 10,
                          }}
                        >
                          {eIdx > 0 && (event.event_date || event.house) && (
                            <div
                              className="flex items-baseline"
                              style={{ gap: 8, marginBottom: 4 }}
                            >
                              {event.house && (
                                <span
                                  className="font-mono"
                                  style={{
                                    fontSize: 10,
                                    color: "var(--text-disabled)",
                                    fontVariationSettings: fontWeights.normal,
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {houseLabel(event.house)}
                                </span>
                              )}
                              {event.event_date && (
                                <span
                                  className="font-mono tabular-nums"
                                  style={{
                                    fontSize: 10,
                                    color: "var(--text-tertiary)",
                                    fontVariationSettings: fontWeights.normal,
                                  }}
                                >
                                  {formatDate(event.event_date)}
                                </span>
                              )}
                            </div>
                          )}

                          <p
                            style={{
                              fontSize: 12.5,
                              lineHeight: 1.55,
                              color: "var(--text-secondary)",
                              fontVariationSettings: fontWeights.normal,
                              letterSpacing: "var(--tracking-body)",
                            }}
                          >
                            {event.description}
                          </p>

                          {event.verbatim_quote && (
                            <blockquote
                              style={{
                                marginTop: 8,
                                paddingLeft: 12,
                                borderLeft: "2px solid var(--border-stronger)",
                                fontSize: 12,
                                lineHeight: 1.55,
                                fontStyle: "italic",
                                color: "var(--text-tertiary)",
                                fontVariationSettings: fontWeights.normal,
                              }}
                            >
                              &ldquo;{event.verbatim_quote}&rdquo;
                              {event.verbatim_speaker_name && (
                                <span
                                  style={{
                                    display: "block",
                                    marginTop: 4,
                                    fontStyle: "normal",
                                    fontSize: 10.5,
                                    color: "var(--text-disabled)",
                                    fontVariationSettings: fontWeights.medium,
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  — {event.verbatim_speaker_name}
                                </span>
                              )}
                            </blockquote>
                          )}

                          {event.source_url && (
                            <a
                              href={event.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center w-fit transition-colors hover:text-[var(--text-secondary)]"
                              style={{
                                marginTop: 8,
                                gap: 5,
                                fontSize: 10.5,
                                color: "var(--text-disabled)",
                                textDecoration: "none",
                                fontVariationSettings: fontWeights.medium,
                                letterSpacing: "0.01em",
                              }}
                            >
                              <ExternalLink size={10} strokeWidth={2} />
                              {event.source_label ?? "Source"}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
