// Linear-style workspace for the Bills index (FF motion retrofit).
// Reuses the generic pieces of the
// components/linear system (FilterBar, PropertyRow/PropertyControl, LabelChip,
// CommandMenu, Kbd) and renders bills as a status-grouped Linear list with a
// right-side key–value detail panel. Replaces the old tabbed BillsList table —
// the House tabs become a House filter, and sorting columns become filters.
//
// Motion follows Fluid Functionalism (AGENTS.md / UI_RULES.md): list + group +
// row entry use AnimateIn/AnimateItem stagger; interactive surfaces use
// framer-motion whileTap/whileHover with the shared `springs` presets; hover
// tints use the --ff-hover token via CSS (never manual DOM style mutation).

"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CircleDashed,
  Landmark,
  FileText,
  Command as CommandIcon,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import { cn } from "@/lib/utils"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import type { Bill } from "@/lib/db/types"
import {
  FilterBar,
  LabelChip,
  Kbd,
  PropertyRow,
  PropertyControl,
  CommandMenu,
  type FilterProperty,
  type AppliedFilter,
  type CommandGroupSpec,
} from "@/components/linear"
import {
  BillStatusIcon,
  OUTCOME_META,
  OUTCOME_ORDER,
  normalizeOutcome,
  type BillOutcome,
} from "./BillStatusIcon"

type BillRow = Pick<
  Bill,
  | "id"
  | "slug"
  | "title"
  | "short_title"
  | "bill_number"
  | "bill_type"
  | "introduced_date"
  | "current_stage"
  | "outcome"
  | "house_introduced"
>

const HOUSE_LABEL: Record<string, string> = {
  lok_sabha: "Lok Sabha",
  rajya_sabha: "Rajya Sabha",
}

function houseLabel(h: string | null | undefined) {
  return h ? HOUSE_LABEL[h] ?? h : null
}

function typeLabel(t: string | null | undefined) {
  return t ? t.replace(/_/g, " ") : null
}

// ── filter matching (generic AND across properties) ──────────────────────────
function billValueIds(bill: BillRow, key: string): string[] {
  switch (key) {
    case "outcome":
      return [normalizeOutcome(bill.outcome)]
    case "house":
      return bill.house_introduced ? [bill.house_introduced] : []
    case "type":
      return bill.bill_type ? [bill.bill_type] : []
    default:
      return []
  }
}

function matchBill(bill: BillRow, f: AppliedFilter): boolean {
  if (f.valueIds.length === 0) return true
  const ids = billValueIds(bill, f.propertyKey)
  const hit = f.valueIds.some((v) => ids.includes(v))
  return f.operator === "is" || f.operator === "includes" ? hit : !hit
}

// ── small inline stage bar (matches the old BillsList visual) ────────────────
function StageBar({ stage }: { stage: number | null }) {
  if (!stage)
    return (
      <span className="text-[12px]" style={{ color: "var(--text-disabled)" }}>
        —
      </span>
    )
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[2px]">
        {Array.from({ length: 8 }).map((_, j) => (
          <div
            key={j}
            className="w-[3px] h-[10px] rounded-[1px]"
            style={{ background: j < Math.round(stage / 2) ? "var(--accent)" : "var(--border-strong)" }}
          />
        ))}
      </div>
      <span className="text-[10px] tabular-nums" style={{ color: "var(--text-disabled)" }}>
        {stage}/16
      </span>
    </div>
  )
}

// ── one bill row in the Linear list ──────────────────────────────────────────
function BillRowItem({
  bill,
  active,
  onClick,
}: {
  bill: BillRow
  active: boolean
  onClick: () => void
}) {
  const outcome = normalizeOutcome(bill.outcome)
  const house = houseLabel(bill.house_introduced)
  const type = typeLabel(bill.bill_type)
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick()
      }}
      whileTap={{ scale: 0.997 }}
      transition={springs.snap}
      className={cn(
        "group/row flex items-center gap-2.5 h-9 pl-3 pr-4 cursor-default select-none outline-none transition-colors duration-100",
        !active && "hover:bg-[var(--ff-hover)]"
      )}
      style={{
        background: active ? "var(--accent-tint)" : undefined,
        boxShadow: "inset 0 -1px 0 var(--border)",
      }}
    >
      <span className="shrink-0">
        <BillStatusIcon outcome={outcome} size={16} />
      </span>

      {bill.bill_number && (
        <span
          className="shrink-0 text-[12px] font-mono tabular-nums hidden sm:inline w-[104px] truncate"
          style={{ color: "var(--text-tertiary)" }}
        >
          {bill.bill_number}
        </span>
      )}

      <span className="truncate text-[13px] min-w-0 flex-1" style={{ color: "var(--text-primary)" }}>
        {bill.short_title ?? bill.title}
      </span>

      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {house && <LabelChip label={house} color="var(--accent)" />}
        {type && <LabelChip label={type} color="var(--text-tertiary)" />}
      </div>

      <span
        className="shrink-0 text-[12px] tabular-nums w-[40px] text-right hidden sm:inline"
        style={{ color: "var(--text-tertiary)" }}
      >
        {bill.introduced_date?.slice(0, 4) ?? "—"}
      </span>

      <span className="shrink-0 w-[72px] hidden lg:flex justify-end">
        <StageBar stage={bill.current_stage} />
      </span>
    </motion.div>
  )
}

