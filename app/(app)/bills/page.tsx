import { createPublicClient } from "@/lib/db/server"
import type { Bill } from "@/lib/db/types"
import { AnimateIn } from "@/components/ui/animate-in"
import { BillsList } from "@/components/forensic/BillsList"

export const revalidate = 21600

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
      <AnimateIn className="mb-6">
        <h1 className="h-page mb-2" style={{ color: "var(--text-primary)" }}>Bills</h1>
        <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
          {allBills.length} bills tracked · Legislative timeline with causal forensics
        </p>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <BillsList bills={allBills} />
      </AnimateIn>

      {/* Caveat block — UI_RULES.md §6 */}
      <AnimateIn delay={0.1} className="caveat-block mt-6">
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
      </AnimateIn>
    </div>
  )
}
