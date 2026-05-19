import { TopNav } from "@/components/shell/TopNav"
import { statusMeta, type PromiseStatus } from "@/lib/tokens"

const statuses: PromiseStatus[] = [
  "not_yet_rated",
  "in_the_works",
  "stalled",
  "compromise",
  "promise_kept",
  "promise_broken",
]

function StatusPill({ status }: { status: PromiseStatus }) {
  const meta = statusMeta[status]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[11px] font-[510] uppercase tracking-[0.04em]"
      style={{
        color: meta.color,
        background: meta.bg,
        borderRadius: "2px",
      }}
    >
      {meta.label}
    </span>
  )
}

export default function HomePage() {
  return (
    <>
      <TopNav title="Overview" />
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">

        {/* Hero */}
        <section>
          <h1
            className="text-heading-xl mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Bharat Manifesto Watch
          </h1>
          <p className="text-[15px] max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Tracking political promises across India. See what was promised — see what was delivered.
          </p>
        </section>

        {/* Status taxonomy */}
        <section>
          <h2 className="text-subheading mb-4" style={{ color: "var(--text-primary)" }}>
            Promise Status Taxonomy
          </h2>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <StatusPill key={s} status={s} />
            ))}
          </div>
        </section>

        {/* Stat cards */}
        <section>
          <h2 className="text-subheading mb-4" style={{ color: "var(--text-primary)" }}>
            At a glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Parties tracked", value: "4" },
              { label: "Promises indexed", value: "0" },
              { label: "Promise Kept", value: "0%" },
              { label: "Promise Broken", value: "0%" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-[6px]"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="text-[28px] font-[590] mb-1"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.022em" }}
                >
                  {value}
                </div>
                <div className="text-caption" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming soon placeholder */}
        <section
          className="rounded-[6px] px-6 py-10 text-center"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
            Manifesto ingestion pipeline in progress — promises loading soon.
          </p>
        </section>
      </div>
    </>
  )
}
