import { TopNav } from "@/components/shell/TopNav"
import { StatusPill } from "@/components/promises/StatusPill"
import type { PromiseStatus } from "@/lib/db/types"

export const revalidate = 21600

const TOPICS = [
  {
    id: "electricity",
    label: "Free / Subsidised Electricity",
    promises: [
      { party: "AAP", slug: "aap", color: "#2196F3", title: "Free 300 units/month to all Delhi households", status: "promise_kept" as PromiseStatus, numeric: "300 units free" },
      { party: "BJP", slug: "bjp", color: "#FF6B00", title: "1 crore rooftop solar installations nationally", status: "in_the_works" as PromiseStatus, numeric: "1 Cr installations" },
      { party: "INC", slug: "inc", color: "#19AAED", title: "Subsidised power for Below Poverty Line families", status: "not_yet_rated" as PromiseStatus, numeric: "BPL only" },
      { party: "DMK", slug: "dmk", color: "#E32636", title: "Free electricity up to 100 units for domestic consumers", status: "promise_kept" as PromiseStatus, numeric: "100 units free" },
    ],
  },
  {
    id: "education",
    label: "School Education",
    promises: [
      { party: "AAP", slug: "aap", color: "#2196F3", title: "Free quality education in all Delhi government schools", status: "promise_kept" as PromiseStatus, numeric: "All govt schools" },
      { party: "DMK", slug: "dmk", color: "#E32636", title: "Free breakfast scheme for all government school students", status: "promise_kept" as PromiseStatus, numeric: "All TN govt schools" },
      { party: "BJP", slug: "bjp", color: "#FF6B00", title: "NEP implementation in all states", status: "in_the_works" as PromiseStatus, numeric: "National" },
      { party: "INC", slug: "inc", color: "#19AAED", title: "30% budget allocation to education", status: "not_yet_rated" as PromiseStatus, numeric: "30% of budget" },
    ],
  },
  {
    id: "women_welfare",
    label: "Women's Economic Support",
    promises: [
      { party: "DMK", slug: "dmk", color: "#E32636", title: "₹1,000/month to women heads of household", status: "promise_kept" as PromiseStatus, numeric: "₹1,000/mo" },
      { party: "INC", slug: "inc", color: "#19AAED", title: "50% women in all government jobs", status: "not_yet_rated" as PromiseStatus, numeric: "50% reservation" },
      { party: "BJP", slug: "bjp", color: "#FF6B00", title: "3 crore Lakhpati Didis (women earning ₹1L/yr)", status: "in_the_works" as PromiseStatus, numeric: "3 Cr women" },
      { party: "AAP", slug: "aap", color: "#2196F3", title: "Free bus travel for women in Delhi", status: "promise_kept" as PromiseStatus, numeric: "All DTC routes" },
    ],
  },
  {
    id: "housing",
    label: "Affordable Housing",
    promises: [
      { party: "BJP", slug: "bjp", color: "#FF6B00", title: "3 crore new houses under PM Awas Yojana by 2029", status: "in_the_works" as PromiseStatus, numeric: "3 Cr houses" },
      { party: "INC", slug: "inc", color: "#19AAED", title: "Urban housing for all below-poverty households by 2030", status: "not_yet_rated" as PromiseStatus, numeric: "All BPL urban" },
      { party: "AAP", slug: "aap", color: "#2196F3", title: "1 lakh flats for Delhi slum dwellers", status: "stalled" as PromiseStatus, numeric: "1 lakh flats" },
    ],
  },
]

export default function ComparePage() {
  return (
    <>
      <TopNav title="Compare" />
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8">
        <div>
          <h1 className="text-heading mb-1" style={{ color: "var(--text-primary)" }}>
            Cross-Party Comparison
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            How did different parties promise on the same topics? Track delivery side by side.
          </p>
        </div>

        {TOPICS.map((topic) => (
          <section key={topic.id}>
            <h2 className="text-subheading mb-3" style={{ color: "var(--text-primary)" }}>
              {topic.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {topic.promises.map((p) => (
                <div
                  key={`${topic.id}-${p.slug}`}
                  className="p-4 rounded-[6px] flex flex-col gap-3"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderTop: `3px solid ${p.color}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-[590] uppercase tracking-wide px-2 py-0.5 rounded-[2px]"
                      style={{ background: `${p.color}22`, color: p.color }}
                    >
                      {p.party}
                    </span>
                    {p.numeric && (
                      <span className="text-[11px] font-mono font-[510]" style={{ color: "var(--text-secondary)" }}>
                        {p.numeric}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] leading-snug flex-1" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </p>
                  <StatusPill status={p.status} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
