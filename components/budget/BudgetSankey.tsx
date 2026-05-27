"use client"

/**
 * Neo Nīti — Union Budget Sankey (NŃ-Flow-321 v3)
 *
 * Proper filled-ribbon Sankey:
 *  - Gradient-filled band paths (source → target color)
 *  - Wide viewBox (1000 × 520) with left/right label margins inside SVG
 *  - Opacity animation for nodes (scaleY is broken on SVG in Framer)
 *  - Connected-subgraph highlight on hover
 *  - Side hover panel with full node details
 */

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { SANKEY_2026_27_BE, type SankeyNode } from "@/lib/budget/data"

// ── Color palette ─────────────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  borrowing:    "var(--status-broken)",
  tax_direct:   "var(--accent)",
  tax_indirect: "var(--blue)",
  non_tax:      "var(--status-inworks)",
  transfer:     "var(--status-compromise)",
  centre:       "var(--status-kept)",
  obligatory:   "var(--status-stalled)",
  scheme:       "var(--blue-marketing)",
  other:        "var(--status-unrated)",
}

const CAT_LABEL: Record<string, string> = {
  borrowing:    "Borrowings",
  tax_direct:   "Direct Tax",
  tax_indirect: "Indirect Tax",
  non_tax:      "Non-Tax Receipts",
  transfer:     "Transfers",
  centre:       "Centre Pool",
  obligatory:   "Obligatory",
  scheme:       "Schemes",
  other:        "Other",
}

function catColor(n: SankeyNode) { return CAT_COLOR[n.category] ?? "var(--status-unrated)" }

// ── Canvas / layout constants ─────────────────────────────────────────────────
// Wide enough that all SVG text labels sit fully inside the viewBox (no clipping)
const W        = 1000
const H        = 520
const NODE_W   = 16      // px width of node bars
const V_PAD    = 9       // vertical gap between nodes in same column
const TOTAL    = SANKEY_2026_27_BE.totalExpenditure

// Column centre-x (leave ~175px margin each side for labels)
const COL_CX   = [175, 488, 825]
const COL_X0   = COL_CX.map(cx => cx - NODE_W / 2)
const COL_X1   = COL_CX.map(cx => cx + NODE_W / 2)

// ── Types ─────────────────────────────────────────────────────────────────────
interface LNode extends SankeyNode {
  x0: number; y0: number; x1: number; y1: number
}

interface LLink {
  id: string
  source: LNode; target: LNode; value: number
  y0s: number; y0e: number   // y-slice on source right edge
  y1s: number; y1e: number   // y-slice on target left edge
}

// ── Layout engine ─────────────────────────────────────────────────────────────
function buildLayout() {
  const data = SANKEY_2026_27_BE
  const cols: SankeyNode[][] = [[], [], []]
  data.nodes.forEach(n => cols[n.column].push(n))

  // Node bounding boxes
  const lnodes: LNode[] = []
  cols.forEach((col, ci) => {
    const colSum   = col.reduce((s, n) => s + n.value, 0)
    const usableH  = H - V_PAD * (col.length - 1)
    let cursor = 0
    col.forEach(n => {
      const h = (n.value / colSum) * usableH
      lnodes.push({ ...n, x0: COL_X0[ci], x1: COL_X1[ci], y0: cursor, y1: cursor + h })
      cursor += h + V_PAD
    })
  })

  // Per-node link-value totals for proportional band slicing
  const srcSums: Record<string, number> = {}
  const tgtSums: Record<string, number> = {}
  data.links.forEach(lk => {
    srcSums[lk.source] = (srcSums[lk.source] ?? 0) + lk.value
    tgtSums[lk.target] = (tgtSums[lk.target] ?? 0) + lk.value
  })

  // Accumulate y-slice offsets per node
  const srcOff: Record<string, number> = {}
  const tgtOff: Record<string, number> = {}
  lnodes.forEach(n => { srcOff[n.id] = n.y0; tgtOff[n.id] = n.y0 })

  const links: LLink[] = data.links.map(lk => {
    const src  = lnodes.find(n => n.id === lk.source)!
    const tgt  = lnodes.find(n => n.id === lk.target)!
    const srcH = (lk.value / (srcSums[lk.source] || 1)) * (src.y1 - src.y0)
    const tgtH = (lk.value / (tgtSums[lk.target] || 1)) * (tgt.y1 - tgt.y0)
    const y0s = srcOff[lk.source]; srcOff[lk.source] += srcH
    const y1s = tgtOff[lk.target]; tgtOff[lk.target] += tgtH
    return { id: `${lk.source}--${lk.target}`, source: src, target: tgt, value: lk.value,
             y0s, y0e: y0s + srcH, y1s, y1e: y1s + tgtH }
  })

  return { nodes: lnodes, links }
}

