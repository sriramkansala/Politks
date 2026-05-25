"use client"

// GSMArena-style spec-sheet comparison shell.
//
// LAYOUT (not colours — colours follow UI_RULES.md tokens):
//
//   [ Type pills: Party · MP · Manifesto                                       ]
//
//   ┌──────────────┬──────────────┬──────────────┬──────────────┐
//   │ COMPARE WITH │ COMPARE WITH │ COMPARE WITH │ COMPARE WITH │
//   │ [search…   ] │ [search…   ] │ [search…   ] │ [search…   ] │
//   │              │              │              │              │
//   │  Filled card │  empty       │  empty       │  empty       │
//   │  • avatar    │  placeholder │  placeholder │  placeholder │
//   │  • name      │              │              │              │
//   │  • meta      │              │              │              │
//   │  • remove ×  │              │              │              │
//   └──────────────┴──────────────┴──────────────┴──────────────┘
//
//   ┌─CATEGORY─┬─Row label──┬─Slot 1─┬─Slot 2─┬─Slot 3─┬─Slot 4─┐
//   │ OVERVIEW │ Promises   │  96    │  —     │  —     │  —     │
//   │          │ Kept       │  12%   │  —     │  —     │  —     │
//   │          │ Broken     │  4%    │  —     │  —     │  —     │
//   │ POLICY   │ Free power │ promise│  —     │  —     │  —     │
//   │          │ Education  │ promise│  —     │  —     │  —     │
//   └──────────┴────────────┴────────┴────────┴────────┴────────┘
//
// The slot columns and the spec table are decoupled — slots can be filled in
// any order; empty cells in the table render as "—" (em-dash).

import { useState, useRef, useEffect, Fragment, type ReactNode } from "react"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { StatusPill } from "@/components/promises/StatusPill"
import type { PromiseStatus } from "@/lib/db/types"
import { tokens } from "@/lib/tokens"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import { useHiddenParties } from "@/hooks/use-hidden-parties"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"

// ─── Exported data shapes (used by server page) ───────────────────────────────

export interface CompareParty {
  id: string
  name: string
  short_name: string | null
  slug: string
  color: string
  total: number
  kept: number
  broken: number
  inworks: number
  stalled: number
  compromise: number
  unrated: number
}

export interface CompareMp {
  id: string
  name: string
  party_name: string | null
  house: string | null
  constituency: string | null
  state_code: string | null
  attendance_pct: number | null
  questions_asked: number | null
  debates_participated: number | null
  criminal_cases_any: number | null
  assets_inr: number | null
  prs_slug: string | null
  color: string
}

// ─── Editorial topic data (party-level policy promises) ───────────────────────

interface TopicPromise {
  partySlug: string
  title: string
  status: PromiseStatus
  numeric?: string
}

interface Topic {
  id: string
  label: string
  promises: TopicPromise[]
}

