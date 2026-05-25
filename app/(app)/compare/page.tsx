// /compare — GSMArena-style side-by-side comparison.
// Pick a type (Party | MP | Manifesto), add up to 4 items, see the table.

import { createPublicClient } from "@/lib/db/server"
import { STATIC_MPS_ALL } from "@/lib/db/staticMps"
import { partyColor } from "@/lib/partyColors"
import type { Party, PromiseRow } from "@/lib/db/types"
import { CompareShell } from "@/components/compare/CompareShell"
import type { CompareParty, CompareMp } from "@/components/compare/CompareShell"
import { tokens } from "@/lib/tokens"
import { AnimateIn } from "@/components/ui/animate-in"

export const revalidate = 21600

export default async function ComparePage() {
  const supabase = createPublicClient()

  const [{ data: partyRows }, { data: promiseRows }] = await Promise.all([
    supabase.from("parties").select("id, name, short_name, slug, color_hex").order("name"),
    supabase.from("promises").select("party_id, status"),
  ])

  type PromiseSelect = Pick<PromiseRow, "party_id" | "status">
  const allPromises = (promiseRows ?? []) as PromiseSelect[]
  const typedParties = (partyRows ?? []) as Pick<Party, "id" | "name" | "short_name" | "slug" | "color_hex">[]

  const parties: CompareParty[] = typedParties.map((p) => {
    const rows = allPromises.filter((r) => r.party_id === p.id)
    return {
      id: p.id as string,
      name: p.name as string,
      short_name: (p.short_name ?? null) as string | null,
      slug: p.slug as string,
      color: (p.color_hex ?? "var(--border-strong)") as string,
      total:      rows.length,
      kept:       rows.filter((r) => r.status === "promise_kept").length,
      broken:     rows.filter((r) => r.status === "promise_broken").length,
      inworks:    rows.filter((r) => r.status === "in_the_works").length,
      stalled:    rows.filter((r) => r.status === "stalled").length,
      compromise: rows.filter((r) => r.status === "compromise").length,
      unrated:    rows.filter((r) => r.status === "not_yet_rated").length,
    }
  })

  const mps: CompareMp[] = STATIC_MPS_ALL.map((mp) => ({
    id: mp.id,
    name: mp.name,
    party_name: mp.party_name ?? null,
    house: mp.house ?? null,
    constituency: mp.constituency ?? null,
    state_code: mp.state_code ?? null,
    attendance_pct: mp.attendance_pct ?? null,
    questions_asked: mp.questions_asked ?? null,
    debates_participated: mp.debates_participated ?? null,
    criminal_cases_any: mp.criminal_cases_any ?? null,
    assets_inr: mp.assets_inr ?? null,
    prs_slug: mp.prs_slug ?? null,
    color: partyColor(mp.party_name ?? ""),
  }))

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
      <AnimateIn>
        <h1 className="h-page mb-2" style={{ color: tokens.color.textPrimary }}>
          Compare
        </h1>
        <p className="text-[15px] max-w-xl" style={{ color: tokens.color.textSecondary }}>
          Search and add up to three items — parties, MPs, or manifestos — to
          compare them side by side.
        </p>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <CompareShell parties={parties} mps={mps} />
      </AnimateIn>

      <AnimateIn delay={0.12} className="caveat-block">
        <strong>How this works.</strong>{" "}
        Party stats are drawn from the promise tracker — only promises with a
        verifiable source are counted. MP data comes from{" "}
        <a href="https://prsindia.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          PRS Legislative Research
        </a>{" "}
        and self-declared ECI affidavits. State-specific promises (AAP/Delhi,
        DMK/Tamil Nadu) are rated against state-government delivery; national
        promises against the Union government.
      </AnimateIn>
    </div>
  )
}
