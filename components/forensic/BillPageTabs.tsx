"use client"

import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { StageTimeline } from "@/components/forensic/StageTimeline"
import { NarrativeTimeline } from "@/components/forensic/NarrativeTimeline"
import { ForensicSignals } from "@/components/forensic/ForensicSignalCard"
import { IssueGraph, type GraphNode, type GraphEdge } from "@/components/forensic/IssueGraph"
import { StakeholderPanel } from "@/components/forensic/StakeholderPanel"
import { fontWeights } from "@/lib/font-weight"
import type { BillStory, BillStat, BillFurtherReading } from "@/lib/db/billStory"
import type { StageEvent } from "@/lib/db/types"

// ─── shared sub-components ────────────────────────────────────────────────────

function SectionHeading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-3">
      <h2 className="h-section" style={{ color: "var(--text-primary)" }}>{children}</h2>
      {sub && <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</p>}
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
                    <StakeholderPanel stakeholders={story.stakeholders} />
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
          {/* Narrative events — editorial story layer above the procedural
              16-stage StageTimeline below. See NarrativeTimeline.tsx for
              design rationale (NYT live-blog pattern, pacing as a first-
              class citizen, adaptive empty-states). */}
          {story && story.events.length > 0 && (
            <AnimateItem>
              <NarrativeTimeline events={story.events} />
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
                <div className="rounded-xl overflow-hidden p-4"
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
