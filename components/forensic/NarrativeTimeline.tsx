"use client"

// ─── NarrativeTimeline ──────────────────────────────────────────────────────
//
// Editorial chronicle of a bill's life — "date-tile chronicle with narrative
// pauses." The timeline structure itself is the design device, not category
// iconography.
//
// Borrowed patterns:
//   - Bloomberg / NYT story timelines: big date stack in the left column —
//     day, uppercase month, small year. Date is the anchor.
//   - The Pudding "Congressional Gridlock": long gaps rendered as explicit
//     narrative pauses ("4 months pass") with horizontal rules.
//   - Apple Health: category encoded as a 2px accent strip on the date tile.
//   - GitHub commit list: date-stamp section pattern at top of each row.
//   - Linear roadmap: month/quarter dividers carry their own visual weight.
//   - StageTimeline pacing rail (this project): click-to-scroll with flash
//     highlight when navigating to a row.
//
// What changed from the icon-rail version:
//   - REMOVED: per-event category icons (Briefcase/Users/Vote etc.) — they
//     were generic clip-art that duplicated the text category label.
//   - REMOVED: 39-dot member grid — a row of identical dots conveyed
//     nothing about the actual composition of the body.
//   - ADDED: prominent date tile per row, with a category-tone left-edge
//     accent strip.
//   - ADDED: GapMarker section breaks between events when gap >= 14 days.
//   - ADDED: clickable pacing-strip pins that scroll to the matching row.
//   - KEPT: VoteBar, number emphasis, currency tail, adaptive source caveat.
// ─────────────────────────────────────────────────────────────────────────────

