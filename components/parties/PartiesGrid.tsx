"use client"

// Client wrapper around the Parties grid so the user's per-party visibility
// preference (see /settings) applies without re-fetching. The page itself
// stays SSR for fast first paint; this component just filters and renders.

import { PartyCard } from "@/components/parties/PartyCard"
import type { Party } from "@/lib/db/types"
import { useHiddenParties } from "@/hooks/use-hidden-parties"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"

interface PartyStat {
  party: Party
  promiseCount: number
  keptCount: number
}

export function PartiesGrid({ partyStats }: { partyStats: PartyStat[] }) {
  const hidden = useHiddenParties((s) => s.hidden)
  const visible = partyStats.filter(({ party }) => !hidden.includes(party.id))

  return (
    <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {visible.map(({ party, promiseCount, keptCount }) => (
        <AnimateItem key={party.id}>
          <PartyCard
            party={party}
            promiseCount={promiseCount}
            keptCount={keptCount}
          />
        </AnimateItem>
      ))}
    </AnimateIn>
  )
}
