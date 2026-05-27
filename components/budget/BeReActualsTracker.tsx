"use client"

/**
 * Neo Nīti Budget — Under-execution Tracker (v2 · Forensic Ledger)
 *
 * REDESIGN RATIONALE (4-iteration critique loop):
 *
 * v1 card-grid failures identified:
 *   — Vertical grouped bars make cross-card comparison impossible
 *   — Delta % buried at card bottom; should be the primary signal
 *   — 2-column grid = only 4 cards visible before scroll
 *   — No priority sort; flagged ₹22,000 Cr JJM cut = same visual weight
 *     as clean ₹300 Cr PM-KISAN variation
 *
 * v2 "Accountability Ledger" pattern (matches CAG annual report layout):
 *   — Dense sortable list: flagged schemes first, clean below
 *   — Horizontal execution track (per-row normalized): BE as ghost,
 *     RE as colored fill, Actuals as tick marker
 *   — Absolute ₹ cut amount is the hero on flagged rows
 *   — Expandable inline forensic notes (no tooltip, no modal)
 *   — Summary banner: total ₹ at risk + worst single cut
 *
 * References: Stripe payments list · Linear issue list · Sentry grouped list
 *   Vercel deployments · Bloomberg Government BE/RE/Actuals table · CAG India
 */

import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { AlertTriangle, ChevronRight, Info, TrendingDown, TrendingUp } from "lucide-react"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { SCHEME_ESTIMATES, type SchemeEstimate } from "@/lib/budget/data"

const FY_OPTIONS = ["2025-26", "2024-25"] as const
type FY = typeof FY_OPTIONS[number]

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtRs(v: number): string {
  if (v >= 1) return `₹${v.toFixed(2)} L Cr`
  // sub-lakh-crore: convert to crore for readability
  // 0.67 L Cr = 67,000 Cr → show as ₹67K Cr
  const crore = v * 100000
  if (crore >= 1000) return `₹${Math.round(crore / 1000)}K Cr`
  return `₹${Math.round(crore)} Cr`
}

function fmtCut(be: number, re: number): string {
  const crore = Math.abs((re - be) * 100000)
  if (crore >= 100000) return `₹${(crore / 100000).toFixed(2)} L Cr`
  if (crore >= 1000)   return `₹${Math.round(crore / 1000)}K Cr`
  return `₹${Math.round(crore)} Cr`
}

function fmtPct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`
}

// ── Execution Track ───────────────────────────────────────────────────────────
// Individual normalization: each row's full width = BE.
// RE fills proportionally; if RE > BE, bar fills 100% + overflow dot.
// Actuals shown as a 2px tall vertical tick.
// This approach (per Plausible Analytics) gives each scheme equal visual
// range regardless of absolute ₹ size — absolute values are in the columns.

function ExecutionTrack({ s }: { s: SchemeEstimate }) {
  const rePct     = Math.min((s.re / s.be) * 100, 110) // cap overflow at 110%
  const acPct     = s.actuals ? Math.min((s.actuals / s.be) * 100, 110) : null
  const isCut     = s.re < s.be * 0.998
  const isUp      = s.re > s.be * 1.002
  const isOverflow = s.re > s.be

  const reColor = isCut
    ? "var(--status-broken)"
    : isUp
    ? "var(--status-kept)"
    : "var(--border-stronger)"

  return (
    <div
      style={{
        position: "relative",
        height: 14,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Track container — full width = BE */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 5,
          background: "var(--bg-elevated-3)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* BE ghost — always 100% */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--border)",
            borderRadius: 3,
          }}
        />

        {/* RE fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(rePct, 100)}%` }}
          transition={{ ...springs.gentle, delay: 0.06 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            background: reColor,
            borderRadius: 3,
          }}
        />

        {/* Actuals tick */}
        {acPct !== null && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ ...springs.snap, delay: 0.4 }}
            style={{
              position: "absolute",
              left: `${Math.min(acPct, 99)}%`,
              top: -2,
              bottom: -2,
              width: 2,
              background: "var(--text-primary)",
              borderRadius: 1,
              transformOrigin: "center",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </div>

      {/* Overflow indicator — when RE > BE */}
      {isOverflow && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...springs.snap, delay: 0.25 }}
          style={{
            marginLeft: 5,
            flexShrink: 0,
          }}
        >
          <TrendingUp size={9} strokeWidth={2.5} style={{ color: "var(--status-kept)" }} />
        </motion.div>
      )}
    </div>
  )
}

