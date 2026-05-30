"use client"

import { useMemo } from "react"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { fontWeights } from "@/lib/font-weight"
import type { BillStakeholder } from "@/lib/db/billStory"

// ═════════════════════════════════════════════════════════════════════════════
// STAKEHOLDER PANEL — v5 · "POSITION DOCKET"
//
// Reframe: the reader's first job is "what's the balance?", the second is
// "what did each actor actually argue?" v4 served the second but not the
// first — a flat power-ordered list hid the for/against split until you read
// it. v5 leads with a scan ribbon, then buckets cards into stance columns.
//
// Reference shelf:
//   • SCOTUSblog docket — two-side editorial brief frame.
//   • Ballotpedia ballot measures — side-by-side Support / Oppose sections.
//   • GovTrack position statements — bucketed by stance with count chips.
//   • Bloomberg Government — sentiment ribbon above bill stakeholder list.
//   • The Pudding "What House Members Said" — sub-8px tone ribbon as gestalt.
//   • Stripe Dispute — verbatim quote with 2px left border, italic tertiary.
//   • Linear Members — uppercase tracked section headers, mono counts.
//
// Layered:
//   1) The Lead — auto-generated BLUF (kept verbatim from v4).
//   2) Balance ribbon — 4-segment 6px bar + count strip.
//   3) Position docket — 3 columns (For / Against / Watch+Review) with
//      tight, top-bordered cards. No left strip, no ordinal index — the
//      column header carries stance, the role chip carries category.
// ═════════════════════════════════════════════════════════════════════════════

// ─── Role taxonomy ───────────────────────────────────────────────────────────

type Role =
  | "government"
  | "court"
  | "constitutional"
  | "opposition"
  | "committee"
  | "expert"
  | "civil"
  | "other"

const ROLE_LABEL: Record<Role, string> = {
  government:     "Govt",
  court:          "Court",
  constitutional: "Constitutional",
  opposition:     "Opposition",
  committee:      "Committee",
  expert:         "Expert",
  civil:          "Civil society",
  other:          "Stakeholder",
}

const ROLE_POWER: Record<Role, number> = {
  government:     100,
  court:           90,
  constitutional:  85,
  opposition:      75,
  committee:       60,
  expert:          50,
  civil:           40,
  other:           30,
}

