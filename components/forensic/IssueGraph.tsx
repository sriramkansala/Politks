"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export interface GraphNode {
  id: string
  label: string
  type: "bill" | "mp" | "event" | "promise"
  color?: string
  href?: string
  year?: number | null
  outcome?: string | null
  x: number
  y: number
}

export interface GraphEdge {
  id: string
  sourceId: string
  targetId: string
  label: string
  description?: string | null
}

interface IssueGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width?: number
  height?: number
}

const NODE_W = 130
const NODE_H = 40
const MP_R = 22

function nodeCenter(n: GraphNode): { x: number; y: number } {
  return { x: n.x, y: n.y }
}

function cubicBezier(
  x1: number, y1: number,
  x2: number, y2: number
): string {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

const OUTCOME_COLOR: Record<string, string> = {
  passed: "var(--status-kept)",
  lapsed: "var(--status-broken)",
  withdrawn: "var(--status-stalled)",
  pending: "var(--status-inworks)",
}

const EDGE_COLOR: Record<string, string> = {
  superseded_by: "var(--text-tertiary)",
  blocked_by: "var(--status-broken)",
  opposed_by: "var(--status-broken)",
  weakened_by: "var(--status-compromise)",
  amended_by: "var(--status-compromise)",
  linked_to: "var(--text-tertiary)",
  descended_from: "var(--accent)",
  endorsed_by: "var(--status-kept)",
  caused_by: "var(--status-broken)",
  lapsed_with: "var(--text-tertiary)",
}

export function IssueGraph({ nodes, edges, width = 900, height = 480 }: IssueGraphProps) {
  const router = useRouter()
  const [hoverEdge, setHoverEdge] = useState<string | null>(null)
  const [hoverNode, setHoverNode] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ maxHeight: height, display: "block" }}
      >
        <defs>
          {/* Arrowhead markers per edge type */}
          {Object.entries(EDGE_COLOR).map(([type, color]) => (
            <marker
              key={type}
              id={`arrow-${type}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} opacity="0.7" />
            </marker>
          ))}
        </defs>

        {/* Edges */}
        {edges.map((edge) => {
          const src = nodeMap.get(edge.sourceId)
          const tgt = nodeMap.get(edge.targetId)
          if (!src || !tgt) return null
          const s = nodeCenter(src)
          const t = nodeCenter(tgt)
          const color = EDGE_COLOR[edge.label] ?? "var(--text-tertiary)"
          const isHovered = hoverEdge === edge.id
          const path = cubicBezier(s.x, s.y, t.x, t.y)

          return (
            <g key={edge.id}>
              {/* Transparent hit area */}
              <path
                d={path}
                stroke="transparent"
                strokeWidth={14}
                fill="none"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverEdge(edge.id)}
                onMouseLeave={() => setHoverEdge(null)}
              />
              <path
                d={path}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1.5}
                fill="none"
                opacity={isHovered ? 1 : 0.55}
                strokeDasharray={edge.label === "superseded_by" ? "5,4" : undefined}
                markerEnd={`url(#arrow-${edge.label})`}
                style={{ transition: "opacity 120ms, stroke-width 120ms", pointerEvents: "none" }}
              />
              {/* Edge label on hover */}
              {isHovered && (
                <text
                  x={(s.x + t.x) / 2}
                  y={(s.y + t.y) / 2 - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill={color}
                  style={{ pointerEvents: "none", fontFamily: "var(--font-sans)", letterSpacing: "0.04em" }}
                >
                  {edge.label.replace(/_/g, " ")}
                </text>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHovered = hoverNode === node.id
          const clickable = !!node.href
          const outlineColor = isHovered
            ? "var(--accent)"
            : "var(--border-strong)"

          if (node.type === "mp") {
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{ cursor: clickable ? "pointer" : "default" }}
                onMouseEnter={() => setHoverNode(node.id)}
                onMouseLeave={() => setHoverNode(null)}
                onClick={() => node.href && router.push(node.href)}
              >
                <circle
                  r={MP_R}
                  fill="var(--bg-elevated-2)"
                  stroke={outlineColor}
                  strokeWidth={isHovered ? 1.5 : 1}
                  style={{ transition: "stroke 120ms" }}
                />
                <text
                  textAnchor="middle"
                  fontSize="9"
                  dy="-5"
                  fill="var(--text-secondary)"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 510 }}
                >
                  {node.label.split(" ")[0]}
                </text>
                <text
                  textAnchor="middle"
                  fontSize="9"
                  dy="6"
                  fill="var(--text-secondary)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {node.label.split(" ").slice(1, 3).join(" ")}
                </text>
                <text
                  textAnchor="middle"
                  fontSize="8"
                  dy="17"
                  fill="var(--text-tertiary)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {node.label.split("(")[1]?.replace(")", "") ?? ""}
                </text>
              </g>
            )
          }

          // Bill node — rectangle
          const fillColor = node.outcome
            ? OUTCOME_COLOR[node.outcome] ?? "var(--bg-elevated-2)"
            : "var(--bg-elevated-2)"

          return (
            <g
              key={node.id}
              transform={`translate(${node.x - NODE_W / 2}, ${node.y - NODE_H / 2})`}
              style={{ cursor: clickable ? "pointer" : "default" }}
              onMouseEnter={() => setHoverNode(node.id)}
              onMouseLeave={() => setHoverNode(null)}
              onClick={() => node.href && router.push(node.href)}
            >
              <rect
                width={NODE_W}
                height={NODE_H}
                rx="4"
                ry="4"
                fill="var(--bg-elevated)"
                stroke={isHovered ? "var(--accent)" : outlineColor}
                strokeWidth={isHovered ? 1.5 : 1}
                style={{ transition: "stroke 120ms" }}
              />
              {/* Colour bar on left edge based on outcome */}
              <rect
                width="3"
                height={NODE_H}
                rx="2"
                fill={fillColor}
                opacity="0.9"
              />
              <text
                x="12"
                y="15"
                fontSize="10"
                fill="var(--text-primary)"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 510 }}
              >
                {node.label.length > 18 ? node.label.slice(0, 18) + "…" : node.label}
              </text>
              {node.year && (
                <text
                  x="12"
                  y="28"
                  fontSize="9"
                  fill="var(--text-tertiary)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {node.year} · {node.outcome ?? "pending"}
                </text>
              )}
            </g>
          )
        })}

        {/* Tooltip for hovered edge */}
        {hoverEdge && (() => {
          const edge = edges.find((e) => e.id === hoverEdge)
          const src = edge ? nodeMap.get(edge.sourceId) : null
          const tgt = edge ? nodeMap.get(edge.targetId) : null
          if (!edge || !src || !tgt || !edge.description) return null
          const mx = (src.x + tgt.x) / 2
          const my = (src.y + tgt.y) / 2 + 20
          const words = edge.description.split(" ")
          const lines: string[] = []
          let cur = ""
          for (const w of words) {
            if ((cur + " " + w).trim().length > 50) { lines.push(cur.trim()); cur = w }
            else cur = (cur + " " + w).trim()
          }
          if (cur) lines.push(cur)
          const tooltipW = 240
          const tooltipH = lines.length * 14 + 16
          return (
            <g style={{ pointerEvents: "none" }}>
              <rect
                x={Math.min(mx - tooltipW / 2, width - tooltipW - 8)}
                y={my}
                width={tooltipW}
                height={tooltipH}
                rx="4"
                fill="var(--bg-elevated-2)"
                stroke="var(--border)"
              />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={Math.min(mx - tooltipW / 2, width - tooltipW - 8) + 8}
                  y={my + 13 + i * 14}
                  fontSize="9"
                  fill="var(--text-secondary)"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {line}
                </text>
              ))}
            </g>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 px-2 mt-2 flex-wrap">
        {[
          { color: OUTCOME_COLOR.passed, label: "Passed" },
          { color: OUTCOME_COLOR.lapsed, label: "Lapsed" },
          { color: EDGE_COLOR.blocked_by, label: "Blocked by" },
          { color: EDGE_COLOR.weakened_by, label: "Weakened by" },
          { color: EDGE_COLOR.endorsed_by, label: "Endorsed by" },
          { color: EDGE_COLOR.superseded_by, label: "Superseded by" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
