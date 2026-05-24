"use client"

import { useState, useMemo } from "react"
import { motion, LayoutGroup } from "framer-motion"
import { Search, X } from "lucide-react"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { tokens } from "@/lib/tokens"
import { useShape } from "@/lib/shape-context"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip"
import { StatusPill } from "./StatusPill"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table"
import type { PromiseStatus } from "@/lib/db/types"

// ── Types ──────────────────────────────────────────────────────────────────

type SignificanceKey =
  | "fundamental_right"
  | "directive_principle"
  | "welfare"
  | "economic"
  | "aspirational"

export type PromiseSlim = {
  id: string
  title: string
  category: string
  status: PromiseStatus
  geography: string
  page_ref?: number | null
  is_headline?: boolean
}

type ClassifiedPromise = PromiseSlim & { sig: SignificanceKey }

// ── Significance config ─────────────────────────────────────────────────────
// Bar colors use the existing status CSS variables — no arbitrary hex.
// All text uses the platform's text hierarchy tokens.

const SIG: Record<SignificanceKey, {
  label: string
  barColor: string  // one of the existing --status-* or --border vars
  description: string
}> = {
  fundamental_right: {
    label: "Fundamental Right",
    barColor: "var(--status-broken)",   // red — constitutionally serious
    description:
      "Directly relates to rights guaranteed under Part III of the Constitution — Right to Life (Art. 21), Equality (Arts. 14–18), Education (Art. 21A), and Freedom from Exploitation (Arts. 23–24).",
  },
  directive_principle: {
    label: "Directive Principle",
    barColor: "var(--status-stalled)",  // warm amber — binding on conscience
    description:
      "Aligns with Directive Principles of State Policy (Part IV) — agriculture, living wages, social security, rural development. Non-justiciable but morally binding on the state.",
  },
  welfare: {
    label: "Welfare Policy",
    barColor: "var(--status-inworks)",  // teal — active social programs
    description:
      "General welfare schemes — subsidies, housing allotments, free transit — with material impact on citizens but not directly pegged to a constitutional provision.",
  },
  economic: {
    label: "Economic & Infrastructure",
    barColor: "var(--border-strong)",   // neutral — discretionary policy
    description:
      "Market, fiscal, energy, and infrastructure policy. Discretionary — no constitutional obligation to deliver on a specific target.",
  },
  aspirational: {
    label: "Aspirational",
    barColor: "var(--border)",          // very subtle — no mandate
    description:
      "Goal-oriented promises with no direct constitutional mandate — sports bids, global rankings, governance restructuring, strategic ambitions.",
  },
}

const SIG_ORDER: SignificanceKey[] = [
  "fundamental_right", "directive_principle", "welfare", "economic", "aspirational",
]

type FilterValue = "all" | SignificanceKey

const FILTERS: { value: FilterValue; label: string; description?: string }[] = [
  { value: "all",                 label: "All", description: "All promises, regardless of constitutional significance." },
  { value: "fundamental_right",   label: "Fundamental Rights",   description: SIG.fundamental_right.description },
  { value: "directive_principle", label: "Directive Principles", description: SIG.directive_principle.description },
  { value: "welfare",             label: "Welfare",              description: SIG.welfare.description },
  { value: "economic",            label: "Economic",             description: SIG.economic.description },
  { value: "aspirational",        label: "Aspirational",         description: SIG.aspirational.description },
]

// ── Classification heuristic ────────────────────────────────────────────────

