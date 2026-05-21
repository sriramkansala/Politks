import { StatusPill } from "@/components/promises/StatusPill"
import { tokens } from "@/lib/tokens"
import { createPublicClient } from "@/lib/db/server"
import type { PromiseStatus, Party, PromiseRow } from "@/lib/db/types"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

export const revalidate = 21600

const STATUS_COLS: Array<{ key: string; label: string; status: PromiseStatus }> = [
  { key: "kept",       label: "Kept",        status: "promise_kept" },
  { key: "compromise", label: "Compromise",  status: "compromise" },
  { key: "inworks",    label: "In Progress", status: "in_the_works" },
  { key: "stalled",    label: "Stalled",     status: "stalled" },
  { key: "broken",     label: "Broken",      status: "promise_broken" },
  { key: "unrated",    label: "Unrated",     status: "not_yet_rated" },
]

function Bar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.color.bgElevated2 }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

export default async function TrackerPage() {
  const supabase = createPublicClient()

  const { data: parties } = await supabase
    .from("parties")
    .select("id, name, short_name, slug, color_hex")
    .order("name", { ascending: true })

  const { data: promiseRows } = await supabase
    .from("promises")
    .select("party_id, status")

  const allRows = (promiseRows ?? []) as Pick<PromiseRow, "party_id" | "status">[]

  type PartyStats = {
    id: string; name: string; short_name: string | null
    slug: string; color: string
    total: number; kept: number; broken: number
    inworks: number; stalled: number; compromise: number; unrated: number
  }

  const typedParties = (parties ?? []) as Pick<Party, "id" | "name" | "short_name" | "slug" | "color_hex">[]

  const stats: PartyStats[] = typedParties.map((p) => {
    const rows = allRows.filter((r) => r.party_id === p.id)
    return {
      id: p.id as string,
      name: p.name as string,
      short_name: (p.short_name ?? null) as string | null,
      slug: p.slug as string,
      // UI_RULES.md §2: fallback for parties without a registered color_hex
      // uses --border-strong (a desaturated neutral) so the dot reads as
      // "no party identity" rather than a fake colour.
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

  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6">
        <div>
          <h1 className="h-page mb-2" style={{ color: tokens.color.textPrimary }}>
            Promise Tracker
          </h1>
          <p className="text-[15px]" style={{ color: tokens.color.textSecondary }}>
            Aggregate fulfillment scores across all tracked parties.
          </p>
        </div>

        {/* Summary cards — Linear-monochrome with single party-color dot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((p) => {
            const keptPct = p.total > 0 ? Math.round((p.kept / p.total) * 100) : 0
            const hasData = p.total > 0 && keptPct > 0
            return (
              <div
                key={p.slug}
                className="p-4 rounded-[var(--radius-card)]"
                style={{
                  background: tokens.color.bgElevated,
                  border: `1px solid ${tokens.color.border}`,
                  // Linear discipline: no full-width party-color top border. Party identity is
                  // a single 7px dot inline with the label.
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block rounded-full"
                      style={{ width: 7, height: 7, background: p.color }}
                      aria-label={p.name}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[0.06em]"
                      style={{
                        color: tokens.color.textSecondary,
                        fontVariationSettings: "'wght' 550",
                      }}
                    >
                      {p.short_name ?? p.name}
                    </span>
                  </div>
                  <span className="text-caption" style={{ color: tokens.color.textTertiary }}>
                    {p.total} promises
                  </span>
                </div>
                <div
                  className="text-[28px] mb-1"
                  style={{
                    // Only paint with status colour when there's actual data; 0% reads as
                    // primary white text rather than "successfully kept" green.
                    color: hasData ? tokens.status.kept : tokens.color.textPrimary,
                    letterSpacing: "-0.022em",
                    fontVariationSettings: "'wght' 590",
                  }}
                >
                  {keptPct}%
                </div>
                <p className="text-caption mb-2" style={{ color: tokens.color.textTertiary }}>kept</p>
                <Bar value={p.kept} total={p.total} color={hasData ? tokens.status.kept : tokens.color.border} />
              </div>
            )
          })}
        </div>

        {/* Full breakdown table */}
        <div
          className="rounded-[6px] overflow-hidden"
          style={{ border: `1px solid ${tokens.color.border}`, background: tokens.color.bgElevated }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-[10px] uppercase tracking-wide"
                  style={{ color: tokens.color.textTertiary, width: "140px" }}
                >
                  Party
                </TableHead>
                {STATUS_COLS.map(({ label, status }) => (
                  <TableHead key={label} className="text-center">
                    <StatusPill status={status} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((p, i) => (
                <TableRow key={p.slug} index={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Linear-mono: 7px party dot + neutral label */}
                      <span
                        className="inline-block rounded-full shrink-0"
                        style={{ width: 7, height: 7, background: p.color }}
                        aria-label={p.name}
                      />
                      <span
                        className="text-[13px]"
                        style={{
                          color: tokens.color.textPrimary,
                          fontVariationSettings: "'wght' 510",
                        }}
                      >
                        {p.short_name ?? p.name}
                      </span>
                    </div>
                  </TableCell>
                  {STATUS_COLS.map(({ key }) => (
                    <TableCell key={key} className="text-center text-[14px]">
                      {(p as unknown as Record<string, number>)[key] ?? 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Caveat block — UI_RULES.md §6 */}
        <section className="caveat-block">
          <strong>How this works.</strong>{" "}
          Each party&apos;s &ldquo;kept&rdquo; percentage is the share of its
          tracked manifesto promises that an editor has rated{" "}
          <em>promise_kept</em> against cited sources (PRS Legislative Research,
          official notifications, court orders). State-party promises are scored
          against the state government&apos;s delivery, national parties against
          the Union government&apos;s. Not all manifesto items are tracked —
          headline pledges are prioritised. &ldquo;Not yet rated&rdquo; is the
          default until at least one piece of post-election evidence is
          published.
        </section>
      </div>
    </>
  )
}