// ── group header ─────────────────────────────────────────────────────────────
function GroupHeader({
  outcome,
  count,
  collapsed,
  onToggle,
}: {
  outcome: BillOutcome
  count: number
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="flex items-center gap-2 h-9 pl-2.5 pr-4"
      style={{ background: "var(--bg-elevated)", boxShadow: "inset 0 -1px 0 var(--border)" }}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.85 }}
        transition={springs.snap}
        className="inline-flex items-center justify-center w-4 h-4 shrink-0"
        style={{ color: "var(--text-tertiary)" }}
        aria-label={collapsed ? "Expand" : "Collapse"}
      >
        <motion.span animate={{ rotate: collapsed ? 0 : 90 }} transition={springs.responsive} className="inline-flex">
          <ChevronRight size={14} strokeWidth={2} />
        </motion.span>
      </motion.button>
      <BillStatusIcon outcome={outcome} size={15} />
      <span
        className="text-[13px]"
        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
      >
        {OUTCOME_META[outcome].label}
      </span>
      <span className="text-[12px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
        {count}
      </span>
    </div>
  )
}

// ── right-side detail panel (key–value properties) ───────────────────────────
function BillDetailPanel({ bill }: { bill: BillRow }) {
  const outcome = normalizeOutcome(bill.outcome)
  return (
    <div
      className="lg:sticky lg:top-4"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-8)",
        background: "var(--bg-elevated)",
        overflow: "hidden",
      }}
    >
      <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        {bill.bill_number && (
          <div className="text-[12px] font-mono tabular-nums mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            {bill.bill_number}
          </div>
        )}
        <h3
          className="text-[15px] leading-snug mb-3"
          style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
        >
          {bill.short_title ?? bill.title}
        </h3>
        <motion.span whileTap={{ scale: 0.97 }} transition={springs.snap} className="inline-flex">
          <Link
            href={`/bills/${bill.slug}`}
            className="inline-flex items-center gap-1 text-[12px]"
            style={{ color: "var(--accent)", textDecoration: "none", fontVariationSettings: fontWeights.medium }}
          >
            View full bill <ArrowUpRight size={13} strokeWidth={1.75} />
          </Link>
        </motion.span>
      </div>

      <div className="p-4">
        <div
          className="text-[11px] uppercase tracking-[0.06em] mb-3"
          style={{ color: "var(--text-quaternary)", fontVariationSettings: fontWeights.semibold }}
        >
          Properties
        </div>

        <PropertyRow
          label="Outcome"
          control={
            <PropertyControl
              icon={<BillStatusIcon outcome={outcome} size={16} />}
              value={OUTCOME_META[outcome].label}
              editable={false}
            />
          }
        />
        <PropertyRow
          label="Chamber"
          control={<PropertyControl value={houseLabel(bill.house_introduced)} placeholder="—" editable={false} />}
        />
        <PropertyRow
          label="Type"
          control={
            <PropertyControl
              value={typeLabel(bill.bill_type)}
              placeholder="—"
              color="var(--text-tertiary)"
              editable={false}
            />
          }
        />
        <PropertyRow
          label="Introduced"
          control={
            <PropertyControl value={bill.introduced_date?.slice(0, 4) ?? null} placeholder="—" editable={false} />
          }
        />
        <PropertyRow
          label="Stage"
          control={
            <div className="flex items-center h-7">
              <StageBar stage={bill.current_stage} />
            </div>
          }
        />
      </div>
    </div>
  )
}

