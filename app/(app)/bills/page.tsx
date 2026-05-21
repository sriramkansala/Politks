import Link from "next/link"
import { createPublicClient } from "@/lib/db/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import type { Bill } from "@/lib/db/types"

export const revalidate = 21600

const OUTCOME_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  passed:    { label: "Passed",    color: "var(--status-kept)",       bg: "var(--status-kept-bg)" },
  lapsed:    { label: "Lapsed",    color: "var(--status-broken)",     bg: "var(--status-broken-bg)" },
  withdrawn: { label: "Withdrawn", color: "var(--status-stalled)",    bg: "var(--status-stalled-bg)" },
  repealed:  { label: "Repealed",  color: "var(--status-compromise)", bg: "var(--status-compromise-bg)" },
  pending:   { label: "Pending",   color: "var(--status-inworks)",    bg: "var(--status-inworks-bg)" },
}

function OutcomePill({ outcome }: { outcome: string | null }) {
  const s = OUTCOME_STYLE[outcome ?? "pending"] ?? OUTCOME_STYLE.pending
  // Linear-monochrome: dot + label, no chip background.
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.04em] shrink-0"
      style={{
        color: "var(--text-tertiary)",
        fontVariationSettings: "'wght' 510",
      }}
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

export default async function BillsPage() {
  const supabase = createPublicClient()

  const { data: bills } = await supabase
    .from("bills")
    .select("id, slug, title, short_title, bill_number, bill_type, introduced_date, current_stage, outcome, house_introduced")
    .order("introduced_date", { ascending: false })

  const allBills = (bills ?? []) as Pick<Bill,
    "id" | "slug" | "title" | "short_title" | "bill_number" | "bill_type" | "introduced_date" | "current_stage" | "outcome" | "house_introduced"
  >[]

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
      <div className="mb-6">
        <h1 className="h-page mb-2" style={{ color: "var(--text-primary)" }}>Bills</h1>
        <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
          {allBills.length} bills tracked · Legislative timeline with causal forensics
        </p>
      </div>

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
            {allBills.map((bill, i) => (
              <TableRow key={bill.id} index={i}>
                <TableCell>
                  <Link
                    href={`/bills/${bill.slug}`}
                    className="block"
                    style={{ textDecoration: "none" }}
                  >
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

      {/* Caveat block — UI_RULES.md §6 */}
      <section className="caveat-block mt-6">
        <strong>How this works.</strong>{" "}
        Bill metadata (number, type, dates, current stage) comes from{" "}
        <a href="https://prsindia.org/billtrack" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          PRS Legislative Research
        </a>
        {" "}and the Lok Sabha / Rajya Sabha digital archives. The 16-stage
        timeline collapses procedural and committee steps into a single forward
        bar; substantive amendments and committee dissent are surfaced on the
        per-bill page. Outcome is set only after gazette notification (Passed),
        explicit withdrawal, or expiry at dissolution of Parliament.
      </section>
    </div>
  )
}
