import { describe, it, expect } from "vitest"
import type { BillClause } from "@/lib/db/types"

// Inline the pure alignment function — same logic as route.ts
function alignClauses(fromClauses: BillClause[], toClauses: BillClause[]) {
  const fromMap = new Map(fromClauses.map((c) => [c.clause_number, c]))
  const toMap   = new Map(toClauses.map((c) => [c.clause_number, c]))
  const allNumbers = [...new Set([
    ...fromClauses.map((c) => c.clause_number),
    ...toClauses.map((c) => c.clause_number),
  ])]

  return allNumbers.map((num) => {
    const f = fromMap.get(num) ?? null
    const t = toMap.get(num) ?? null
    let diffType: "unchanged" | "added" | "removed" | "modified"
    if (!f) diffType = "added"
    else if (!t) diffType = "removed"
    else if (f.clause_text === t.clause_text) diffType = "unchanged"
    else diffType = "modified"
    return { clauseNumber: num, diffType, isPoisonPill: t?.is_poison_pill ?? f?.is_poison_pill ?? false }
  })
}

const makeClause = (n: string, text: string, poisonPill = false): BillClause => ({
  id: n, bill_version_id: "v1", clause_number: n, clause_title: null,
  clause_text: text, parent_clause_id: null, topic_tags: [],
  references_act: null, is_poison_pill: poisonPill, attribution_note: null,
  ordinal: parseInt(n) || 0, created_at: "",
})

describe("alignClauses", () => {
  it("marks identical clauses as unchanged", () => {
    const c = makeClause("1", "Short title")
    const result = alignClauses([c], [c])
    expect(result[0].diffType).toBe("unchanged")
  })

  it("marks clause present only in 'to' as added", () => {
    const result = alignClauses([], [makeClause("334A", "New clause")])
    expect(result[0].diffType).toBe("added")
  })

  it("marks clause present only in 'from' as removed", () => {
    const result = alignClauses([makeClause("5", "Old clause")], [])
    expect(result[0].diffType).toBe("removed")
  })

  it("marks clause with changed text as modified", () => {
    const result = alignClauses(
      [makeClause("2", "Old text")],
      [makeClause("2", "New text")],
    )
    expect(result[0].diffType).toBe("modified")
  })

  it("flags poison-pill clauses (WRB Article 334A)", () => {
    const result = alignClauses([], [makeClause("334A", "Reservation linked to delimitation", true)])
    expect(result[0].isPoisonPill).toBe(true)
    expect(result[0].diffType).toBe("added")
  })

  it("preserves 'from' ordinal ordering for unchanged clauses", () => {
    const from = [makeClause("1", "A"), makeClause("2", "B")]
    const to   = [makeClause("1", "A"), makeClause("2", "B")]
    const result = alignClauses(from, to)
    expect(result.map((r) => r.clauseNumber)).toEqual(["1", "2"])
  })

  it("WRB 2008→2023: detects Article 334A addition", () => {
    const wrb2008 = [
      makeClause("1", "Short title"),
      makeClause("2", "Art 239AA"),
      makeClause("3", "Art 330A"),
      makeClause("4", "Art 332A"),
      makeClause("5", "Art 334 amendment"),
    ]
    const wrb2023 = [
      makeClause("1", "Short title"),
      makeClause("2", "Art 239AA"),
      makeClause("3", "Art 330A"),
      makeClause("4", "Art 332A"),
      makeClause("334A", "Linked to delimitation", true),
      makeClause("5", "Art 334 amendment (expanded)"),
    ]
    const result = alignClauses(wrb2008, wrb2023)
    const added  = result.filter((r) => r.diffType === "added")
    const poisonPills = result.filter((r) => r.isPoisonPill)
    expect(added.length).toBe(1)
    expect(added[0].clauseNumber).toBe("334A")
    expect(poisonPills.length).toBe(1)
  })
})
