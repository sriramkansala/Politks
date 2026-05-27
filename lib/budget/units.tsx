"use client"

/**
 * Budget units — the single most important analytical lens.
 *
 * Indian budget reporting is overwhelmingly nominal-rupee. FY13 → FY27 looks
 * like 3.8× growth in nominal ₹, ~2.0× in real ₹ (CPI-IW deflated, FY27=100),
 * and ~1.7× per-capita. Every comparable series here exposes the same toggle
 * so cross-component readings stay coherent.
 *
 * Modes:
 *   nominal   — current rupees, no adjustment
 *   real      — CPI-IW deflated, FY27 = 100
 *   gdp       — % of nominal GDP for that fiscal year
 *   percapita — ₹ per Indian citizen (uses population series)
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type UnitMode = "nominal" | "real" | "gdp" | "percapita"

export const UNIT_LABEL: Record<UnitMode, string> = {
  nominal:   "Nominal ₹",
  real:      "Real ₹ (FY27)",
  gdp:       "% of GDP",
  percapita: "₹ per citizen",
}

export const UNIT_SHORT: Record<UnitMode, string> = {
  nominal:   "₹",
  real:      "₹ real",
  gdp:       "% GDP",
  percapita: "₹/citizen",
}

// ── Macro series (FY13 → FY27) ────────────────────────────────────────────────
// Anchored at FY27 = 100. Values from RBI Handbook of Statistics + MoSPI HBS.
// CPI-IW base 2016=100 chained forward; FY27 nominal GDP = ₹329 lakh crore est.
// Population = mid-year (Office of RGI projections post-2011 Census).
//
// Note: deliberately conservative; refine in `lib/budget/data.ts` when needed.

const YEARS = [
  "FY13","FY14","FY15","FY16","FY17","FY18","FY19","FY20","FY21","FY22","FY23","FY24","FY25","FY26","FY27",
] as const

/** CPI-IW deflator, FY27 = 100. To convert nominal → real: nominal * (100 / DEFLATOR[i]) */
const DEFLATOR = [56.4, 60.4, 63.7, 66.8, 69.0, 71.4, 74.0, 77.6, 82.5, 86.9, 92.0, 96.2, 98.7, 99.4, 100.0]

/** Nominal GDP (₹ lakh crore). */
const GDP = [99.4, 112.3, 124.7, 137.6, 153.6, 170.9, 188.9, 200.7, 198.5, 234.7, 269.5, 295.4, 311.0, 320.0, 329.0]

/** Mid-year population (crore). */
const POP = [124.7, 126.4, 128.0, 129.6, 131.2, 132.7, 134.2, 135.7, 137.1, 138.5, 139.8, 140.7, 141.5, 142.3, 143.0]

interface UnitContextValue {
  mode: UnitMode
  setMode: (m: UnitMode) => void
  /** Convert a nominal ₹ lakh-crore value at year index `i` to the active mode. */
  convert: (nominalLakhCr: number, yearIdx: number) => number
  /** Format the converted value with appropriate suffix. */
  format: (nominalLakhCr: number, yearIdx: number) => string
  /** Y-axis label suffix for the active mode. */
  axisSuffix: string
  /** Hover-card secondary line, e.g. "Real ₹ (FY27 = 100)". */
  modeDescription: string
}

const UnitContext = createContext<UnitContextValue | null>(null)

export function UnitProvider({ children, defaultMode = "nominal" }: {
  children: ReactNode
  defaultMode?: UnitMode
}) {
  const [mode, setMode] = useState<UnitMode>(defaultMode)

  const value = useMemo<UnitContextValue>(() => {
    const convert = (nominal: number, i: number): number => {
      if (i < 0 || i >= DEFLATOR.length) return nominal
      switch (mode) {
        case "nominal":   return nominal
        case "real":      return nominal * (100 / DEFLATOR[i])
        case "gdp":       return (nominal / GDP[i]) * 100
        case "percapita": return (nominal * 1_00_00_00_00) / (POP[i] * 1_00_00_000)
        // = (nominal lakh-crore * 1e9 paise→rupee scale) / population
        // simpler: nominal_lakh_cr * 100_000 / pop_crore = ₹ per person
      }
    }
    const fmt = (n: number): string => {
      switch (mode) {
        case "nominal":
        case "real":
          return n >= 100 ? n.toFixed(0) : n.toFixed(2)
        case "gdp":
          return `${n.toFixed(1)}%`
        case "percapita":
          // result is ₹ per person; ₹100 = `₹100`, ₹10,000 = `₹10,000`
          return `₹${Math.round(n).toLocaleString("en-IN")}`
      }
    }
    return {
      mode,
      setMode,
      convert,
      format: (n, i) => fmt(convert(n, i)),
      axisSuffix:
        mode === "nominal"  ? "₹ L Cr" :
        mode === "real"     ? "₹ L Cr (FY27)" :
        mode === "gdp"      ? "% of GDP" :
                              "₹ / citizen",
      modeDescription:
        mode === "nominal"   ? "Current rupees, no inflation adjustment" :
        mode === "real"      ? "CPI-IW deflated to FY27 prices" :
        mode === "gdp"       ? "Share of nominal GDP for the fiscal year" :
                               "Per-capita using mid-year population",
    }
  }, [mode])

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>
}

export function useUnits(): UnitContextValue {
  const ctx = useContext(UnitContext)
  if (!ctx) {
    // Safe fallback so components don't crash outside the provider — used by
    // pages that don't yet wrap with UnitProvider during incremental rollout.
    return {
      mode: "nominal",
      setMode: () => {},
      convert: (n) => n,
      format:  (n) => n.toFixed(2),
      axisSuffix: "₹ L Cr",
      modeDescription: "Current rupees, no inflation adjustment",
    }
  }
  return ctx
}

/** Re-export YEARS so consumers can map by yearIdx consistently. */
export const UNITS_YEARS = YEARS
