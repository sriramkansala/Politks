"use client"

// Client-side filterable bills list: Lok Sabha / Rajya Sabha / All.
// Filters in-memory so tab switching stays instant (no server round-trip)
// and the same data is reused. Uses the project's Tabs primitive so the
// active-pill animation matches every other tab strip in the app.

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import type { Bill } from "@/lib/db/types"

type BillRow = Pick<Bill,
  "id" | "slug" | "title" | "short_title" | "bill_number" | "bill_type"
  | "introduced_date" | "current_stage" | "outcome" | "house_introduced"
>

const OUTCOME_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  passed:    { label: "Passed",    color: "var(--status-kept)",       bg: "var(--status-kept-bg)" },
  lapsed:    { label: "Lapsed",    color: "var(--status-broken)",     bg: "var(--status-broken-bg)" },
  withdrawn: { label: "Withdrawn", color: "var(--status-stalled)",    bg: "var(--status-stalled-bg)" },
  repealed:  { label: "Repealed",  color: "var(--status-compromise)", bg: "var(--status-compromise-bg)" },
  pending:   { label: "Pending",   color: "var(--status-inworks)",    bg: "var(--status-inworks-bg)" },
}

function OutcomePill({ outcome }: { outcome: string | null }) {
  const s = OUTCOME_STYLE[outcome ?? "pending"] ?? OUTCOME_STYLE.pending
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.04em] shrink-0"
      style={{ color: "var(--text-tertiary)", fontVariationSettings: "'wght' 510" }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: s.color }}
        aria-hidden="true"
      />
      {s.label}
    </span>
  )
}

function StageBar({ stage }: { stage: number | null }) {
  if (!stage) return <span className="text-[12px]" style={{ color: "var(--text-disabled)" }}>—</span>
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[2px]">
        {Array.from({ length: 8 }).map((_, j) => (
          <div
            key={j}
            className="w-[3px] h-[10px] rounded-[1px]"
            style={{
              background: j < Math.round(stage / 2) ? "var(--accent)" : "var(--border-strong)",
            }}
          />
        ))}
      </div>
      <span className="text-[10px]" style={{ color: "var(--text-disabled)" }}>{stage}/16</span>
    </div>
  )
}

function BillTable({ bills }: { bills: BillRow[] }) {
  if (bills.length === 0) {
    return (
      <div
        className="rounded-[6px] p-8 text-center"
        style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
      >
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          No bills tracked in this chamber yet.
        </p>
      </div>
    )
  }
  return (
    <div
      className="rounded-[6px] overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
              Bill
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-wide hidden md:table-cell whitespace-nowrap" style={{ color: "var(--text-tertiary)", width: 180 }}>
              Number
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-wide hidden md:table-cell whitespace-nowrap" style={{ color: "var(--text-tertiary)", width: 70 }}>
              Year
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--text-tertiary)", width: 130 }}>
              Stage
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--text-tertiary)", width: 130 }}>
              Outcome
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill, i) => (
            <TableRow key={bill.id} index={i}>
              <TableCell>
                <Link href={`/bills/${bill.slug}`} className="block" style={{ textDecoration: "none" }}>
                  <div className="text-[13px] font-book" style={{ color: "var(--text-primary)" }}>
                    {bill.short_title ?? bill.title}
                  </div>
                  {bill.house_introduced && (
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--text-disabled)" }}>
                      {bill.house_introduced === "lok_sabha" ? "Lok Sabha" : "Rajya Sabha"}
                      {bill.bill_type ? ` · ${bill.bill_type.replace("_", " ")}` : ""}
                    </div>
                  )}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell whitespace-nowrap">
                <span className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                  {bill.bill_number ?? "—"}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell whitespace-nowrap">
                <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                  {bill.introduced_date?.slice(0, 4) ?? "—"}
                </span>
              </TableCell>
              <TableCell>
                <StageBar stage={bill.current_stage} />
              </TableCell>
              <TableCell>
                <OutcomePill outcome={bill.outcome ?? null} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface Props {
  bills: BillRow[]
}

export function BillsList({ bills }: Props) {
  const [tab, setTab] = useState<"all" | "lok_sabha" | "rajya_sabha">("all")

  const lokSabha   = bills.filter((b) => b.house_introduced === "lok_sabha")
  const rajyaSabha = bills.filter((b) => b.house_introduced === "rajya_sabha")

  const labelFor = (kind: "all" | "lok_sabha" | "rajya_sabha") => {
    if (kind === "all")        return `All (${bills.length})`
    if (kind === "lok_sabha")  return `Lok Sabha (${lokSabha.length})`
    return `Rajya Sabha (${rajyaSabha.length})`
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
      <div className="mb-4">
        <TabsList className="bg-transparent p-0 gap-1">
          <TabItem value="all"          label={labelFor("all")} />
          <TabItem value="lok_sabha"    label={labelFor("lok_sabha")} />
          <TabItem value="rajya_sabha"  label={labelFor("rajya_sabha")} />
        </TabsList>
      </div>

      <TabPanel value="all">
        <AnimateIn stagger className="space-y-2">
          <AnimateItem><BillTable bills={bills} /></AnimateItem>
        </AnimateIn>
      </TabPanel>
      <TabPanel value="lok_sabha">
        <AnimateIn stagger className="space-y-2">
          <AnimateItem><BillTable bills={lokSabha} /></AnimateItem>
        </AnimateIn>
      </TabPanel>
      <TabPanel value="rajya_sabha">
        <AnimateIn stagger className="space-y-2">
          <AnimateItem><BillTable bills={rajyaSabha} /></AnimateItem>
        </AnimateIn>
      </TabPanel>
    </Tabs>
  )
}
