"use client"

import { motion } from "framer-motion"
import { springs } from "@/lib/springs"

// x: -1 = Left, +1 = Right
// y: -1 = Socialist, +1 = Democratic
const PARTY_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  bjp:  { x:  0.60, y: -0.35, label: "Right · Nationalist" },
  inc:  { x: -0.18, y:  0.30, label: "Centre-Left · Liberal" },
  aap:  { x: -0.28, y:  0.55, label: "Centre-Left · Democratic" },
  dmk:  { x: -0.52, y:  0.20, label: "Left · Democratic Socialist" },
}

const SIZE = 120
const PAD = 18
const INNER = SIZE - PAD * 2

function toSvg(val: number) {
  return PAD + ((val + 1) / 2) * INNER
}

interface PoliticalCompassProps {
  slug: string
  color: string
}

export function PoliticalCompass({ slug, color }: PoliticalCompassProps) {
  const pos = PARTY_POSITIONS[slug]
  if (!pos) return null

  const cx = toSvg(pos.x)
  const cy = toSvg(-pos.y) // SVG y flips

  const mid = PAD + INNER / 2
  const quadrantOpacity = 0.04

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ display: "block" }}
      >
        {/* Quadrant fills */}
        {/* Top-left: Left + Democratic */}
        <rect x={PAD} y={PAD} width={INNER / 2} height={INNER / 2}
          fill="var(--status-kept)" opacity={quadrantOpacity} />
        {/* Top-right: Right + Democratic */}
        <rect x={mid} y={PAD} width={INNER / 2} height={INNER / 2}
          fill="var(--status-inworks)" opacity={quadrantOpacity} />
        {/* Bottom-left: Left + Socialist */}
        <rect x={PAD} y={mid} width={INNER / 2} height={INNER / 2}
          fill="var(--status-broken)" opacity={quadrantOpacity} />
        {/* Bottom-right: Right + Socialist */}
        <rect x={mid} y={mid} width={INNER / 2} height={INNER / 2}
          fill="var(--status-stalled)" opacity={quadrantOpacity} />

        {/* Grid lines */}
        {/* Horizontal axis */}
        <line x1={PAD} y1={mid} x2={PAD + INNER} y2={mid}
          stroke="var(--border-strong)" strokeWidth={0.5} />
        {/* Vertical axis */}
        <line x1={mid} y1={PAD} x2={mid} y2={PAD + INNER}
          stroke="var(--border-strong)" strokeWidth={0.5} />

        {/* Outer border */}
        <rect x={PAD} y={PAD} width={INNER} height={INNER}
          fill="none" stroke="var(--border)" strokeWidth={0.5} />

        {/* Axis labels */}
        <text x={PAD + 3} y={mid - 3} fontSize="6" fill="var(--text-disabled)"
          fontFamily="var(--font-sans)">Left</text>
        <text x={PAD + INNER - 3} y={mid - 3} fontSize="6" fill="var(--text-disabled)"
          textAnchor="end" fontFamily="var(--font-sans)">Right</text>
        <text x={mid} y={PAD + 7} fontSize="6" fill="var(--text-disabled)"
          textAnchor="middle" fontFamily="var(--font-sans)">Democratic</text>
        <text x={mid} y={PAD + INNER - 3} fontSize="6" fill="var(--text-disabled)"
          textAnchor="middle" fontFamily="var(--font-sans)">Socialist</text>

        {/* Crosshair at origin */}
        <circle cx={mid} cy={mid} r={1.5} fill="var(--border-strong)" />

        {/* Party dot — animated in */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={5}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...springs.slow, delay: 0.15 }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />
        {/* Dot glow ring */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={8}
          fill="none"
          stroke={color}
          strokeWidth={1}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ ...springs.slow, delay: 0.2 }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />
      </svg>

      {/* Label below */}
      <span
        className="text-[10px] font-mono text-right leading-tight"
        style={{ color: "var(--text-disabled)", maxWidth: SIZE }}
      >
        {pos.label}
      </span>
    </div>
  )
}