// ── Delta badge ───────────────────────────────────────────────────────────────

function DeltaBadge({ pct, size = "sm" }: { pct: number; size?: "sm" | "xs" }) {
  const isNeg = pct < 0
  const color  = isNeg ? "var(--status-broken)" : "var(--status-kept)"
  const fz     = size === "xs" ? 9.5 : 11

  return (
    <span
      className="inline-flex items-center tabular-nums"
      style={{
        gap: 2,
        fontSize: fz,
        color,
        fontVariationSettings: fontWeights.semibold,
        letterSpacing: "0.01em",
      }}
    >
      {isNeg
        ? <TrendingDown size={size === "xs" ? 8 : 9} strokeWidth={2.5} />
        : <TrendingUp   size={size === "xs" ? 8 : 9} strokeWidth={2.5} />
      }
      {fmtPct(pct)}
    </span>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionLabel({
  label, count, variant,
}: {
  label: string
  count: number
  variant: "flag" | "clean-cut" | "clean-up" | "neutral"
}) {
  const colors: Record<typeof variant, { bg: string; text: string; dot: string }> = {
    flag:      { bg: "color-mix(in srgb, var(--status-broken) 7%, var(--bg-elevated-2))",  text: "var(--status-broken)",  dot: "var(--status-broken)"  },
    "clean-cut":{ bg: "var(--bg-elevated-2)", text: "var(--text-tertiary)", dot: "var(--border-stronger)" },
    "clean-up": { bg: "color-mix(in srgb, var(--status-kept) 5%, var(--bg-elevated-2))",   text: "var(--status-kept)",    dot: "var(--status-kept)"    },
    neutral:    { bg: "var(--bg-elevated-2)", text: "var(--text-tertiary)", dot: "var(--border-stronger)" },
  }
  const c = colors[variant]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 12px 5px",
        background: c.bg,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 9.5,
          letterSpacing: "0.1em",
          color: c.text,
          fontVariationSettings: fontWeights.semibold,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize: 9.5,
          color: "var(--text-disabled)",
          fontVariationSettings: fontWeights.normal,
          marginLeft: 2,
        }}
      >
        {count}
      </span>
    </div>
  )
}

// ── Scheme Row ────────────────────────────────────────────────────────────────
// Layout (inspired by Stripe amount-as-hero + Linear row density):
//
//   ▶  Scheme Name                        BE     RE            Actuals       [Cut badge]
//      Ministry · Category  [track bar]
//
// Click on flagged rows → expands forensic note with 2px left accent border.

