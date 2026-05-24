import { StatusPill } from "@/components/promises/StatusPill"
import { tokens } from "@/lib/tokens"
import { partyColor } from "@/lib/partyColors"
import type { PromiseStatus } from "@/lib/db/types"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"

export const revalidate = 21600

// Party color comes from `partyColor()` at render time — UI_RULES.md §2:
// no hex codes in content/data; party identity is a single tokenised helper.
const TOPICS = [
  {
    id: "electricity",
    label: "Free / Subsidised Electricity",
    promises: [
      { party: "AAP", slug: "aap", title: "Free 300 units/month to all Delhi households", status: "promise_kept" as PromiseStatus, numeric: "300 units free" },
      { party: "BJP", slug: "bjp", title: "1 crore rooftop solar installations nationally", status: "in_the_works" as PromiseStatus, numeric: "1 Cr installations" },
      { party: "INC", slug: "inc", title: "Subsidised power for Below Poverty Line families", status: "not_yet_rated" as PromiseStatus, numeric: "BPL only" },
      { party: "DMK", slug: "dmk", title: "Free electricity up to 100 units for domestic consumers", status: "promise_kept" as PromiseStatus, numeric: "100 units free" },
    ],
  },
  {
    id: "education",
    label: "School Education",
    promises: [
      { party: "AAP", slug: "aap", title: "Free quality education in all Delhi government schools", status: "promise_kept" as PromiseStatus, numeric: "All govt schools" },
      { party: "DMK", slug: "dmk", title: "Free breakfast scheme for all government school students", status: "promise_kept" as PromiseStatus, numeric: "All TN govt schools" },
      { party: "BJP", slug: "bjp", title: "NEP implementation in all states", status: "in_the_works" as PromiseStatus, numeric: "National" },
      { party: "INC", slug: "inc", title: "30% budget allocation to education", status: "not_yet_rated" as PromiseStatus, numeric: "30% of budget" },
    ],
  },
  {
    id: "women_welfare",
    label: "Women's Economic Support",
    promises: [
      { party: "DMK", slug: "dmk", title: "₹1,000/month to women heads of household", status: "promise_kept" as PromiseStatus, numeric: "₹1,000/mo" },
      { party: "INC", slug: "inc", title: "50% women in all government jobs", status: "not_yet_rated" as PromiseStatus, numeric: "50% reservation" },
      { party: "BJP", slug: "bjp", title: "3 crore Lakhpati Didis (women earning ₹1L/yr)", status: "in_the_works" as PromiseStatus, numeric: "3 Cr women" },
      { party: "AAP", slug: "aap", title: "Free bus travel for women in Delhi", status: "promise_kept" as PromiseStatus, numeric: "All DTC routes" },
    ],
  },
  {
    id: "housing",
    label: "Affordable Housing",
    promises: [
      { party: "BJP", slug: "bjp", title: "3 crore new houses under PM Awas Yojana by 2029", status: "in_the_works" as PromiseStatus, numeric: "3 Cr houses" },
      { party: "INC", slug: "inc", title: "Urban housing for all below-poverty households by 2030", status: "not_yet_rated" as PromiseStatus, numeric: "All BPL urban" },
      { party: "AAP", slug: "aap", title: "1 lakh flats for Delhi slum dwellers", status: "stalled" as PromiseStatus, numeric: "1 lakh flats" },
    ],
  },
]

export default function ComparePage() {
  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
        <AnimateIn>
          <h1 className="h-page mb-2" style={{ color: tokens.color.textPrimary }}>
            Cross-Party Comparison
          </h1>
          <p className="text-body" style={{ color: tokens.color.textSecondary }}>
            How did different parties promise on the same topics? Track delivery side by side.
          </p>
        </AnimateIn>

        {TOPICS.map((topic, ti) => (
          <AnimateIn key={topic.id} delay={0.05 + ti * 0.04}>
            <h2 className="h-section mb-3" style={{ color: tokens.color.textPrimary }}>
              {topic.label}
            </h2>
            <AnimateIn stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {topic.promises.map((p) => {
                const accent = partyColor(p.slug)
                return (
                <AnimateItem key={`${topic.id}-${p.slug}`}>
                <div
                  className="p-4 rounded-[var(--radius-card)] flex flex-col gap-3 h-full"
                  style={{
                    background: tokens.color.bgElevated,
                    border: `1px solid ${tokens.color.border}`,
                    borderTop: `1px solid ${accent}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {/* 7px party dot replaces the colored PartySymbol */}
                      <span
                        className="inline-block rounded-full"
                        style={{ width: 7, height: 7, background: accent }}
                      />
                      <span
                        className="text-[11px] uppercase tracking-[0.06em]"
                        style={{
                          color: tokens.color.textSecondary,
                          fontVariationSettings: "'wght' 550",
                        }}
                      >
                        {p.party}
                      </span>
                    </div>
                    {p.numeric && (
                      <span
                        className="text-[11px] font-mono"
                        style={{ color: tokens.color.textTertiary }}
                      >
                        {p.numeric}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] leading-snug flex-1" style={{ color: tokens.color.textPrimary }}>
                    {p.title}
                  </p>
                  <StatusPill status={p.status} />
                </div>
                </AnimateItem>
                )
              })}
            </AnimateIn>
          </AnimateIn>
        ))}

        {/* Caveat block — UI_RULES.md §6 */}
        <AnimateIn className="caveat-block">
          <strong>How this works.</strong>{" "}
          Topics surface promises across parties that target the same policy
          area (electricity, education, housing, women&apos;s welfare). Status
          ratings come from{" "}
          <a href="https://prsindia.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            PRS Legislative Research
          </a>{" "}
          tracking and editorial review. State-specific promises (AAP/Delhi,
          DMK/Tamil Nadu) are rated against state-government delivery; national
          promises (BJP/INC) against the Union government. Comparisons are not
          like-for-like across geographies — read each card with its scope in
          mind.
        </AnimateIn>
      </div>
    </>
  )
}
