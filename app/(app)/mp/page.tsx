// /mp — Legislator Hub landing (BMW-130 entry point).
// User flow: enter PIN / constituency / MP name → land on /mp/[slug].

import Link from "next/link"
import { findMpByPin, findMpByQuery, STATIC_MPS_ALL } from "@/lib/db/staticMps"
import { MpSearchForm } from "@/components/mp/MpSearchForm"
import { MpRow } from "@/components/mp/LegislatorRow"
import { fontWeights } from "@/lib/font-weight"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"

export const metadata = { title: "Know your politician · Bharat Manifesto Watch" }

interface PageProps {
  searchParams: Promise<{ pin?: string; q?: string }>
}

export default async function MpHubPage({ searchParams }: PageProps) {
  const { pin, q } = await searchParams

  let resolved: ReturnType<typeof findMpByQuery> = []
  let pinMatched: ReturnType<typeof findMpByPin> = null
  let notice: string | null = null

  if (pin) {
    pinMatched = findMpByPin(pin)
    if (pinMatched) {
      resolved = [pinMatched]
    } else {
      notice = `No MP currently mapped to PIN ${pin}. PIN→constituency rolls for the full 543-MP dataset are still being wired in — try searching by name or constituency instead.`
    }
  } else if (q) {
    resolved = findMpByQuery(q)
    if (resolved.length === 0) notice = `No MP found for "${q}".`
  }

  // Pick 8 high-profile MPs to feature on landing — those named in BMW-130.
  const featuredSlugs = [
    "manish-tewari", "praveen-patel", "rahul-gandhi", "nakul-nath",
    "abhishek-banerjee", "arvind-sawant", "priyanka-gandhi-vadra", "anant-kumar-singh",
  ]
  const featured = featuredSlugs
    .map((s) => STATIC_MPS_ALL.find((mp) => mp.prs_slug === s))
    .filter(Boolean) as typeof STATIC_MPS_ALL

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">
      <AnimateIn>
        <h1 className="h-page mb-2" style={{ color: "var(--text-primary)" }}>
          Know your politician
        </h1>
        <p className="text-[15px] max-w-xl" style={{ color: "var(--text-secondary)" }}>
          Enter your PIN code, constituency, or MP name. See attendance, questions
          asked, criminal cases, declared assets and MPLADS spending — in one card.
        </p>
      </AnimateIn>

      {/* Search form */}
      <AnimateIn delay={0.05}>
        <MpSearchForm defaultPin={pin ?? ""} defaultQ={q ?? ""} />

        {notice && (
          <p
            className="mt-3 text-[12px] max-w-2xl"
            style={{ color: "var(--text-tertiary)" }}
          >
            {notice}
          </p>
        )}
      </AnimateIn>

      {/* Results */}
      {resolved.length > 0 && (
        <AnimateIn delay={0.1}>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
            {resolved.length === 1 ? "Match" : `${resolved.length} matches`}
          </h2>
          <AnimateIn stagger className="grid gap-2">
            {resolved.map((mp) => (
              <AnimateItem key={mp.id}><Link
                href={`/mp/${mp.prs_slug}`}
                className="flex items-center justify-between p-4 rounded-[var(--radius-card)] transition-colors hover:border-[var(--border-strong)]"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                <div>
                  <div
                    className="text-[14px]"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
                  >
                    {mp.name}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {mp.party_name} · {mp.constituency ?? "Rajya Sabha"}
                    {mp.state_code ? ` · ${mp.state_code}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                  {mp.attendance_pct != null ? (
                    <span>{mp.attendance_pct.toFixed(0)}% att.</span>
                  ) : (
                    <span>—</span>
                  )}
                  <span>→</span>
                </div>
              </Link></AnimateItem>
            ))}
          </AnimateIn>
        </AnimateIn>
      )}

      {/* Featured */}
      <AnimateIn delay={0.15}>
        <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>
          Featured MPs
        </h2>
        <p className="text-caption mb-4" style={{ color: "var(--text-tertiary)" }}>
          A handful of widely-covered 18th Lok Sabha members. Browse the full
          18th LS roster of {STATIC_MPS_ALL.length} MPs at{" "}
          <Link href="/legislators" style={{ color: "var(--accent)" }}>/legislators</Link>.
        </p>
        <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {featured.map((mp) => (
            <AnimateItem key={mp.id}><MpRow mp={mp} /></AnimateItem>
          ))}
        </AnimateIn>
      </AnimateIn>

      {/* Footer caveat */}
      <AnimateIn delay={0.2} className="caveat-block">
        <strong>How this works.</strong>{" "}
        Attendance, questions, debates and PMB counts come from{" "}
        <a href="https://prsindia.org/mptrack" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          PRS Legislative Research
        </a>
        . Assets and criminal cases are self-declared affidavits filed with the{" "}
        <a href="https://affidavit.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          Election Commission
        </a>
        . Ministers and the Speaker are exempt from signing the attendance
        register — flagged on individual cards.
      </AnimateIn>
    </div>
  )
}
