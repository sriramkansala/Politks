"use client"

// Dial-gauge political compass — speedometer style.
//
// Two semicircular dials:
//   • Top dial — Economic axis: Left ← centre → Right
//   • Lower dial — Social axis: Socialist ← centre → Democratic
//
// Visual reference is a Passed/Failed-Controls speedometer:
//   • thick (~12px) rounded arc with a subtle vertical gradient on the
//     inactive portion (lighter at the top, darker at the rim)
//   • short tick marks sitting just inside the inner edge of the arc
//   • bright party-colour active arc swept from 9 o'clock
//   • thick rounded-cap needle that ends well short of the arc
//   • tiny same-colour pivot dot, no chrome
//   • no labels inside the SVG — axis names sit as a small caption below

import { useEffect, useId } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
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

// ─── Geometry constants (tuned to reference) ──────────────────────────────────

const W = 220
const H = 132
const CX = W / 2
const CY = H - 14            // pivot 14px from bottom, label sits below
const R_ARC = 90             // arc centreline radius
const ARC_STROKE = 12
const R_TICK_OUT = R_ARC - (ARC_STROKE / 2) - 4   // 80 — just inside inner edge
const R_TICK_IN = R_TICK_OUT - 11                 // 69 — 11px tick length
const R_TICK_IN_CENTRE = R_TICK_OUT - 14          // centre tick reaches 3px further
const R_NEEDLE = R_ARC - ARC_STROKE - 12          // 66 — ends ~12px short of the arc inner edge
const TICKS = 29             // odd → centre tick at index 14
const TICK_STROKE = 1.25
const NEEDLE_STROKE = 4

// Map a value in [-1, +1] to an angle in radians on the semicircle.
// -1 → π (9 o'clock), 0 → π/2 (12 o'clock), +1 → 0 (3 o'clock).
function valToAngle(val: number): number {
  const clamped = Math.max(-1, Math.min(1, val))
  return Math.PI * (1 - (clamped + 1) / 2)
}

// Polar → Cartesian on the dial (SVG y flipped).
function polar(r: number, a: number): { x: number; y: number } {
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) }
}

// SVG arc path between two angles at radius r. Sweep direction is chosen so
// the path always travels the short way.
function arcPath(r: number, a1: number, a2: number): string {
  const p1 = polar(r, a1)
  const p2 = polar(r, a2)
  const sweepFlag = a1 > a2 ? 1 : 0
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 ${sweepFlag} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
}

// ─── Single dial ──────────────────────────────────────────────────────────────

interface DialProps {
  value: number
  color: string
  /** Stagger delay so the two dials don't fire at the exact same instant. */
  delay?: number
}

function Dial({ value, color, delay = 0 }: DialProps) {
  const needleAngle = valToAngle(value)
  const leftAngle = Math.PI

  // Live angle drives both the needle endpoint and (via pathLength) the
  // active arc fill. Starts at π (9 o'clock) and springs to the target,
  // so the needle traces the arc like a clock hand sweeping from 9 → 3.
  const angleMV = useMotionValue(leftAngle)
  const x2 = useTransform(angleMV, (a) => (CX + R_NEEDLE * Math.cos(a)).toFixed(2))
  const y2 = useTransform(angleMV, (a) => (CY - R_NEEDLE * Math.sin(a)).toFixed(2))

  useEffect(() => {
    const controls = animate(angleMV, needleAngle, { ...springs.gentle, delay: delay + 0.05 })
    return () => controls.stop()
  }, [needleAngle, delay, angleMV])

  const opacityMV = useMotionValue(0)
  useEffect(() => {
    const controls = animate(opacityMV, 1, { duration: 0.2, delay: delay + 0.05 })
    return () => controls.stop()
  }, [delay, opacityMV])

  // Unique gradient ID per dial so two stacked dials don't collide.
  const gradId = useId().replace(/:/g, "_")

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block", overflow: "visible" }}
      aria-label={`Dial value ${value.toFixed(2)}`}
    >
      <defs>
        <linearGradient id={`arcBg-${gradId}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"  stopColor="var(--border-strong)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--border)"        stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Background arc — full semicircle, gradient-filled */}
      <path
        d={arcPath(R_ARC, Math.PI, 0)}
        fill="none"
        stroke={`url(#arcBg-${gradId})`}
        strokeWidth={ARC_STROKE}
        strokeLinecap="round"
      />

      {/* Active arc — from 9 o'clock sweeping clockwise to the needle angle */}
      <motion.path
        d={arcPath(R_ARC, leftAngle, needleAngle)}
        fill="none"
        stroke={color}
        strokeWidth={ARC_STROKE}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...springs.gentle, delay }}
      />

      {/* Tick marks — inside the inner edge of the arc band */}
      {Array.from({ length: TICKS }).map((_, i) => {
        const t = i / (TICKS - 1)
        const a = Math.PI * (1 - t)
        const isCentre = i === Math.floor(TICKS / 2)
        const inP = polar(isCentre ? R_TICK_IN_CENTRE : R_TICK_IN, a)
        const outP = polar(R_TICK_OUT, a)
        return (
          <line
            key={i}
            x1={inP.x}
            y1={inP.y}
            x2={outP.x}
            y2={outP.y}
            stroke={isCentre ? "var(--text-tertiary)" : "var(--border-strong)"}
            strokeWidth={isCentre ? 1.5 : TICK_STROKE}
            strokeLinecap="round"
            opacity={isCentre ? 1 : 0.7}
          />
        )
      })}

      {/* Needle */}
      <motion.line
        x1={CX}
        y1={CY}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={NEEDLE_STROKE}
        strokeLinecap="round"
        style={{ opacity: opacityMV }}
      />

      {/* Pivot — small same-colour dot */}
      <circle cx={CX} cy={CY} r={3} fill={color} />
    </svg>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export function PoliticalCompass({ slug, color }: PoliticalCompassProps) {
  const pos = PARTY_POSITIONS[slug]
  if (!pos) return null

  return (
    <div className="flex flex-col items-end gap-3 shrink-0">
      <div className="flex flex-col items-end gap-1">
        <Dial value={pos.x} color={color} delay={0.1} />
        <span
          className="text-[10px] uppercase tracking-[0.1em] -mt-1"
          style={{ color: "var(--text-disabled)", fontVariationSettings: fontWeights.medium }}
        >
          Left ← → Right
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <Dial value={pos.y} color={color} delay={0.2} />
        <span
          className="text-[10px] uppercase tracking-[0.1em] -mt-1"
          style={{ color: "var(--text-disabled)", fontVariationSettings: fontWeights.medium }}
        >
          Socialist ← → Democratic
        </span>
      </div>

      <span
        className="text-[11px] font-mono text-right leading-tight"
        style={{ color: "var(--text-tertiary)", maxWidth: W }}
      >
        {pos.label}
      </span>
    </div>
  )
}
