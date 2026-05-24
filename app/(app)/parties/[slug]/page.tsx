// /parties/[slug] — Multi-tab party profile.
//
// Tabs (URL-driven via ?tab=…, default = "promises" so the existing route
// behaviour is preserved):
//
//   overview     — party header + status counts + political compass
//   history      — milestones since founding (PARTY_HISTORY)
//   organisation — leadership tree with year selector (?org_year=…)
//   donors       — electoral bonds + top declared contributors
//   personnel    — ADR/MyNeta criminal-case aggregates over this party's MPs
//   legal        — cases against the party itself
//   promises     — existing PromiseList (default tab)
//   manifestos   — past manifestos with PDFs
//
// Each tab is a real link, so URLs are shareable and SSR-friendly. The
// Promises tab being the default preserves the existing route behaviour
// from before this expansion.

import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { PoliticalCompass } from "@/components/parties/PoliticalCompass"
import { PartySymbol } from "@/components/parties/PartySymbol"
import { PromiseList } from "@/components/promises/PromiseList"
import { PartyTabNav, type TabSpec } from "@/components/parties/PartyTabNav"
import { PartyHistoryTimeline } from "@/components/parties/PartyHistoryTimeline"
import { PartyOrganisation } from "@/components/parties/PartyOrganisation"
import { PartyDonors } from "@/components/parties/PartyDonors"
import { PartyLegalCases } from "@/components/parties/PartyLegalCases"
import { PartyPersonnelStats } from "@/components/parties/PartyPersonnelStats"
import { PartyManifestoList } from "@/components/parties/PartyManifestoList"
import { createPublicClient } from "@/lib/db/server"
import { fontWeights } from "@/lib/font-weight"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import {
  PARTY_HISTORY,
  PARTY_ORGANISATION,
  PARTY_DONORS,
  PARTY_LEGAL_CASES,
  PARTY_MP_SHORTCODES,
} from "@/lib/db/partyProfile"
import { STATIC_MPS_ALL } from "@/lib/db/staticMps"
import type {
  PromiseStatus,
  Party,
  PromiseRow,
  Manifesto,
} from "@/lib/db/types"

export const revalidate = 21600

export async function generateStaticParams() {
  return ["bjp", "inc", "aap", "dmk"].map((slug) => ({ slug }))
}

const TABS: TabSpec[] = [
  { value: "overview", label: "Overview" },
  { value: "history", label: "History" },
  { value: "organisation", label: "Organisation" },
  { value: "donors", label: "Donors" },
  { value: "personnel", label: "Personnel records" },
  { value: "legal", label: "Legal cases" },
  { value: "promises", label: "Promises", isDefault: true },
  { value: "manifestos", label: "Manifestos" },
]

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string; org_year?: string }>
}

