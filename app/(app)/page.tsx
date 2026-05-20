import Link from "next/link"
import { ArrowRight, GitBranch } from "lucide-react"
import { statusMeta, type PromiseStatus } from "@/lib/tokens"
import { createPublicClient } from "@/lib/db/server"
import type { PromiseRow } from "@/lib/db/types"

export const revalidate = 21600

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
      style={{ color: meta.color, background: meta.bg, borderRadius: "2px" }}
    >
      {meta.label}
    </span>
  )
}

export default async function HomePage() {
  const supabase = createPublicClient()

  const [{ count: totalPromises }, { data: statusRows }] = await Promise.all([
    supabase.from("promises").select("*", { count: "exact", head: true }),
    supabase.from("promises").select("status"),
  ])

  const allStatuses = (statusRows ?? []) as Pick<PromiseRow, "status">[]
  const kept = allStatuses.filter((r) => r.status === "promise_kept").length
  const broken = allStatuses.filter((r) => r.status === "promise_broken").length
  const total = totalPromises ?? 0
  const keptPct = total > 0 ? Math.round((kept / total) * 100) : 0
  const brokenPct = total > 0 ? Math.round((broken / total) * 100) : 0

  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">

        {/* Hero */}
        <section>
          <h1 className="text-heading-xl mb-3" style={{ color: "var(--text-primary)" }}>
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
              { label: "Promises indexed", value: String(total) },
              { label: "Promise Kept", value: `${keptPct}%` },
              { label: "Promise Broken", value: `${brokenPct}%` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-[6px]"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
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

        {/* Party breakdown teaser */}
        <section
          className="rounded-[6px] px-6 py-8"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <p className="text-body mb-1" style={{ color: "var(--text-primary)" }}>
            {total} promises tracked across BJP, INC, AAP &amp; DMK.
          </p>
          <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
            All promises are currently unrated. Status ratings will be updated as evidence emerges.
          </p>
        </section>

        {/* Featured Investigation */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
              Featured Investigation
            </h2>
            <Link
              href="/bills"
              className="flex items-center gap-1 text-[12px] transition-colors"
              style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
            >
              All bills <ArrowRight size={12} />
            </Link>
          </div>

          <Link
            href="/bills/wrb-2023"
            style={{ textDecoration: "none" }}
            className="block"
          >
            <div
              className="rounded-[6px] p-5 transition-colors duration-100 hover:border-[var(--border-strong)] group"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch size={12} style={{ color: "var(--accent)" }} />
                    <span
                      className="text-[10px] font-[510] uppercase tracking-[0.07em]"
                      style={{ color: "var(--accent)" }}
                    >
                      Forensic Investigation
                    </span>
                  </div>
                  <h3
                    className="text-[15px] font-[510] mb-1 group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    The 27-Year Women&apos;s Reservation Bill
                  </h3>
                  <p className="text-[13px] leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                    How a constitutional amendment promised in 1996 was blocked, lapsed, torn, passed with a poison pill, and still hasn&apos;t taken effect in 2024. A full causal graph across 5 bills, 6 MPs, and 4 Lok Sabhas.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["5 bills", "6 MPs", "27 years", "Article 334A signal"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-[3px] font-[450]"
                        style={{
                          background: "var(--bg-elevated-2)",
                          color: "var(--text-tertiary)",
                          border: "1px solid var(--border)",
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
        </section>
      </div>
    </>
  )
}
