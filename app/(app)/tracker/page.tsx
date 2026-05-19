import { TopNav } from "@/components/shell/TopNav"
import { StatusPill } from "@/components/promises/StatusPill"
import type { PromiseStatus } from "@/lib/db/types"

export const revalidate = 21600

const PARTY_STATS = [
  {
    slug: "bjp", name: "BJP", color: "#FF6B00",
    total: 5, kept: 0, broken: 0, inworks: 3, stalled: 1, compromise: 0, unrated: 1,
  },
  {
    slug: "inc", name: "INC", color: "#19AAED",
    total: 4, kept: 0, broken: 0, inworks: 0, stalled: 0, compromise: 0, unrated: 4,
  },
  {
    slug: "aap", name: "AAP", color: "#2196F3",
    total: 4, kept: 3, broken: 0, inworks: 0, stalled: 1, compromise: 0, unrated: 0,
  },
  {
    slug: "dmk", name: "DMK", color: "#E32636",
    total: 3, kept: 2, broken: 0, inworks: 0, stalled: 0, compromise: 1, unrated: 0,
  },
]

function Bar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated-2)" }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

const STATUS_COLS: Array<{ key: string; label: string; status: PromiseStatus }> = [
  { key: "kept",       label: "Kept",       status: "promise_kept" },
  { key: "compromise", label: "Compromise", status: "compromise" },
  { key: "inworks",    label: "In Progress",status: "in_the_works" },
  { key: "stalled",    label: "Stalled",    status: "stalled" },
  { key: "broken",     label: "Broken",     status: "promise_broken" },
  { key: "unrated",    label: "Unrated",    status: "not_yet_rated" },
]

export default function TrackerPage() {
  return (
    <>
      <TopNav title="Tracker" />
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6">
        <div>
          <h1 className="text-heading mb-1" style={{ color: "var(--text-primary)" }}>
            Promise Tracker
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            Aggregate fulfillment scores across all tracked parties.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PARTY_STATS.map((p) => {
            const keptPct = p.total > 0 ? Math.round((p.kept / p.total) * 100) : 0
            return (
              <div
                key={p.slug}
                className="p-4 rounded-[6px]"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderTop: `3px solid ${p.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[12px] font-[590] uppercase tracking-wide px-2 py-0.5 rounded-[2px]"
                    style={{ background: `${p.color}22`, color: p.color }}
                  >
                    {p.name}
                  </span>
                  <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                    {p.total} promises
                  </span>
                </div>
                <div
                  className="text-[28px] font-[590] mb-1"
                  style={{ color: "var(--status-kept)", letterSpacing: "-0.022em" }}
                >
                  {keptPct}%
                </div>
                <p className="text-caption mb-2" style={{ color: "var(--text-secondary)" }}>kept</p>
                <Bar value={p.kept} total={p.total} color="var(--status-kept)" />
              </div>
            )
          })}
        </div>

        {/* Full breakdown table */}
        <div
          className="rounded-[6px] overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Header */}
          <div
            className="grid px-4 py-2"
            style={{
              gridTemplateColumns: "120px repeat(6, 1fr)",
              background: "var(--bg-elevated)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span className="text-caption font-[510] uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
              Party
            </span>
            {STATUS_COLS.map(({ label, status }) => (
              <div key={label} className="flex justify-center">
                <StatusPill status={status} />
              </div>
            ))}
          </div>

          {PARTY_STATS.map((p, i) => (
            <div
              key={p.slug}
              className="grid px-4 py-3 items-center hover:bg-[var(--bg-elevated-2)] transition-colors duration-100"
              style={{
                gridTemplateColumns: "120px repeat(6, 1fr)",
                borderTop: i > 0 ? "1px solid var(--border)" : undefined,
              }}
            >
              <span
                className="text-[13px] font-[510]"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
              {STATUS_COLS.map(({ key }) => (
                <div key={key} className="flex justify-center">
                  <span
                    className="text-[14px] font-[590]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {(p as unknown as Record<string, number>)[key] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
          Data reflects manually seeded sample promises. Full counts will update after manifesto ingestion.
        </p>
      </div>
    </>
  )
}
