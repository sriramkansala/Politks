import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { PoliticalCompass } from "@/components/parties/PoliticalCompass"
import { PartySymbol } from "@/components/parties/PartySymbol"
import { PromiseList } from "@/components/promises/PromiseList"
import { createPublicClient } from "@/lib/db/server"
import type { PromiseStatus, Party, PromiseRow } from "@/lib/db/types"

export const revalidate = 21600

export async function generateStaticParams() {
  return ["bjp", "inc", "aap", "dmk"].map((slug) => ({ slug }))
}

export default async function PartyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createPublicClient()

  // Fetch party
  const { data: party } = await supabase
    .from("parties")
    .select("*")
    .eq("slug", slug)
    .single()

  const typedParty = party as Party | null
  if (!typedParty) notFound()

  // Fetch headline promises for this party
  const { data: promises } = await supabase
    .from("promises")
    .select("id, title, category, status, geography, page_ref, is_headline")
    .eq("party_id", typedParty.id)
    .order("is_headline", { ascending: false })
    .order("ordinal", { ascending: true })
    .limit(40)

  type PromiseSlim = Pick<PromiseRow, "id" | "title" | "category" | "status" | "geography" | "page_ref" | "is_headline">
  const allPromises = (promises ?? []) as PromiseSlim[]

  // Status breakdown counts
  const statusCounts = allPromises.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const level = typedParty.level === "state"
    ? `State${typedParty.state_code ? ` (${typedParty.state_code})` : ""}`
    : "National"

  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">

        {/* Party header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-[6px] flex items-center justify-center shrink-0"
              style={{ background: `${typedParty.color_hex}18` }}
            >
              <PartySymbol slug={slug} color={typedParty.color_hex as string} size={34} />
            </div>
            <div>
              <h1 className="text-heading" style={{ color: "var(--text-primary)" }}>
                {typedParty.name}
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-caption" style={{ color: "var(--text-secondary)" }}>
                  Est. {typedParty.founded_year} · {level}
                </span>
                {typedParty.website_url && (
                  <a
                    href={typedParty.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption flex items-center gap-0.5 transition-colors duration-100"
                    style={{ color: "var(--accent)" }}
                  >
                    Website <ExternalLink size={10} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <PoliticalCompass slug={slug} color={typedParty.color_hex} />
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {([
            ["not_yet_rated", "Unrated"],
            ["in_the_works", "In Progress"],
            ["stalled", "Stalled"],
            ["compromise", "Compromise"],
            ["promise_kept", "Kept"],
            ["promise_broken", "Broken"],
          ] as [PromiseStatus, string][]).map(([status, label]) => (
            <div
              key={status}
              className="p-3 rounded-[6px] text-center"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <div className="text-[22px] font-[590]" style={{ color: "var(--text-primary)" }}>
                {statusCounts[status] ?? 0}
              </div>
              <div className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Promises list — filterable by constitutional significance */}
        <PromiseList promises={allPromises} />
      </div>
    </>
  )
}
