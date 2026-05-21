// Indian-numbering formatters.
//
// formatIndianNumber(n)        → "80 crore", "3 crore", "1 lakh", "5,000"
// formatINR(rupees)            → "₹1 lakh", "₹4 crore", "₹1.5 crore"
// formatTarget(value, unit)    → "80 crore beneficiaries", "₹1 lakh/year",
//                                 "rank 3", "100 units", "6% of GDP"
//
// Convention used throughout the app: when a number is countable (people,
// houses, women, jobs, units), we Indianise it — lakh/crore are how Indian
// readers actually parse big counts. When it's small (≤999) we render as-is.
// Currency uses the same lakh/crore abbreviation prefixed with ₹.

export function formatIndianNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  const abs = Math.abs(n)
  if (abs >= 1_00_00_000) {
    // Crore (1 crore = 1,00,00,000 = 10 million)
    const c = n / 1_00_00_000
    return `${trim(c)} crore`
  }
  if (abs >= 1_00_000) {
    // Lakh (1 lakh = 1,00,000)
    const l = n / 1_00_000
    return `${trim(l)} lakh`
  }
  // < 1 lakh: Indian-style grouping ("99,999")
  return n.toLocaleString("en-IN")
}

/** Format Rupees with Indian abbreviation: "₹1.5 crore", "₹500", "₹4 lakh". */
export function formatINR(rupees: number | null | undefined): string {
  if (rupees == null || !Number.isFinite(rupees)) return "—"
  if (rupees === 0) return "₹0"
  const abs = Math.abs(rupees)
  if (abs >= 1_00_00_000) return `₹${trim(rupees / 1_00_00_000)} cr`
  if (abs >= 1_00_000) return `₹${trim(rupees / 1_00_000)} L`
  if (abs >= 1_000) return `₹${rupees.toLocaleString("en-IN")}`
  return `₹${rupees}`
}

/** Drop trailing zeros: 80.00 → "80", 1.50 → "1.5", 1.234 → "1.23". */
function trim(n: number): string {
  if (Number.isInteger(n)) return String(n)
  // Up to 2 decimals; strip trailing zeros
  return Number(n.toFixed(2)).toString()
}

/**
 * Format a promise/manifesto target metric in a human-readable Indian style.
 * Examples:
 *   {value: 800_000_000, unit: "people"}              → "80 crore people"
 *   {value: 30_000_000,  unit: "houses"}              → "3 crore houses"
 *   {value: 100_000,     unit: "INR/year"}            → "₹1 lakh/year"
 *   {value: 100_000,     unit: "INR/family/year"}     → "₹1 lakh/family/year"
 *   {value: 6,           unit: "percent of GDP"}      → "6% of GDP"
 *   {value: 3,           unit: "rank"}                → "rank 3"
 *   {value: 2025,        unit: "year"}                → "2025"
 *   {value: 700,         unit: "INR/day"}             → "₹700/day"
 */
export function formatTarget(
  value: number,
  unit: string,
  deadline_year?: number | null
): string {
  const u = unit.trim()
  const lower = u.toLowerCase()

  // Currency targets: any unit starting with "INR" or containing it
  if (/^inr\b/i.test(u) || /\binr\b/i.test(u)) {
    // Replace "INR" with ₹ + Indianised number; preserve the per-period suffix
    const period = u.replace(/^inr\s*\/?\s*/i, "").replace(/\binr\b\s*\/?\s*/i, "")
    const formatted = formatINR(value)
    const suffix = period ? `/${period}` : ""
    const result = formatted + suffix
    return deadline_year ? `${result} by ${deadline_year}` : result
  }

  // Percent
  if (/^percent|^%/i.test(u)) {
    const rest = u.replace(/^percent\s*/i, "").replace(/^%\s*/i, "")
    const suffix = rest ? ` ${rest}` : ""
    const v = `${trim(value)}%${suffix}`
    return deadline_year ? `${v} by ${deadline_year}` : v
  }

  // Rank
  if (/^rank/i.test(u)) {
    return deadline_year ? `rank ${value} by ${deadline_year}` : `rank ${value}`
  }

  // Year
  if (lower === "year") {
    return String(value)
  }

  // Default: countable noun
  // Special-case smaller units that read better without lakh/crore:
  // - "%", "ratio", "score" — already handled above
  // - Anything else: apply formatIndianNumber
  const numericPart = formatIndianNumber(value)
  const v = `${numericPart} ${u}`
  return deadline_year ? `${v} by ${deadline_year}` : v
}