function classify(title: string, category: string): SignificanceKey {
  const t = title.toLowerCase()
  const c = category.toLowerCase()

  if (
    t.includes("reservat") || t.includes("uniform civil code") ||
    t.includes("nari shakti") || (t.includes("seat") && t.includes("women")) ||
    t.includes("50% women") || t.includes("gender") ||
    t.includes("obc") || t.includes("sc/st") || t.includes("caste") ||
    t.includes("discriminat") || t.includes("minority right") || t.includes("equal pay")
  ) return "fundamental_right"

  if (
    c === "healthcare" || t.includes("health") || t.includes("hospital") ||
    t.includes("ayushman") || t.includes("medical") ||
    t.includes("nutrition") || t.includes("hunger") || t.includes("sanitation") ||
    t.includes("clean water") || t.includes("pollution") || t.includes("air quality") ||
    t.includes("bpl") ||
    (t.includes("housing") && (t.includes("slum") || t.includes("poverty") || t.includes("below")))
  ) return "fundamental_right"

  if (
    c === "education" || t.includes("school") || t.includes("education") ||
    t.includes("breakfast scheme") || t.includes("midday meal") ||
    t.includes("literacy") || t.includes("teacher") || t.includes("nep")
  ) return "fundamental_right"

  if (t.includes("trafficking") || t.includes("child labour") || t.includes("bonded"))
    return "fundamental_right"

  if (
    c === "agriculture" || t.includes("farmer") || t.includes("kisan") ||
    t.includes("msp") || t.includes("crop") || t.includes("minimum wage") ||
    t.includes("wage") || t.includes("labour") || t.includes("worker") ||
    t.includes("livelihood") || t.includes("panchayat") || t.includes("social security") ||
    t.includes("maternity") || t.includes("land reform") ||
    c === "employment" || t.includes("employment") || t.includes("job")
  ) return "directive_principle"

  if (
    t.includes("lakhpati") || t.includes("pm kisan") || t.includes("samman nidhi") ||
    t.includes("₹") || t.includes("free electricity") || t.includes("units free") ||
    t.includes("units/month") || t.includes("subsidi") || t.includes("rooftop solar") ||
    (t.includes("women") && t.includes("head"))
  ) return "directive_principle"

  if (
    c === "tribal_affairs" || c === "social_welfare" || c === "women_empowerment" ||
    t.includes("tribal") || t.includes("adivasi") || t.includes("backward class")
  ) return "directive_principle"

  if (
    t.includes("olympic") || t.includes("world cup") ||
    t.includes("one nation one election") || t.includes("simultaneous election") ||
    t.includes("theatre command") || t.includes("cultural centre") ||
    t.includes("diplomatic") || t.includes("strategic presence") ||
    t.includes("foreign mission") ||
    c === "defence_security" || c === "sports" ||
    (c === "governance" && (t.includes("election") || t.includes("simultaneous"))) ||
    (c === "culture" && !t.includes("minority"))
  ) return "aspirational"

  if (
    t.includes("free bus") || t.includes("yojana") || t.includes("awas") ||
    t.includes("crore house") || t.includes("lakh flat") || t.includes("slum dweller") ||
    t.includes("rural") || t.includes("below poverty line") ||
    t.includes("urban housing") || t.includes("affordable housing") ||
    c === "housing" || c === "environment"
  ) return "welfare"

  return "economic"
}

// ── Component ───────────────────────────────────────────────────────────────

interface PromiseListProps {
  promises: PromiseSlim[]
}

