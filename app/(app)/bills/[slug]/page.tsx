import { notFound } from "next/navigation"
import Link from "next/link"
import { FileDiff } from "lucide-react"
import { IssueGraph, type GraphNode, type GraphEdge } from "@/components/forensic/IssueGraph"
import { StageTimeline } from "@/components/forensic/StageTimeline"
import { ForensicSignals } from "@/components/forensic/ForensicSignalCard"
import { BillStorySection, BillStoryEmptyState } from "@/components/forensic/BillStorySection"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import { createPublicClient } from "@/lib/db/server"
import { getBillStory } from "@/lib/db/billStory"
import { fontWeights } from "@/lib/font-weight"
import type { Bill, StageEvent, IssueGraphEdge, Mp } from "@/lib/db/types"

export const revalidate = 21600

export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase.from("bills").select("slug")
  return (data ?? [] as { slug: string }[]).map((b) => ({ slug: (b as { slug: string }).slug }))
}

const OUTCOME_STYLE: Record<string, { label: string; color: string }> = {
  passed:    { label: "Passed",    color: "var(--status-kept)" },
  lapsed:    { label: "Lapsed",    color: "var(--status-broken)" },
  withdrawn: { label: "Withdrawn", color: "var(--status-stalled)" },
  repealed:  { label: "Repealed",  color: "var(--status-compromise)" },
  pending:   { label: "Pending",   color: "var(--status-inworks)" },
}



