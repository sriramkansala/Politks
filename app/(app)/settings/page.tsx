// /settings — viewer preferences for Neo Nīti.
// Currently: which parties to show / hide across list & grid views.
// Stored entirely client-side (localStorage via zustand-persist) — no
// server account required.

import { createPublicClient } from "@/lib/db/server"
import type { Party } from "@/lib/db/types"
import { PartyVisibilityList } from "@/components/settings/PartyVisibilityList"

export const metadata = { title: "Settings · Neo Nīti" }
export const revalidate = 21600

export default async function SettingsPage() {
  const supabase = createPublicClient()
  const { data: partyRows } = await supabase
    .from("parties")
    .select("id, name, short_name, color_hex")
    .order("name", { ascending: true })

  type Row = Pick<Party, "id" | "name" | "short_name" | "color_hex">
  const parties = (partyRows ?? []).map((p) => {
    const row = p as Row
    return {
      id: row.id as string,
      name: row.name as string,
      short_name: (row.short_name ?? null) as string | null,
      color: (row.color_hex ?? "var(--border-strong)") as string,
    }
  })

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
      <section className="flex flex-col gap-2">
        <h1 className="h-page" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
        <p className="text-[15px] max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Customise what you see across the app. Changes are saved in your browser
          and apply immediately.
        </p>
      </section>

      <section>
        <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>
          Parties to show
        </h2>
        <PartyVisibilityList parties={parties} />
      </section>
    </div>
  )
}