// ── workspace ────────────────────────────────────────────────────────────────
export function BillsWorkspace({ bills }: { bills: BillRow[] }) {
  const router = useRouter()
  const [filters, setFilters] = useState<AppliedFilter[]>([])
  const [activeId, setActiveId] = useState<string | null>(bills[0]?.id ?? null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [cmdOpen, setCmdOpen] = useState(false)

  const billTypes = useMemo(
    () => Array.from(new Set(bills.map((b) => b.bill_type).filter(Boolean))) as string[],
    [bills]
  )

  const properties: FilterProperty[] = useMemo(
    () => [
      {
        key: "outcome",
        label: "Outcome",
        icon: <CircleDashed size={14} strokeWidth={1.75} />,
        operators: ["is", "is_not"],
        multi: true,
        values: OUTCOME_ORDER.map((o) => ({
          id: o,
          label: OUTCOME_META[o].label,
          icon: <BillStatusIcon outcome={o} size={16} />,
        })),
      },
      {
        key: "house",
        label: "Chamber",
        icon: <Landmark size={14} strokeWidth={1.75} />,
        operators: ["is", "is_not"],
        multi: true,
        values: [
          { id: "lok_sabha", label: "Lok Sabha", color: "var(--accent)" },
          { id: "rajya_sabha", label: "Rajya Sabha", color: "var(--accent)" },
        ],
      },
      {
        key: "type",
        label: "Type",
        icon: <FileText size={14} strokeWidth={1.75} />,
        operators: ["is", "is_not"],
        multi: true,
        values: billTypes.map((t) => ({ id: t, label: typeLabel(t)!, color: "var(--text-tertiary)" })),
      },
    ],
    [billTypes]
  )

  const filtered = useMemo(
    () => bills.filter((b) => filters.every((f) => matchBill(b, f))),
    [bills, filters]
  )

  const groups = useMemo(
    () =>
      OUTCOME_ORDER.map((outcome) => ({
        outcome,
        items: filtered.filter((b) => normalizeOutcome(b.outcome) === outcome),
      })).filter((g) => g.items.length > 0),
    [filtered]
  )

  const active = filtered.find((b) => b.id === activeId) ?? filtered[0] ?? null

  const commandGroups: CommandGroupSpec[] = useMemo(
    () => [
      {
        heading: "Bills",
        items: bills.slice(0, 8).map((b) => ({
          id: b.id,
          label: b.short_title ?? b.title,
          hint: b.bill_number ?? undefined,
          icon: <BillStatusIcon outcome={normalizeOutcome(b.outcome)} size={16} />,
          keywords: [b.bill_number ?? "", b.title],
          onSelect: () => router.push(`/bills/${b.slug}`),
        })),
      },
    ],
    [bills, router]
  )

  // Stable key so the list re-mounts (and re-staggers) whenever the filter set
  // changes — the FF entry animation then plays on every filter change.
  const listKey = filters.map((f) => `${f.propertyKey}:${f.operator}:${f.valueIds.join(",")}`).join("|")

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <FilterBar properties={properties} filters={filters} onChange={setFilters} className="flex-1 min-w-0" />
        <motion.button
          type="button"
          onClick={() => setCmdOpen(true)}
          whileTap={{ scale: 0.96 }}
          transition={springs.snap}
          className="inline-flex items-center gap-2 h-7 px-2.5 shrink-0 transition-colors hover:bg-[var(--ff-hover)]"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-6)",
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.medium,
          }}
        >
          <CommandIcon size={13} strokeWidth={1.75} />
          <span className="text-[12px] hidden sm:inline">Search</span>
          <span className="flex items-center gap-0.5">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </motion.button>
      </div>

      <div className="text-[12px] mb-2" style={{ color: "var(--text-tertiary)" }}>
        {filtered.length} {filtered.length === 1 ? "bill" : "bills"}
      </div>

      {/* List + detail split */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 items-start">
        <div
          className="overflow-hidden"
          style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-8)" }}
        >
          {groups.length === 0 ? (
            <div className="grid place-items-center py-16 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              No bills match the current filters.
            </div>
          ) : (
            <AnimateIn key={listKey} stagger>
              {groups.flatMap(({ outcome, items }) => {
                const isCollapsed = collapsed[outcome]
                const rows: React.ReactNode[] = [
                  <AnimateItem key={`h-${outcome}`}>
                    <GroupHeader
                      outcome={outcome}
                      count={items.length}
                      collapsed={isCollapsed}
                      onToggle={() => setCollapsed((c) => ({ ...c, [outcome]: !c[outcome] }))}
                    />
                  </AnimateItem>,
                ]
                if (!isCollapsed) {
                  for (const bill of items) {
                    rows.push(
                      <AnimateItem key={bill.id}>
                        <BillRowItem
                          bill={bill}
                          active={active?.id === bill.id}
                          onClick={() => setActiveId(bill.id)}
                        />
                      </AnimateItem>
                    )
                  }
                }
                return rows
              })}
            </AnimateIn>
          )}
        </div>

        {active && (
          <div className="hidden md:block">
            {/* Re-key by bill id so the panel fade-rises when selection changes. */}
            <AnimateIn key={active.id}>
              <BillDetailPanel bill={active} />
            </AnimateIn>
          </div>
        )}
      </div>

      <CommandMenu
        groups={commandGroups}
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        placeholder="Search bills…"
      />
    </div>
  )
}
