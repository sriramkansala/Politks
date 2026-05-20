"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { springs } from "@/lib/springs"
import type { StageEvent } from "@/lib/db/types"

const STAGE_LABELS: Record<number, string> = {
  1: "Draft Circulated", 2: "Cabinet Approval", 3: "Introduced (1st Reading)",
  4: "2nd Reading / Debate", 5: "Referred to Committee", 6: "Committee Report",
  7: "3rd Reading / Vote", 8: "Passed (House 1)", 9: "Transmitted to House 2",
  10: "2nd House: 1st Reading", 11: "2nd House: Committee", 12: "2nd House: Passed",
  13: "Joint Session (if needed)", 14: "Presidential Assent", 15: "Gazette Notification",
  16: "Notified / In Force",
}

interface StageTimelineProps {
  stageEvents: StageEvent[]
  currentStage: number | null
  coveredCount: number
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: springs.moderate },
}

const cardVariants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { ...springs.moderate, delay: 0.05 } },
}

export function StageTimeline({ stageEvents, currentStage, coveredCount }: StageTimelineProps) {
  return (
    <section>
      <h2 className="text-subheading mb-1" style={{ color: "var(--text-primary)" }}>
        Stage Timeline
      </h2>
      <p className="text-[12px] mb-6" style={{ color: "var(--text-tertiary)" }}>
        16-stage parliamentary lifecycle · {coveredCount} of 16 stages documented
      </p>

      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Single continuous vertical line */}
        <div
          className="absolute top-[6px] bottom-[6px] w-px"
          style={{ left: 5, background: "var(--border)" }}
        />

        {Array.from({ length: 16 }, (_, i) => i + 1).map((stage) => {
          const eventsAtStage = stageEvents.filter((e) => e.stage === stage)
          const hasEvents = eventsAtStage.length > 0
          const stageLabel = STAGE_LABELS[stage] ?? `Stage ${stage}`
          const isCurrentStage = currentStage === stage

          return (
            <motion.div key={stage} variants={rowVariants} className="flex items-start gap-4 pb-4">
              {/* Dot */}
              <div className="shrink-0 pt-[3px]" style={{ width: 12 }}>
                <motion.div
                  className="w-[10px] h-[10px] rounded-full relative z-10"
                  style={{
                    background: hasEvents
                      ? "var(--accent)"
                      : isCurrentStage
                      ? "var(--text-tertiary)"
                      : "var(--border-strong)",
                    outline: isCurrentStage ? "2px solid var(--accent)" : "none",
                    outlineOffset: "2px",
                  }}
                  animate={hasEvents ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3, delay: stage * 0.02 }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--text-disabled)" }}>
                    {String(stage).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[12px] font-[450]"
                    style={{
                      color: hasEvents ? "var(--text-primary)" : "var(--text-disabled)",
                      fontVariationSettings: hasEvents ? "'wght' 510" : "'wght' 400",
                    }}
                  >
                    {stageLabel}
                  </span>
                </div>

                {eventsAtStage.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={cardVariants}
                    className="mb-2 rounded-[4px] px-3 py-2"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <p className="text-[12px] leading-relaxed flex-1 min-w-0" style={{ color: "var(--text-secondary)" }}>
                        {event.description}
                      </p>
                      {(event.event_date || event.house) && (
                        <div className="shrink-0 text-right" style={{ minWidth: 52 }}>
                          {event.event_date && (
                            <div className="text-[11px] font-mono whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>
                              {event.event_date}
                            </div>
                          )}
                          {event.house && (
                            <div className="text-[10px] uppercase" style={{ color: "var(--text-disabled)" }}>
                              {event.house === "lok_sabha" ? "LS" : event.house === "rajya_sabha" ? "RS" : event.house}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {event.verbatim_quote && (
                      <blockquote
                        className="mt-2 pl-2 text-[11px] leading-relaxed italic"
                        style={{ color: "var(--text-tertiary)", borderLeft: "2px solid var(--border-strong)" }}
                      >
                        &ldquo;{event.verbatim_quote}&rdquo;
                        {event.verbatim_speaker_name && (
                          <span className="not-italic ml-1" style={{ color: "var(--text-disabled)" }}>
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
                        className="mt-1.5 flex items-center gap-1 text-[10px] w-fit transition-colors hover:text-[var(--text-secondary)]"
                        style={{ color: "var(--text-disabled)", textDecoration: "none" }}
                      >
                        <ExternalLink size={9} />
                        {event.source_label ?? "Source"}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
