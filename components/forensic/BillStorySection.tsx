// Contextual "story" sections for a bill detail page. Rendered above the
// 16-stage parliamentary StageTimeline — gives a reader the political moment,
// stakeholders, narrative events, scale stats, and verification sources.
//
// All visual tokens follow UI_RULES.md — colours via var(--...), weights via
// fontVariationSettings, numbers via lib/format helpers at call sites.

"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type {
  BillStory,
  BillStakeholder,
  BillStoryEvent,
  BillStat,
  BillFurtherReading,
} from "@/lib/db/billStory"
import { fontWeights } from "@/lib/font-weight"

// ── side accent colour for stakeholder cards ────────────────────────────────
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
      <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
        {children}
      </h2>
      {sub ? (
        <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          {sub}
        </p>
      ) : null}
    </div>
  )
}

function SourceLink({
  source,
  source_pending,
  label = "Source",
}: {
  source?: string
  source_pending?: boolean
  label?: string
}) {
  if (source) {
    return (
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px]"
        style={{ color: "var(--accent)", textDecoration: "none" }}
      >
        {label} <ExternalLink size={10} strokeWidth={1.5} />
      </a>
    )
  }
  if (source_pending) {
    return (
      <span
        className="inline-block text-[10px] uppercase tracking-wide"
        style={{ color: "var(--text-disabled)" }}
      >
        Source pending
      </span>
    )
  }
  return null
}

function StakeholderCard({ s }: { s: BillStakeholder }) {
  const tone = SIDE_COLOR[s.side]
  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative p-3 rounded-[6px]"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 1, background: tone }}
      />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h3
          className="text-[13px] leading-tight"
          style={{
            color: "var(--text-primary)",
            fontVariationSettings: fontWeights.semibold,
            letterSpacing: "-0.011em",
          }}
        >
          {s.actor}
        </h3>
        <span
          className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[2px] whitespace-nowrap"
          style={{
            color: tone,
            background: `color-mix(in srgb, ${tone} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${tone} 35%, transparent)`,
            fontVariationSettings: fontWeights.medium,
          }}
        >
          {SIDE_LABEL[s.side]}
        </span>
      </div>
      <p
        className="text-[12.5px] leading-relaxed mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {s.position}
      </p>
      {s.quote ? (
        <blockquote
          className="text-[12px] italic leading-relaxed mb-1.5 pl-2"
          style={{
            color: "var(--text-tertiary)",
            borderLeft: "2px solid var(--border-strong)",
          }}
        >
          &ldquo;{s.quote}&rdquo;
        </blockquote>
      ) : null}
      <SourceLink source={s.source} source_pending={s.source_pending} />
    </motion.div>
  )
}

function StoryEventRow({ ev }: { ev: BillStoryEvent }) {
  return (
    <li className="relative pl-5">
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          left: -4,
          top: 7,
          width: 7,
          height: 7,
          background: "var(--text-tertiary)",
          boxShadow: "0 0 0 3px var(--bg-base)",
        }}
      />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className="text-[11px] font-mono tabular-nums"
          style={{ color: "var(--text-secondary)" }}
        >
          {ev.date}
        </span>
        <span
          className="text-[13px] leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {ev.headline}
        </span>
        <SourceLink source={ev.source} source_pending={ev.source_pending} />
      </div>
    </li>
  )
}

function StatCard({ s }: { s: BillStat }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="stat-card"
    >
      <span className="label">{s.label}</span>
      <span className="value">{s.value}</span>
      {s.caveat ? <span className="note">{s.caveat}</span> : null}
    </motion.div>
  )
}

function ReadingRow({ r }: { r: BillFurtherReading }) {
  // Each row uses `display: contents` so its cells flow into the parent <ul>'s
  // grid tracks. This makes every column auto-size to the widest cell across
  // all rows, instead of each row sizing independently.
  // Note: whileHover on display:contents elements is not supported by framer-motion,
  // so we apply the hover background to the li wrapper using CSS instead.
  const cells = (
    <>
      <span
        className="text-[11px] font-mono tabular-nums whitespace-nowrap py-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        {r.date}
      </span>
      <span
        className="text-[11px] uppercase tracking-[0.06em] whitespace-nowrap py-1"
        style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}
      >
        {r.domain}
      </span>
      <span
        className="text-[13px] py-1"
        style={{ color: "var(--text-primary)" }}
      >
        {r.headline}
      </span>
      {r.source ? (
        <span
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide whitespace-nowrap py-1"
          style={{ color: "var(--accent)" }}
        >
          Open <ExternalLink size={10} strokeWidth={1.5} />
        </span>
      ) : r.source_pending ? (
        <span
          className="text-[10px] uppercase tracking-wide whitespace-nowrap py-1"
          style={{ color: "var(--text-disabled)" }}
        >
          Source pending
        </span>
      ) : (
        <span aria-hidden className="py-1" />
      )}
    </>
  )
  if (r.source) {
    return (
      <li style={{ display: "contents" }}>
        <a
          href={r.source}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "contents", textDecoration: "none" }}
        >
          {cells}
        </a>
      </li>
    )
  }
  return <li style={{ display: "contents" }}>{cells}</li>
}

