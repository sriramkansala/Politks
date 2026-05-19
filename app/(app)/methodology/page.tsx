import { TopNav } from "@/components/shell/TopNav"
import { StatusPill } from "@/components/promises/StatusPill"
import type { PromiseStatus } from "@/lib/db/types"

export const revalidate = 86400

const STATUSES: Array<{ status: PromiseStatus; definition: string; example: string }> = [
  {
    status: "not_yet_rated",
    definition: "Every promise begins at this level. We have not yet gathered enough evidence to assess whether this promise is being fulfilled.",
    example: "A newly elected government announces a housing scheme but has not yet allocated budget or begun construction.",
  },
  {
    status: "in_the_works",
    definition: "The promise has been proposed, is being actively considered, or is clearly underway — but not yet fulfilled.",
    example: "A bill has been introduced in Parliament, or tenders have been floated for a construction project.",
  },
  {
    status: "stalled",
    definition: "The promise is not being actively worked on. We see no meaningful movement toward fulfillment.",
    example: "Legislation was proposed but shelved after a session, or a project was announced but no funds disbursed.",
  },
  {
    status: "compromise",
    definition: "The promise was partially fulfilled — substantially less than stated, but a significant accomplishment consistent with the spirit of the goal.",
    example: "A party promised full MSP for all crops, but only implemented it for wheat and paddy.",
  },
  {
    status: "promise_kept",
    definition: "The original promise is mostly or completely fulfilled, based on verifiable evidence from official data, RTI responses, or credible news sources.",
    example: "Delhi's free electricity scheme is operational, confirmed by DERC tariff orders showing zero charges for ≤200 units.",
  },
  {
    status: "promise_broken",
    definition: "The promise has not been fulfilled and there is no reasonable prospect that it will be — or the government explicitly abandoned or reversed it.",
    example: "A party promised a law within 100 days but the term ended with no legislation introduced.",
  },
]

export default function MethodologyPage() {
  return (
    <>
      <TopNav title="Methodology" />
      <div className="px-6 py-8 max-w-[860px] mx-auto space-y-8">
        <div>
          <h1 className="text-heading mb-2" style={{ color: "var(--text-primary)" }}>
            Tracking Methodology
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            Our methodology is adapted from PolitiFact's Promise Tracker — the most battle-tested
            political promise-tracking system in the world. We apply it to Indian elections with
            adaptations for federal complexity and multilingual sources.
          </p>
        </div>

        <section
          className="rounded-[6px] p-5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)" }}
        >
          <p className="text-subheading mb-2" style={{ color: "var(--text-primary)" }}>Core rule</p>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            We rate promises on{" "}
            <strong style={{ color: "var(--text-primary)" }}>verifiable outcomes, not intentions or effort</strong>.
            A government that tried hard but achieved nothing still receives the appropriate status.
            Every status change must be backed by at least one cited source.
          </p>
        </section>

        <section>
          <h2 className="text-subheading mb-4" style={{ color: "var(--text-primary)" }}>The Six Statuses</h2>
          <div className="space-y-3">
            {STATUSES.map(({ status, definition, example }) => (
              <div
                key={status}
                className="rounded-[6px] p-4"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <StatusPill status={status} />
                <p className="text-body mt-2 mb-1" style={{ color: "var(--text-primary)" }}>{definition}</p>
                <p className="text-caption italic" style={{ color: "var(--text-secondary)" }}>
                  Example: {example}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-[6px] p-5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-subheading mb-3" style={{ color: "var(--text-primary)" }}>Data Sources</h2>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            Evidence drawn from: data.gov.in, NITI Aayog NDAP & DMEO dashboards, RBI DBIE,
            Press Information Bureau, PMAY-G, Jal Jeevan Mission, PRS Legislative Research (CC-BY-4.0),
            Alt News, Factly.in, Boom Live, The Hindu, Indian Express.
          </p>
        </section>
      </div>
    </>
  )
}