// Build graph nodes/edges for the WRB bill chain from DB data
function buildWrbGraph(
  bills: Pick<Bill, "id" | "slug" | "short_title" | "title" | "outcome" | "introduced_date">[],
  edges: IssueGraphEdge[],
  mps: Mp[],
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  // Bill layout: chronological left-to-right at y=220
  // MP layout: staggered above/below
  const billPositions: Record<string, { x: number; y: number }> = {
    "wrb-1996": { x: 120, y: 220 },
    "wrb-1998": { x: 280, y: 220 },
    "wrb-1999": { x: 440, y: 220 },
    "wrb-2008": { x: 600, y: 220 },
    "wrb-2023": { x: 760, y: 220 },
  }
  const mpPositions: Record<string, { x: number; y: number }> = {
    "mp-geeta-mukherjee":       { x: 120, y: 100 },
    "mp-surendra-yadav":        { x: 380, y: 360 },
    "mp-owaisi":                { x: 600, y: 360 },
    "mp-syed-jaleel":           { x: 760, y: 360 },
    "mp-arjun-ram-meghwal":     { x: 700, y: 100 },
    "mp-nirmala-sitharaman":    { x: 860, y: 100 },
  }

  const billNodeMap = new Map(bills.map((b) => [b.id, b]))
  const mpNodeMap = new Map(mps.map((m) => [m.id, m]))

  // Collect node IDs referenced by edges
  const nodeIds = new Set<string>()
  edges.forEach((e) => { nodeIds.add(e.source_id); nodeIds.add(e.target_id) })
  bills.forEach((b) => nodeIds.add(b.id))

  const nodes: GraphNode[] = []

  for (const bill of bills) {
    const pos = billPositions[bill.slug] ?? { x: 400, y: 220 }
    nodes.push({
      id: bill.id,
      label: bill.short_title ?? bill.title,
      type: "bill",
      href: `/bills/${bill.slug}`,
      year: bill.introduced_date ? parseInt(bill.introduced_date.slice(0, 4)) : null,
      outcome: bill.outcome ?? null,
      x: pos.x,
      y: pos.y,
    })
  }

  // Add MP nodes referenced in edges
  for (const mp of mps) {
    const slug = mp.name
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .replace(/ +/g, "-")
    const knownKey = Object.keys(mpPositions).find((k) =>
      mp.name.toLowerCase().includes(k.replace("mp-", "").replace(/-/g, " ").split(" ")[0])
    )
    if (!knownKey) continue
    const pos = mpPositions[knownKey]
    nodes.push({
      id: mp.id,
      label: `${mp.name} (${mp.party_name?.split(" ")[0] ?? "?"})`,
      type: "mp",
      href: undefined,
      x: pos.x,
      y: pos.y,
    })
  }

  const graphEdges: GraphEdge[] = edges.map((e) => ({
    id: e.id,
    sourceId: e.source_id,
    targetId: e.target_id,
    label: e.edge_type,
    description: e.description,
  }))

  return { nodes, edges: graphEdges }
}

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: bill } = await supabase.from("bills").select("*").eq("slug", slug).single()

  const typedBill = bill as Bill | null
  if (!typedBill) notFound()

  const [{ data: events }, { data: edges }, { data: allBills }, { data: mps }] =
    await Promise.all([
      supabase
        .from("stage_events")
        .select("*")
        .eq("bill_id", typedBill.id)
        .order("stage", { ascending: true })
        .order("event_date", { ascending: true }),
      supabase
        .from("issue_graph_edges")
        .select("*")
        .or(`source_id.eq.${typedBill.id},target_id.eq.${typedBill.id}`),
      supabase
        .from("bills")
        .select("id, slug, title, short_title, outcome, introduced_date")
        .order("introduced_date", { ascending: true }),
      supabase.from("mps").select("*"),
    ])

  const stageEvents = (events ?? []) as StageEvent[]
  const graphEdges = (edges ?? []) as IssueGraphEdge[]
  const billsForGraph = (allBills ?? []) as Pick<Bill, "id" | "slug" | "short_title" | "title" | "outcome" | "introduced_date">[]
  const mpsForGraph = (mps ?? []) as Mp[]

  // Build stage coverage: which stages have events?
  const coveredStages = new Set(stageEvents.map((e) => e.stage))

  const outcome = typedBill.outcome ?? "pending"
  const outcomeStyle = OUTCOME_STYLE[outcome] ?? OUTCOME_STYLE.pending

  // Build graph data (only for WRB bills)
  const isWrbSeries = slug.startsWith("wrb-")
  const { nodes: graphNodes, edges: graphEdgesForComponent } = isWrbSeries
    ? buildWrbGraph(billsForGraph, graphEdges, mpsForGraph)
    : { nodes: [], edges: [] }

  const year = typedBill.introduced_date?.slice(0, 4) ?? "—"
  const story = getBillStory(typedBill.slug)

  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/bills"
              className="text-[12px]"
              style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
            >
              Bills
            </Link>
            <span style={{ color: "var(--text-disabled)" }}>/</span>
            <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              {typedBill.bill_number ?? slug}
            </span>
          </div>
          {/* Title row — status pill anchored opposite the title for clarity */}
          <div className="flex items-start justify-between gap-6 mb-2">
            <h1 className="h-page" style={{ color: "var(--text-primary)" }}>
              {typedBill.title}
            </h1>
            <span
              className="inline-flex items-center px-3 py-1.5 text-[13px] uppercase tracking-[0.06em] rounded-[var(--radius-pill)] shrink-0 self-start whitespace-nowrap"
              style={{
                color: outcomeStyle.color,
                background: `${outcomeStyle.color}22`,
                border: `1px solid ${outcomeStyle.color}55`,
                fontVariationSettings: fontWeights.semibold,
              }}
            >
              <span
                className="inline-block rounded-full mr-2"
                style={{ width: 7, height: 7, background: outcomeStyle.color }}
                aria-hidden
              />
              {outcomeStyle.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {typedBill.bill_number && (
              <span className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                {typedBill.bill_number}
              </span>
            )}
            <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              {typedBill.house_introduced === "lok_sabha" ? "Lok Sabha" : typedBill.house_introduced === "rajya_sabha" ? "Rajya Sabha" : ""}
              {year !== "—" ? ` · ${year}` : ""}
            </span>
            {typedBill.ministry && (
              <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                {typedBill.ministry}
              </span>
            )}
          </div>
          {typedBill.claude_summary && (
            <p className="mt-3 text-[14px] leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              {typedBill.claude_summary}
            </p>
          )}
          {/* Bill Diff CTA — shown if bill has a predecessor */}
          {typedBill.predecessor_bill_id && (
            <div className="mt-4">
              <Link
                href={`/bills/${slug}/diff`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] transition-colors duration-80"
                style={{
                  background: "var(--bg-elevated-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  fontVariationSettings: fontWeights.medium,
                }}
              >
                <FileDiff size={13} strokeWidth={1.5} />
                View Bill Diff — what changed from the previous version?
              </Link>
            </div>
          )}
        </div>

        {/* Contextual story — explainer, stakeholders, narrative timeline, stats, sources */}
        <AnimateIn delay={0.05}>
          {story ? <BillStorySection story={story} /> : <BillStoryEmptyState />}
        </AnimateIn>

        {/* Issue Graph (WRB series only) */}
        {isWrbSeries && graphNodes.length > 0 && (
          <AnimateIn>
          <section>
            <h2 className="h-section mb-1" style={{ color: "var(--text-primary)" }}>
              Causal Graph
            </h2>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-tertiary)" }}>
              Relationships between bills, MPs, and blocking events in this legislative series
            </p>
            <div
              className="rounded-[6px] overflow-hidden p-4"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <IssueGraph
                nodes={graphNodes}
                edges={graphEdgesForComponent}
                width={920}
                height={480}
              />
            </div>
          </section>
          </AnimateIn>
        )}

        {/* Forensic Signals (WRB only) */}
        {slug === "wrb-2023" && (
          <section>
            <h2 className="h-section mb-1" style={{ color: "var(--text-primary)" }}>
              Forensic Signals
            </h2>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-tertiary)" }}>
              Automated signals detected by the BMW forensic engine
            </p>
            <ForensicSignals />
          </section>
        )}

        <AnimateIn delay={0.1}>
          <StageTimeline
            stageEvents={stageEvents}
            currentStage={typedBill.current_stage}
            coveredCount={coveredStages.size}
          />
        </AnimateIn>
      </div>
    </>
  )
}
