// Visual hierarchical org chart for a party leadership snapshot.
// Pill-card nodes with avatar initials + name, connected by dashed lines.
// Server-renderable (no client JS) — uses CSS-only tree layout.
//
// Layout: each level is a horizontal flex row. A dashed "bus" line runs across
// the row (drawn via the level container's ::before equivalent — a real div so
// it server-renders), with vertical dashed drops to each node.
//
// Data: receives a flat list of roles with a `level` (0..N). Roles at the same
// level render side-by-side; the chart auto-wraps if a level has too many.
//
// Avatar: initials of the holder's name on a tinted circle keyed to the
// party color (passed in by parent).

import type { PartyOrgSnapshot } from "@/lib/db/partyProfile"
import { fontWeights } from "@/lib/font-weight"

interface Props {
  snap: PartyOrgSnapshot
  partyColor: string
}

function initialsOf(name: string): string {
  // "Narendra Modi" → "NM"; "J.P. Nadda" → "JN"; "B.L. Santhosh" → "BS"
  const parts = name.replace(/[.()]/g, " ").split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Node({
  role,
  holder,
  scope,
  color,
}: {
  role: string
  holder: string
  scope?: string
  color: string
}) {
  return (
    <div
      className="org-node"
      style={{
        // Pill card — white-ish elevated surface, full rounding, hairline border.
        background: "var(--bg-elevated-2)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        padding: "6px 14px 6px 6px",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 1px 0 rgba(0,0,0,0.25)",
        maxWidth: 240,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Avatar circle with initials */}
      <span
        className="org-node__avatar"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `color-mix(in oklab, ${color} 35%, var(--bg-elevated))`,
          color: "var(--text-primary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          letterSpacing: "0.02em",
          fontVariationSettings: fontWeights.semibold,
          flexShrink: 0,
        }}
        aria-hidden
      >
        {initialsOf(holder)}
      </span>
      <span className="org-node__text flex flex-col min-w-0">
        <span
          className="text-[13px] leading-tight truncate"
          style={{
            color: "var(--text-primary)",
            fontVariationSettings: fontWeights.semibold,
            letterSpacing: "-0.005em",
          }}
        >
          {holder}
        </span>
        <span
          className="text-[10px] leading-tight truncate"
          style={{
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.medium,
          }}
        >
          {role}
          {scope ? ` · ${scope}` : ""}
        </span>
      </span>
    </div>
  )
}

export function PartyOrgChart({ snap, partyColor }: Props) {
  // Group roles by their level (0 = top, increasing downward).
  const byLevel: Record<number, PartyOrgSnapshot["roles"]> = {}
  for (const r of snap.roles) {
    const lvl = r.level ?? 0
    ;(byLevel[lvl] ??= []).push(r)
  }
  const levels = Object.keys(byLevel)
    .map((k) => Number(k))
    .sort((a, b) => a - b)

  return (
    <div
      className="org-chart"
      style={{
        // Canvas — slightly elevated panel, lots of breathing room.
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        padding: "32px 24px 40px",
        overflowX: "auto",
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{ minWidth: "fit-content", gap: 0 }}
      >
        {levels.map((lvl, levelIdx) => {
          const rolesAtLevel = byLevel[lvl]
          const isFirst = levelIdx === 0
          // Geometry: SPINE (16px vertical from above) → RAKE (horizontal,
          // spans sibling centres, sits at top:16) → DROP (16px vertical
          // from rake into each node). Half the flex gap (16/2 = 8px) is
          // used as negative offset so adjacent rake halves meet exactly
          // at the gap midpoint between siblings.
          const SPINE = 16
          const DROP = 16
          const HALF_GAP = 8
          return (
            <div
              key={lvl}
              className="org-chart__level"
              style={{
                position: "relative",
                paddingTop: isFirst ? 0 : SPINE + DROP,
                paddingBottom: 4,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexWrap: "nowrap",
                gap: 16,
                width: "100%",
              }}
            >
              {/* Spine — single vertical drop from the level above into the rake. */}
              {!isFirst && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    height: SPINE,
                    borderLeft: "1px solid var(--text-tertiary)",
                    pointerEvents: "none",
                  }}
                />
              )}
              {rolesAtLevel.map((r, i, arr) => {
                const isFirstInRow = i === 0
                const isLastInRow = i === arr.length - 1
                return (
                  <div
                    key={`${r.role}-${r.holder}-${i}`}
                    style={{
                      position: "relative",
                      // Reserve space for SPINE + DROP above this node.
                      paddingTop: isFirst ? 0 : 0,
                    }}
                  >
                    {!isFirst && (
                      <>
                        {/* Drop — short vertical line from rake into this node. */}
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            top: -DROP,
                            left: "50%",
                            height: DROP,
                            borderLeft: "1px solid var(--text-tertiary)",
                            pointerEvents: "none",
                          }}
                        />
                        {/* Rake-left half — from this node's centre extending
                            left to the gap midpoint with the previous sibling.
                            Suppressed on the first sibling so the rake starts
                            exactly at the first node's centre. */}
                        {!isFirstInRow && (
                          <span
                            aria-hidden
                            style={{
                              position: "absolute",
                              top: -DROP,
                              right: "50%",
                              left: -HALF_GAP,
                              borderTop: "1px solid var(--text-tertiary)",
                              pointerEvents: "none",
                            }}
                          />
                        )}
                        {/* Rake-right half — extends to the gap midpoint with
                            the next sibling. Suppressed on the last sibling. */}
                        {!isLastInRow && (
                          <span
                            aria-hidden
                            style={{
                              position: "absolute",
                              top: -DROP,
                              left: "50%",
                              right: -HALF_GAP,
                              borderTop: "1px solid var(--text-tertiary)",
                              pointerEvents: "none",
                            }}
                          />
                        )}
                      </>
                    )}
                    <Node
                      role={r.role}
                      holder={r.holder}
                      scope={r.scope}
                      color={partyColor}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
