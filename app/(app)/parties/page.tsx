import { Suspense } from "react"
import { TopNav } from "@/components/shell/TopNav"
import { PartyCard } from "@/components/parties/PartyCard"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 21600 // 6 hours

// Seeded party data — replace with live DB fetch once Supabase is connected
const SEED_PARTIES = [
  {
    id: "1",
    slug: "bjp",
    name: "Bharatiya Janata Party",
    name_translations: {},
    short_name: "BJP",
    level: "national" as const,
    state_code: null,
    founded_year: 1980,
    color_hex: "#FF6B00",
    logo_url: null,
    ec_registration: null,
    website_url: "https://www.bjp.org",
    created_at: "",
  },
  {
    id: "2",
    slug: "inc",
    name: "Indian National Congress",
    name_translations: {},
    short_name: "INC",
    level: "national" as const,
    state_code: null,
    founded_year: 1885,
    color_hex: "#19AAED",
    logo_url: null,
    ec_registration: null,
    website_url: "https://www.inc.in",
    created_at: "",
  },
  {
    id: "3",
    slug: "aap",
    name: "Aam Aadmi Party",
    name_translations: {},
    short_name: "AAP",
    level: "national" as const,
    state_code: null,
    founded_year: 2012,
    color_hex: "#2196F3",
    logo_url: null,
    ec_registration: null,
    website_url: "https://www.aamaadmiparty.org",
    created_at: "",
  },
  {
    id: "4",
    slug: "dmk",
    name: "Dravida Munnetra Kazhagam",
    name_translations: {},
    short_name: "DMK",
    level: "state" as const,
    state_code: "TN",
    founded_year: 1949,
    color_hex: "#E32636",
    logo_url: null,
    ec_registration: null,
    website_url: "https://www.dmk.in",
    created_at: "",
  },
]

function PartySkeleton() {
  return (
    <div
      className="p-4 rounded-[6px] flex items-center gap-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <Skeleton className="w-8 h-8 rounded-[4px]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function PartyList() {
  return (
    <div className="grid grid-cols-1 gap-3">
      {SEED_PARTIES.map((party) => (
        <PartyCard key={party.id} party={party} />
      ))}
    </div>
  )
}

export default function PartiesPage() {
  return (
    <>
      <TopNav title="Parties" />
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
        <div className="mb-6">
          <h1 className="text-heading mb-1" style={{ color: "var(--text-primary)" }}>
            Parties
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            4 parties tracked · Lok Sabha 2024 + state elections
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map((i) => <PartySkeleton key={i} />)}
          </div>
        }>
          <PartyList />
        </Suspense>
      </div>
    </>
  )
}
