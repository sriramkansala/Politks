"use client"

// Diverging-bar political compass.
//
// Two horizontal tracks, one per axis (Economic, Social). From the centre
// tick a coloured bar grows toward the party's lean — length encodes
// magnitude, direction encodes side. No implied "more is better"; the
// centre is the meaningful reference and both poles are equally far from
// neutral.

import { motion } from "framer-motion"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"

// x: -1 = Left, +1 = Right
// y: -1 = Socialist, +1 = Democratic
export const PARTY_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  bjp:  { x:  0.60, y: -0.35, label: "Right · Nationalist" },
  inc:  { x: -0.18, y:  0.30, label: "Centre-Left · Liberal" },
  aap:  { x: -0.28, y:  0.55, label: "Centre-Left · Democratic" },
  dmk:  { x: -0.52, y:  0.20, label: "Left · Democratic Socialist" },
}

/** Look up the human-readable lean label ("Centre-Left · Liberal") for a
 *  party slug. Returns null if we don't have a position recorded yet. */
export function getPartyLean(slug: string): string | null {
  return PARTY_POSITIONS[slug]?.label ?? null
}

interface PoliticalCompassProps {
  slug: string
  color: string
}

// ─── Single axis row ──────────────────────────────────────────────────────────

const TRACK_W = 160
const TRACK_H = 6
const TICK_H = 14
const NEAR_CENTRE = 0.05 // |value| below this counts as centre

interface AxisProps {
  value: number
  leftLabel: string
  rightLabel: string
  color: string
  delay?: number
}

function Axis({ value, leftLabel, rightLabel, color, delay = 0 }: AxisProps) {
  const v = Math.max(-1, Math.min(1, value))
  const isLeft = v < 0
  const magnitude = Math.abs(v)
  const isCentre = magnitude < NEAR_CENTRE

  // Bar geometry: half-track = TRACK_W / 2, starts at centre, extends
  // outward by magnitude × half-track.
  const halfPct = 50 * magnitude
  const left = isLeft ? `${50 - halfPct}%` : "50%"
  const width = `${halfPct}%`

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[9px] uppercase tracking-[0.08em] text-right shrink-0"
        style={{
          width: 62,
          color: isLeft && !isCentre ? "var(--text-primary)" : "var(--text-disabled)",
          fontVariationSettings: isLeft && !isCentre ? fontWeights.semibold : fontWeights.medium,
        }}
      >
        {leftLabel}
      </span>

      <div
        className="relative rounded-full"
        style={{
          width: TRACK_W,
          height: TRACK_H,
          background: "var(--bg-elevated-2)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Centre tick — emphasises the meaningful zero */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2"
          style={{
            width: 2,
            height: TICK_H,
            marginLeft: -1,
            marginTop: -TICK_H / 2,
            background: "var(--text-tertiary)",
            borderRadius: 1,
            opacity: 0.65,
          }}
        />

        {/* Value bar — animates out from centre in the lean direction */}
        {!isCentre && (
          <motion.div
            className="absolute top-0 bottom-0 rounded-full"
            style={{
              left,
              width,
              background: color,
              transformOrigin: isLeft ? "right center" : "left center",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ ...springs.gentle, delay }}
          />
        )}
      </div>

      <span
        className="text-[9px] uppercase tracking-[0.08em] shrink-0"
        style={{
          width: 76,
          color: !isLeft && !isCentre ? "var(--text-primary)" : "var(--text-disabled)",
          fontVariationSettings: !isLeft && !isCentre ? fontWeights.semibold : fontWeights.medium,
        }}
      >
        {rightLabel}
      </span>
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export function PoliticalCompass({ slug, color }: PoliticalCompassProps) {
  const pos = PARTY_POSITIONS[slug]
  if (!pos) return null

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <Axis value={pos.x} leftLabel="Left"      rightLabel="Right"      color={color} delay={0.1} />
      <Axis value={pos.y} leftLabel="Socialist" rightLabel="Democratic" color={color} delay={0.18} />
    </div>
  )
}
