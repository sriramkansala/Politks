import { StatusPill } from "@/components/promises/StatusPill"
import { PartySymbol } from "@/components/parties/PartySymbol"
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
      color: (p.color_hex ?? "#888") as string,
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
          <h1 className="text-heading mb-1" style={{ color: tokens.color.textPrimary }}>
            Promise Tracker
          </h1>
          <p className="text-body" style={{ color: tokens.color.textSecondary }}>
            Aggregate fulfillment scores across all tracked parties.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((p) => {
            const keptPct = p.total > 0 ? Math.round((p.kept / p.total) * 100) : 0
            return (
              <div
                key={p.slug}
                className="p-4 rounded-[6px]"
                style={{
                  background: tokens.color.bgElevated,
                  border: `1px solid ${tokens.color.border}`,
                  borderTop: `3px solid ${p.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <PartySymbol slug={p.slug} color={p.color} size={16} />
                    <span
                      className="text-[11px] font-[590] uppercase tracking-[0.06em]"
                      style={{ color: p.color }}
                    >
                      {p.short_name ?? p.name}
                    </span>
                  </div>
                  <span className="text-caption" style={{ color: tokens.color.textTertiary }}>
                    {p.total} promises
                  </span>
                </div>
                <div
                  className="text-[28px] font-[590] mb-1"
                  style={{ color: tokens.status.kept, letterSpacing: "-0.022em" }}
                >
                  {keptPct}%
                </div>
                <p className="text-caption mb-2" style={{ color: tokens.color.textSecondary }}>kept</p>
                <Bar value={p.kept} total={p.total} color={tokens.status.kept} />
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
                      <PartySymbol slug={p.slug} color={p.color} size={16} />
                      <span className="font-[510] text-[13px]" style={{ color: p.color }}>
                        {p.short_name ?? p.name}
                      </span>
                    </div>
                  </TableCell>
                  {STATUS_COLS.map(({ key }) => (
                    <TableCell key={key} className="text-center text-[14px] font-[590]">
                      {(p as unknown as Record<string, number>)[key] ?? 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-caption" style={{ color: tokens.color.textTertiary }}>
          Promises are rated as evidence of government action (or inaction) accumulates. Status updates require editorial review and cited sources.
        </p>
      </div>
    </>
  )
}