export function BillStorySection({ story }: { story: BillStory }) {
  const supporters = story.stakeholders.filter((s) => s.side === "support")
  const opposers = story.stakeholders.filter((s) => s.side === "oppose")
  const neutral = story.stakeholders.filter((s) => s.side === "neutral")

  return (
    <div className="space-y-10">
      {/* 1. What this bill does */}
      <section>
        <SectionHeading sub="Plain-English explainer">What this bill does</SectionHeading>
        <p
          className="text-[14px] leading-relaxed max-w-3xl"
          style={{ color: "var(--text-secondary)" }}
        >
          {story.what_it_does}
        </p>
      </section>

      {/* 2. Why it matters */}
      <section>
        <SectionHeading sub="The political and social moment around this bill">
          Why it matters
        </SectionHeading>
        <p
          className="text-[14px] leading-relaxed max-w-3xl"
          style={{ color: "var(--text-secondary)" }}
        >
          {story.why_it_matters}
        </p>
      </section>

      {/* 3. Where it stands */}
      <section>
        <SectionHeading sub="What &lsquo;Pending&rsquo; or &lsquo;In force&rsquo; actually means for this bill">
          Where it stands
        </SectionHeading>
        <p
          className="text-[14px] leading-relaxed max-w-3xl"
          style={{ color: "var(--text-secondary)" }}
        >
          {story.where_it_stands}
        </p>
      </section>

      {/* 4. Stakeholders — grouped by stance */}
      {story.stakeholders.length > 0 ? (
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
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: SIDE_COLOR[side] }}
                      aria-hidden
                    />
                    <h3
                      className="text-[11px] uppercase tracking-[0.08em]"
                      style={{
                        color: "var(--text-secondary)",
                        fontVariationSettings: fontWeights.semibold,
                      }}
                    >
                      {label}
                    </h3>
                    <span
                      className="text-[11px] tabular-nums"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {group.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.map((s, i) => (
                      <StakeholderCard key={`${s.actor}-${i}`} s={s} />
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {/* 5. Story timeline (narrative — distinct from the 16-stage parliamentary timeline below) */}
      {story.events.length > 0 ? (
        <section>
          <SectionHeading sub="What was happening in the country around this bill">
            Story timeline
          </SectionHeading>
          <ol
            className="relative space-y-3 pl-3"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            {story.events.map((ev, i) => (
              <StoryEventRow key={`${ev.date}-${i}`} ev={ev} />
            ))}
          </ol>
        </section>
      ) : null}

      {/* 6. By the numbers */}
      {story.stats.length > 0 ? (
        <section>
          <SectionHeading sub="Scale and context, in numbers">By the numbers</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {story.stats.map((s, i) => (
              <StatCard key={`${s.label}-${i}`} s={s} />
            ))}
          </div>
        </section>
      ) : null}

      {/* (Stage Timeline renders below this component, in the page itself.) */}

      {/* 8. Read more / sources — receipts */}
      {story.further_reading.length > 0 ? (
        <section>
          <SectionHeading sub="Verifying the claims above — primary documents and reporting">
            Read more
          </SectionHeading>
          <ul
            // Single grid for all rows — each row uses display:contents so
            // columns auto-size to the widest cell across the whole list.
            // Column order: date · domain · headline · status.
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto minmax(0, 1fr) auto",
              columnGap: 16,
              rowGap: 2,
              alignItems: "center",
            }}
          >
            {story.further_reading.map((r, i) => (
              <ReadingRow key={`${r.domain}-${i}`} r={r} />
            ))}
          </ul>
          <div className="caveat-block mt-6">
            <strong>About these sources.</strong> Where we have a confident direct URL, it links
            out. Items marked &ldquo;Source pending&rdquo; reflect facts we are confident about from
            mainstream reporting but where we have not yet pinned a specific article URL — we&rsquo;d
            rather flag this than fabricate a link. The 16-stage parliamentary timeline below this
            section is independently sourced from PRS Legislative Research bill-track records.
          </div>
        </section>
      ) : null}
    </div>
  )
}

/** Empty state when no curated story exists for this bill slug. */
export function BillStoryEmptyState() {
  return (
    <section>
      <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
        Contextual story being compiled.{" "}
        <a
          href="mailto:contribute@bharatmanifesto.watch?subject=Bill%20story%20data"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          Contribute a verified record →
        </a>
      </p>
    </section>
  )
}