import { Fragment, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import type { BillStoryEvent } from "@/lib/db/billStory"

// ─── Date helpers ────────────────────────────────────────────────────────────

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function parseDate(d: string): { y: string; mi: number; day: number } | null {
  const [y, m, day] = d.split("-")
  const mi = parseInt(m, 10) - 1
  const dayN = parseInt(day, 10)
  if (isNaN(mi) || mi < 0 || mi > 11 || isNaN(dayN)) return null
  return { y, mi, day: dayN }
}

function daysBetween(a: string, b: string): number | null {
  const t1 = new Date(a).getTime()
  const t2 = new Date(b).getTime()
  if (isNaN(t1) || isNaN(t2)) return null
  return Math.round((t2 - t1) / 86400000)
}

function humanShortGap(days: number): string | null {
  // Only for "short" gaps surfaced in the meta row. Long gaps get a GapMarker.
  if (days <= 0)  return "same day"
  if (days === 1) return "1 day later"
  if (days < 14)  return `${days} days later`
  return null
}

function humanLongGap(days: number): string {
  if (days < 60)  return `${Math.round(days / 7)} weeks pass`
  if (days < 730) return `${Math.round(days / 30)} months pass`
  return `${(days / 365).toFixed(1)} years pass`
}

function humanAge(days: number): string {
  if (days <= 0)  return "today"
  if (days === 1) return "yesterday"
  if (days < 14)  return `${days} days ago`
  if (days < 60)  return `${Math.round(days / 7)} weeks ago`
  if (days < 730) return `${Math.round(days / 30)} months ago`
  return `${(days / 365).toFixed(1)} years ago`
}

function arcLabel(events: BillStoryEvent[]): string | null {
  if (events.length < 2) return null
  const dates = events.map(e => e.date).sort()
  const days = daysBetween(dates[0], dates[dates.length - 1])
  if (days === null || days <= 0) return null
  if (days < 31)  return `${days}-day arc`
  if (days < 365) return `${Math.round(days / 30)}-month arc`
  return `${(days / 365).toFixed(1)}-year arc`
}

// ─── Event classification ──────────────────────────────────────────────────
// Category label and tone only — no icons. Tone drives the date-tile accent
// strip and the meta-row category label color.

type Category =
  | "vote" | "assent" | "lapsed" | "introduction"
  | "cabinet" | "committee" | "report" | "milestone"

function classifyEvent(headline: string): Category {
  const h = headline.toLowerCase()
  if (/\b(lapsed|withdrawn|defeated|rejected|failed)\b/.test(h))                  return "lapsed"
  if (/\b(presidential assent|signed into law|notified in.+gazette)\b/.test(h))   return "assent"
  if (/\b(vote|passes|passed|division|ayes|noes)\b/.test(h))                      return "vote"
  if (/\b(introduced|first reading)\b/.test(h))                                   return "introduction"
  if (/\b(cabinet)\b/.test(h))                                                    return "cabinet"
  if (/\b(committee|jpc|referred to.+committee|standing committee)\b/.test(h))    return "committee"
  if (/\b(report|kovind|commission|recommend)\b/.test(h))                         return "report"
  return "milestone"
}

const CATEGORY_META: Record<Category, { label: string }> = {
  vote:         { label: "Vote"         },
  assent:       { label: "Assent"       },
  lapsed:       { label: "Lapsed"       },
  introduction: { label: "Introduction" },
  cabinet:      { label: "Cabinet"      },
  committee:    { label: "Committee"    },
  report:       { label: "Report"       },
  milestone:    { label: "Milestone"    },
}

// ─── Vote tally extraction ─────────────────────────────────────────────────

interface VoteTally {
  yea: number
  nay: number
  threshold?: number
  thresholdLabel?: string
  passed: boolean
}

function extractVoteTally(headline: string): VoteTally | null {
  const m = headline.match(/(\d{2,4})\s*[-–]\s*(\d{2,4})/)
  if (!m) return null
  const yea = parseInt(m[1], 10)
  const nay = parseInt(m[2], 10)
  if (!yea || !nay) return null

  const total = yea + nay
  const lower = headline.toLowerCase()

  let threshold: number | undefined
  let thresholdLabel: string | undefined

  if (/two-thirds|2\/3/.test(lower)) {
    threshold = Math.ceil(total * 2 / 3)
    thresholdLabel = "for ⅔ majority"
  } else if (/three-fourths|3\/4|three-fifths/.test(lower)) {
    threshold = Math.ceil(total * 3 / 4)
    thresholdLabel = "for ¾ majority"
  } else if (/short of|fell short|failed to/.test(lower)) {
    threshold = Math.ceil(total * 2 / 3)
    thresholdLabel = "needed"
  }

  const passed = threshold !== undefined ? yea >= threshold : yea > nay
  return { yea, nay, threshold, thresholdLabel, passed }
}

// ─── Date tile (left rail) ─────────────────────────────────────────────────
// Neutral by design — the tile is the date anchor, not a category indicator.
// Category meaning lives in the text label in the meta row of each event.

function DateTile({ date }: { date: string }) {
  const p = parseDate(date)
  if (!p) return null
  return (
    <div
      style={{
        position: "relative",
        width: 60,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 6,
        borderRadius: "var(--radius-4)",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        textAlign: "left",
      }}
    >
      <div
        className="font-mono tabular-nums"
        style={{
          fontSize: 22,
          lineHeight: 1,
          color: "var(--text-primary)",
          fontVariationSettings: fontWeights.semibold,
          letterSpacing: "-0.02em",
        }}
      >
        {p.day}
      </div>
      <div
        className="uppercase"
        style={{
          marginTop: 4,
          fontSize: 9.5,
          letterSpacing: "0.1em",
          color: "var(--text-tertiary)",
          fontVariationSettings: fontWeights.semibold,
          lineHeight: 1,
        }}
      >
        {MONTHS_SHORT[p.mi]}
      </div>
      <div
        className="font-mono tabular-nums"
        style={{
          marginTop: 2,
          fontSize: 9.5,
          color: "var(--text-disabled)",
          fontVariationSettings: fontWeights.normal,
          lineHeight: 1,
        }}
      >
        {p.y}
      </div>
    </div>
  )
}

// ─── Gap marker (narrative pause between events) ───────────────────────────

function GapMarker({ days }: { days: number }) {
  const label = humanLongGap(days)
  return (
    <li
      aria-hidden
      style={{
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 0 16px 76px",  // align rule with content column (60px tile + 16px gap)
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background: "var(--border)",
        }}
      />
      <span
        className="uppercase"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.11em",
          color: "var(--text-disabled)",
          fontVariationSettings: fontWeights.semibold,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: "var(--border)",
        }}
      />
    </li>
  )
}

