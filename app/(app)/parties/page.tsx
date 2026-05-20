import { PartyCard } from "@/components/parties/PartyCard"
import { createPublicClient } from "@/lib/db/server"
import type { Party, PromiseRow } from "@/lib/db/types"

export const revalidate = 21600

export default async function PartiesPage() {
  const supabase = createPublicClient()

  const { data: parties } = await supabase
    .from("parties")
    .select("*")
    .order("founded_year", { ascending: true })

  const { data: promiseCounts } = await supabase
    .from("promises")
    .select("party_id, status")

  const allRows = (promiseCounts ?? []) as Pick<PromiseRow, "party_id" | "status">[]
  const allParties = (parties ?? []) as Party[]

  const partyStats = allParties.map((p) => {
    const rows = allRows.filter((r) => r.party_id === p.id)
    const kept = rows.filter((r) => r.status === "promise_kept").length
    return { party: p, promiseCount: rows.length, keptCount: kept }
  })

  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
        <div className="mb-6">
          <h1 className="text-heading mb-1" style={{ color: "var(--text-primary)" }}>
            Parties
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            {allParties.length} parties tracked · Lok Sabha 2024 + state elections
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {partyStats.map(({ party, promiseCount, keptCount }) => (
            <PartyCard key={party.id} party={party} promiseCount={promiseCount} keptCount={keptCount} />
          ))}
        </div>
      </div>
    </>
  )
}
