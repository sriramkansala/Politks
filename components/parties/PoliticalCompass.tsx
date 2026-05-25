"use client"

// Dial-gauge political compass.
//
// Replaces the older 2D quadrant scatter with two semicircular dials that
// read instantly like a speedometer (inspired by passed/failed-controls
// gauges):
//   • Top dial  — Economic axis: Left ← centre → Right
//   • Lower dial — Social axis:  Socialist ← centre → Democratic
//
// Each dial has:
//   • tick marks around the arc (compass scale)
//   • a coloured active arc from the centre top down to the needle, using
//     the party colour for "how far from centre"
//   • a needle that animates in with a spring
//   • compact axis labels under the dial

import { motion } from "framer-motion"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"

// x: -1 = Left, +1 = Right
// y: -1 = Socialist, +1 = Democratic
const PARTY_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  bjp:  { x:  0.60, y: -0.35, label: "Right · Nationalist" },
  inc:  { x: -0.18, y:  0.30, label: "Centre-Left · Liberal" },
  aap:  { x: -0.28, y:  0.55, label: "Centre-Left · Democratic" },
  dmk:  { x: -0.52, y:  0.20, label: "Left · Democratic Socialist" },
}

interface PoliticalCompassProps {
  slug: string
  color: string
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────

const W = 150              // dial width
const H = 92               // dial height (slightly more than half W for label clearance)
const CX = W / 2
const CY = H - 14          // pivot near the bottom
const R_OUTER = 60         // tick-end radius
const R_ARC = 54           // colored arc radius
const R_TICK_IN = 50       // tick start radius
const R_NEEDLE = 50        // needle length

/** Map a value in [-1, +1] to an angle in radians on the semicircle.
 *  -1 → π (left), 0 → π/2 (top), +1 → 0 (right). */
function valToAngle(val: number): number {
  const clamped = Math.max(-1, Math.min(1, val))
  return Math.PI * (1 - (clamped + 1) / 2)
}

/** Polar → Cartesian on the dial (Y flipped for SVG). */
function polar(r: number, a: number): { x: number; y: number } {
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) }
}

/** SVG path for an arc from angle a1 to angle a2 at radius r. */
function arcPath(r: number, a1: number, a2: number): string {
  const p1 = polar(r, a1)
  const p2 = polar(r, a2)
  // Always small-arc (180° max), sweep direction depends on a1 vs a2
  const sweepFlag = a1 > a2 ? 1 : 0
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 ${sweepFlag} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
}

// ─── Single dial ──────────────────────────────────────────────────────────────

interface DialProps {
  value: number
  color: string
  leftLabel: string
  rightLabel: string
  /** Delay before the needle springs in, for the stagger between dials. */
  delay?: number
}

function Dial({ value, color, leftLabel, rightLabel, delay = 0 }: DialProps) {
  const TICKS = 21 // odd so there's a centre tick
  const needleAngle = valToAngle(value)
  const centreAngle = Math.PI / 2
  const needleEnd = polar(R_NEEDLE, needleAngle)

  return (
    <div className="flex flex-col items-end">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block", overflow: "visible" }}
        aria-label={`${leftLabel} to ${rightLabel} dial, value ${value.toFixed(2)}`}
      >
        {/* Background arc — full semicircle */}
        <path
          d={arcPath(R_ARC, Math.PI, 0)}
          fill="none"
          stroke="var(--border)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Active arc — from centre top to needle position, in party colour.
         *  Direction depends on which side of centre the needle sits. */}
        <motion.path
          d={arcPath(R_ARC, centreAngle, needleAngle)}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ ...springs.gentle, delay }}
        />

        {/* Tick marks */}
        {Array.from({ length: TICKS }).map((_, i) => {
          const t = i / (TICKS - 1)            // 0..1
          const a = Math.PI * (1 - t)           // π..0
          const inP = polar(R_TICK_IN, a)
          const outP = polar(R_OUTER, a)
          const isCentre = i === Math.floor(TICKS / 2)
          return (
            <line
              key={i}
              x1={inP.x}
              y1={inP.y}
              x2={outP.x}
              y2={outP.y}
              stroke={isCentre ? "var(--text-tertiary)" : "var(--border-strong)"}
              strokeWidth={isCentre ? 1.25 : 0.75}
              strokeLinecap="round"
            />
          )
        })}

        {/* Needle */}
        <motion.line
          x1={CX}
          y1={CY}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ ...springs.gentle, delay: delay + 0.05 }}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        />

        {/* Pivot */}
        <circle cx={CX} cy={CY} r={3.5} fill="var(--bg-base)" stroke={color} strokeWidth={1.5} />

        {/* Axis labels */}
        <text
          x={6}
          y={H - 2}
          fontSize={9}
          fill="var(--text-disabled)"
          fontFamily="var(--font-sans)"
          style={{ fontVariationSettings: fontWeights.medium }}
        >
          {leftLabel}
        </text>
        <text
          x={W - 6}
          y={H - 2}
          fontSize={9}
          fill="var(--text-disabled)"
          fontFamily="var(--font-sans)"
          textAnchor="end"
          style={{ fontVariationSettings: fontWeights.medium }}
        >
          {rightLabel}
        </text>
      </svg>
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export function PoliticalCompass({ slug, color }: PoliticalCompassProps) {
  const pos = PARTY_POSITIONS[slug]
  if (!pos) return null

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <Dial
        value={pos.x}
        color={color}
        leftLabel="Left"
        rightLabel="Right"
        delay={0.1}
      />
      <Dial
        value={pos.y}
        color={color}
        leftLabel="Socialist"
        rightLabel="Democratic"
        delay={0.2}
      />
      <span
        className="text-[10px] font-mono text-right leading-tight mt-0.5"
        style={{ color: "var(--text-tertiary)", maxWidth: W }}
      >
        {pos.label}
      </span>
    </div>
  )
}