function SchemeRow({
  s, idx, isLast,
}: { s: SchemeEstimate; idx: number; isLast: boolean }) {
  const [open, setOpen] = useState(false)

  const isFlagged = s.forensicFlag
  const isCut     = s.re < s.be
  const isUp      = s.re > s.be
  const reColor   = isCut ? "var(--status-broken)" : isUp ? "var(--status-kept)" : "var(--text-tertiary)"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ ...springs.gentle, delay: 0.025 * idx }}
      layout="position"
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--border)",
      }}
    >
      {/* Main row button */}
      <div
        role={isFlagged ? "button" : undefined}
        tabIndex={isFlagged ? 0 : undefined}
        onClick={() => isFlagged && setOpen(o => !o)}
        onKeyDown={e => isFlagged && e.key === "Enter" && setOpen(o => !o)}
        className="group"
        style={{
          display: "grid",
          // Left (scheme info) + Right (numbers)
          gridTemplateColumns: "1fr auto",
          columnGap: 16,
          alignItems: "center",
          padding: "9px 12px 8px",
          cursor: isFlagged ? "pointer" : "default",
          transition: "background 100ms ease-out",
          background: open
            ? "color-mix(in srgb, var(--status-broken) 4%, var(--bg-elevated))"
            : "var(--bg-elevated)",
        }}
      >
        {/* ── Left: name + bar ──────────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>
          {/* Name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}
          >
            {isFlagged && (
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={springs.responsive}
                style={{ flexShrink: 0, display: "flex" }}
              >
                <ChevronRight
                  size={11}
                  strokeWidth={2.5}
                  style={{ color: "var(--status-broken)" }}
                />
              </motion.span>
            )}

            <span
              className="truncate"
              style={{
                fontSize: 13,
                lineHeight: 1.35,
                color: "var(--text-primary)",
                fontVariationSettings: isFlagged
                  ? fontWeights.semibold
                  : fontWeights.medium,
                letterSpacing: "-0.005em",
              }}
            >
              {s.scheme}
            </span>

            {isFlagged && (
              <AlertTriangle
                size={10}
                strokeWidth={2.5}
                style={{ color: "var(--status-broken)", flexShrink: 0 }}
              />
            )}
          </div>

          {/* Metadata + track */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingLeft: isFlagged ? 17 : 0,
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                color: "var(--text-disabled)",
                fontVariationSettings: fontWeights.normal,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s.ministry}
            </span>
            <div style={{ flex: 1, minWidth: 60 }}>
              <ExecutionTrack s={s} />
            </div>
          </div>
        </div>

        {/* ── Right: numeric columns ────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          {/* BE */}
          <div
            style={{
              width: 76,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "var(--text-disabled)",
                fontVariationSettings: fontWeights.semibold,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              BE
            </span>
            <span
              className="tabular-nums"
              style={{
                fontSize: 12,
                color: "var(--text-tertiary)",
                fontVariationSettings: fontWeights.normal,
              }}
            >
              {fmtRs(s.be)}
            </span>
          </div>

          {/* RE + delta */}
          <div
            style={{
              width: 96,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "var(--text-disabled)",
                fontVariationSettings: fontWeights.semibold,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              RE
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span
                className="tabular-nums"
                style={{
                  fontSize: 13,
                  color: reColor,
                  fontVariationSettings: fontWeights.semibold,
                }}
              >
                {fmtRs(s.re)}
              </span>
            </div>
            <DeltaBadge pct={s.reVsBePct} size="xs" />
          </div>

          {/* Actuals */}
          <div
            style={{
              width: 88,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "var(--text-disabled)",
                fontVariationSettings: fontWeights.semibold,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              Actuals
            </span>
            {s.actuals !== null ? (
              <>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    fontVariationSettings: fontWeights.normal,
                  }}
                >
                  {fmtRs(s.actuals)}
                </span>
                {s.actualsVsRePct !== null && (
                  <DeltaBadge pct={s.actualsVsRePct} size="xs" />
                )}
              </>
            ) : (
              <span
                style={{
                  fontSize: 10.5,
                  color: "var(--text-disabled)",
                  fontVariationSettings: fontWeights.normal,
                  fontStyle: "italic",
                  marginTop: 2,
                }}
              >
                pending
              </span>
            )}
          </div>

          {/* Cut badge — flagged rows only. Absolute ₹ is the hero. */}
          <div style={{ width: 80, display: "flex", justifyContent: "flex-end" }}>
            {isFlagged && isCut ? (
              <div
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: "color-mix(in srgb, var(--status-broken) 11%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--status-broken) 22%, transparent)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 8.5,
                    color: "var(--status-broken)",
                    fontVariationSettings: fontWeights.semibold,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Cut
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 11.5,
                    color: "var(--status-broken)",
                    fontVariationSettings: fontWeights.bold,
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {fmtCut(s.be, s.re)}
                </span>
              </div>
            ) : (
              <div style={{ width: 80 }} /> /* spacer to keep alignment */
            )}
          </div>
        </div>
      </div>

      {/* ── Forensic note expansion ──────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {open && isFlagged && s.forensicNote && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ...springs.gentle, duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                margin: "0 12px 10px 29px",
                borderLeft: "2px solid color-mix(in srgb, var(--status-broken) 40%, transparent)",
                paddingLeft: 11,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  fontVariationSettings: fontWeights.normal,
                  letterSpacing: "var(--tracking-body)",
                }}
              >
                {s.forensicNote}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────

function TrackLegend() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {[
        { swatch: { w: 18, h: 4, bg: "var(--border)", radius: 2 },    label: "BE (budget estimate)" },
        { swatch: { w: 18, h: 4, bg: "var(--status-broken)", radius: 2 }, label: "RE — cut" },
        { swatch: { w: 18, h: 4, bg: "var(--status-kept)", radius: 2 },   label: "RE — increase" },
        { swatch: { w: 2,  h: 10, bg: "var(--text-primary)", radius: 1 }, label: "Actuals (CAG)" },
      ].map(({ swatch, label }) => (
        <span key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            aria-hidden
            style={{
              width: swatch.w,
              height: swatch.h,
              background: swatch.bg,
              borderRadius: swatch.radius,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10.5,
              color: "var(--text-disabled)",
              fontVariationSettings: fontWeights.normal,
            }}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function BeReActualsTracker() {
  const [fy, setFy] = useState<FY>("2025-26")

  const schemes = SCHEME_ESTIMATES.filter(s => s.fy === fy)

  // Sort: flagged first (sorted by severity of cut desc), then clean
  const flagged = schemes
    .filter(s => s.forensicFlag)
    .sort((a, b) => a.reVsBePct - b.reVsBePct) // most cut first (most negative first)

  const cleanUp = schemes.filter(s => !s.forensicFlag && s.reVsBePct > 0)
  const cleanOk = schemes.filter(s => !s.forensicFlag && s.reVsBePct <= 0)

  // Summary stats
  const totalCutLCr = flagged.reduce((acc, s) => acc + Math.max(0, s.be - s.re), 0)
  const worstCut    = flagged[0] // sorted: worst first
  const totalCutStr = totalCutLCr >= 1
    ? `₹${totalCutLCr.toFixed(2)} L Cr`
    : `₹${Math.round(totalCutLCr * 100000)} Cr`

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Top bar: summary + FY toggle ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Summary copy */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {flagged.length > 0 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 5,
                background: "color-mix(in srgb, var(--status-broken) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--status-broken) 18%, transparent)",
              }}
            >
              <AlertTriangle
                size={11}
                strokeWidth={2.5}
                style={{ color: "var(--status-broken)" }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--status-broken)",
                  fontVariationSettings: fontWeights.semibold,
                }}
              >
                {flagged.length} forensic signal{flagged.length !== 1 ? "s" : ""}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  fontVariationSettings: fontWeights.normal,
                }}
              >
                · {totalCutStr} in RE cuts
              </span>
            </span>
          )}
          {worstCut && (
            <span
              style={{
                fontSize: 11.5,
                color: "var(--text-tertiary)",
                fontVariationSettings: fontWeights.normal,
              }}
            >
              Worst:{" "}
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontVariationSettings: fontWeights.medium,
                }}
              >
                {worstCut.scheme}
              </span>{" "}
              {fmtPct(worstCut.reVsBePct)}
            </span>
          )}
        </div>

        {/* FY toggle */}
        <LayoutGroup id="fy-toggle-v2">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 8,
              padding: "2px",
              background: "var(--bg-elevated-2)",
              border: "1px solid var(--border)",
              gap: 2,
            }}
          >
            {FY_OPTIONS.map(y => (
              <button
                key={y}
                onClick={() => setFy(y)}
                style={{
                  position: "relative",
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: fy === y ? "var(--text-primary)" : "var(--text-tertiary)",
                  fontVariationSettings: fy === y
                    ? fontWeights.semibold
                    : fontWeights.normal,
                  outline: "none",
                }}
              >
                {fy === y && (
                  <motion.div
                    layoutId="fy-active-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 6,
                      background: "var(--bg-elevated-3)",
                    }}
                    transition={springs.responsive}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>FY {y}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* ── Column headers ───────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          columnGap: 16,
          padding: "4px 12px",
          background: "var(--bg-elevated-2)",
          borderRadius: "6px 6px 0 0",
          border: "1px solid var(--border)",
          borderBottom: "none",
        }}
      >
        <span
          style={{
            fontSize: 9.5,
            color: "var(--text-disabled)",
            fontVariationSettings: fontWeights.semibold,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Scheme
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[
            { label: "BE", w: 76 },
            { label: "RE · Δ", w: 96 },
            { label: "Actuals · Δ", w: 88 },
            { label: "Cut", w: 80 },
          ].map(col => (
            <div
              key={col.label}
              style={{
                width: col.w,
                textAlign: "right",
                fontSize: 9.5,
                color: "var(--text-disabled)",
                fontVariationSettings: fontWeights.semibold,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {col.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── The ledger ───────────────────────────────────────────────── */}
      <div
        style={{
          borderRadius: "0 0 6px 6px",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          overflow: "hidden",
          marginTop: -1, // connect to header
        }}
      >
        <AnimatePresence mode="popLayout">

          {/* FORENSIC SIGNALS */}
          {flagged.length > 0 && (
            <motion.div key={`flagged-${fy}`} layout="position">
              <SectionLabel
                label="Forensic Signals"
                count={flagged.length}
                variant="flag"
              />
              {flagged.map((s, i) => (
                <SchemeRow
                  key={`${fy}-flag-${s.scheme}`}
                  s={s}
                  idx={i}
                  isLast={i === flagged.length - 1 && cleanUp.length === 0 && cleanOk.length === 0}
                />
              ))}
            </motion.div>
          )}

          {/* OVER-EXECUTING (e.g., MGNREGA demand-driven surge) */}
          {cleanUp.length > 0 && (
            <motion.div key={`up-${fy}`} layout="position">
              <SectionLabel
                label="Over-executing"
                count={cleanUp.length}
                variant="clean-up"
              />
              {cleanUp.map((s, i) => (
                <SchemeRow
                  key={`${fy}-up-${s.scheme}`}
                  s={s}
                  idx={flagged.length + i}
                  isLast={i === cleanUp.length - 1 && cleanOk.length === 0}
                />
              ))}
            </motion.div>
          )}

          {/* WITHIN TOLERANCE */}
          {cleanOk.length > 0 && (
            <motion.div key={`ok-${fy}`} layout="position">
              <SectionLabel
                label="Within Tolerance"
                count={cleanOk.length}
                variant="neutral"
              />
              {cleanOk.map((s, i) => (
                <SchemeRow
                  key={`${fy}-ok-${s.scheme}`}
                  s={s}
                  idx={flagged.length + cleanUp.length + i}
                  isLast={i === cleanOk.length - 1}
                />
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Legend + methodology ─────────────────────────────────────── */}
      <TrackLegend />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          fontSize: 11,
          lineHeight: 1.55,
          color: "var(--text-disabled)",
        }}
      >
        <Info size={11} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          BE = Budget Estimate (Feb speech). RE = Revised Estimate (following February).
          Actuals = CAG-audited figures (~12–18 months post year-end).
          Forensic flag triggers when RE ≤ 80% of BE. Values in ₹ lakh crore (1 L Cr = ₹1 trillion).
          Click any flagged row to expand the forensic note.
          Sources: indiabudget.gov.in · CGA Monthly Accounts · CAG Finance Accounts · PRS Budget Analysis.
        </span>
      </div>
    </div>
  )
}