// ── Filled ribbon path (top-curve → bottom-curve) ────────────────────────────
function ribbon(x0: number, y0s: number, y0e: number, x1: number, y1s: number, y1e: number) {
  const cpx = x0 + (x1 - x0) * 0.52
  return [
    `M ${x0} ${y0s}`,
    `C ${cpx} ${y0s}, ${cpx} ${y1s}, ${x1} ${y1s}`,
    `L ${x1} ${y1e}`,
    `C ${cpx} ${y1e}, ${cpx} ${y0e}, ${x0} ${y0e}`,
    `Z`,
  ].join(" ")
}

// ── Mobile bar view ───────────────────────────────────────────────────────────
function MobileBar({ nodes, label }: { nodes: SankeyNode[]; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] uppercase tracking-[0.08em]"
        style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
        {label}
      </p>
      <div className="flex h-3 rounded-full overflow-hidden w-full gap-px">
        {nodes.map((n, i) => (
          <motion.div key={n.id}
            style={{ width: `${(n.value / TOTAL) * 100}%`, background: catColor(n), minWidth: 2, originX: "left" }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ ...springs.gentle, delay: 0.1 + i * 0.04 }} />
        ))}
      </div>
      <ul className="flex flex-col gap-1">
        {nodes.map((n, i) => (
          <motion.li key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...springs.gentle, delay: 0.15 + i * 0.05 }}
            className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: catColor(n) }} />
            <span style={{ color: "var(--text-secondary)" }}>{n.label}</span>
            <span className="ml-auto tabular-nums"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
              ₹{n.value.toFixed(1)} L Cr
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

