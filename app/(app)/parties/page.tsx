import { PartyCard } from "@/components/parties/PartyCard"
import { createPublicClient } from "@/lib/db/server"
import type { Party, PromiseRow } from "@/lib/db/types"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"

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
        <AnimateIn className="mb-6">
          <h1 className="h-page mb-2" style={{ color: "var(--text-primary)" }}>
            Parties
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            {allParties.length} parties tracked · Lok Sabha 2024 + state elections
          </p>
        </AnimateIn>

        <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {partyStats.map(({ party, promiseCount, keptCount }) => (
            <AnimateItem key={party.id}>
              <PartyCard party={party} promiseCount={promiseCount} keptCount={keptCount} />
            </AnimateItem>
          ))}
        </AnimateIn>

        {/* Caveat block — UI_RULES.md §6 */}
        <AnimateIn delay={0.1} className="caveat-block mt-6">
          <strong>How this works.</strong>{" "}
          Party metadata (founded year, alliance, leadership) comes from each
          party&apos;s self-declared profile filed with the{" "}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            Election Commission of India
          </a>
          . Promise counts reflect manifesto pledges editors have catalogued so
          far — not every line in every manifesto is tracked. &ldquo;Kept&rdquo;
          counts are based on cited post-election evidence; absence of a count
          means rating is still pending, not that the party failed.
        </AnimateIn>
      </div>
    </>
  )
}
