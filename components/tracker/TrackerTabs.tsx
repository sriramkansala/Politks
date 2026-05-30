"use client"

// Tracker page tab layout.
// Overview tab: party summary cards + breakdown table.
// Promises tab: full promise list filterable by status.

import { useState } from "react"
import { motion, LayoutGroup } from "framer-motion"
import Link from "next/link"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { springs } from "@/lib/springs"
import { StatusPill } from "@/components/promises/StatusPill"
import { useHiddenParties } from "@/hooks/use-hidden-parties"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { tokens } from "@/lib/tokens"
import { fontWeights } from "@/lib/font-weight"
import type { PromiseStatus } from "@/lib/db/types"

// ─── Types (mirrored from server) ────────────────────────────────────────────

export interface PartyStats {
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

export interface PromiseSummary {
  id: string
  title: string
  category: string
  status: PromiseStatus
  party_id: string | null
  is_headline: boolean
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const STATUS_COLS: Array<{ key: keyof PartyStats; label: string; status: PromiseStatus }> = [
  { key: "kept",       label: "Kept",        status: "promise_kept"   },
  { key: "compromise", label: "Compromise",  status: "compromise"     },
  { key: "inworks",    label: "In Progress", status: "in_the_works"   },
  { key: "stalled",    label: "Stalled",     status: "stalled"        },
  { key: "broken",     label: "Broken",      status: "promise_broken" },
  { key: "unrated",    label: "Unrated",     status: "not_yet_rated"  },
]

function Bar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.color.bgElevated2 }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ stats }: { stats: PartyStats[] }) {
  return (
    <AnimateIn stagger className="space-y-6">
      {/* Summary cards */}
      <AnimateItem>
        <AnimateIn stagger className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((p) => {
            const keptPct = p.total > 0 ? Math.round((p.kept / p.total) * 100) : 0
            const hasData = p.total > 0 && keptPct > 0
            return (
              <AnimateItem key={p.slug}>
              <motion.div
                whileHover={{ y: -1 }}
                transition={springs.responsive}
                className="p-4 rounded-[var(--radius-card)]"
                style={{ background: tokens.color.bgElevated, border: `1px solid ${tokens.color.border}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: p.color }} aria-label={p.name} />
                    <span className="text-[11px] uppercase tracking-[0.06em]"
                      style={{ color: tokens.color.textSecondary, fontVariationSettings: "'wght' 550" }}>
                      {p.short_name ?? p.name}
                    </span>
                  </div>
                  <span className="text-caption" style={{ color: tokens.color.textTertiary }}>
                    {p.total} promises
                  </span>
                </div>
                <div className="text-[28px] mb-1"
                  style={{
                    color: hasData ? tokens.status.kept : tokens.color.textPrimary,
                    letterSpacing: "-0.022em",
                    fontVariationSettings: "'wght' 590",
                  }}>
                  {keptPct}%
                </div>
                <p className="text-caption mb-2" style={{ color: tokens.color.textTertiary }}>kept</p>
                <Bar value={p.kept} total={p.total} color={hasData ? tokens.status.kept : tokens.color.border} />
              </motion.div>
              </AnimateItem>
            )
          })}
        </AnimateIn>
      </AnimateItem>

      {/* Breakdown table */}
      <AnimateItem>
        <div className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${tokens.color.border}`, background: tokens.color.bgElevated }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] uppercase tracking-wide"
                  style={{ color: tokens.color.textTertiary, width: "140px" }}>
                  Party
                </TableHead>
                {STATUS_COLS.map(({ label, status }) => (
                  <TableHead key={label} className="text-center">
                    <StatusPill status={status} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((p, i) => (
                <TableRow key={p.slug} index={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded-full shrink-0"
                        style={{ width: 7, height: 7, background: p.color }} aria-label={p.name} />
                      <span className="text-[13px]"
                        style={{ color: tokens.color.textPrimary, fontVariationSettings: "'wght' 510" }}>
                        {p.short_name ?? p.name}
                      </span>
                    </div>
                  </TableCell>
                  {STATUS_COLS.map(({ key }) => (
                    <TableCell key={key} className="text-center text-[14px]">
                      {(p[key] as number) ?? 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AnimateItem>
    </AnimateIn>
  )
}

// ─── Promises tab ─────────────────────────────────────────────────────────────

const PROMISE_STATUSES: Array<{ value: PromiseStatus | "all"; label: string }> = [
  { value: "all",           label: "All"         },
  { value: "promise_kept",  label: "Kept"        },
  { value: "in_the_works",  label: "In Progress" },
  { value: "stalled",       label: "Stalled"     },
  { value: "compromise",    label: "Compromise"  },
  { value: "promise_broken",label: "Broken"      },
  { value: "not_yet_rated", label: "Unrated"     },
]

function PromisesTab({
  promises,
  stats,
}: {
  promises: PromiseSummary[]
  stats: PartyStats[]
}) {
  const [filter, setFilter] = useState<PromiseStatus | "all">("all")
  const partyMap = Object.fromEntries(stats.map((p) => [p.id, p]))

  const filtered = filter === "all"
    ? promises
    : promises.filter((p) => p.status === filter)

  return (
    <AnimateIn stagger className="space-y-4">
      {/* Status filter chips — FF shared-element pill (see PromiseList.tsx). */}
      <AnimateItem>
        <LayoutGroup id="tracker-filter-group">
          <div className="flex flex-wrap gap-0.5">
            {PROMISE_STATUSES.map(({ value, label }) => {
              const count = value === "all" ? promises.length : promises.filter(p => p.status === value).length
              const isActive = filter === value
              return (
                // UI_RULES.md §1 exception: chip uses motion.span layoutId for
                // shared-element pill animation between active filters. See
                // PromiseList.tsx:236 for the canonical pattern.
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className="relative px-2.5 py-1 text-[11px] rounded-[var(--radius-pill)] transition-colors duration-80"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                    fontVariationSettings: isActive ? fontWeights.semibold : fontWeights.normal,
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tracker-filter-pill"
                      className="absolute inset-0 rounded-[var(--radius-pill)]"
                      style={{ background: "var(--bg-tertiary)" }}
                      transition={springs.moderate}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1">
                    {label}
                    <span style={{ opacity: 0.5, fontVariationSettings: fontWeights.normal }}>{count}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
      </AnimateItem>

      {/* Promise list */}
      <AnimateItem>
        <div className="space-y-0" style={{ borderTop: "1px solid var(--border)" }}>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              No promises match this filter.
            </p>
          ) : (
            filtered.map((p) => {
              const party = p.party_id ? partyMap[p.party_id] : null
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ backgroundColor: "var(--hover-row)" }}
                  transition={springs.snap}
                  className="flex items-start justify-between gap-4 py-3 px-1 rounded-lg"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {party && (
                      <span className="inline-block rounded-full shrink-0 mt-1.5"
                        style={{ width: 6, height: 6, background: party.color }} />
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] leading-snug" style={{ color: "var(--text-primary)" }}>
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {party && (
                          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                            {party.short_name ?? party.name}
                          </span>
                        )}
                        {p.category && (
                          <span className="text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[var(--radius-tag)]"
                            style={{ color: "var(--text-disabled)", background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}>
                            {p.category}
                          </span>
                        )}
                        {p.is_headline && (
                          <span className="text-[10px] uppercase tracking-[0.06em]"
                            style={{ color: "var(--accent)" }}>
                            Headline
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusPill status={p.status} />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </AnimateItem>

      {filtered.length > 0 && (
        <AnimateItem>
          <p className="text-[11px] text-center" style={{ color: "var(--text-disabled)" }}>
            {filtered.length} promise{filtered.length !== 1 ? "s" : ""}
          </p>
        </AnimateItem>
      )}
    </AnimateIn>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function TrackerTabs({
  stats,
  promises,
}: {
  stats: PartyStats[]
  promises: PromiseSummary[]
}) {
  // Apply the user's per-party visibility preference (Settings page).
  const hidden = useHiddenParties((s) => s.hidden)
  const visibleStats = stats.filter((p) => !hidden.includes(p.id))
  const visiblePromises = promises.filter(
    (pr) => !pr.party_id || !hidden.includes(pr.party_id)
  )

  return (
    <Tabs defaultValue="overview">
      <div className="mb-8">
        <TabsList className="bg-transparent p-0 gap-1">
          <TabItem value="overview"  label="Overview" />
          <TabItem value="promises"  label={`Promises (${visiblePromises.length})`} />
        </TabsList>
      </div>

      <TabPanel value="overview">
        <OverviewTab stats={visibleStats} />
      </TabPanel>
      <TabPanel value="promises">
        <PromisesTab promises={visiblePromises} stats={visibleStats} />
      </TabPanel>
    </Tabs>
  )
}