const TOPICS: Topic[] = [
  {
    id: "electricity",
    label: "Free / subsidised electricity",
    promises: [
      { partySlug: "aap", title: "Free 300 units/month to all Delhi households",            status: "promise_kept",   numeric: "300 units free" },
      { partySlug: "bjp", title: "1 crore rooftop solar installations nationally",          status: "in_the_works",   numeric: "1 Cr installs" },
      { partySlug: "inc", title: "Subsidised power for BPL families",                       status: "not_yet_rated",  numeric: "BPL only" },
      { partySlug: "dmk", title: "Free electricity up to 100 units for domestic consumers", status: "promise_kept",   numeric: "100 units free" },
    ],
  },
  {
    id: "education",
    label: "School education",
    promises: [
      { partySlug: "aap", title: "Free quality education in all Delhi government schools",   status: "promise_kept",  numeric: "All govt schools" },
      { partySlug: "dmk", title: "Free breakfast scheme for all government school students", status: "promise_kept",  numeric: "All TN govt schools" },
      { partySlug: "bjp", title: "NEP implementation in all states",                         status: "in_the_works",  numeric: "National" },
      { partySlug: "inc", title: "30% budget allocation to education",                       status: "not_yet_rated", numeric: "30% of budget" },
    ],
  },
  {
    id: "women",
    label: "Women's economic support",
    promises: [
      { partySlug: "dmk", title: "₹1,000/month to women heads of household",            status: "promise_kept",   numeric: "₹1,000/mo" },
      { partySlug: "inc", title: "50% women in all government jobs",                    status: "not_yet_rated",  numeric: "50% reservation" },
      { partySlug: "bjp", title: "3 crore Lakhpati Didis (women earning ₹1L/yr)",       status: "in_the_works",   numeric: "3 Cr women" },
      { partySlug: "aap", title: "Free bus travel for women in Delhi",                  status: "promise_kept",   numeric: "All DTC routes" },
    ],
  },
  {
    id: "housing",
    label: "Affordable housing",
    promises: [
      { partySlug: "bjp", title: "3 crore new houses under PM Awas Yojana by 2029",       status: "in_the_works",   numeric: "3 Cr houses" },
      { partySlug: "inc", title: "Urban housing for all below-poverty households by 2030", status: "not_yet_rated", numeric: "All BPL urban" },
      { partySlug: "aap", title: "1 lakh flats for Delhi slum dwellers",                   status: "stalled",        numeric: "1 lakh flats" },
    ],
  },
  {
    id: "health",
    label: "Healthcare",
    promises: [
      { partySlug: "bjp", title: "Ayushman Bharat expanded to 70+ age group",                  status: "in_the_works",   numeric: "40 Cr seniors" },
      { partySlug: "inc", title: "Right to Health Act — free treatment in all govt hospitals", status: "not_yet_rated",  numeric: "Universal" },
      { partySlug: "aap", title: "Free mohalla clinics and polyclinics across Delhi",          status: "promise_kept",   numeric: "1,000+ clinics" },
      { partySlug: "dmk", title: "Universal Health Coverage for all TN families",              status: "in_the_works",   numeric: "All families" },
    ],
  },
  {
    id: "employment",
    label: "Employment & skilling",
    promises: [
      { partySlug: "bjp", title: "1 crore internships for youth in top companies",         status: "in_the_works",   numeric: "1 Cr internships" },
      { partySlug: "inc", title: "30 lakh government jobs, 1-yr apprenticeship stipend",   status: "not_yet_rated",  numeric: "30 L jobs" },
      { partySlug: "aap", title: "Rozgar budget — guaranteed employment scheme for Delhi", status: "stalled",        numeric: "Delhi-wide" },
    ],
  },
]

// ─── Spec-table groups ────────────────────────────────────────────────────────

type ValueRenderer<T> = (item: T) => ReactNode

interface SpecRow<T> {
  label: string
  render: ValueRenderer<T>
}

interface SpecGroup<T> {
  category: string
  rows: SpecRow<T>[]
}

function crore(inr: number | null) {
  if (inr == null) return "—"
  return `₹${(inr / 1e7).toFixed(1)} cr`
}

function pct(num: number, denom: number) {
  if (denom === 0) return "—"
  return `${Math.round((num / denom) * 100)}% (${num}/${denom})`
}

// Party policy cell — looks up the party's promise on this topic (if any).
function policyCell(topicId: string): ValueRenderer<CompareParty> {
  return (p) => {
    const topic = TOPICS.find((t) => t.id === topicId)
    const promise = topic?.promises.find((pr) => pr.partySlug === p.slug)
    if (!promise) {
      return <span style={{ color: tokens.color.textDisabled }}>No tracked promise</span>
    }
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] leading-snug" style={{ color: tokens.color.textPrimary }}>
          {promise.title}
        </span>
        <div className="flex items-center gap-2">
          <StatusPill status={promise.status} />
          {promise.numeric && (
            <span className="text-[10px] font-mono" style={{ color: tokens.color.textTertiary }}>
              {promise.numeric}
            </span>
          )}
        </div>
      </div>
    )
  }
}

const PARTY_GROUPS: SpecGroup<CompareParty>[] = [
  {
    category: "Overview",
    rows: [
      { label: "Party name",          render: (p) => p.name },
      { label: "Short code",          render: (p) => p.short_name ?? "—" },
      { label: "Tracked promises",    render: (p) => String(p.total) },
    ],
  },
  {
    category: "Promises",
    rows: [
      { label: "Kept",         render: (p) => pct(p.kept,       p.total) },
      { label: "Broken",       render: (p) => pct(p.broken,     p.total) },
      { label: "In progress",  render: (p) => pct(p.inworks,    p.total) },
      { label: "Stalled",      render: (p) => pct(p.stalled,    p.total) },
      { label: "Compromise",   render: (p) => pct(p.compromise, p.total) },
      { label: "Not yet rated",render: (p) => pct(p.unrated,    p.total) },
    ],
  },
  {
    category: "Policy",
    rows: TOPICS.map((t) => ({ label: t.label, render: policyCell(t.id) })),
  },
]