// ── Side hover panel ──────────────────────────────────────────────────────────
function HoverPanel({ node, color }: { node: LNode; color: string }) {
  return (
    <motion.div
      key={node.id}
      className="rounded-xl px-4 py-3 border flex flex-col gap-2 shadow-2xl"
      style={{ background: "var(--bg-elevated-3)", borderColor: "var(--border-strong)" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={springs.responsive}
    >
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
        <p className="text-[12px] leading-tight"
          style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
          {node.label}
        </p>
      </div>
      <p className="text-[20px] tabular-nums leading-none"
        style={{ color, fontVariationSettings: fontWeights.bold }}>
        ₹{node.value.toFixed(2)}{" "}
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.regular }}>
          lakh crore
        </span>
      </p>
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 rounded-full flex-1" style={{ background: "var(--bg-quaternary)" }}>
          <div className="h-full rounded-full"
            style={{ width: `${(node.value / TOTAL) * 100}%`, background: color }} />
        </div>
        <span className="text-[10px] tabular-nums shrink-0"
          style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
          {((node.value / TOTAL) * 100).toFixed(1)}%
        </span>
      </div>
      {node.note && (
        <p className="text-[10px] leading-[1.45] pt-1.5 border-t"
          style={{ color: "var(--text-tertiary)", borderColor: "var(--border)" }}>
          {node.note}
        </p>
      )}
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function BudgetSankey() {
  const { nodes, links } = useMemo(() => buildLayout(), [])
  const [hovered, setHovered] = useState<string | null>(null)
  const data = SANKEY_2026_27_BE

  const hoveredNode = nodes.find(n => n.id === hovered) ?? null

  // Compute which node IDs are in the hovered subgraph
  const connectedIds = useMemo(() => {
    if (!hovered) return null
    const ids = new Set([hovered])
    links.forEach(lk => {
      if (lk.source.id === hovered || lk.target.id === hovered) {
        ids.add(lk.source.id)
        ids.add(lk.target.id)
      }
    })
    return ids
  }, [hovered, links])

  const nodeActive = (id: string) => !connectedIds || connectedIds.has(id)
  const linkActive = (lk: LLink)  => !connectedIds || connectedIds.has(lk.source.id) || connectedIds.has(lk.target.id)

  const sources = data.nodes.filter(n => n.column === 0)
  const uses    = data.nodes.filter(n => n.column === 2)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Desktop ─────────────────────────────────────────── */}
      <div className="hidden sm:flex gap-5 items-start">

        {/* SVG column */}
        <div className="flex-1 min-w-0">
          {/* Column headers */}
          <div className="relative h-5 mb-3">
            {[
              { label: "WHERE IT COMES FROM", ci: 0 },
              { label: "CENTRE'S POOL",       ci: 1 },
              { label: "WHERE IT GOES",        ci: 2 },
            ].map(({ label, ci }) => (
              <motion.span
                key={label}
                className="absolute text-[9px] tracking-[0.1em] uppercase whitespace-nowrap"
                style={{
                  left: `${(COL_CX[ci] / W) * 100}%`,
                  transform: "translateX(-50%)",
                  color: "var(--text-tertiary)",
                  fontVariationSettings: fontWeights.semibold,
                }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: ci * 0.08 }}
              >
                {label}
              </motion.span>
            ))}
          </div>

          {/* SVG canvas */}
          <div className="w-full" style={{ overflow: "visible" }}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              style={{ display: "block", overflow: "visible" }}
              aria-label="Union Budget 2026-27 — sources to final uses"
            >
              <defs>
                {links.map(lk => (
                  <linearGradient
                    key={lk.id}
                    id={`g-${lk.id}`}
                    x1="0%" y1="0%" x2="100%" y2="0%"
                  >
                    <stop offset="0%"   stopColor={catColor(lk.source)} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={catColor(lk.target)} stopOpacity="0.38" />
                  </linearGradient>
                ))}
              </defs>

              {/* Ribbon bands */}
              <g>
                {links.map((lk, i) => (
                  <motion.path
                    key={lk.id}
                    d={ribbon(lk.source.x1, lk.y0s, lk.y0e, lk.target.x0, lk.y1s, lk.y1e)}
                    fill={`url(#g-${lk.id})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: linkActive(lk) ? 1 : 0.05 }}
                    transition={springs.responsive}
                    onMouseEnter={() => setHovered(lk.source.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "default" }}
                  />
                ))}
              </g>

              {/* Nodes */}
              <g>
                {nodes.map((n, i) => {
                  const active   = nodeActive(n.id)
                  const col      = catColor(n)
                  const nh       = n.y1 - n.y0
                  const cy       = (n.y0 + n.y1) / 2
                  const isLeft   = n.column === 0
                  const isRight  = n.column === 2
                  const isCenter = n.column === 1
                  // Label side
                  const lblX    = isLeft ? n.x0 - 10 : isRight ? n.x1 + 10 : (n.x0 + n.x1) / 2
                  const anchor  = isLeft ? "end" : isRight ? "start" : "middle"
                  // Name row (up if two lines, centered if one)
                  const nameY   = nh > 26 ? cy - 7 : cy
                  const showVal = nh > 22

                  return (
                    <motion.g
                      key={n.id}
                      initial={false}
                      animate={{ opacity: active ? 1 : 0.1 }}
                      transition={springs.responsive}
                      onMouseEnter={() => setHovered(n.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Node bar */}
                      <rect
                        x={n.x0} y={n.y0}
                        width={NODE_W} height={Math.max(nh, 4)}
                        rx={3}
                        fill={col}
                      />

                      {/* Node name */}
                      <text
                        x={lblX} y={nameY}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fontSize={isCenter ? 11 : 10}
                        fill="var(--text-primary)"
                        style={{
                          userSelect: "none",
                          fontVariationSettings: isCenter ? fontWeights.semibold : fontWeights.medium,
                        } as React.CSSProperties}
                      >
                        {n.label.length > 22 && !isCenter ? n.label.slice(0, 20) + "…" : n.label}
                      </text>

                      {/* Value sub-label */}
                      {showVal && (
                        <text
                          x={lblX} y={cy + (nh > 26 ? 7 : 8)}
                          textAnchor={anchor}
                          dominantBaseline="middle"
                          fontSize={9}
                          fill={col}
                          style={{
                            userSelect: "none",
                            fontVariationSettings: fontWeights.semibold,
                          } as React.CSSProperties}
                        >
                          ₹{n.value.toFixed(1)} L Cr
                        </text>
                      )}
                    </motion.g>
                  )
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* Info panel */}
        <div className="w-[200px] shrink-0 hidden lg:block pt-8" style={{ minHeight: 80 }}>
          <AnimatePresence mode="wait">
            {hoveredNode
              ? <HoverPanel key={hoveredNode.id} node={hoveredNode} color={catColor(hoveredNode)} />
              : (
                <motion.p key="hint"
                  className="text-[10px] leading-[1.7]"
                  style={{ color: "var(--text-disabled)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={springs.gentle}
                >
                  Hover any node or flow ribbon to see the breakdown.
                </motion.p>
              )
            }
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────── */}
      <div className="sm:hidden flex flex-col gap-5">
        <MobileBar nodes={sources} label="Where it comes from" />
        <Separator style={{ background: "var(--border)" }} />
        <MobileBar nodes={uses} label="Where it goes" />
      </div>

      {/* ── Legend ──────────────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap gap-x-5 gap-y-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...springs.gentle, delay: 0.9 }}
      >
        {Object.entries(CAT_COLOR)
          .filter(([k]) => data.nodes.some(n => n.category === k))
          .map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span style={{ color: "var(--text-tertiary)" }}>{CAT_LABEL[cat] ?? cat}</span>
            </div>
          ))}
      </motion.div>

      {/* ── Citation ────────────────────────────────────────── */}
      <p className="text-[10px]" style={{ color: "var(--text-disabled)" }}>
        {data.source} · FY {data.fy} {data.estimate} · Total expenditure ₹{data.totalExpenditure} lakh crore · Fiscal deficit {data.fiscalDeficitPct}% of GDP
      </p>

    </div>
  )
}
