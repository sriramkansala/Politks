import Link from "next/link"
import { ArrowRight, GitBranch, MapPin } from "lucide-react"
import { createPublicClient } from "@/lib/db/server"
import type { PromiseRow } from "@/lib/db/types"
import { DykCard } from "@/components/insights/DykCard"
import { pickDailyFact } from "@/lib/insights/facts"
import { fontWeights } from "@/lib/font-weight"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { MotionSection } from "@/components/ui/motion-section"

export const revalidate = 21600

// Promise Status Taxonomy legend section removed from the home page — the
// taxonomy is self-evident from the status pills used everywhere else.

export default async function HomePage() {
  const supabase = createPublicClient()

  const [{ count: totalPromises }, { data: statusRows }, { count: partyCount }] =
    await Promise.all([
      supabase.from("promises").select("*", { count: "exact", head: true }),
      supabase.from("promises").select("status"),
      supabase.from("parties").select("*", { count: "exact", head: true }),
    ])

  const allStatuses = (statusRows ?? []) as Pick<PromiseRow, "status">[]
  const kept = allStatuses.filter((r) => r.status === "promise_kept").length
  const broken = allStatuses.filter((r) => r.status === "promise_broken").length
  const rated = allStatuses.filter(
    (r) => r.status === "promise_kept" || r.status === "promise_broken" || r.status === "compromise" || r.status === "stalled" || r.status === "in_the_works",
  ).length
  const total = totalPromises ?? 0
  // Percentage is of *rated* promises, not all promises. Most are not_yet_rated
  // because we only count promises with a verifiable source — so dividing by
  // total understates the kept rate to ~1% noise.
  const keptPct = rated > 0 ? Math.round((kept / rated) * 100) : 0
  const brokenPct = rated > 0 ? Math.round((broken / rated) * 100) : 0

  const dailyFact = pickDailyFact()

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">

      {/* Hero — title + body + a single primary CTA that takes the user
       *   to the legislator-search page (replaces the embedded PIN form
       *   that previously took up an entire section). */}
      <MotionSection className="flex flex-col gap-4">
        <h1 className="h-hero" style={{ color: "var(--text-primary)" }}>
          Bharat Manifesto Watch
        </h1>
        <p className="text-[15px] max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Tracking political promises across India. See what was promised — see what was delivered.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Link href="/mp" className="btn-primary-inverse">
            <MapPin size={13} strokeWidth={1.5} />
            Find my politician
          </Link>
          <Link
            href="/legislators"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-pill)] text-[13px]"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontVariationSettings: "'wght' 510",
            }}
          >
            Browse all legislators
          </Link>
        </div>
      </MotionSection>

      {/* Did You Know — daily card */}
      <MotionSection delay={0.05}>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
            Did you know?
          </h2>
          <Link href="/insights" className="pillar-link">
            All insights <ArrowRight size={12} />
          </Link>
        </div>
        <DykCard fact={dailyFact} />
      </MotionSection>


      {/* Stat cards */}
      <MotionSection delay={0.1}>
        <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>
          At a glance
        </h2>
        <AnimateIn stagger className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Parties tracked", value: String(partyCount ?? 0), pct: null },
            { label: "Promises indexed", value: String(total), pct: null },
            { label: `Kept (of ${rated} rated)`, value: String(kept), pct: keptPct, tone: "tone-good" as const },
            { label: `Broken (of ${rated} rated)`, value: String(broken), pct: brokenPct, tone: "tone-bad" as const },
          ].map(({ label, value, pct, tone }) => (
            // Apply the status tone only when the stat is non-zero (Linear-style
            // restraint: 0% is just text, not a red-or-green status).
            <AnimateItem key={label} className={`stat-card ${pct != null && pct > 0 ? tone ?? "" : ""}`}>
              <div className="value" style={{ fontSize: "28px", letterSpacing: "-0.022em" }}>
                {value}
              </div>
              <div className="label">{label}</div>
            </AnimateItem>
          ))}
        </AnimateIn>
      </MotionSection>


      {/* Featured Investigation */}
      <MotionSection delay={0.15}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
            Featured Investigation
          </h2>
          <Link href="/bills" className="pillar-link">
            All bills <ArrowRight size={12} />
          </Link>
        </div>

        <Link href="/bills/wrb-2023" style={{ textDecoration: "none" }} className="block">
          <div
            className="rounded-[var(--radius-card)] p-5 transition-colors duration-100 hover:border-[var(--border-strong)] group"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              // Linear discipline: drop the secondary accent border. The Find My MP CTA
              // above is the page's single accent; the rest stays monochrome.
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
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
                  className="text-[15px] mb-1 group-hover:text-[var(--accent)] transition-colors"
                  style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium, letterSpacing: "var(--tracking-body)" }}
                >
                  The 27-Year Women&apos;s Reservation Bill
                </h3>
                <p className="text-[13px] leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                  How a constitutional amendment promised in 1996 was blocked, lapsed, torn, passed with a poison
                  pill, and still hasn&apos;t taken effect in 2024. A full causal graph across 5 bills, 6 MPs, and
                  4 Lok Sabhas.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["5 bills", "6 MPs", "27 years", "Article 334A signal"].map((tag) => (
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
              <ArrowRight
                size={16}
                className="shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                style={{ color: "var(--text-disabled)" }}
              />
            </div>
          </div>
        </Link>
      </MotionSection>
    </div>
  )
}