const MP_GROUPS: SpecGroup<CompareMp>[] = [
  {
    category: "Profile",
    rows: [
      { label: "Party",         render: (m) => m.party_name ?? "—" },
      { label: "House",         render: (m) => (m.house ?? "—").replace("_", " ") },
      { label: "Constituency",  render: (m) => m.constituency ?? "Rajya Sabha" },
      { label: "State",         render: (m) => m.state_code ?? "—" },
    ],
  },
  {
    category: "Parliament",
    rows: [
      {
        label: "Attendance",
        render: (m) => {
          if (m.attendance_pct == null) return "—"
          const tone =
            m.attendance_pct >= 80 ? tokens.status.kept :
            m.attendance_pct < 50  ? tokens.status.broken :
            tokens.color.textPrimary
          return <span style={{ color: tone, fontVariationSettings: fontWeights.medium }}>{m.attendance_pct.toFixed(0)}%</span>
        },
      },
      { label: "Questions asked", render: (m) => m.questions_asked != null ? String(m.questions_asked) : "—" },
      { label: "Debates",         render: (m) => m.debates_participated != null ? String(m.debates_participated) : "—" },
    ],
  },
  {
    category: "Integrity",
    rows: [
      {
        label: "Criminal cases",
        render: (m) => {
          const n = m.criminal_cases_any ?? 0
          return (
            <span style={{ color: n > 0 ? tokens.status.broken : tokens.status.kept, fontVariationSettings: fontWeights.medium }}>
              {n}
            </span>
          )
        },
      },
      { label: "Declared assets", render: (m) => crore(m.assets_inr) },
    ],
  },
]

// ─── Slot columns (header) ────────────────────────────────────────────────────

const SLOT_W       = 220 // px — column width (also used by spec-table)
const CAT_W        = 96  // px — leftmost category-label column in spec table
const ROW_LABEL_W  = 168 // px — row-label column in spec table
const GAP          = 12  // px — gap between columns
const MAX_SLOTS    = 3

interface PickerItem {
  id: string
  name: string
  type: CompareType
  /** Disabled items render greyed-out and can't be picked (e.g. Manifestos coming soon). */
  disabled?: boolean
  /** Per-row meta shown under the name (e.g. party for an MP). */
  meta?: string
}

interface PickerGroup {
  label: string
  type: CompareType
  items: PickerItem[]
  /** Optional empty-state hint shown when this group has no items / no matches. */
  emptyNote?: string
}

