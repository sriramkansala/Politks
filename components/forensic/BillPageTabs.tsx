"use client"

import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { StageTimeline } from "@/components/forensic/StageTimeline"
import { ForensicSignals } from "@/components/forensic/ForensicSignalCard"
import { IssueGraph, type GraphNode, type GraphEdge } from "@/components/forensic/IssueGraph"
import { fontWeights } from "@/lib/font-weight"
import type { BillStory, BillStakeholder, BillStat, BillFurtherReading, BillStoryEvent } from "@/lib/db/billStory"
import type { StageEvent } from "@/lib/db/types"

// ─── shared sub-components ────────────────────────────────────────────────────

const SIDE_COLOR: Record<BillStakeholder["side"], string> = {
  support: "var(--status-kept)",
  oppose: "var(--status-broken)",
  neutral: "var(--text-disabled)",
}
const SIDE_LABEL: Record<BillStakeholder["side"], string> = {
  support: "Supports",
  oppose: "Opposes",
  neutral: "Neutral",
}

function SectionHeading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-3">
      <h2 className="h-section" style={{ color: "var(--text-primary)" }}>{children}</h2>
      {sub && <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</p>}
    </div>
  )
}

function SourceLink({ source, source_pending }: { source?: string; source_pending?: boolean }) {
  if (source) return (
    <a href={source} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[11px]"
      style={{ color: "var(--accent)", textDecoration: "none" }}>
      Source <ExternalLink size={10} strokeWidth={1.5} />
    </a>
  )
  if (source_pending) return (
    <span className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-disabled)" }}>
      Source pending
    </span>
  )
  return null
}

function StakeholderCard({ s }: { s: BillStakeholder }) {
  const tone = SIDE_COLOR[s.side]
  return (
    <div className="relative p-3 rounded-[6px]"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <span aria-hidden className="absolute left-0 top-0 bottom-0 rounded-l-[6px]"
        style={{ width: 3, background: tone }} />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h3 className="text-[13px] leading-tight"
          style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
          {s.actor}
        </h3>
        <span className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[2px] whitespace-nowrap shrink-0"
          style={{
            color: tone,
            background: `color-mix(in srgb, ${tone} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${tone} 35%, transparent)`,
            fontVariationSettings: fontWeights.medium,
          }}>
          {SIDE_LABEL[s.side]}
        </span>
      </div>
      <p className="text-[12.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {s.position}
      </p>
      {s.quote && (
        <blockquote className="text-[12px] italic leading-relaxed mb-1.5 pl-2"
          style={{ color: "var(--text-tertiary)", borderLeft: "2px solid var(--border-strong)" }}>
          &ldquo;{s.quote}&rdquo;
        </blockquote>
      )}
      <SourceLink source={s.source} source_pending={s.source_pending} />
    </div>
  )
}

function StatCard({ s }: { s: BillStat }) {
  return (
    <div className="stat-card">
      <span className="label">{s.label}</span>
      <span className="value">{s.value}</span>
      {s.caveat && <span className="note">{s.caveat}</span>}
    </div>
  )
}

function EventRow({ ev }: { ev: BillStoryEvent }) {
  return (
    <li className="relative pl-5">
      <span aria-hidden className="absolute rounded-full"
        style={{ left: -4, top: 7, width: 7, height: 7, background: "var(--text-tertiary)", boxShadow: "0 0 0 3px var(--bg-base)" }} />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[11px] font-mono tabular-nums" style={{ color: "var(--text-secondary)" }}>
          {ev.date}
        </span>
        <span className="text-[13px] leading-snug" style={{ color: "var(--text-primary)" }}>
          {ev.headline}
        </span>
        <SourceLink source={ev.source} source_pending={ev.source_pending} />
      </div>
    </li>
  )
}

function ReadingRow({ r }: { r: BillFurtherReading }) {
  const cells = (
    <>
      <span className="text-[11px] font-mono tabular-nums whitespace-nowrap py-1"
        style={{ color: "var(--text-tertiary)" }}>{r.date}</span>
      <span className="text-[11px] uppercase tracking-[0.06em] whitespace-nowrap py-1"
        style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}>{r.domain}</span>
      <span className="text-[13px] py-1" style={{ color: "var(--text-primary)" }}>{r.headline}</span>
      {r.source ? (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide whitespace-nowrap py-1"
          style={{ color: "var(--accent)" }}>Open <ExternalLink size={10} strokeWidth={1.5} /></span>
      ) : r.source_pending ? (
        <span className="text-[10px] uppercase tracking-wide whitespace-nowrap py-1"
          style={{ color: "var(--text-disabled)" }}>Source pending</span>
      ) : <span aria-hidden className="py-1" />}
    </>
  )
  if (r.source) return (
    <li style={{ display: "contents" }}>
      <a href={r.source} target="_blank" rel="noopener noreferrer"
        style={{ display: "contents", textDecoration: "none" }}>{cells}</a>
    </li>
  )
  return <li style={{ display: "contents" }}>{cells}</li>
}


// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { value: "overview",     label: "Overview" },
  { value: "story",        label: "Story" },
  { value: "history",      label: "History" },
  { value: "implications", label: "Implications" },
] as const

// ─── Main component ───────────────────────────────────────────────────────────

interface BillPageTabsProps {
  story: BillStory | null
  stageEvents: StageEvent[]
  currentStage: number | null
  coveredCount: number
  isWrbSeries: boolean
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  showForensicSignals: boolean
  billVotes?: {
    lok_sabha_ayes?: number | null
    lok_sabha_noes?: number | null
    rajya_sabha_ayes?: number | null
    rajya_sabha_noes?: number | null
  }
}

export function BillPageTabs({
  story,
  stageEvents,
  currentStage,
  coveredCount,
  isWrbSeries,
  graphNodes,
  graphEdges,
  showForensicSignals,
  billVotes,
}: BillPageTabsProps) {
  const supporters = story?.stakeholders.filter((s) => s.side === "support") ?? []
  const opposers   = story?.stakeholders.filter((s) => s.side === "oppose") ?? []
  const neutral    = story?.stakeholders.filter((s) => s.side === "neutral") ?? []

  return (
    <Tabs defaultValue="overview">
      {/* Tab strip */}
      <div className="mb-8">
        <TabsList className="bg-transparent p-0 gap-1">
          {TABS.map((tab) => (
            <TabItem key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsList>
      </div>

      {/* ── Tab 1: Overview ────────────────────────────────────────────────── */}
      <TabPanel value="overview">
        <AnimateIn stagger className="space-y-8">
          {story ? (
            <AnimateItem>
              <section>
                <SectionHeading sub="Plain-English explainer">What this bill does</SectionHeading>
                <p className="text-[14px] leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
                  {story.what_it_does}
                </p>
              </section>
            </AnimateItem>
          ) : (
            <AnimateItem>
              <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                Contextual overview being compiled.
              </p>
            </AnimateItem>
          )}

          {/* Vote counts */}
          {(billVotes?.lok_sabha_ayes != null || billVotes?.rajya_sabha_ayes != null) && (
            <AnimateItem>
              <section>
                <SectionHeading sub="Parliamentary vote record">Voting record</SectionHeading>
                <AnimateIn stagger className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {billVotes?.lok_sabha_ayes != null && (
                    <AnimateItem>
                      <div className="stat-card tone-good">
                        <span className="label">Lok Sabha — Ayes</span>
                        <span className="value">{billVotes.lok_sabha_ayes}</span>
                      </div>
                    </AnimateItem>
                  )}
                  {billVotes?.lok_sabha_noes != null && (
                    <AnimateItem>
                      <div className="stat-card tone-bad">
                        <span className="label">Lok Sabha — Noes</span>
                        <span className="value">{billVotes.lok_sabha_noes}</span>
                      </div>
                    </AnimateItem>
                  )}
                  {billVotes?.rajya_sabha_ayes != null && (
                    <AnimateItem>
                      <div className="stat-card tone-good">
                        <span className="label">Rajya Sabha — Ayes</span>
                        <span className="value">{billVotes.rajya_sabha_ayes}</span>
                      </div>
                    </AnimateItem>
                  )}
                  {billVotes?.rajya_sabha_noes != null && (
                    <AnimateItem>
                      <div className="stat-card tone-bad">
                        <span className="label">Rajya Sabha — Noes</span>
                        <span className="value">{billVotes.rajya_sabha_noes}</span>
                      </div>
                    </AnimateItem>
                  )}
                </AnimateIn>
              </section>
            </AnimateItem>
          )}

          {/* Stats */}
          {story && story.stats.length > 0 && (
            <AnimateItem>
              <section>
                <SectionHeading sub="Scale and context, in numbers">By the numbers</SectionHeading>
                <AnimateIn stagger className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {story.stats.map((s, i) => (
                    <AnimateItem key={i}><StatCard s={s} /></AnimateItem>
                  ))}
                </AnimateIn>
              </section>
            </AnimateItem>
          )}
        </AnimateIn>
      </TabPanel>

      {/* ── Tab 2: Story ───────────────────────────────────────────────────── */}
      <TabPanel value="story">
        <AnimateIn stagger className="space-y-8">
          {story ? (
            <>
              <AnimateItem>
                <section>
                  <SectionHeading sub="The political and social moment around this bill">
                    Why it matters
                  </SectionHeading>
                  <p className="text-[14px] leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
                    {story.why_it_matters}
                  </p>
                </section>
              </AnimateItem>

              {story.stakeholders.length > 0 && (
                <AnimateItem>
                  <section>
                    <SectionHeading sub="Who supports, opposes, or has taken a formal position">
                      Stakeholders
                    </SectionHeading>
                    <div className="space-y-6">
                      {([
                        ["support", "Supports", supporters],
                        ["oppose",  "Opposes",  opposers],
                        ["neutral", "Neutral",  neutral],
                      ] as const).map(([side, label, group]) =>
                        group.length > 0 ? (
                          <div key={side}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full"
                                style={{ background: SIDE_COLOR[side] }} aria-hidden />
                              <span className="text-[11px] uppercase tracking-[0.08em]"
                                style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.semibold }}>
                                {label}
                              </span>
                              <span className="text-[11px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                                {group.length}
                              </span>
                            </div>
                            <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {group.map((s, i) => (
                                <AnimateItem key={i}><StakeholderCard s={s} /></AnimateItem>
                              ))}
                            </AnimateIn>
                          </div>
                        ) : null,
                      )}
                    </div>
                  </section>
                </AnimateItem>
              )}
            </>
          ) : (
            <AnimateItem>
              <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                Story being compiled for this bill.
              </p>
            </AnimateItem>
          )}
        </AnimateIn>
      </TabPanel>

      {/* ── Tab 3: History ─────────────────────────────────────────────────── */}
      <TabPanel value="history">
        <AnimateIn stagger className="space-y-10">
          {/* Narrative events */}
          {story && story.events.length > 0 && (
            <AnimateItem>
              <section>
                <SectionHeading sub="Key moments in the life of this bill">
                  Narrative timeline
                </SectionHeading>
                <ol className="relative space-y-3 pl-3"
                  style={{ borderLeft: "1px solid var(--border)" }}>
                  {[...story.events]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((ev, i) => <EventRow key={i} ev={ev} />)}
                </ol>
              </section>
            </AnimateItem>
          )}

          {/* 16-stage parliamentary timeline */}
          <AnimateItem>
            <StageTimeline
              stageEvents={stageEvents}
              currentStage={currentStage}
              coveredCount={coveredCount}
            />
          </AnimateItem>

          {/* Causal graph — WRB series only */}
          {isWrbSeries && graphNodes.length > 0 && (
            <AnimateItem>
              <section>
                <SectionHeading sub="Relationships between bills, MPs, and blocking events">
                  Causal graph
                </SectionHeading>
                <div className="rounded-[6px] overflow-hidden p-4"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <IssueGraph nodes={graphNodes} edges={graphEdges} width={920} height={480} />
                </div>
              </section>
            </AnimateItem>
          )}
        </AnimateIn>
      </TabPanel>

      {/* ── Tab 4: Implications ────────────────────────────────────────────── */}
      <TabPanel value="implications">
        <AnimateIn stagger className="space-y-8">
          {story ? (
            <>
              <AnimateItem>
                <section>
                  <SectionHeading sub="What this means in practice beyond the status pill">
                    Where it stands
                  </SectionHeading>
                  <p className="text-[14px] leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
                    {story.where_it_stands}
                  </p>
                </section>
              </AnimateItem>

              {showForensicSignals && (
                <AnimateItem>
                  <section>
                    <SectionHeading sub="Automated signals detected by the Neo Nīti forensic engine">
                      Forensic signals
                    </SectionHeading>
                    <ForensicSignals />
                  </section>
                </AnimateItem>
              )}

              {story.further_reading.length > 0 && (
                <AnimateItem>
                  <section>
                    <SectionHeading sub="Primary documents and reporting">
                      Further reading
                    </SectionHeading>
                    <ul style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto minmax(0, 1fr) auto",
                      columnGap: 16,
                      rowGap: 2,
                      alignItems: "center",
                    }}>
                      {story.further_reading.map((r, i) => <ReadingRow key={i} r={r} />)}
                    </ul>
                    <div className="caveat-block mt-6">
                      <strong>About these sources.</strong> Where we have a confident direct URL it
                      links out. Items marked &ldquo;Source pending&rdquo; reflect facts we are confident about
                      from mainstream reporting but where we have not yet pinned a specific article URL.
                    </div>
                  </section>
                </AnimateItem>
              )}
            </>
          ) : (
            <AnimateItem>
              <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                Implications analysis being compiled for this bill.
              </p>
            </AnimateItem>
          )}
        </AnimateIn>
      </TabPanel>
    </Tabs>
  )
}
