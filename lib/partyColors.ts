// Single source of truth for party colours used in UI accents (left borders,
// swatches, avatar rings, attendance bars). Maps every short_name / alias the
// app uses to the canonical color_hex from STATIC_PARTIES.
//
// Falls back to `--accent` (Linear's #5e6ad2) for unknown parties so the
// design stays coherent even when data is incomplete.

import { STATIC_PARTIES } from "./db/staticData"

/** Build short_name → color_hex map. */
const _byShort: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const p of STATIC_PARTIES) {
    if (p.short_name) m[p.short_name.toUpperCase()] = p.color_hex
    if (p.slug) m[p.slug.toUpperCase()] = p.color_hex
  }
  return m
})()

/** Common aliases / synonymous short codes used in MP records. */
const _aliases: Record<string, string> = {
  TMC:    "#00B5A8",   // All India Trinamool Congress (AITC)
  AITC:   "#00B5A8",
  "SS(UBT)":   "#FF6B5C",  // Shiv Sena (UBT)
  SHS:    "#FF6B5C",
  "SS(UBT)/SHIVSENA": "#FF6B5C",
  SHIVSENA: "#FF6B5C",
  NCP:    "#0B7CCA",    // Sharadchandra Pawar
  "NCP(SP)": "#0B7CCA",
  SP:     "#E60028",    // Samajwadi Party
  YSRCP:  "#1A8C36",
  AIMIM:  "#1D7349",
  TDP:    "#FFD500",    // Telugu Desam Party (yellow)
  AAP:    "#0166B8",
  RJD:    "#0B6E51",
  JD:     "#0B6E51",
  "JD(U)":   "#0F4A4D",
  "JD(S)":   "#118A47",
  CPM:    "#D7351E",
  "CPI(M)":  "#D7351E",
  CPI:    "#D7351E",
  BSP:    "#22409A",
  INC:    "#19AAED",
  BJP:    "#FF6B00",
  DMK:    "#E60028",
  OTHER:  "#5e6ad2",
  IND:    "#5e6ad2",
  I:      "#5e6ad2",
}

/** Get the party color for a given short code, alias, or slug. */
export function partyColor(shortOrSlug: string | null | undefined): string {
  if (!shortOrSlug) return "#5e6ad2"
  const k = shortOrSlug.toUpperCase().trim()
  return _byShort[k] ?? _aliases[k] ?? "#5e6ad2"
}

/** Convert a hex colour to an `rgba()` string with alpha. */
export function hexAlpha(hex: string, alpha: number): string {
  const c = hex.replace("#", "")
  if (c.length !== 6) return hex
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
