import Link from "next/link"
import { ArrowRight, GitBranch, MapPin } from "lucide-react"
import { createPublicClient } from "@/lib/db/server"
import type { Party, PromiseRow } from "@/lib/db/types"
import { DykCard } from "@/components/insights/DykCard"
import { pickDailyFact } from "@/lib/insights/facts"
import { fontWeights } from "@/lib/font-weight"
import { TrackerTabs } from "@/components/tracker/TrackerTabs"
import type { PartyStats, PromiseSummary } from "@/components/tracker/TrackerTabs"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"

export const revalidate = 21600

export default async function HomePage() {
  const supabase = createPublicClient()

  const [
    { data: parties },
    { data: promiseRows },
    { count: totalPromises },
    { count: partyCount },
  ] = await Promise.all([
    supabase.from("parties").select("id, name, short_name, slug, color_hex").order("name", { ascending: true }),
    supabase.from("promises").select("id, title, category, status, party_id, is_headline"),
    supabase.from("promises").select("*", { count: "exact", head: true }),
    supabase.from("parties").select("*", { count: "exact", head: true }),
  ])

  type PromiseSelect = Pick<PromiseRow, "id" | "title" | "category" | "status" | "party_id" | "is_headline">
  const allRows = (promiseRows ?? []) as PromiseSelect[]

  const typedParties = (parties ?? []) as Pick<Party, "id" | "name" | "short_name" | "slug" | "color_hex">[]

  const stats: PartyStats[] = typedParties.map((p) => {
    const rows = allRows.filter((r) => r.party_id === p.id)
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

  const promises: PromiseSummary[] = allRows.map((r) => ({
    id: r.id as string,
    title: r.title as string,
    category: (r.category ?? "") as string,
    status: r.status,
    party_id: (r.party_id ?? null) as string | null,
    is_headline: (r.is_headline ?? false) as boolean,
  }))

  // Summary stats for the "At a glance" strip
  const kept    = allRows.filter((r) => r.status === "promise_kept").length
  const broken  = allRows.filter((r) => r.status === "promise_broken").length
  const rated   = allRows.filter((r) => ["promise_kept","promise_broken","compromise","stalled","in_the_works"].includes(r.status)).length
  const total   = totalPromises ?? 0
  const keptPct   = rated > 0 ? Math.round((kept   / rated) * 100) : 0
  const brokenPct = rated > 0 ? Math.round((broken / rated) * 100) : 0

  const dailyFact = pickDailyFact()

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">

      {/* Hero — animates in on first paint (FF motion as information). */}
      <AnimateIn>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="h-page" style={{ color: "var(--text-primary)" }}>
              Overview
            </h1>
            <div className="flex flex-wrap gap-2">
              <Link href="/mp" className="btn-primary-inverse">
                <MapPin size={13} strokeWidth={1.5} />
                Find my politician
              </Link>
              <Link href="/mp?tab=legislators" className="btn-secondary">
                Browse all legislators
              </Link>
            </div>
          </div>
          <p className="text-[15px] max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Tracking political promises across India. See what was promised — see what was delivered.
          </p>
        </section>
      </AnimateIn>

      {/* 2-column body: 2/3 main · 1/3 insights sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

        {/* ── Main column (2/3) ───────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10 min-w-0">

          {/* At a glance — section heading + stat cards both reveal together,
              with the cards staggering individually inside the section. */}
          <AnimateIn stagger>
            <section>
              <AnimateItem>
                <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>
                  At a glance
                </h2>
              </AnimateItem>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Parties tracked",          value: String(partyCount ?? 0), pct: null },
                  { label: "Promises indexed",          value: String(total),           pct: null },
                  { label: `Kept (of ${rated} rated)`,  value: String(kept),   pct: keptPct,   tone: "tone-good" as const },
                  { label: `Broken (of ${rated} rated)`,value: String(broken), pct: brokenPct, tone: "tone-bad"  as const },
                ].map(({ label, value, pct, tone }) => (
                  <AnimateItem key={label}>
                    <div
                      className={`stat-card ${pct != null && pct > 0 ? tone ?? "" : ""}`}
                      data-explain
                      data-explain-label={label}
                      data-explain-value={value}
                      data-explain-context="Neo Nīti home dashboard — At a glance summary across all tracked parties and promises in India."
                    >
                      <div className="value">{value}</div>
                      <div className="label">{label}</div>
                    </div>
                  </AnimateItem>
                ))}
              </div>
            </section>
          </AnimateIn>

          {/* Promise Tracker — section heading + content animate together. */}
          <AnimateIn>
            <section>
              <h2 className="h-section mb-6" style={{ color: "var(--text-primary)" }}>
                Promise Tracker
              </h2>
              <TrackerTabs stats={stats} promises={promises} />
            </section>
          </AnimateIn>
        </div>

        {/* ── Sidebar (1/3): Insights · Featured Investigation · Caveat ─── */}
        <aside className="lg:col-span-1 min-w-0 space-y-8">

          {/* Did you know? */}
          <AnimateIn delay={0.08}>
            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
                  Did you know?
                </h2>
                <Link href="/insights" className="pillar-link">
                  All insights <ArrowRight size={12} />
                </Link>
              </div>
              <DykCard fact={dailyFact} />
            </section>
          </AnimateIn>

          {/* Featured Investigation — compact sidebar variant */}
          <AnimateIn delay={0.16}>
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
                Featured Investigation
              </h2>
              <Link href="/bills" className="pillar-link">
                All bills <ArrowRight size={12} />
              </Link>
            </div>

            <Link href="/bills/wrb-2023" style={{ textDecoration: "none" }} className="block">
              <div
                className="rounded-[var(--radius-card)] p-4 transition-colors duration-100 hover:border-[var(--border-strong)] group"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch size={12} style={{ color: "var(--accent)" }} />
                  <span
                    className="text-[10px] uppercase tracking-[0.07em]"
                    style={{ color: "var(--accent)", fontVariationSettings: fontWeights.medium }}
                  >
                    Forensic Investigation
                  </span>
                </div>
                <h3
                  className="text-[14px] leading-snug mb-1.5 group-hover:text-[var(--accent)] transition-colors"
                  style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium, letterSpacing: "var(--tracking-body)" }}
                >
                  The 27-Year Women&apos;s Reservation Bill
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  How a constitutional amendment promised in 1996 was blocked, lapsed, torn, passed with a poison
                  pill, and still hasn&apos;t taken effect in 2024.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["5 bills", "6 MPs", "27 years"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-[var(--radius-tag)]"
                      style={{
                        background: "var(--bg-elevated-2)",
                        color: "var(--text-tertiary)",
                        border: "1px solid var(--border)",
                        fontVariationSettings: fontWeights.medium,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </section>
          </AnimateIn>

          {/* Caveat — moved into sidebar */}
          <section className="caveat-block">
            <strong>How this works.</strong>{" "}
            Each party&apos;s &ldquo;kept&rdquo; percentage is the share of its tracked manifesto promises rated{" "}
            <em>promise_kept</em> against cited sources (PRS, official notifications, court orders).
            Not all manifesto items are tracked — headline pledges are prioritised.
            &ldquo;Not yet rated&rdquo; is the default until post-election evidence is published.
          </section>
        </aside>

      </div>
    </div>
  )
}
