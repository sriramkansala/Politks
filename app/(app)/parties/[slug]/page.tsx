import { notFound } from "next/navigation"
import { TopNav } from "@/components/shell/TopNav"
import { StatusPill } from "@/components/promises/StatusPill"
import { ExternalLink } from "lucide-react"
import type { PromiseStatus } from "@/lib/db/types"

export const revalidate = 21600

const PARTIES: Record<string, {
  name: string; short_name: string; color_hex: string
  website_url: string; founded_year: number; level: string
}> = {
  bjp: { name: "Bharatiya Janata Party", short_name: "BJP", color_hex: "#FF6B00", website_url: "https://www.bjp.org", founded_year: 1980, level: "National" },
  inc: { name: "Indian National Congress", short_name: "INC", color_hex: "#19AAED", website_url: "https://www.inc.in", founded_year: 1885, level: "National" },
  aap: { name: "Aam Aadmi Party", short_name: "AAP", color_hex: "#2196F3", website_url: "https://www.aamaadmiparty.org", founded_year: 2012, level: "National" },
  dmk: { name: "Dravida Munnetra Kazhagam", short_name: "DMK", color_hex: "#E32636", website_url: "https://www.dmk.in", founded_year: 1949, level: "State (TN)" },
}

// Sample headline promises for visual completeness before ingestion
const SAMPLE_PROMISES: Record<string, Array<{
  id: string; title: string; category: string; status: PromiseStatus; geography: string; page_ref: number | null
}>> = {
  bjp: [
    { id: "bjp-1", title: "3 crore new houses under PM Awas Yojana by 2029", category: "infrastructure", status: "in_the_works", geography: "national", page_ref: 12 },
    { id: "bjp-2", title: "1 crore rooftop solar installations", category: "energy", status: "in_the_works", geography: "national", page_ref: 18 },
    { id: "bjp-3", title: "Uniform Civil Code legislation", category: "governance", status: "stalled", geography: "national", page_ref: 31 },
    { id: "bjp-4", title: "Make India the 3rd largest economy by 2027", category: "economy", status: "in_the_works", geography: "national", page_ref: 5 },
    { id: "bjp-5", title: "2 crore new jobs per year", category: "labor", status: "not_yet_rated", geography: "national", page_ref: 22 },
  ],
  inc: [
    { id: "inc-1", title: "₹1 lakh per year cash transfer to every poor family (Nyay)", category: "social_welfare", status: "not_yet_rated", geography: "national", page_ref: 8 },
    { id: "inc-2", title: "30% of central government jobs reserved for youth under 30", category: "youth", status: "not_yet_rated", geography: "national", page_ref: 14 },
    { id: "inc-3", title: "Legal guarantee for MSP on agricultural produce", category: "agriculture", status: "not_yet_rated", geography: "national", page_ref: 19 },
    { id: "inc-4", title: "50% women in all government jobs", category: "women", status: "not_yet_rated", geography: "national", page_ref: 24 },
  ],
  aap: [
    { id: "aap-1", title: "Free 300 units of electricity per month to all households", category: "energy", status: "promise_kept", geography: "DL", page_ref: 3 },
    { id: "aap-2", title: "Free quality education in government schools", category: "education", status: "promise_kept", geography: "DL", page_ref: 7 },
    { id: "aap-3", title: "Free water up to 20,000 litres per month", category: "water", status: "promise_kept", geography: "DL", page_ref: 5 },
    { id: "aap-4", title: "24-hour clean drinking water supply across Delhi", category: "water", status: "stalled", geography: "DL", page_ref: 9 },
  ],
  dmk: [
    { id: "dmk-1", title: "₹1,000/month to women heads of household", category: "women", status: "promise_kept", geography: "TN", page_ref: 6 },
    { id: "dmk-2", title: "Free breakfast scheme for all government school students", category: "education", status: "promise_kept", geography: "TN", page_ref: 11 },
    { id: "dmk-3", title: "Neet exemption for Tamil Nadu medical admissions", category: "education", status: "compromise", geography: "TN", page_ref: 15 },
  ],
}

export async function generateStaticParams() {
  return Object.keys(PARTIES).map((slug) => ({ slug }))
}

export default async function PartyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const party = PARTIES[slug]
  if (!party) notFound()

  const promises = SAMPLE_PROMISES[slug] ?? []
  const statusCounts = promises.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      <TopNav title={party.short_name} />
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">

        {/* Party header */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[6px] flex items-center justify-center text-white text-[18px] font-[590] shrink-0"
            style={{ background: party.color_hex }}
          >
            {party.short_name[0]}
          </div>
          <div>
            <h1 className="text-heading" style={{ color: "var(--text-primary)" }}>
              {party.name}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-caption" style={{ color: "var(--text-secondary)" }}>
                Est. {party.founded_year} · {party.level}
              </span>
              <a
                href={party.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption flex items-center gap-0.5 transition-colors duration-100"
                style={{ color: "var(--accent)" }}
              >
                Website <ExternalLink size={10} strokeWidth={1.5} />
              </a>
            </div>
          </div>
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
              <div
                className="text-[22px] font-[590]"
                style={{ color: "var(--text-primary)" }}
              >
                {statusCounts[status] ?? 0}
              </div>
              <div className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Promises list */}
        <div>
          <h2 className="text-subheading mb-3" style={{ color: "var(--text-primary)" }}>
            Headline Promises
          </h2>
          <div
            className="rounded-[6px] overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {promises.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                  No promises ingested yet — upload a manifesto in the admin panel.
                </p>
              </div>
            ) : (
              promises.map((promise, i) => (
                <div
                  key={promise.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
                  style={i < promises.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {promise.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] uppercase font-[510] tracking-wide px-1.5 py-0.5 rounded-[2px]"
                        style={{ background: "var(--bg-elevated-2)", color: "var(--text-secondary)" }}
                      >
                        {promise.category.replace(/_/g, " ")}
                      </span>
                      {promise.geography !== "national" && (
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {promise.geography}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusPill status={promise.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
