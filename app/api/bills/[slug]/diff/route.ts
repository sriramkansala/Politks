import { NextRequest, NextResponse } from "next/server"
import { createPublicClient } from "@/lib/db/server"
import type { BillVersion, BillClause } from "@/lib/db/types"

export const revalidate = 21600

export type DiffType = "unchanged" | "added" | "removed" | "modified"

export interface ClausePair {
  clauseNumber: string
  clauseTitle: string | null
  textFrom: string | null   // null = clause added in "to"
  textTo: string | null     // null = clause removed in "to"
  diffType: DiffType
  isPoisonPill: boolean
  attributionNote: string | null
  topicTags: string[]
}

export interface DiffResponse {
  fromVersion: BillVersion
  toVersion: BillVersion
  allVersions: BillVersion[]
  pairs: ClausePair[]
}

function alignClauses(
  fromClauses: BillClause[],
  toClauses: BillClause[],
): ClausePair[] {
  const fromMap = new Map(fromClauses.map((c) => [c.clause_number, c]))
  const toMap   = new Map(toClauses.map((c) => [c.clause_number, c]))

  // Union of all clause numbers, preserving "to" ordinal ordering
  const allNumbers = [
    ...new Set([
      ...fromClauses.map((c) => c.clause_number),
      ...toClauses.map((c) => c.clause_number),
    ]),
  ]

  return allNumbers.map((num) => {
    const f = fromMap.get(num) ?? null
    const t = toMap.get(num) ?? null
    const representativeClause = t ?? f!

    let diffType: DiffType
    if (!f) diffType = "added"
    else if (!t) diffType = "removed"
    else if (f.clause_text === t.clause_text) diffType = "unchanged"
    else diffType = "modified"

    return {
      clauseNumber:    num,
      clauseTitle:     representativeClause.clause_title,
      textFrom:        f?.clause_text ?? null,
      textTo:          t?.clause_text ?? null,
      diffType,
      isPoisonPill:    t?.is_poison_pill ?? f?.is_poison_pill ?? false,
      attributionNote: t?.attribution_note ?? f?.attribution_note ?? null,
      topicTags:       representativeClause.topic_tags,
    }
  })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const { searchParams } = req.nextUrl
  const supabase = createPublicClient()

  // Fetch the two bills being compared
  const fromSlug = searchParams.get("from") ?? null
  const toSlug   = slug

  const [{ data: toBill }, { data: fromBill }] = await Promise.all([
    supabase.from("bills").select("id").eq("slug", toSlug).single(),
    fromSlug
      ? supabase.from("bills").select("id").eq("slug", fromSlug).single()
      : Promise.resolve({ data: null as { id: string } | null }),
  ])

  const typedToBill = toBill as { id: string } | null
  if (!typedToBill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 })
  }

  // Fetch all versions in the WRB family (predecessor chain) for the time-machine
  // We do this by fetching all bills that share any version with the given slugs
  const relatedSlugs = [toSlug, fromSlug].filter(Boolean) as string[]
  const { data: relatedBills } = await supabase
    .from("bills")
    .select("id")
    .in("slug", relatedSlugs)

  const relatedBillIds = ((relatedBills ?? []) as { id: string }[]).map((b) => b.id)
  const { data: allVersionsRaw } = await supabase
    .from("bill_versions")
    .select("*")
    .in("bill_id", relatedBillIds)
    .order("version_date", { ascending: true })

  const allVersions = (allVersionsRaw ?? []) as BillVersion[]

  if (allVersions.length < 2) {
    return NextResponse.json({ error: "Not enough versions for diff" }, { status: 404 })
  }

  // Default: first version vs last version
  const toId   = typedToBill.id
  const fromId = (fromBill as { id: string } | null)?.id ?? null

  const toVersion   = allVersions.find((v) => v.bill_id === toId) ?? allVersions[allVersions.length - 1]
  const fromVersion = fromId
    ? allVersions.find((v) => v.bill_id === fromId) ?? allVersions[0]
    : allVersions[0]

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

  const response: DiffResponse = {
    fromVersion,
    toVersion,
    allVersions,
    pairs,
  }

  return NextResponse.json(response)
}