// ─── Inline vote bar ───────────────────────────────────────────────────────
// Westminster parliamentary convention: FOR (Ayes) is always green, AGAINST
// is neutral grey. Outcome is read geometrically — does the green reach the
// threshold line? — and via the verdict pill. Color carries SIDE, geometry
// carries OUTCOME.

function VoteBar({ tally }: { tally: VoteTally }) {
  const total = tally.yea + tally.nay
  const yeaPct = (tally.yea / total) * 100
  const thresholdPct = tally.threshold ? (tally.threshold / total) * 100 : null
  const hasThreshold = thresholdPct !== null
  const passed = tally.passed

  // FOR is always green (Westminster Ayes lobby colour).
  const yeaColor = "var(--success)"
  const nayColor = "var(--border-stronger)"

  const margin = tally.threshold
    ? passed
      ? tally.yea - tally.threshold
      : tally.threshold - tally.yea
    : Math.abs(tally.yea - tally.nay)

  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 14px 14px",
        borderRadius: "var(--radius-4)",
        background: "var(--bg-elevated-2)",
        border: "1px solid var(--border)",
      }}
    >
      {/* ── Header row: For / Against captions ──────────────────────
          Caption text stays neutral; the colored swatch acts as the
          legend that maps to the bar fill. */}
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 6 }}
      >
        <span
          className="uppercase flex items-baseline"
          style={{
            gap: 6,
            fontSize: 9.5,
            letterSpacing: "0.11em",
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: 1,
              background: yeaColor,
              display: "inline-block",
            }}
          />
          For
        </span>
        <span
          className="uppercase flex items-baseline"
          style={{
            gap: 6,
            fontSize: 9.5,
            letterSpacing: "0.11em",
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          Against
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: 1,
              background: nayColor,
              display: "inline-block",
            }}
          />
        </span>
      </div>

      {/* ── Threshold callout + Bar ───────────────────────────────────
          paddingTop reserves vertical space for the absolute-positioned
          threshold callout pill above the bar. Sized generously enough
          that tall glyphs (⅔, ¾) don't clip against the wrapper top. */}
      <div style={{ position: "relative", paddingTop: hasThreshold ? 28 : 0 }}>
        {/* Threshold callout tab above marker.
            NOTE: opacity-only animation (no `y` translate) — framer-motion
            writes `transform: translateY(...)` to the DOM when animating
            `y`, which would clobber the `transform: translateX(-50%)` we
            need to center the pill on the threshold line. */}
        {hasThreshold && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, delay: 0.5 }}
            style={{
              position: "absolute",
              top: 2,
              left: `${thresholdPct}%`,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span
              className="uppercase font-mono tabular-nums"
              style={{
                fontSize: 9.5,
                lineHeight: 1.4, // explicit so ⅔/¾ glyph metrics don't push the box around
                letterSpacing: "0.08em",
                color: "var(--text-primary)",
                fontVariationSettings: fontWeights.semibold,
                whiteSpace: "nowrap",
                padding: "2px 7px",
                borderRadius: "var(--radius-pill)",
                background: "var(--bg-base)",
                border: "1px solid var(--border-stronger)",
              }}
            >
              {tally.threshold} {tally.thresholdLabel ?? "needed"}
            </span>
          </motion.div>
        )}

        {/* The bar */}
        <div
          style={{
            position: "relative",
            height: 32,
            borderRadius: 3,
            background: nayColor,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          {/* For fill — solid */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${yeaPct}%` }}
            transition={{ ...springs.gentle, delay: 0.2 }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              background: yeaColor,
            }}
          />

          {/* In-bar For number — leading edge of segment.
              White on the success/broken fill works for both outcomes. */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.55 }}
            className="font-mono tabular-nums"
            style={{
              position: "absolute",
              left: 9,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12.5,
              color: "var(--text-primary)",
              fontVariationSettings: fontWeights.bold,
              letterSpacing: "0.01em",
              pointerEvents: "none",
            }}
          >
            {tally.yea}
          </motion.span>

          {/* In-bar Against number — trailing edge */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.55 }}
            className="font-mono tabular-nums"
            style={{
              position: "absolute",
              right: 9,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12.5,
              color: "var(--text-secondary)",
              fontVariationSettings: fontWeights.semibold,
              letterSpacing: "0.01em",
              pointerEvents: "none",
            }}
          >
            {tally.nay}
          </motion.span>

          {/* Threshold marker — tall 2px white vertical */}
          {hasThreshold && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.4 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ ...springs.snap, delay: 0.5 }}
              style={{
                position: "absolute",
                left: `${thresholdPct}%`,
                top: -4,
                bottom: -4,
                width: 0,
                borderLeft: "2px solid var(--text-primary)",
                transformOrigin: "center",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          )}
        </div>

        {/* Percentage scale (subtle, below bar) */}
        <div
          className="flex justify-between"
          style={{
            marginTop: 5,
            fontSize: 9,
            color: "var(--text-disabled)",
            fontVariationSettings: fontWeights.normal,
          }}
        >
          <span className="tabular-nums">
            {((tally.yea / total) * 100).toFixed(1)}%
          </span>
          <span className="tabular-nums">
            {((tally.nay / total) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* ── Verdict row — outcome pill + sentence ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.85 }}
        className="flex items-center"
        style={{
          marginTop: 12,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          className="uppercase"
          style={{
            fontSize: 9.5,
            padding: "2px 8px",
            borderRadius: "var(--radius-pill)",
            background: passed
              ? "color-mix(in oklab, var(--success) 16%, transparent)"
              : "color-mix(in oklab, var(--status-broken) 16%, transparent)",
            color: passed ? "var(--success)" : "var(--status-broken)",
            border: passed
              ? "1px solid color-mix(in oklab, var(--success) 32%, transparent)"
              : "1px solid color-mix(in oklab, var(--status-broken) 32%, transparent)",
            fontVariationSettings: fontWeights.semibold,
            letterSpacing: "0.08em",
          }}
        >
          {passed ? "Passed" : "Failed"}
        </span>

        {hasThreshold ? (
          <span
            style={{
              fontSize: 11.5,
              lineHeight: 1.4,
              color: "var(--text-secondary)",
              fontVariationSettings: fontWeights.medium,
            }}
          >
            {passed ? (
              <>
                <span
                  className="tabular-nums"
                  style={{
                    color: "var(--text-primary)",
                    fontVariationSettings: fontWeights.semibold,
                  }}
                >
                  {margin}
                </span>{" "}
                {margin === 1 ? "vote" : "votes"} above the{" "}
                {tally.thresholdLabel?.replace("for ", "").replace(" majority", "") ?? "majority"}
                {" "}line
              </>
            ) : (
              <>
                Short by{" "}
                <span
                  className="tabular-nums"
                  style={{
                    color: "var(--status-broken)",
                    fontVariationSettings: fontWeights.semibold,
                  }}
                >
                  {margin}
                </span>{" "}
                {margin === 1 ? "vote" : "votes"} —{" "}
                {margin} of the {tally.nay} Against{" "}
                {margin === 1 ? "vote" : "votes"} would have needed to flip
              </>
            )}
          </span>
        ) : (
          <span
            style={{
              fontSize: 11.5,
              lineHeight: 1.4,
              color: "var(--text-secondary)",
              fontVariationSettings: fontWeights.medium,
            }}
          >
            by{" "}
            <span
              className="tabular-nums"
              style={{
                color: "var(--text-primary)",
                fontVariationSettings: fontWeights.semibold,
              }}
            >
              {margin}
            </span>{" "}
            {margin === 1 ? "vote" : "votes"}
          </span>
        )}
      </motion.div>
    </div>
  )
}

// ─── Number emphasis inline ────────────────────────────────────────────────

const NUM_EMPHASIS_PATTERN = /(\d+[-–]\d+(?!-member)|\d+-member|\d+\s+member)/g

function emphasizeNumbers(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let m: RegExpExecArray | null
  let key = 0
  const rx = new RegExp(NUM_EMPHASIS_PATTERN.source, "g")
  while ((m = rx.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index))
    parts.push(
      <span
        key={`n${key++}`}
        className="tabular-nums"
        style={{
          fontVariationSettings: fontWeights.semibold,
          fontFeatureSettings: "'tnum'",
        }}
      >
        {m[0]}
      </span>
    )
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length === 0 ? text : parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)
}

// ─── Main component ────────────────────────────────────────────────────────

export function NarrativeTimeline({ events }: { events: BillStoryEvent[] }) {
  if (events.length === 0) return null

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
  const arc    = arcLabel(sorted)
  const allPending = sorted.every(e => !e.source && e.source_pending)

  const last = sorted[sorted.length - 1]
  const [ageDays, setAgeDays] = useState<number | null>(null)
  useEffect(() => {
    const todayISO = new Date().toISOString().slice(0, 10)
    setAgeDays(daysBetween(last.date, todayISO))
  }, [last.date])
  const stale   = ageDays !== null && ageDays > 30
  const ageText = ageDays !== null ? humanAge(ageDays) : null

  // Build an interleaved list of events and gap-markers so the chronicle
  // reads top-to-bottom with explicit narrative pauses for long gaps.
  type Row =
    | { kind: "event"; event: BillStoryEvent; index: number; gap: number | null }
    | { kind: "gap"; days: number; afterIndex: number }
  const rows: Row[] = []
  sorted.forEach((event, i) => {
    const prev = i > 0 ? sorted[i - 1] : null
    const gap  = prev ? daysBetween(prev.date, event.date) : null
    if (gap !== null && gap >= 14) {
      rows.push({ kind: "gap", days: gap, afterIndex: i - 1 })
    }
    rows.push({ kind: "event", event, index: i, gap })
  })

  return (
    <section>
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header style={{ marginBottom: 18 }}>
        <div
          className="flex items-baseline justify-between"
          style={{ gap: 12, marginBottom: 4 }}
        >
          <h2
            className="text-subheading"
            style={{ color: "var(--text-primary)" }}
          >
            Narrative timeline
          </h2>
          {arc && (
            <span
              className="font-mono tabular-nums shrink-0"
              style={{
                fontSize: 11,
                color: "var(--text-tertiary)",
                fontVariationSettings: fontWeights.normal,
              }}
            >
              {arc}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.normal,
          }}
        >
          The political story of this bill in {sorted.length}{" "}
          {sorted.length === 1 ? "moment" : "moments"} — from genesis to its
          current standing.
        </p>
      </header>

      {/* ─── Chronicle ──────────────────────────────────────────────── */}
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rows.map((row, ri) => {
          if (row.kind === "gap") {
            return <GapMarker key={`gap-${ri}`} days={row.days} />
          }
          return (
            <NarrativeMoment
              key={`evt-${row.index}`}
              event={row.event}
              gap={row.gap}
              index={row.index}
              isFirst={row.index === 0}
              isLast={row.index === sorted.length - 1}
              showInlineSource={!allPending && (!!row.event.source || !!row.event.source_pending)}
            />
          )
        })}
      </ol>

      {/* ─── Currency tail ──────────────────────────────────────────── */}
      {ageText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: [0.165, 0.84, 0.44, 1] }}
          style={{
            marginTop: 16,
            paddingLeft: 76, // align with content column
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              width: 18,
              height: 1,
              background: "var(--border-stronger)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: stale ? "var(--text-tertiary)" : "var(--text-disabled)",
              fontVariationSettings: fontWeights.normal,
              fontStyle: stale ? "italic" : "normal",
            }}
          >
            {stale
              ? `No new documented activity for ${ageText.replace(" ago", "")}.`
              : `Last documented activity ${ageText}.`}
          </span>
        </motion.div>
      )}

      {/* ─── Adaptive source caveat ─────────────────────────────────── */}
      {allPending && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 12,
            borderTop: "1px dashed var(--border)",
            maxWidth: "62ch",
          }}
        >
          <p
            style={{
              fontSize: 11.5,
              lineHeight: 1.55,
              color: "var(--text-tertiary)",
              fontVariationSettings: fontWeights.normal,
            }}
          >
            <span
              className="uppercase"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.11em",
                color: "var(--text-disabled)",
                fontVariationSettings: fontWeights.semibold,
                marginRight: 8,
              }}
            >
              Sources
            </span>
            These moments are confirmed from mainstream reporting but not yet
            pinned to specific URLs. Rather than fabricate citations, we flag
            the gap here.
          </p>
        </div>
      )}
    </section>
  )
}

// ─── Single moment ─────────────────────────────────────────────────────────

function NarrativeMoment({
  event,
  gap,
  index,
  isFirst,
  isLast,
  showInlineSource,
}: {
  event: BillStoryEvent
  gap: number | null
  index: number
  isFirst: boolean
  isLast: boolean
  showInlineSource: boolean
}) {
  const category = classifyEvent(event.headline)
  const meta     = CATEGORY_META[category]
  const voteTally = category === "vote" ? extractVoteTally(event.headline) : null

  // Short-gap label (< 14 days). Long gaps are handled by the GapMarker above.
  const shortGap = !isFirst && gap !== null && gap < 14
    ? humanShortGap(gap)
    : null

  return (
    <motion.li
      id={`narrative-event-${index}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.responsive, delay: 0.05 * index }}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "60px minmax(0, 1fr)",
        columnGap: 16,
        paddingTop: isFirst ? 0 : 8,
        paddingBottom: isLast ? 4 : 0,
        // Padding to give the highlight-flash animation breathing room.
        marginLeft: -6,
        marginRight: -6,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: "var(--radius-4)",
      }}
    >
      {/* ── Left rail: DateTile ────────────────────────────────── */}
      <DateTile date={event.date} />

      {/* ── Right content column ──────────────────────────────── */}
      <div style={{ minWidth: 0, paddingTop: 1 }}>
        {/* Meta row — CATEGORY · short-gap (if applicable) */}
        <div
          className="flex items-baseline"
          style={{
            gap: 8,
            marginBottom: 6,
            flexWrap: "wrap",
            rowGap: 2,
          }}
        >
          <span
            className="uppercase"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.1em",
              color: "var(--text-tertiary)",
              fontVariationSettings: fontWeights.semibold,
            }}
          >
            {meta.label}
          </span>
          {shortGap && (
            <>
              <span aria-hidden style={{ color: "var(--text-disabled)", fontSize: 11 }}>
                ·
              </span>
              <span
                className="uppercase"
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.09em",
                  color: "var(--text-tertiary)",
                  fontVariationSettings: fontWeights.semibold,
                }}
              >
                {shortGap}
              </span>
            </>
          )}
        </div>

        {/* Headline */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: "var(--text-primary)",
            fontVariationSettings: fontWeights.medium,
            letterSpacing: "var(--tracking-body)",
            maxWidth: "58ch",
          }}
        >
          {emphasizeNumbers(event.headline)}
        </p>

        {/* Inline vote bar — only when there's a tally to render */}
        {voteTally && <VoteBar tally={voteTally} />}

        {/* Source — quiet magazine footnote */}
        {showInlineSource && (
          <div style={{ marginTop: 8 }}>
            {event.source ? (
              <a
                href={event.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-colors hover:text-[var(--text-secondary)]"
                style={{
                  gap: 5,
                  fontSize: 10.5,
                  color: "var(--text-disabled)",
                  textDecoration: "none",
                  fontVariationSettings: fontWeights.medium,
                  letterSpacing: "0.01em",
                }}
              >
                <ExternalLink size={10} strokeWidth={2} />
                <span>Source</span>
              </a>
            ) : (
              <span
                className="inline-flex items-center"
                style={{
                  gap: 5,
                  fontSize: 10,
                  color: "var(--text-disabled)",
                  fontVariationSettings: fontWeights.normal,
                  fontStyle: "italic",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    border: "1px solid var(--text-disabled)",
                    background: "transparent",
                  }}
                />
                source pending
              </span>
            )}
          </div>
        )}
      </div>
    </motion.li>
  )
}
