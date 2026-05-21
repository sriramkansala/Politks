import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BillDiffView } from "@/components/forensic/BillDiffView"
import { createPublicClient } from "@/lib/db/server"
import { tokens } from "@/lib/tokens"
import type { BillVersion, BillClause, Bill } from "@/lib/db/types"
import type { ClausePair, DiffType } from "@/app/api/bills/[slug]/diff/route"

export const revalidate = 21600

// For the WRB family we statically pre-render the 2023 diff page
export async function generateStaticParams() {
  return [{ slug: "wrb-2023" }]
}

function alignClauses(
  fromClauses: BillClause[],
  toClauses: BillClause[],
): ClausePair[] {
  const fromMap = new Map(fromClauses.map((c) => [c.clause_number, c]))
  const toMap   = new Map(toClauses.map((c) => [c.clause_number, c]))

  const allNumbers = [
    ...new Set([
      ...fromClauses.map((c) => c.clause_number),
      ...toClauses.map((c) => c.clause_number),
    ]),
  ]

  return allNumbers.map((num) => {
    const f = fromMap.get(num) ?? null
    const t = toMap.get(num) ?? null
    const rep = t ?? f!

    let diffType: DiffType
    if (!f) diffType = "added"
    else if (!t) diffType = "removed"
    else if (f.clause_text === t.clause_text) diffType = "unchanged"
    else diffType = "modified"

    return {
      clauseNumber:    num,
      clauseTitle:     rep.clause_title,
      textFrom:        f?.clause_text ?? null,
      textTo:          t?.clause_text ?? null,
      diffType,
      isPoisonPill:    t?.is_poison_pill ?? f?.is_poison_pill ?? false,
      attributionNote: t?.attribution_note ?? f?.attribution_note ?? null,
      topicTags:       rep.topic_tags,
    }
  })
}

export default async function BillDiffPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { slug } = await params
  const { from: fromSlug } = await searchParams
  const supabase = createPublicClient()

  // Fetch the target bill
  const { data: toBillRaw } = await supabase
    .from("bills")
    .select("id, slug, title, short_title")
    .eq("slug", slug)
    .single()

  if (!toBillRaw) notFound()
  const toBill = toBillRaw as Pick<Bill, "id" | "slug" | "title" | "short_title">

  // Fetch "from" bill (default: predecessor)
  const { data: toBillFull } = await supabase
    .from("bills")
    .select("predecessor_bill_id")
    .eq("id", toBill.id)
    .single()

  const predecessorId = (toBillFull as { predecessor_bill_id: string | null } | null)?.predecessor_bill_id

  // Resolve "from" bill: explicit param → predecessor → first bill in family
  let fromBillId: string | null = null

  if (fromSlug) {
    const { data: fromBillBySlug } = await supabase
      .from("bills")
      .select("id")
      .eq("slug", fromSlug)
      .single()
    fromBillId = (fromBillBySlug as { id: string } | null)?.id ?? null
  }
  if (!fromBillId) fromBillId = predecessorId ?? null

  if (!fromBillId) {
    // No predecessor: diff against itself with no changes
    return (
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
        <p style={{ color: tokens.color.textSecondary }}>
          No earlier version found to compare against.
        </p>
      </div>
    )
  }

  // Fetch both bill IDs for version lookup
  const billIds = [fromBillId, toBill.id]
  const { data: versionsRaw } = await supabase
    .from("bill_versions")
    .select("*")
    .in("bill_id", billIds)
    .order("version_date", { ascending: true })

  const allVersions = (versionsRaw ?? []) as BillVersion[]
  if (allVersions.length < 2) {
    return (
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
        <p style={{ color: tokens.color.textSecondary }}>
          Bill versions not yet loaded. Run the WRB seed to enable the diff view.
        </p>
        <p className="mt-2 text-[12px]" style={{ color: tokens.color.textTertiary }}>
          Run: <code className="font-mono">psql -f supabase/0003_bill_diff.sql</code> then{" "}
          <code className="font-mono">psql -f supabase/seed_wrb_bill_versions.sql</code>
        </p>
      </div>
    )
  }

  const fromVersion = allVersions.find((v) => v.bill_id === fromBillId) ?? allVersions[0]
  const toVersion   = allVersions.find((v) => v.bill_id === toBill.id) ?? allVersions[allVersions.length - 1]

  // Fetch clauses for both versions
  const [{ data: fromClausesRaw }, { data: toClausesRaw }] = await Promise.all([
    supabase
      .from("bill_clauses")
      .select("*")
      .eq("bill_version_id", fromVersion.id)
      .order("ordinal", { ascending: true }),
    supabase
      .from("bill_clauses")
      .select("*")
      .eq("bill_version_id", toVersion.id)
      .order("ordinal", { ascending: true }),
  ])

  const fromClauses = (fromClausesRaw ?? []) as BillClause[]
  const toClauses   = (toClausesRaw ?? []) as BillClause[]
  const pairs       = alignClauses(fromClauses, toClauses)

  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href={`/bills/${slug}`}
            className="flex items-center gap-1.5 text-[12px] transition-colors duration-80 hover:text-[var(--text-primary)]"
            style={{ color: tokens.color.textTertiary, textDecoration: "none" }}
          >
            <ArrowLeft size={12} />
            {toBill.short_title ?? toBill.title}
          </Link>
          <span style={{ color: tokens.color.textDisabled }}>/</span>
          <span className="text-[12px]" style={{ color: tokens.color.textTertiary }}>
            Bill Diff
          </span>
        </div>

        {/* Page header */}
        <div>
          <h1 className="h-page mb-2" style={{ color: tokens.color.textPrimary }}>
            Bill Diff View
          </h1>
          <p className="text-[14px]" style={{ color: tokens.color.textSecondary }}>
            Clause-by-clause comparison — every change highlighted, every insertion attributed.
          </p>
        </div>

        {/* Diff view — client component */}
        <BillDiffView
          fromVersion={fromVersion}
          toVersion={toVersion}
          allVersions={allVersions}
          pairs={pairs}
          billSlug={slug}
          fromSourceUrl={fromVersion.source_url}
          toSourceUrl={toVersion.source_url}
        />
      </div>
    </>
  )
}