export default async function PartyPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { tab, org_year } = await searchParams
  const supabase = createPublicClient()

  // Fetch party
  const { data: party } = await supabase
    .from("parties")
    .select("*")
    .eq("slug", slug)
    .single()

  const typedParty = party as Party | null
  if (!typedParty) notFound()

  // Resolve active tab — default to Promises to preserve existing behaviour
  const validTab = TABS.find((t) => t.value === tab)
  const active = validTab?.value ?? "promises"

  // Promises (always fetched — overview shows status counts, promises tab
  // shows the full list)
  const { data: promises } = await supabase
    .from("promises")
    .select("id, title, category, status, geography, page_ref, is_headline")
    .eq("party_id", typedParty.id)
    .order("is_headline", { ascending: false })
    .order("ordinal", { ascending: true })
    .limit(40)

  type PromiseSlim = Pick<
    PromiseRow,
    "id" | "title" | "category" | "status" | "geography" | "page_ref" | "is_headline"
  >
  const allPromises = (promises ?? []) as PromiseSlim[]

  // Status breakdown counts
  const statusCounts = allPromises.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Manifestos for this party
  const { data: manifestosRaw } = await supabase
    .from("manifestos")
    .select("*")
    .eq("party_id", typedParty.id)
    .order("election_year", { ascending: false })
  const manifestos = (manifestosRaw ?? []) as Manifesto[]

  // Personnel stats — filter STATIC_MPS_ALL by this party's short-codes.
  const shortCodes = PARTY_MP_SHORTCODES[slug] ?? [
    typedParty.short_name?.toUpperCase() ?? "",
  ]
  const partyMps = STATIC_MPS_ALL.filter((mp) =>
    shortCodes.includes(mp.party_name ?? ""),
  )

  // Profile data (real-data-only seed for BJP/INC, empty arrays elsewhere
  // so empty-state copy renders rather than fabricated data).
  const history = PARTY_HISTORY[slug] ?? []
  const organisation = PARTY_ORGANISATION[slug] ?? []
  const donors = PARTY_DONORS[slug] ?? []
  const legal = PARTY_LEGAL_CASES[slug] ?? []

  const level =
    typedParty.level === "state"
      ? `State${typedParty.state_code ? ` (${typedParty.state_code})` : ""}`
      : "National"

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
      {/* Party header — visible on every tab */}
      <AnimateIn className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[6px] flex items-center justify-center shrink-0"
            style={{ background: `${typedParty.color_hex}18` }}
          >
            <PartySymbol slug={slug} color={typedParty.color_hex as string} size={34} />
          </div>
          <div>
            <h1 className="h-page" style={{ color: "var(--text-primary)" }}>
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
      </AnimateIn>

      {/* Tabs */}
      <PartyTabNav
        tabs={TABS}
        active={active}
        basePath={`/parties/${slug}`}
        preserveParams={
          active === "organisation" && org_year ? { org_year } : {}
        }
      />

      {/* Tab content */}
      {active === "overview" && (
        <AnimateIn delay={0.05} className="space-y-6">
          <AnimateIn stagger className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(
              [
                ["not_yet_rated", "Unrated"],
                ["in_the_works", "In Progress"],
                ["stalled", "Stalled"],
                ["compromise", "Compromise"],
                ["promise_kept", "Kept"],
                ["promise_broken", "Broken"],
              ] as [PromiseStatus, string][]
            ).map(([status, label]) => (
              <AnimateItem key={status}>
              <div
                className="p-3 rounded-[6px] text-center h-full"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="text-[22px]"
                  style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
                >
                  {statusCounts[status] ?? 0}
                </div>
                <div
                  className="text-[10px] mt-0.5 uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {label}
                </div>
              </div>
              </AnimateItem>
            ))}
          </AnimateIn>
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Use the tabs above to view this party's history, organisational
            structure, donor records, personnel-record aggregates, legal cases,
            promise tracker, and past manifestos.
          </p>
        </AnimateIn>
      )}

      {active === "history" && (
        <AnimateIn delay={0.05}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            History
          </h2>
          <PartyHistoryTimeline events={history} partyColor={typedParty.color_hex} />
        </AnimateIn>
      )}

      {active === "organisation" && (
        <AnimateIn delay={0.05}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            Organisation
          </h2>
          <PartyOrganisation
            snapshots={organisation}
            selectedYear={org_year}
            preserveTab="organisation"
            partyColor={typedParty.color_hex}
          />
        </AnimateIn>
      )}

      {active === "donors" && (
        <AnimateIn delay={0.05}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            Donors
          </h2>
          <PartyDonors donors={donors} partyColor={typedParty.color_hex} />
        </AnimateIn>
      )}

      {active === "personnel" && (
        <AnimateIn delay={0.05}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            Personnel records
          </h2>
          <PartyPersonnelStats mps={partyMps} partyColor={typedParty.color_hex} />
        </AnimateIn>
      )}

      {active === "legal" && (
        <AnimateIn delay={0.05}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            Legal cases against the party
          </h2>
          <PartyLegalCases cases={legal} />
        </AnimateIn>
      )}

      {active === "promises" && <AnimateIn delay={0.05}><PromiseList promises={allPromises} /></AnimateIn>}

      {active === "manifestos" && (
        <AnimateIn delay={0.05}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            Manifestos
          </h2>
          <PartyManifestoList
            manifestos={manifestos}
            partyColor={typedParty.color_hex}
          />
        </AnimateIn>
      )}

      {/* Source caveat — visible on all non-Promises tabs */}
      {active !== "promises" && (
        <AnimateIn delay={0.15}>
        <section
          className="rounded-[6px] p-4 text-[12px] leading-relaxed"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-tertiary)",
          }}
        >
          <strong style={{ color: "var(--text-secondary)" }}>Sources.</strong>{" "}
          Personnel and asset stats are sourced from{" "}
          <a
            href="https://adrindia.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            ADR
          </a>{" "}
          /{" "}
          <a
            href="https://myneta.info/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            MyNeta
          </a>{" "}
          affidavit aggregations. Donor figures and electoral-bond totals come
          from ADR's annual contribution-report analyses and{" "}
          <a
            href="https://eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            ECI
          </a>{" "}
          filings. History and organisation snapshots draw on official party
          releases and{" "}
          <a
            href="https://prsindia.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            PRS Legislative Research
          </a>
          . Legal-case rows link to court records via Indian Kanoon or the
          Supreme Court e-judgements portal. Entries marked "Source pending"
          are awaiting verification — we don't fabricate URLs.
        </section>
        </AnimateIn>
      )}
    </div>
  )
}