function SlotColumn({
  filled,
  groups,
  selectedIds,
  onSelect,
  onRemove,
  renderHeader,
}: {
  filled: PickerItem | null
  groups: PickerGroup[]
  selectedIds: string[]
  onSelect: (item: PickerItem) => void
  onRemove: () => void
  renderHeader: (item: PickerItem) => ReactNode
}) {
  const [q, setQ] = useState("")
  const [focused, setFocused] = useState(false)
  const [activeGroupIdx, setActiveGroupIdx] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  // Unique id per SlotColumn instance so the layoutId pill animation doesn't
  // cross-fade between sibling slot columns.
  const layoutId = useRef(`slot-picker-pill-${Math.random().toString(36).slice(2, 8)}`).current

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  // Filter each group by query and dedup against existing selections.
  const filteredGroups = groups.map((g) => ({
    ...g,
    items: g.items.filter(
      (it) => !selectedIds.includes(it.id) && it.name.toLowerCase().includes(q.toLowerCase())
    ),
  }))
  const activeGroup = filteredGroups[activeGroupIdx]

  return (
    <div
      ref={rootRef}
      className="shrink-0 flex flex-col rounded-[var(--radius-card)]"
      style={{
        width: SLOT_W,
        background: tokens.color.bgElevated,
        border: `1px solid ${tokens.color.border}`,
        minHeight: 240,
      }}
    >
      {/* Cross-fade between filled and empty states — FF "motion as information":
          the transition makes it clear an item was added/removed. */}
      <AnimatePresence mode="wait" initial={false}>
      {filled ? (
        <motion.div
          key="filled"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={springs.responsive}
          className="relative flex-1 p-4"
        >
          {/* §1 exception: chip-internal remove control on a slot card. */}
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full transition-colors hover:bg-[var(--bg-elevated-2)]"
            style={{ color: tokens.color.textTertiary }}
            aria-label="Remove from comparison"
          >
            <X size={11} strokeWidth={2} />
          </button>
          {renderHeader(filled)}
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springs.gentle}
          className="flex-1 flex flex-col"
        >
          {/* "Compare with" search at the top of the empty column */}
          <div className="px-3 pt-3 pb-2">
            <p
              className="text-[10px] uppercase tracking-[0.07em] mb-1.5"
              style={{ color: tokens.color.textTertiary, fontVariationSettings: fontWeights.medium }}
            >
              Compare with
            </p>
            {/* §1 exception: composite slot search input. .linear-input would
                add its own 32px-h bordered box inside the already-bordered slot
                card — a double frame per §7. Bare input keeps the slot tidy. */}
            <div className="relative">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-[6px]"
                style={{
                  background: tokens.color.bgElevated2,
                  border: `1px solid ${focused ? "var(--accent)" : tokens.color.border}`,
                  transition: "border-color 80ms",
                }}
              >
                <Search size={12} strokeWidth={1.5} style={{ color: tokens.color.textTertiary }} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocused(true)}
                  placeholder="Search…"
                  className="flex-1 bg-transparent outline-none text-[12px] min-w-0"
                  style={{ color: tokens.color.textPrimary }}
                />
              </div>

              <AnimatePresence>
                {focused && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={springs.snap}
                    className="absolute top-full left-0 right-0 mt-1 z-30 rounded-[6px] overflow-hidden flex flex-col"
                    style={{
                      background: tokens.color.bgElevated,
                      border: `1px solid ${tokens.color.border}`,
                      boxShadow: "var(--shadow-s4)",
                      maxHeight: 320,
                    }}
                  >
                    {/* Category tabs — same visual language as the rest of the app:
                        grey pill on the active tab, sliding via motion.span layoutId. */}
                    <LayoutGroup id={`${layoutId}-tabs`}>
                      <div
                        className="flex gap-0.5 p-1 shrink-0"
                        style={{ borderBottom: `1px solid ${tokens.color.border}` }}
                      >
                        {filteredGroups.map((g, i) => {
                          const isActive = i === activeGroupIdx
                          return (
                            // §1 exception: dropdown-internal tab control.
                            <button
                              key={g.type}
                              onClick={() => setActiveGroupIdx(i)}
                              className="relative flex-1 px-1.5 py-1 rounded-[6px] text-[11px] whitespace-nowrap transition-colors duration-80"
                              style={{
                                color: isActive ? tokens.color.textPrimary : tokens.color.textTertiary,
                                fontVariationSettings: isActive ? fontWeights.semibold : fontWeights.medium,
                              }}
                            >
                              {isActive && (
                                <motion.span
                                  layoutId={layoutId}
                                  className="absolute inset-0 rounded-[6px]"
                                  style={{ background: "var(--bg-tertiary)" }}
                                  transition={springs.moderate}
                                />
                              )}
                              <span className="relative z-10">{g.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </LayoutGroup>

                    {/* Items for the active tab */}
                    <div className="flex-1 overflow-y-auto">
                      {!activeGroup || activeGroup.items.length === 0 ? (
                        <p className="px-3 py-3 text-[11px]" style={{ color: tokens.color.textDisabled }}>
                          {activeGroup?.emptyNote ?? (q ? "No matches" : "Nothing to show")}
                        </p>
                      ) : (
                        activeGroup.items.slice(0, 50).map((item) => (
                          // §1 exception: listbox option inside a popover.
                          <button
                            key={`${item.type}-${item.id}`}
                            onClick={() => {
                              if (item.disabled) return
                              onSelect(item)
                              setQ("")
                              setFocused(false)
                            }}
                            disabled={item.disabled}
                            className="w-full text-left px-3 py-2 text-[12px] transition-colors hover:bg-[var(--bg-elevated-2)] disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ color: tokens.color.textPrimary }}
                          >
                            <div>{item.name}</div>
                            {item.meta && (
                              <div className="text-[10px] mt-0.5" style={{ color: tokens.color.textTertiary }}>
                                {item.meta}
                              </div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Empty placeholder body */}
          <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 gap-2">
            <div
              className="rounded-[6px]"
              style={{
                width: 64,
                height: 64,
                border: `1.5px dashed ${tokens.color.border}`,
              }}
            />
            <span className="text-[11px] text-center" style={{ color: tokens.color.textDisabled }}>
              Search to add an item
            </span>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

// ─── Spec table (renders one SpecGroup at a time as its own CSS grid) ────────

function SpecTable<T>({
  slots,
  groups,
}: {
  slots: (T | null)[]
  groups: SpecGroup<T>[]
}) {
  const cols = `${CAT_W}px ${ROW_LABEL_W}px repeat(${slots.length}, ${SLOT_W}px)`

  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{
        background: tokens.color.bgElevated,
        border: `1px solid ${tokens.color.border}`,
      }}
    >
      {groups.map((group, gi) => (
        <section
          key={group.category}
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            borderTop: gi === 0 ? "none" : `1px solid ${tokens.color.border}`,
          }}
        >
          {/* Category label — spans all rows in this group */}
          <div
            style={{
              gridColumn: 1,
              gridRow: `1 / span ${group.rows.length}`,
              padding: "14px 14px 14px 16px",
              background: tokens.color.bgElevated2,
              borderRight: `1px solid ${tokens.color.border}`,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.08em]"
              style={{
                color: "var(--accent)",
                fontVariationSettings: fontWeights.semibold,
              }}
            >
              {group.category}
            </span>
          </div>

          {/* Rows of the group */}
          {group.rows.map((row, ri) => (
            <Fragment key={row.label}>
              <div
                style={{
                  gridColumn: 2,
                  gridRow: ri + 1,
                  padding: "12px 14px",
                  borderTop: ri === 0 ? "none" : `1px solid ${tokens.color.border}`,
                  borderRight: `1px solid ${tokens.color.border}`,
                  background: tokens.color.bgElevated,
                }}
              >
                <span
                  className="text-[12px]"
                  style={{ color: tokens.color.textSecondary, fontVariationSettings: fontWeights.medium }}
                >
                  {row.label}
                </span>
              </div>
              {slots.map((slot, si) => (
                <div
                  key={si}
                  style={{
                    gridColumn: 3 + si,
                    gridRow: ri + 1,
                    padding: "12px 14px",
                    borderTop: ri === 0 ? "none" : `1px solid ${tokens.color.border}`,
                    borderRight: si === slots.length - 1 ? "none" : `1px solid ${tokens.color.border}`,
                    background: tokens.color.bgElevated,
                    minWidth: 0,
                  }}
                >
                  {/* Cross-fade when a slot's data appears/disappears — small
                      stagger via the row index so the column doesn't pop in
                      one frame. FF "motion as information". */}
                  <AnimatePresence mode="wait" initial={false}>
                    {slot ? (
                      <motion.span
                        key="value"
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ ...springs.responsive, delay: ri * 0.015 }}
                        className="text-[13px] block"
                        style={{ color: tokens.color.textPrimary }}
                      >
                        {row.render(slot)}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="dash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={springs.gentle}
                        className="block"
                        style={{ color: tokens.color.textDisabled }}
                      >
                        —
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </Fragment>
          ))}
        </section>
      ))}
    </div>
  )
}

// ─── Main shell ───────────────────────────────────────────────────────────────

type CompareType = "party" | "mp" | "manifesto"

export function CompareShell({
  parties,
  mps,
}: {
  parties: CompareParty[]
  mps: CompareMp[]
}) {
  const [compareType, setCompareType] = useState<CompareType>("party")
  const [partySlots, setPartySlots] = useState<(CompareParty | null)[]>(() =>
    Array.from({ length: MAX_SLOTS }, () => null)
  )
  const [mpSlots, setMpSlots] = useState<(CompareMp | null)[]>(() =>
    Array.from({ length: MAX_SLOTS }, () => null)
  )

  // Add to first empty slot
  function addToFirstEmpty<T>(slots: (T | null)[], item: T): (T | null)[] {
    const idx = slots.findIndex((s) => s === null)
    if (idx === -1) return slots
    const next = slots.slice()
    next[idx] = item
    return next
  }

  function addPartyAt(index: number, p: CompareParty) {
    setPartySlots((prev) => {
      const next = prev.slice()
      next[index] = p
      return next
    })
  }
  function addMpAt(index: number, m: CompareMp) {
    setMpSlots((prev) => {
      const next = prev.slice()
      next[index] = m
      return next
    })
  }
  function clearPartyAt(index: number) {
    setPartySlots((prev) => {
      const next = prev.slice()
      next[index] = null
      return next
    })
  }
  function clearMpAt(index: number) {
    setMpSlots((prev) => {
      const next = prev.slice()
      next[index] = null
      return next
    })
  }
  // (Kept for potential future "Quick add" feature)
  void addToFirstEmpty

  // Per-user visibility setting from /settings page.
  const hiddenPartyIds = useHiddenParties((s) => s.hidden)
  const visibleParties = parties.filter((p) => !hiddenPartyIds.includes(p.id))

  // Unified search groups — same dropdown shape in every slot, regardless of mode.
  const searchGroups: PickerGroup[] = [
    {
      label: "Parties",
      type: "party",
      items: visibleParties.map((p) => ({
        id: p.id,
        name: p.short_name ?? p.name,
        type: "party" as const,
        meta: p.short_name ? p.name : undefined,
      })),
    },
    {
      label: "Politicians",
      type: "mp",
      items: mps.map((m) => ({
        id: m.id,
        name: m.name,
        type: "mp" as const,
        meta: [m.party_name, m.house?.replace("_", " "), m.constituency].filter(Boolean).join(" · "),
      })),
    },
    {
      label: "Manifestos",
      type: "manifesto",
      items: [],
      emptyNote: "Manifesto comparison coming soon",
    },
  ]

  const selectedPartyIds = partySlots.filter(Boolean).map((p) => (p as CompareParty).id)
  const selectedMpIds    = mpSlots.filter(Boolean).map((m) => (m as CompareMp).id)

  // Picks an item from any group — switches mode if needed.
  function pickAt(slotIndex: number, item: PickerItem) {
    if (item.type === "party") {
      const p = parties.find((x) => x.id === item.id)
      if (!p) return
      if (compareType !== "party") {
        // Switching modes wipes the other type's slots; place new pick at slot 0.
        setMpSlots(Array.from({ length: MAX_SLOTS }, () => null))
        setCompareType("party")
        setPartySlots((prev) => {
          const next = prev.slice()
          next[0] = p
          return next
        })
      } else {
        addPartyAt(slotIndex, p)
      }
    } else if (item.type === "mp") {
      const m = mps.find((x) => x.id === item.id)
      if (!m) return
      if (compareType !== "mp") {
        setPartySlots(Array.from({ length: MAX_SLOTS }, () => null))
        setCompareType("mp")
        setMpSlots((prev) => {
          const next = prev.slice()
          next[0] = m
          return next
        })
      } else {
        addMpAt(slotIndex, m)
      }
    }
    // Manifesto items are disabled — nothing happens.
  }

  return (
    <div className="space-y-6">

      {/* Type selection is now implicit — picking an item from the slot
       *  dropdown (Parties / Politicians / Manifestos sections) automatically
       *  switches the comparison mode. The standalone Party/MP/Manifesto pill
       *  row was removed; the same options now live as section headers inside
       *  each slot's search dropdown. */}

      {compareType === "party" && (
        <CompareBoard
          slots={partySlots}
          searchGroups={searchGroups}
          selectedIds={selectedPartyIds}
          renderHeader={(item) => {
            const p = parties.find((x) => x.id === item.id)
            if (!p) return null
            return (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block rounded-full shrink-0"
                    style={{ width: 10, height: 10, background: p.color }}
                  />
                  <span
                    className="text-[14px] leading-tight"
                    style={{ color: tokens.color.textPrimary, fontVariationSettings: fontWeights.semibold }}
                  >
                    {p.short_name ?? p.name}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: tokens.color.textTertiary }}>
                  {p.name}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span
                    className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                    style={{
                      background: tokens.color.bgElevated2,
                      color: tokens.color.textSecondary,
                      fontVariationSettings: fontWeights.medium,
                    }}
                  >
                    {p.total} promises
                  </span>
                  {p.total > 0 && (
                    <span
                      className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                      style={{
                        background: "color-mix(in srgb, var(--status-kept) 14%, transparent)",
                        color: "var(--status-kept)",
                        fontVariationSettings: fontWeights.medium,
                      }}
                    >
                      {Math.round((p.kept / p.total) * 100)}% kept
                    </span>
                  )}
                </div>
              </div>
            )
          }}
          onSelect={pickAt}
          onRemove={clearPartyAt}
          groups={PARTY_GROUPS}
        />
      )}

      {compareType === "mp" && (
        <CompareBoard
          slots={mpSlots}
          searchGroups={searchGroups}
          selectedIds={selectedMpIds}
          renderHeader={(item) => {
            const m = mps.find((x) => x.id === item.id)
            if (!m) return null
            return (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block rounded-full shrink-0"
                    style={{ width: 10, height: 10, background: m.color }}
                  />
                  <span
                    className="text-[14px] leading-tight"
                    style={{ color: tokens.color.textPrimary, fontVariationSettings: fontWeights.semibold }}
                  >
                    {m.name}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: tokens.color.textTertiary }}>
                  {m.party_name ?? "—"} · {m.house?.replace("_", " ") ?? "—"}
                </span>
                {m.constituency && (
                  <span className="text-[11px]" style={{ color: tokens.color.textTertiary }}>
                    {m.constituency}{m.state_code ? ` · ${m.state_code}` : ""}
                  </span>
                )}
              </div>
            )
          }}
          onSelect={pickAt}
          onRemove={clearMpAt}
          groups={MP_GROUPS}
        />
      )}
    </div>
  )
}

// ─── CompareBoard: slot row + spec table for one type ─────────────────────────

function CompareBoard<T>({
  slots,
  searchGroups,
  selectedIds,
  renderHeader,
  onSelect,
  onRemove,
  groups,
}: {
  slots: (T | null)[]
  searchGroups: PickerGroup[]
  selectedIds: string[]
  renderHeader: (item: PickerItem) => ReactNode
  onSelect: (slotIndex: number, item: PickerItem) => void
  onRemove: (slotIndex: number) => void
  groups: SpecGroup<T>[]
}) {
  // Convert each filled slot into the PickerItem shape SlotColumn renders headers from.
  // (The full T is reached via the renderHeader callback's id lookup.)
  function slotAsPickerItem(slot: T | null): PickerItem | null {
    if (!slot) return null
    const s = slot as unknown as { id: string; name?: string; short_name?: string | null }
    // We can't tell the type purely from the slot shape, but renderHeader doesn't need it
    // — pass the type that matches whichever spec table the parent built.
    return { id: s.id, name: s.short_name ?? s.name ?? "", type: "party" as CompareType }
  }

  return (
    <AnimateIn stagger className="space-y-6">
      {/* Slot columns row */}
      <AnimateItem>
        <div className="overflow-x-auto">
          <div style={{ minWidth: slots.length * (SLOT_W + GAP) }}>
            <AnimateIn stagger className="flex gap-3">
              {slots.map((slot, i) => {
                const filled = slotAsPickerItem(slot)
                return (
                  <AnimateItem key={i}>
                    <SlotColumn
                      filled={filled}
                      groups={searchGroups}
                      selectedIds={selectedIds}
                      onSelect={(item) => onSelect(i, item)}
                      onRemove={() => onRemove(i)}
                      renderHeader={renderHeader}
                    />
                  </AnimateItem>
                )
              })}
            </AnimateIn>
          </div>
        </div>
      </AnimateItem>

      {/* Spec table */}
      <AnimateItem>
        <div className="overflow-x-auto">
          <div style={{ minWidth: CAT_W + ROW_LABEL_W + slots.length * SLOT_W }}>
            <SpecTable<T> slots={slots} groups={groups} />
          </div>
        </div>
      </AnimateItem>
    </AnimateIn>
  )
}