export function PromiseList({ promises }: PromiseListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")
  const [search, setSearch] = useState("")
  const shape = useShape()

  const classified = useMemo<ClassifiedPromise[]>(
    () => promises.map((p) => ({ ...p, sig: classify(p.title, p.category) })),
    [promises]
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: classified.length }
    SIG_ORDER.forEach((k) => { c[k] = classified.filter((p) => p.sig === k).length })
    return c
  }, [classified])

  const filtered = useMemo(() => {
    let list = classified
    if (activeFilter !== "all") list = list.filter((p) => p.sig === activeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [classified, activeFilter, search])

  return (
    <div className="space-y-3">

      {/* ── Controls ── */}
      <div className="flex items-start justify-between gap-4">

        <div className="space-y-2 min-w-0">
          <h2 className="text-subheading" style={{ color: tokens.color.textPrimary }}>
            Promises
            <span
              className="ml-2 text-[13px]"
              style={{ color: tokens.color.textTertiary, fontVariationSettings: fontWeights.normal }}
            >
              ({filtered.length}{filtered.length !== classified.length ? ` of ${classified.length}` : ""})
            </span>
          </h2>

          {/* Filter chips — uniform active state, no per-category colors */}
          <LayoutGroup id="promise-filter-group">
            <div className="flex gap-0.5 flex-wrap">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.value
                const count = counts[f.value] ?? 0
                if (count === 0 && f.value !== "all") return null
                const button = (
                  // UI_RULES.md §1 exception: this chip uses a framer-motion
                  // `layoutId="promise-filter-pill"` for the shared-element
                  // background-pill animation between active filters. The
                  // <Button> wrapper renders its own `absolute inset-0` bg span
                  // which would fight (and double-render) the motion.span pill.
                  // It also targets 11px text + 24px height (below sm = 28px).
                  // Keep as a bare <button> — documented exception.
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={`relative px-2.5 py-[5px] text-[11px] transition-colors duration-80 ${shape.button}`}
                    style={{
                      color: isActive ? tokens.color.textPrimary : tokens.color.textTertiary,
                      fontVariationSettings: isActive ? fontWeights.semibold : fontWeights.normal,
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="promise-filter-pill"
                        className={`absolute inset-0 ${shape.bg}`}
                        style={{ background: tokens.color.bgElevated2 }}
                        transition={springs.moderate}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      {f.label}
                      <span style={{ opacity: 0.4, fontVariationSettings: fontWeights.normal }}>
                        {count}
                      </span>
                    </span>
                  </button>
                )
                return f.description ? (
                  <Tooltip
                    key={f.value}
                    side="bottom"
                    content={<span className="block max-w-[280px] leading-snug">{f.description}</span>}
                  >
                    {button}
                  </Tooltip>
                ) : button
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Search */}
        <div className="relative flex items-center shrink-0 mt-[2px]">
          <Search
            size={11}
            className="absolute left-2.5 pointer-events-none z-10"
            style={{ color: tokens.color.textDisabled }}
          />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promises…"
            className="pl-7 w-40 focus:w-52 transition-[width] duration-200"
            style={{ paddingRight: search ? 28 : undefined }}
          />
          {search && (
            // UI_RULES.md §1 exception: 11px icon-only clear button absolutely
            // positioned inside the <Input>'s right padding (28px). The
            // smallest <Button> variant (icon-sm = 32x32) is larger than the
            // Input itself (h-8 = 32px) and cannot sit inside the padding.
            // Keep as a bare <button> — documented exception.
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 z-10"
              style={{ color: tokens.color.textDisabled }}
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Description now shown via hover tooltip on each filter chip. */}

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div
          className="px-4 py-10 text-center rounded-[6px]"
          style={{ border: `1px solid ${tokens.color.border}` }}
        >
          <p className="text-caption" style={{ color: tokens.color.textTertiary }}>
            {search ? `No promises match "${search}"` : "No promises in this category."}
          </p>
        </div>
      ) : (
        <div
          className="rounded-[6px] overflow-hidden"
          style={{ border: `1px solid ${tokens.color.border}`, background: tokens.color.bgElevated }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 6 }} />
                <TableHead
                  className="text-[10px] uppercase tracking-wide"
                  style={{ color: tokens.color.textTertiary }}
                >
                  Promise
                </TableHead>
                <TableHead
                  className="text-[10px] uppercase tracking-wide hidden md:table-cell"
                  style={{ color: tokens.color.textTertiary, width: 160 }}
                >
                  Category
                </TableHead>
                <TableHead
                  className="text-[10px] uppercase tracking-wide"
                  style={{ color: tokens.color.textTertiary, width: 160 }}
                >
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((promise, i) => {
                const sig = SIG[promise.sig]
                return (
                  <TableRow key={promise.id} index={i}>
                    {/* Significance bar — uses existing status vars */}
                    <TableCell style={{ paddingLeft: 10, paddingRight: 0, width: 6 }}>
                      <div
                        className="w-[3px] h-[18px] rounded-full"
                        style={{ background: sig.barColor }}
                      />
                    </TableCell>

                    {/* Title + significance label */}
                    <TableCell>
                      <p
                        className="text-[13px] leading-snug"
                        style={{ color: tokens.color.textPrimary }}
                      >
                        {promise.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] uppercase tracking-wider"
                          style={{
                            color: tokens.color.textDisabled,
                            fontVariationSettings: fontWeights.normal,
                          }}
                        >
                          {sig.label}
                        </span>
                        {promise.geography && promise.geography !== "national" && (
                          <span className="text-[11px]" style={{ color: tokens.color.textTertiary }}>
                            {promise.geography}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="hidden md:table-cell" style={{ whiteSpace: "nowrap" }}>
                      <span
                        className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-[2px]"
                        style={{
                          background: tokens.color.bgElevated2,
                          color: tokens.color.textSecondary,
                          fontVariationSettings: fontWeights.medium,
                        }}
                      >
                        {promise.category.replace(/_/g, " ")}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      <StatusPill status={promise.status as PromiseStatus} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