function detectRole(actor: string): Role {
  const a = actor.toLowerCase()
  if (/government|ministry|cabinet|nda government|upa government|union government|prime minister|home minister|finance minister|law minister/.test(a)) return "government"
  if (/supreme court|high court|\bjustice |bench/.test(a) && !/justice b\.n\. srikrishna/.test(a)) return "court"
  if (/election commission|cag |comptroller|reserve bank|nhrc|cvc|lokpal|attorney general/.test(a)) return "constitutional"
  if (/committee|panel|jpc|standing committee/.test(a)) return "committee"
  if (/bloc|opposition|congress|bjp|dmk|tmc|trinamool|aap|samajwadi|rjd|aimim|jd\(|janata|cpi|cpm|owaisi/.test(a)) return "opposition"
  if (/foundation|union |morcha|guild|association|federation|sangh|samiti|forum|access now|sflc|internet freedom|kisan/.test(a)) return "civil"
  if (/justice |professor|dr\. |economist|jurist|former /.test(a)) return "expert"
  return "other"
}

// ─── Action verbs (unchanged from v4) ────────────────────────────────────────

type Tone = "for" | "against" | "watch" | "review"
type Action = { verb: string; tone: Tone }

function deriveAction(role: Role, side: BillStakeholder["side"]): Action {
  if (side === "neutral") {
    if (role === "committee") return { verb: "Reviewing",    tone: "review" }
    if (role === "court")     return { verb: "Deliberating", tone: "review" }
    if (role === "expert")    return { verb: "Weighing",     tone: "review" }
    if (role === "civil")     return { verb: "Watching",     tone: "review" }
    return { verb: "Watching", tone: "review" }
  }
  if (side === "support") {
    switch (role) {
      case "government":     return { verb: "Pushing",    tone: "for" }
      case "opposition":     return { verb: "Backing",    tone: "for" }
      case "court":          return { verb: "Upholding",  tone: "for" }
      case "constitutional": return { verb: "Approving",  tone: "for" }
      case "committee":      return { verb: "Endorsing",  tone: "for" }
      case "expert":         return { verb: "Endorsing",  tone: "for" }
      case "civil":          return { verb: "Advocating", tone: "for" }
      default:               return { verb: "Supporting", tone: "for" }
    }
  }
  switch (role) {
    case "government":     return { verb: "Resisting",     tone: "against" }
    case "opposition":     return { verb: "Resisting",     tone: "against" }
    case "court":          return { verb: "Striking down", tone: "against" }
    case "constitutional": return { verb: "Cautioning",    tone: "watch"   }
    case "committee":      return { verb: "Dissenting",    tone: "against" }
    case "expert":         return { verb: "Dissenting",    tone: "against" }
    case "civil":          return { verb: "Protesting",    tone: "against" }
    default:               return { verb: "Opposing",      tone: "against" }
  }
}

const TONE_COLOR: Record<Tone, string> = {
  for:     "var(--status-kept)",
  against: "var(--status-broken)",
  watch:   "var(--status-compromise)",
  review:  "var(--text-tertiary)",
}

// ─── Ordering & lead (preserved) ─────────────────────────────────────────────

function orderStakeholders(items: BillStakeholder[]): BillStakeholder[] {
  return [...items].sort((a, b) => {
    const pa = ROLE_POWER[detectRole(a.actor)]
    const pb = ROLE_POWER[detectRole(b.actor)]
    if (pa !== pb) return pb - pa
    const stanceOrder: Record<BillStakeholder["side"], number> = { support: 0, oppose: 1, neutral: 2 }
    return stanceOrder[a.side] - stanceOrder[b.side]
  })
}

function actorShortName(actor: string): string {
  return actor.replace(/\(.*?\)/g, "").trim().replace(/\s+/g, " ")
}
function articleFor(noun: string): string {
  return /^(a|e|i|o|u)/i.test(noun.replace(/^the\s+/i, "")) ? "an" : "a"
}
function joinList(parts: string[]): string {
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`
}

function generateLead(items: BillStakeholder[]): { sentences: string[] } {
  const ordered = orderStakeholders(items)
  const get  = (r: Role, side: BillStakeholder["side"]) =>
    ordered.filter((s) => detectRole(s.actor) === r && s.side === side)

  const govFor    = get("government", "support")[0]
  const govAgainst= get("government", "oppose")[0]
  const oppFor    = get("opposition", "support")
  const oppAgainst= get("opposition", "oppose")
  const courtFor  = get("court", "support")[0]
  const courtAg   = get("court", "oppose")[0]
  const constAg   = get("constitutional", "oppose")
  const constFor  = get("constitutional", "support")
  const cmteFor   = get("committee", "support")
  const cmteAg    = get("committee", "oppose")
  const cmteRev   = get("committee", "neutral")
  const civFor    = get("civil", "support")
  const civAg     = get("civil", "oppose")
  const expertFor = get("expert", "support")
  const expertAg  = get("expert", "oppose")

  const sentences: string[] = []

  if (govFor) {
    const allies: string[] = []
    if (cmteFor.length > 0) allies.push(`${articleFor(actorShortName(cmteFor[0].actor))} ${actorShortName(cmteFor[0].actor).toLowerCase()}`)
    if (oppFor.length > 0)  allies.push("cross-party backing")
    if (courtFor)           allies.push("the Supreme Court")
    if (constFor.length > 0) allies.push(actorShortName(constFor[0].actor))
    if (civFor.length > 0)   allies.push("civil-society advocates")
    if (expertFor.length > 0 && allies.length === 0) allies.push("expert support")
    sentences.push(
      allies.length > 0
        ? `The government is pushing the bill, backed by ${joinList(allies)}.`
        : `The government is pushing the bill.`
    )
  } else if (govAgainst) {
    sentences.push(`The government is resisting the proposal.`)
  } else if (oppFor.length > 0 && oppAgainst.length === 0) {
    sentences.push(`Opposition parties are backing the bill.`)
  } else if (cmteFor.length > 0) {
    sentences.push(`The proposal is endorsed by an advisory committee.`)
  } else if (civFor.length > 0) {
    sentences.push(`Civil-society groups are advocating for the bill.`)
  }

  const resistance: string[] = []
  if (oppAgainst.length > 0) resistance.push("opposition parties")
  if (constAg.length > 0)    resistance.push(`the ${actorShortName(constAg[0].actor)}`)
  if (courtAg)               resistance.push("the Supreme Court")
  if (civAg.length > 0)      resistance.push("civil-society groups")
  if (cmteAg.length > 0 && resistance.length === 0) resistance.push("a parliamentary committee")
  if (expertAg.length > 0 && resistance.length === 0) resistance.push("expert dissent")
  if (resistance.length > 0) {
    sentences.push(
      sentences.length > 0
        ? `It faces resistance from ${joinList(resistance)}.`
        : `The bill faces resistance from ${joinList(resistance)}.`
    )
  }

  if (cmteRev.length > 0) {
    const reviewer = actorShortName(cmteRev[0].actor)
    sentences.push(`${reviewer === "Joint Parliamentary Committee" ? "A Joint Parliamentary Committee" : `The ${reviewer}`} is currently reviewing.`)
  }

  if (sentences.length === 0) {
    const supports = items.filter((s) => s.side === "support").length
    const opposes  = items.filter((s) => s.side === "oppose").length
    if (supports + opposes > 0) {
      sentences.push(`${supports} stakeholder${supports === 1 ? "" : "s"} in favor; ${opposes} opposed.`)
    }
  }
  return { sentences }
}

// ═════════════════════════════════════════════════════════════════════════════
// THE LEAD
// ═════════════════════════════════════════════════════════════════════════════

function Lead({ sentences }: { sentences: string[] }) {
  if (sentences.length === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 pl-4"
      style={{ borderLeft: "2px solid var(--border-strong)" }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.14em] mb-1.5"
        style={{
          color: "var(--text-disabled)",
          fontVariationSettings: fontWeights.semibold,
        }}
      >
        The lead
      </div>
      <p
        className="text-[13px] leading-relaxed max-w-[64ch]"
        style={{
          color: "var(--text-primary)",
          fontVariationSettings: fontWeights.normal,
        }}
      >
        {sentences.join(" ")}
      </p>
    </motion.div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// BALANCE RIBBON — Pudding-style 6px stance gestalt + count strip
// ═════════════════════════════════════════════════════════════════════════════

const RIBBON_ORDER: { tone: Tone; label: string }[] = [
  { tone: "for",     label: "For"     },
  { tone: "watch",   label: "Watch"   },
  { tone: "review",  label: "Review"  },
  { tone: "against", label: "Against" },
]

function BalanceRibbon({ items }: { items: BillStakeholder[] }) {
  const counts = useMemo(() => {
    const c: Record<Tone, number> = { for: 0, against: 0, watch: 0, review: 0 }
    for (const s of items) {
      const role = detectRole(s.actor)
      c[deriveAction(role, s.side).tone] += 1
    }
    return c
  }, [items])

  const total = items.length
  if (total === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="mb-6"
    >
      {/* Count strip — uppercase, mono numerals, tone-tinted labels */}
      <div className="flex items-baseline flex-wrap" style={{ gap: 14, marginBottom: 6 }}>
        {RIBBON_ORDER.map((seg) => {
          const n = counts[seg.tone]
          const dim = n === 0
          return (
            <span
              key={seg.tone}
              className="inline-flex items-baseline"
              style={{ gap: 6, opacity: dim ? 0.4 : 1 }}
            >
              <span
                aria-hidden
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 1.5,
                  background: TONE_COLOR[seg.tone],
                  display: "inline-block",
                  transform: "translateY(-1px)",
                }}
              />
              <span
                className="uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.11em",
                  color: dim ? "var(--text-disabled)" : "var(--text-tertiary)",
                  fontVariationSettings: fontWeights.semibold,
                }}
              >
                {seg.label}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{
                  fontSize: 11,
                  color: dim ? "var(--text-disabled)" : "var(--text-primary)",
                  fontVariationSettings: fontWeights.semibold,
                  letterSpacing: "0.02em",
                }}
              >
                {n}
              </span>
            </span>
          )
        })}
      </div>

      {/* The bar */}
      <div
        style={{
          height: 6,
          width: "100%",
          display: "flex",
          gap: 2,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {RIBBON_ORDER.map((seg) => {
          const n = counts[seg.tone]
          if (n === 0) return null
          const pct = (n / total) * 100
          return (
            <motion.div
              key={seg.tone}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: TONE_COLOR[seg.tone],
                height: "100%",
              }}
              aria-label={`${seg.label}: ${n}`}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// POSITION CARD — tight editorial, top-edge tone accent, no ordinal
// ═════════════════════════════════════════════════════════════════════════════

function PositionCard({
  s, delay,
}: {
  s: BillStakeholder
  delay: number
}) {
  const role   = detectRole(s.actor)
  const action = deriveAction(role, s.side)
  const tone   = TONE_COLOR[action.tone]

  return (
    <motion.article
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1], delay }}
      className="group"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: "10px 12px 11px",
        transition: "background 120ms ease-out, border-color 120ms ease-out",
      }}
    >
      {/* Chip row — Linear "labels" pattern: tiny pill tags, top of card */}
      <div
        className="flex items-center flex-wrap"
        style={{ gap: 6, marginBottom: 7 }}
      >
        <span
          className="inline-flex items-center"
          style={{
            gap: 5,
            fontSize: 10,
            padding: "2px 7px 2px 6px",
            borderRadius: 999,
            background: "color-mix(in oklab, var(--text-primary) 5%, transparent)",
            border: "1px solid var(--border)",
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.medium,
            letterSpacing: "0.01em",
            lineHeight: 1.4,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: tone,
              display: "inline-block",
            }}
          />
          {ROLE_LABEL[role]}
        </span>
        <span
          style={{
            fontSize: 10,
            padding: "2px 7px",
            borderRadius: 999,
            background: `color-mix(in oklab, ${tone} 14%, transparent)`,
            color: tone,
            border: `1px solid color-mix(in oklab, ${tone} 26%, transparent)`,
            fontVariationSettings: fontWeights.semibold,
            letterSpacing: "0.02em",
            lineHeight: 1.4,
          }}
        >
          {action.verb}
        </span>
      </div>

      {/* Title — actor (Linear card title) */}
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.4,
          color: "var(--text-primary)",
          fontVariationSettings: fontWeights.medium,
          letterSpacing: "var(--tracking-body)",
          marginBottom: 5,
        }}
      >
        {s.actor}
      </div>

      {/* Body — position prose */}
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.55,
          color: "var(--text-tertiary)",
          fontVariationSettings: fontWeights.normal,
          letterSpacing: "var(--tracking-body)",
        }}
      >
        {s.position}
      </p>

      {/* Verbatim quote */}
      {s.quote && (
        <blockquote
          style={{
            marginTop: 8,
            paddingLeft: 9,
            borderLeft: "2px solid var(--border-stronger)",
            fontSize: 11.5,
            lineHeight: 1.55,
            fontStyle: "italic",
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.normal,
          }}
        >
          &ldquo;{s.quote}&rdquo;
        </blockquote>
      )}

      {/* Bottom meta row — Linear pattern: small actions/metadata at the foot */}
      <div
        className="flex items-center"
        style={{
          marginTop: 9,
          paddingTop: 8,
          borderTop: "1px solid var(--border)",
          gap: 8,
          minHeight: 14,
        }}
      >
        {s.source ? (
          <a
            href={s.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center transition-colors hover:text-[var(--text-secondary)]"
            style={{
              gap: 4,
              fontSize: 10.5,
              color: "var(--text-tertiary)",
              textDecoration: "none",
              fontVariationSettings: fontWeights.medium,
              letterSpacing: "0.01em",
            }}
          >
            <ExternalLink size={10} strokeWidth={2} />
            <span>Source</span>
          </a>
        ) : s.source_pending ? (
          <span
            className="inline-flex items-center"
            title="Source pending verification"
            style={{
              gap: 5,
              fontSize: 10.5,
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
              }}
            />
            Source pending
          </span>
        ) : (
          <span aria-hidden style={{ fontSize: 10.5, color: "transparent" }}>·</span>
        )}
      </div>
    </motion.article>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// DOCKET COLUMN
// ═════════════════════════════════════════════════════════════════════════════

interface ColumnDef {
  key: "for" | "against" | "deliberating"
  label: string
  tones: Tone[]
  accent: string
}

const COLUMNS: ColumnDef[] = [
  { key: "for",          label: "Arguing for",          tones: ["for"],              accent: "var(--status-kept)"      },
  { key: "against",      label: "Arguing against",      tones: ["against"],          accent: "var(--status-broken)"    },
  { key: "deliberating", label: "Watching & reviewing", tones: ["watch", "review"],  accent: "var(--text-tertiary)"    },
]

function ColumnHeader({ col, count }: { col: ColumnDef; count: number }) {
  const dim = count === 0
  return (
    <div
      className="flex items-center"
      style={{
        gap: 8,
        paddingBottom: 8,
        marginBottom: 10,
        borderBottom: "1px solid var(--border)",
        opacity: dim ? 0.55 : 1,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dim ? "var(--text-disabled)" : col.accent,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12.5,
          color: dim ? "var(--text-disabled)" : "var(--text-primary)",
          fontVariationSettings: fontWeights.semibold,
          letterSpacing: "var(--tracking-body)",
        }}
      >
        {col.label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize: 11,
          color: "var(--text-disabled)",
          fontVariationSettings: fontWeights.medium,
          letterSpacing: "0.02em",
          marginLeft: 4,
        }}
      >
        {count}
      </span>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Main export
// ═════════════════════════════════════════════════════════════════════════════

export function StakeholderPanel({
  stakeholders,
}: {
  stakeholders: BillStakeholder[]
}) {
  const { ordered, lead, buckets } = useMemo(() => {
    const ord = orderStakeholders(stakeholders)
    const ld  = generateLead(stakeholders)
    const b: Record<ColumnDef["key"], BillStakeholder[]> = {
      for: [], against: [], deliberating: [],
    }
    for (const s of ord) {
      const role = detectRole(s.actor)
      const tone = deriveAction(role, s.side).tone
      const col = COLUMNS.find((c) => c.tones.includes(tone))
      if (col) b[col.key].push(s)
    }
    return { ordered: ord, lead: ld, buckets: b }
  }, [stakeholders])

  if (stakeholders.length === 0) return null

  return (
    <div>
      <Lead sentences={lead.sentences} />
      <BalanceRibbon items={stakeholders} />

      {/* Board — 3 equal kanban columns, gap matches Linear board */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          columnGap: 14,
        }}
      >
        {COLUMNS.map((col, ci) => {
          const items = buckets[col.key]
          return (
            <section key={col.key} style={{ minWidth: 0 }}>
              <ColumnHeader col={col} count={items.length} />

              {items.length === 0 ? (
                <p
                  style={{
                    fontSize: 11.5,
                    color: "var(--text-disabled)",
                    fontVariationSettings: fontWeights.normal,
                    fontStyle: "italic",
                  }}
                >
                  None recorded.
                </p>
              ) : (
                <div className="flex flex-col" style={{ gap: 8 }}>
                  {items.map((s, i) => (
                    <PositionCard
                      key={`${col.key}-${i}-${s.actor}`}
                      s={s}
                      delay={0.18 + ci * 0.04 + i * 0.05}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Total + N footnote — tiny anchor at the bottom, hints provenance */}
      <div
        className="flex items-center"
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
          gap: 10,
        }}
      >
        <span
          className="uppercase"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.12em",
            color: "var(--text-disabled)",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          {ordered.length} {ordered.length === 1 ? "position" : "positions"} on record
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span
          className="uppercase font-mono tabular-nums"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.08em",
            color: "var(--text-disabled)",
            fontVariationSettings: fontWeights.medium,
          }}
        >
          Ordered by institutional power
        </span>
      </div>
    </div>
  )
}
