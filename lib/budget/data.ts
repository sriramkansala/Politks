/**
 * Neo Nīti — Union Budget data layer (Wave 1 seed)
 *
 * Sources:
 *   indiabudget.gov.in Budget at a Glance 2026-27
 *   PRS Union Budget 2026-27 Analysis
 *   CGA Monthly Accounts FY 2025-26
 *   16th Finance Commission Report (tabled 1 Feb 2026) — PRS summary
 *
 * All monetary values in ₹ lakh crore (1 lakh crore = 1 trillion INR).
 */

// ── Fiscal year labels ────────────────────────────────────────────────────────
export const FISCAL_YEARS = [
  "2017-18", "2018-19", "2019-20", "2020-21", "2021-22",
  "2022-23", "2023-24", "2024-25", "2025-26", "2026-27",
] as const
export type FiscalYear = typeof FISCAL_YEARS[number]
export type EstimateType = "BE" | "RE" | "Actuals"

// ── Sankey types ──────────────────────────────────────────────────────────────
export interface SankeyNode {
  id: string
  label: string
  value: number
  column: 0 | 1 | 2      // 0 = sources, 1 = pool, 2 = uses
  category:
    | "borrowing"
    | "tax_direct"
    | "tax_indirect"
    | "non_tax"
    | "transfer"
    | "centre"
    | "obligatory"
    | "scheme"
    | "other"
  note?: string
  children?: SankeyNode[]
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface SankeyData {
  fy: FiscalYear
  estimate: EstimateType
  totalExpenditure: number
  fiscalDeficitPct: number
  gdpEstimate: number
  nodes: SankeyNode[]
  links: SankeyLink[]
  source: string
}

// ── FY 2026-27 BE ─────────────────────────────────────────────────────────────
export const SANKEY_2026_27_BE: SankeyData = {
  fy: "2026-27",
  estimate: "BE",
  totalExpenditure: 53.47,
  fiscalDeficitPct: 4.3,
  gdpEstimate: 330,
  source: "Budget at a Glance 2026-27 · indiabudget.gov.in",
  nodes: [
    // Column 0 — Revenue Sources
    { id: "src-borrowing", label: "Borrowings & Liabilities", value: 14.44, column: 0, category: "borrowing", note: "Fiscal deficit financed via dated securities, small savings, etc." },
    { id: "src-pit",       label: "Income Tax",               value: 11.76, column: 0, category: "tax_direct" },
    { id: "src-gst",       label: "GST & Indirect Taxes",     value:  9.62, column: 0, category: "tax_indirect" },
    { id: "src-cit",       label: "Corporation Tax",          value:  9.09, column: 0, category: "tax_direct" },
    { id: "src-nontax",    label: "Non-Tax Receipts",         value:  4.81, column: 0, category: "non_tax",    note: "RBI dividend, PSU dividends, spectrum" },
    { id: "src-excise",    label: "Union Excise Duties",      value:  2.67, column: 0, category: "tax_indirect" },
    { id: "src-customs",   label: "Customs",                  value:  1.07, column: 0, category: "tax_indirect" },
    { id: "src-capital",   label: "Non-Debt Capital",         value:  0.53, column: 0, category: "non_tax",    note: "Disinvestment + asset monetisation" },
    // Column 1 — Centre's Pool
    { id: "pool-states",   label: "States' Devolution Pool",  value: 14.12, column: 1, category: "transfer",   note: "41% of net divisible pool per 16th Finance Commission" },
    { id: "pool-centre",   label: "Centre's Net Pool",        value: 39.35, column: 1, category: "centre",     note: "After devolution — funds Centre's schemes + obligations" },
    // Column 2 — Final Uses
    { id: "use-interest",  label: "Interest Payments",        value: 12.73, column: 2, category: "obligatory", note: "Largest single head — 38.6% of revenue receipts" },
    { id: "use-devol",     label: "Tax Devolution to States", value: 14.12, column: 2, category: "transfer" },
    { id: "use-css",       label: "Centrally Sponsored Schemes", value: 9.90, column: 2, category: "scheme",   note: "60:40 Centre:State; ₹9.90 L Cr (+17.1% vs RE 2025-26)" },
    { id: "use-central",   label: "Central Sector Schemes",   value: 17.72, column: 2, category: "scheme",     note: "100% Centre-funded; ₹17.72 L Cr (+8.2% vs RE 2025-26)" },
    { id: "use-defence",   label: "Defence",                  value:  7.85, column: 2, category: "obligatory", note: "~1.9% of GDP; +7% vs RE 2025-26" },
    { id: "use-subsidies", label: "Subsidies",                value:  3.81, column: 2, category: "transfer",   note: "Food ~₹2 L Cr · Fertiliser ~₹1.7 L Cr · Petroleum negligible" },
    { id: "use-pensions",  label: "Pensions",                 value:  2.40, column: 2, category: "obligatory" },
    { id: "use-other",     label: "Other Expenditure",        value:  5.94, column: 2, category: "other" },
  ],
  links: [
    { source: "src-borrowing", target: "pool-centre",  value: 14.44 },
    { source: "src-pit",       target: "pool-centre",  value: 11.76 },
    { source: "src-gst",       target: "pool-states",  value:  3.93 },
    { source: "src-gst",       target: "pool-centre",  value:  5.69 },
    { source: "src-cit",       target: "pool-states",  value:  3.73 },
    { source: "src-cit",       target: "pool-centre",  value:  5.36 },
    { source: "src-nontax",    target: "pool-centre",  value:  4.81 },
    { source: "src-excise",    target: "pool-states",  value:  1.10 },
    { source: "src-excise",    target: "pool-centre",  value:  1.57 },
    { source: "src-customs",   target: "pool-states",  value:  0.44 },
    { source: "src-customs",   target: "pool-centre",  value:  0.63 },
    { source: "src-capital",   target: "pool-centre",  value:  0.53 },
    { source: "pool-states",   target: "use-devol",    value: 14.12 },
    { source: "pool-centre",   target: "use-interest", value: 12.73 },
    { source: "pool-centre",   target: "use-css",      value:  9.90 },
    { source: "pool-centre",   target: "use-central",  value: 17.72 },
    { source: "pool-centre",   target: "use-defence",  value:  7.85 },
    { source: "pool-centre",   target: "use-subsidies",value:  3.81 },
    { source: "pool-centre",   target: "use-pensions", value:  2.40 },
    { source: "pool-centre",   target: "use-other",    value:  5.94 },
  ],
}

// ── Scheme estimates (BE / RE / Actuals) ──────────────────────────────────────
export interface SchemeEstimate {
  fy: FiscalYear
  scheme: string
  ministry: string
  category: string
  be: number
  re: number
  actuals: number | null
  reVsBePct: number
  actualsVsRePct: number | null
  forensicFlag: boolean
  forensicNote?: string
}

export const SCHEME_ESTIMATES: SchemeEstimate[] = [
  {
    fy: "2025-26", scheme: "Centrally Sponsored Schemes (Total)", ministry: "All Ministries",
    category: "css", be: 15.48, re: 13.45, actuals: null,
    reVsBePct: -13.1, actualsVsRePct: null,
    forensicFlag: true,
    forensicNote: "RE fell ₹2.03 lakh crore (−19%) below BE — recurring pattern of CSS under-execution. Source: PRS Budget Analysis 2026-27."
  },
  {
    fy: "2025-26", scheme: "PM-KISAN", ministry: "Agriculture",
    category: "css", be: 0.63, re: 0.60, actuals: null,
    reVsBePct: -4.8, actualsVsRePct: null, forensicFlag: false,
  },
  {
    fy: "2025-26", scheme: "MGNREGA", ministry: "Rural Development",
    category: "css", be: 0.86, re: 1.04, actuals: null,
    reVsBePct: +20.9, actualsVsRePct: null,
    forensicFlag: false,
    forensicNote: "RE exceeds BE — demand-driven; liabilities roll over. Distress uptake exceeded projection.",
  },
  {
    fy: "2025-26", scheme: "Jal Jeevan Mission", ministry: "Jal Shakti",
    category: "css", be: 0.67, re: 0.45, actuals: null,
    reVsBePct: -32.8, actualsVsRePct: null,
    forensicFlag: true,
    forensicNote: "RE cut by ₹22,000 crore. State absorption capacity and UC submission delays are primary causes per CAG.",
  },
  {
    fy: "2025-26", scheme: "PM Awas Yojana (Grameen)", ministry: "Rural Development",
    category: "css", be: 0.54, re: 0.50, actuals: null,
    reVsBePct: -7.4, actualsVsRePct: null, forensicFlag: false,
  },
  {
    fy: "2025-26", scheme: "Samagra Shiksha", ministry: "Education",
    category: "css", be: 0.37, re: 0.31, actuals: null,
    reVsBePct: -16.2, actualsVsRePct: null,
    forensicFlag: true,
    forensicNote: "RE reduction linked to slow state-level implementation and pending UCs from 2024-25.",
  },
  {
    fy: "2025-26", scheme: "National Health Mission", ministry: "Health",
    category: "css", be: 0.38, re: 0.35, actuals: null,
    reVsBePct: -7.9, actualsVsRePct: null, forensicFlag: false,
  },
  {
    fy: "2025-26", scheme: "Capital Expenditure (Total)", ministry: "All Ministries",
    category: "capex", be: 11.21, re: 10.18, actuals: null,
    reVsBePct: -9.2, actualsVsRePct: null,
    forensicFlag: true,
    forensicNote: "Capex RE cut by ₹1.03 lakh crore — recurring under-execution across multiple years.",
  },
  {
    fy: "2024-25", scheme: "Centrally Sponsored Schemes (Total)", ministry: "All Ministries",
    category: "css", be: 14.03, re: 12.60, actuals: 11.95,
    reVsBePct: -10.2, actualsVsRePct: -5.2,
    forensicFlag: true,
    forensicNote: "Actuals fell ₹65,000 crore short of RE — chronic under-utilisation in CSS.",
  },
  {
    fy: "2024-25", scheme: "Capital Expenditure (Total)", ministry: "All Ministries",
    category: "capex", be: 11.11, re: 10.11, actuals: 9.86,
    reVsBePct: -9.0, actualsVsRePct: -2.5,
    forensicFlag: true,
    forensicNote: "Actuals ₹9.86 L Cr vs BE ₹11.11 L Cr — ₹1.25 lakh crore under-execution.",
  },
]

// ── Cess + Surcharge series ───────────────────────────────────────────────────
export interface CessEntry {
  fy: FiscalYear
  totalGTR: number
  cessTotal: number
  surchargeTotal: number
  cessAndSurcharge: number
  pctOfGTR: number
  divisiblePoolPct: number
  annotation?: string
}

export const CESS_SERIES: CessEntry[] = [
  { fy: "2017-18", totalGTR: 19.19, cessTotal: 1.75, surchargeTotal: 0.72, cessAndSurcharge: 2.47, pctOfGTR: 12.9, divisiblePoolPct: 87.1 },
  { fy: "2018-19", totalGTR: 20.80, cessTotal: 2.11, surchargeTotal: 0.82, cessAndSurcharge: 2.93, pctOfGTR: 14.1, divisiblePoolPct: 85.9 },
  { fy: "2019-20", totalGTR: 20.10, cessTotal: 2.20, surchargeTotal: 1.06, cessAndSurcharge: 3.26, pctOfGTR: 16.2, divisiblePoolPct: 83.8 },
  { fy: "2020-21", totalGTR: 20.27, cessTotal: 3.13, surchargeTotal: 1.11, cessAndSurcharge: 4.24, pctOfGTR: 20.9, divisiblePoolPct: 79.1, annotation: "COVID + cess hikes — peak share year" },
  { fy: "2021-22", totalGTR: 27.07, cessTotal: 3.89, surchargeTotal: 1.22, cessAndSurcharge: 5.11, pctOfGTR: 18.9, divisiblePoolPct: 81.1 },
  { fy: "2022-23", totalGTR: 30.43, cessTotal: 4.05, surchargeTotal: 1.35, cessAndSurcharge: 5.40, pctOfGTR: 17.7, divisiblePoolPct: 82.3 },
  { fy: "2023-24", totalGTR: 34.37, cessTotal: 4.29, surchargeTotal: 1.52, cessAndSurcharge: 5.81, pctOfGTR: 16.9, divisiblePoolPct: 83.1 },
  { fy: "2024-25", totalGTR: 38.40, cessTotal: 3.87, surchargeTotal: 1.53, cessAndSurcharge: 5.40, pctOfGTR: 14.1, divisiblePoolPct: 85.9 },
  { fy: "2025-26", totalGTR: 42.70, cessTotal: 4.18, surchargeTotal: 1.72, cessAndSurcharge: 5.90, pctOfGTR: 13.8, divisiblePoolPct: 86.2, annotation: "16th FC urged 'progressive reduction'" },
  { fy: "2026-27", totalGTR: 45.20, cessTotal: 4.31, surchargeTotal: 1.79, cessAndSurcharge: 6.10, pctOfGTR: 13.5, divisiblePoolPct: 86.5 },
]

// ── Subsidies series ──────────────────────────────────────────────────────────
export interface SubsidyEntry {
  fy: FiscalYear
  food: number
  fertiliser: number
  petroleum: number
  other: number
  total: number
  gdpPct: number
  annotation?: string
}

export const SUBSIDY_SERIES: SubsidyEntry[] = [
  { fy: "2017-18", food: 1.69, fertiliser: 0.70, petroleum: 0.25, other: 0.12, total: 2.76, gdpPct: 1.47 },
  { fy: "2018-19", food: 1.71, fertiliser: 0.70, petroleum: 0.25, other: 0.14, total: 2.80, gdpPct: 1.40 },
  { fy: "2019-20", food: 1.84, fertiliser: 0.80, petroleum: 0.37, other: 0.18, total: 3.19, gdpPct: 1.59 },
  { fy: "2020-21", food: 5.41, fertiliser: 1.33, petroleum: 0.38, other: 0.22, total: 7.34, gdpPct: 3.82, annotation: "PMGKAY free foodgrain — COVID spike" },
  { fy: "2021-22", food: 2.86, fertiliser: 1.58, petroleum: 0.14, other: 0.21, total: 4.79, gdpPct: 2.10 },
  { fy: "2022-23", food: 2.73, fertiliser: 2.25, petroleum: 0.09, other: 0.19, total: 5.26, gdpPct: 1.96, annotation: "Russia-Ukraine: fertiliser prices surge" },
  { fy: "2023-24", food: 2.05, fertiliser: 1.64, petroleum: 0.06, other: 0.17, total: 3.92, gdpPct: 1.32 },
  { fy: "2024-25", food: 2.14, fertiliser: 1.68, petroleum: 0.06, other: 0.19, total: 4.07, gdpPct: 1.26 },
  { fy: "2025-26", food: 2.03, fertiliser: 1.70, petroleum: 0.05, other: 0.20, total: 3.98, gdpPct: 1.15 },
  { fy: "2026-27", food: 2.07, fertiliser: 1.74, petroleum: 0.05, other: 0.22, total: 4.08, gdpPct: 1.10 },
]

// ── State net positions ───────────────────────────────────────────────────────
export interface StateNetPosition {
  stateCode: string
  stateName: string
  gsdpSharePct: number
  fcShare15th: number
  fcShare16th: number
  taxContribEstimate: number
  devolutionReceived: number
  totalTransfers: number
  ratioReceivedPerRupee: number
  note?: string
}

export const STATE_NET_POSITIONS: StateNetPosition[] = [
  { stateCode: "MH", stateName: "Maharashtra",     gsdpSharePct: 14.5, fcShare15th: 6.317, fcShare16th: 6.44,  taxContribEstimate: 8.0,  devolutionReceived: 0.91, totalTransfers: 1.35, ratioReceivedPerRupee: 0.38 },
  { stateCode: "TN", stateName: "Tamil Nadu",       gsdpSharePct:  9.0, fcShare15th: 4.079, fcShare16th: 4.10,  taxContribEstimate: 4.5,  devolutionReceived: 0.58, totalTransfers: 0.92, ratioReceivedPerRupee: 0.48 },
  { stateCode: "KA", stateName: "Karnataka",        gsdpSharePct:  8.4, fcShare15th: 3.647, fcShare16th: 4.13,  taxContribEstimate: 4.2,  devolutionReceived: 0.58, totalTransfers: 0.91, ratioReceivedPerRupee: 0.50 },
  { stateCode: "GJ", stateName: "Gujarat",          gsdpSharePct:  8.1, fcShare15th: 3.398, fcShare16th: 3.57,  taxContribEstimate: 4.0,  devolutionReceived: 0.50, totalTransfers: 0.82, ratioReceivedPerRupee: 0.48 },
  { stateCode: "UP", stateName: "Uttar Pradesh",    gsdpSharePct:  8.0, fcShare15th: 17.93, fcShare16th: 17.62, taxContribEstimate: 2.5,  devolutionReceived: 2.49, totalTransfers: 3.60, ratioReceivedPerRupee: 2.00, note: "High income-distance weight — constitutional equalisation" },
  { stateCode: "BR", stateName: "Bihar",            gsdpSharePct:  3.0, fcShare15th: 10.06, fcShare16th: 9.95,  taxContribEstimate: 0.8,  devolutionReceived: 1.40, totalTransfers: 2.10, ratioReceivedPerRupee: 2.90, note: "Lowest per-capita GSDP; highest income-distance score" },
  { stateCode: "RJ", stateName: "Rajasthan",        gsdpSharePct:  5.0, fcShare15th: 5.979, fcShare16th: 5.72,  taxContribEstimate: 1.8,  devolutionReceived: 0.81, totalTransfers: 1.30, ratioReceivedPerRupee: 1.30 },
  { stateCode: "MP", stateName: "Madhya Pradesh",   gsdpSharePct:  4.2, fcShare15th: 7.548, fcShare16th: 7.25,  taxContribEstimate: 1.2,  devolutionReceived: 1.02, totalTransfers: 1.60, ratioReceivedPerRupee: 1.90 },
  { stateCode: "WB", stateName: "West Bengal",      gsdpSharePct:  5.5, fcShare15th: 7.520, fcShare16th: 7.33,  taxContribEstimate: 2.0,  devolutionReceived: 1.03, totalTransfers: 1.65, ratioReceivedPerRupee: 1.20 },
  { stateCode: "AP", stateName: "Andhra Pradesh",   gsdpSharePct:  4.0, fcShare15th: 4.111, fcShare16th: 4.22,  taxContribEstimate: 1.5,  devolutionReceived: 0.60, totalTransfers: 0.96, ratioReceivedPerRupee: 1.00 },
  { stateCode: "TS", stateName: "Telangana",        gsdpSharePct:  4.5, fcShare15th: 2.102, fcShare16th: 2.17,  taxContribEstimate: 2.0,  devolutionReceived: 0.31, totalTransfers: 0.52, ratioReceivedPerRupee: 0.65 },
  { stateCode: "KL", stateName: "Kerala",           gsdpSharePct:  3.5, fcShare15th: 1.925, fcShare16th: 2.38,  taxContribEstimate: 1.6,  devolutionReceived: 0.34, totalTransfers: 0.58, ratioReceivedPerRupee: 0.58, note: "+0.455pp gain in 16th FC via GDP contribution parameter" },
  { stateCode: "HR", stateName: "Haryana",          gsdpSharePct:  3.4, fcShare15th: 1.082, fcShare16th: 1.18,  taxContribEstimate: 1.6,  devolutionReceived: 0.17, totalTransfers: 0.30, ratioReceivedPerRupee: 0.40 },
  { stateCode: "OD", stateName: "Odisha",           gsdpSharePct:  2.5, fcShare15th: 4.629, fcShare16th: 4.47,  taxContribEstimate: 0.7,  devolutionReceived: 0.63, totalTransfers: 1.00, ratioReceivedPerRupee: 1.90 },
  { stateCode: "JH", stateName: "Jharkhand",        gsdpSharePct:  1.5, fcShare15th: 3.309, fcShare16th: 3.23,  taxContribEstimate: 0.4,  devolutionReceived: 0.46, totalTransfers: 0.72, ratioReceivedPerRupee: 2.40 },
]

// ── Finance Commission formula ─────────────────────────────────────────────────
export const FC_FORMULA = {
  "15th FC": { "Income Distance": 45, "Population": 15, "Demographic Perf.": 12.5, "Area": 15, "Forest & Ecology": 10, "Tax Effort": 2.5, "GDP Contribution": 0 },
  "16th FC": { "Income Distance": 42.5, "Population": 17.5, "Demographic Perf.": 10, "Area": 10, "Forest & Ecology": 10, "Tax Effort": 0, "GDP Contribution": 10 },
}

// ── Budget KPIs ────────────────────────────────────────────────────────────────
export const BUDGET_KPIS = {
  fy: "2026-27" as FiscalYear,
  estimate: "BE" as EstimateType,
  totalExpenditure: 53.47,
  totalReceipts: 34.97,
  fiscalDeficit: 14.44,
  fiscalDeficitPct: 4.3,
  statesTransfersTotal: 26.20,
  statesTransfersPct: 49.0,
  capitalExpenditure: 11.50,
  capexGdpPct: 3.1,
  source: "PRS Union Budget 2026-27 Analysis · Budget at a Glance 2026-27",

  // Prior-year baselines (FY 2025-26 BE) for YoY comparison
  prior: {
    fy: "2025-26" as FiscalYear,
    totalExpenditure: 48.21,
    fiscalDeficitPct: 4.4,
    statesTransfersTotal: 23.35,
    statesTransfersPct: 48.4,
    capitalExpenditure: 11.21,
    capexGdpPct: 3.1,
  },

  // 6-year history for micro-trends (FY 2021-22 BE → FY 2026-27 BE)
  trend: {
    totalExpenditure:  [37.70, 39.45, 44.90, 47.66, 48.21, 53.47],
    fiscalDeficitPct:  [ 6.40,  5.90,  5.80,  4.90,  4.40,  4.30],
    statesTransfersPct:[44.80, 46.10, 47.20, 47.90, 48.40, 49.00],
    capexGdpPct:       [ 2.20,  2.70,  3.30,  3.40,  3.10,  3.10],
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// WAVE 2 + WAVE 3 DATA (NŃ-322, 327, 329, 331, 332, 324, 328, 333, 334, 335)
// ═══════════════════════════════════════════════════════════════════════════════

// ── NŃ-322 Time-Machine: per-FY composition (% of total) ──────────────────────
// FY12-13 → FY26-27 BE. Source: PRS Union Budget Analyses + indiabudget.gov.in
export const TIME_MACHINE = {
  years: ["FY13","FY14","FY15","FY16","FY17","FY18","FY19","FY20","FY21","FY22","FY23","FY24","FY25","FY26","FY27"] as const,
  totalExp:   [ 14.10, 15.59, 16.66, 17.77, 19.75, 21.42, 24.45, 26.86, 35.10, 37.70, 41.87, 45.03, 47.66, 48.21, 53.47 ],
  defence:    [ 1.93,  2.03,  2.22,  2.46,  2.74,  2.95,  3.18,  3.37,  3.40,  4.78,  5.25,  5.94,  6.21,  6.81,  6.81 ],
  interest:   [ 3.16,  3.74,  4.02,  4.41,  4.81,  5.29,  5.83,  6.25,  6.79,  8.06,  9.40, 10.79, 11.62, 12.20, 12.76 ],
  subsidies:  [ 2.57,  2.55,  2.59,  2.43,  2.32,  1.91,  1.96,  2.62,  7.07,  4.33,  5.31,  4.13,  3.81,  3.97,  4.26 ],
  capex:      [ 1.66,  1.88,  1.97,  2.53,  2.85,  3.07,  3.10,  3.36,  4.26,  5.93,  7.50, 10.00, 11.11, 11.21, 11.50 ],
  centSchemes:[ 1.50,  1.40,  1.75,  2.50,  2.20,  3.05,  3.45,  3.30,  4.10,  3.55,  4.05,  4.45,  4.30,  4.78,  5.50 ],
  cssTrans:   [ 1.05,  1.30,  2.10,  2.05,  2.40,  3.40,  3.05,  3.30,  3.50,  4.43,  4.42,  4.76,  4.43,  4.66,  5.41 ],
  source: "PRS Union Budget Analyses FY13–FY27 · indiabudget.gov.in Statement of Expenditure",
}

// ── NŃ-327 16th FC: all three commissions, full formula ───────────────────────
export const FC_HISTORY = {
  "14th FC": { period: "FY16-FY20", vertical: 42, formula: { "Income Distance": 50, "Population (1971)": 17.5, "Population (2011)": 10, "Area": 15, "Forest Cover": 7.5, "Demographic Perf.": 0, "Tax Effort": 0, "GDP Contribution": 0 } },
  "15th FC": { period: "FY21-FY26", vertical: 41, formula: { "Income Distance": 45, "Population (1971)": 0, "Population (2011)": 15, "Area": 15, "Forest Cover": 10, "Demographic Perf.": 12.5, "Tax Effort": 2.5, "GDP Contribution": 0 } },
  "16th FC": { period: "FY27-FY31", vertical: 41, formula: { "Income Distance": 42.5, "Population (1971)": 0, "Population (2011)": 17.5, "Area": 10, "Forest Cover": 10, "Demographic Perf.": 10, "Tax Effort": 0, "GDP Contribution": 10 } },
} as const

export const DISASTER_GRANTS_16TH = {
  totalCorpus: 2.04,           // ₹ lakh crore over FY27-FY31
  ndrfShare: 70,               // %, National Disaster Response Fund
  sdrfShare: 30,               // %, State Disaster Response Fund pool
  recurrenceWeight: 70,        // % weight on past spend
  riskWeight: 30,              // % weight on disaster risk index
  centreStateSplit: "90:10 NE/Hilly · 75:25 others",
  source: "16th FC Report Vol I · tabled 1 Feb 2026 · PRS summary",
}

// ── NŃ-329 Defence vs Social Sector (% of GDP, FY10→FY27) ─────────────────────
export const SECTOR_GDP = {
  years: ["FY13","FY14","FY15","FY16","FY17","FY18","FY19","FY20","FY21","FY22","FY23","FY24","FY25","FY26","FY27"] as const,
  defence:    [1.81, 1.79, 1.78, 1.78, 1.81, 1.76, 1.69, 1.51, 1.73, 2.03, 1.95, 2.02, 1.91, 1.94, 1.86],
  health:     [0.27, 0.30, 0.21, 0.21, 0.30, 0.31, 0.32, 0.32, 0.49, 0.81, 0.76, 0.78, 0.84, 0.86, 0.91],
  education:  [0.58, 0.51, 0.45, 0.49, 0.44, 0.50, 0.49, 0.45, 0.40, 0.43, 0.40, 0.41, 0.45, 0.48, 0.52],
  ruralDev:   [0.65, 0.61, 0.48, 0.61, 0.69, 0.78, 0.81, 0.74, 0.91, 0.88, 0.86, 0.85, 0.87, 0.89, 0.91],
  agri:       [0.20, 0.20, 0.23, 0.27, 0.30, 0.32, 0.45, 0.66, 0.65, 0.50, 0.43, 0.39, 0.43, 0.45, 0.49],
  source: "PRS Union Budget Analyses · MoSPI nominal GDP series",
}

// ── NŃ-331 Off-Budget Borrowings — true fiscal deficit ─────────────────────────
export interface ObbRow { fy: string; headlineFd: number; obb: number; sources: string; note?: string }
export const OBB_SERIES: ObbRow[] = [
  { fy: "FY15", headlineFd: 5.10, obb: 0.62, sources: "FCI-NSSF · oil bonds residual" },
  { fy: "FY16", headlineFd: 5.32, obb: 0.85, sources: "FCI-NSSF · IRFC railways" },
  { fy: "FY17", headlineFd: 5.36, obb: 1.08, sources: "FCI-NSSF · IRFC · NHAI bonds" },
  { fy: "FY18", headlineFd: 5.91, obb: 1.32, sources: "FCI-NSSF · IRFC · NHAI · PSU recap" },
  { fy: "FY19", headlineFd: 6.49, obb: 1.78, sources: "FCI-NSSF · IRFC · PSU recap bonds" },
  { fy: "FY20", headlineFd: 9.34, obb: 2.27, sources: "Peak — FCI-NSSF ₹1.36 LC · IRFC ₹0.80 LC", note: "CAG flagged ₹2.27 LC OBB; true FD was 2.5% higher than reported" },
  { fy: "FY21", headlineFd: 18.18, obb: 1.04, sources: "COVID; OBB partly internalised", note: "FCI-NSSF brought on-budget under glide path" },
  { fy: "FY22", headlineFd: 15.84, obb: 0.50, sources: "Glide-path adjustment" },
  { fy: "FY23", headlineFd: 17.55, obb: 0.34, sources: "Residual NHAI · IRFC" },
  { fy: "FY24", headlineFd: 16.85, obb: 0.20, sources: "Largely on-budget" },
  { fy: "FY25", headlineFd: 16.13, obb: 0.18, sources: "Residual PSU recap" },
  { fy: "FY26", headlineFd: 15.69, obb: 0.15, sources: "Minimal — bond market discipline" },
  { fy: "FY27", headlineFd: 14.44, obb: 0.12, sources: "Estimate — continued glide" },
]

// ── NŃ-332 GST IGST Settlement ─────────────────────────────────────────────────
export const GST_IGST = {
  totalIgstFy25: 11.85,        // ₹ L Cr gross IGST collected
  settledToStates: 6.42,
  settledToCentre: 5.43,
  states: [
    { code: "MH", name: "Maharashtra",     origination: 18.5, consumption: 14.2, netRatio: 0.77 },
    { code: "GJ", name: "Gujarat",         origination: 11.0, consumption:  6.8, netRatio: 0.62 },
    { code: "TN", name: "Tamil Nadu",      origination:  9.8, consumption:  7.5, netRatio: 0.77 },
    { code: "KA", name: "Karnataka",       origination:  9.5, consumption:  8.9, netRatio: 0.94 },
    { code: "HR", name: "Haryana",         origination:  6.5, consumption:  3.8, netRatio: 0.58 },
    { code: "UP", name: "Uttar Pradesh",   origination:  6.8, consumption: 12.4, netRatio: 1.82 },
    { code: "WB", name: "West Bengal",     origination:  3.8, consumption:  5.5, netRatio: 1.45 },
    { code: "RJ", name: "Rajasthan",       origination:  3.5, consumption:  4.6, netRatio: 1.31 },
    { code: "AP", name: "Andhra Pradesh",  origination:  3.0, consumption:  3.8, netRatio: 1.27 },
    { code: "MP", name: "Madhya Pradesh",  origination:  2.5, consumption:  4.2, netRatio: 1.68 },
    { code: "BR", name: "Bihar",           origination:  1.2, consumption:  3.6, netRatio: 3.00 },
    { code: "KL", name: "Kerala",          origination:  2.8, consumption:  3.4, netRatio: 1.21 },
    { code: "TS", name: "Telangana",       origination:  4.5, consumption:  4.1, netRatio: 0.91 },
    { code: "OD", name: "Odisha",          origination:  2.0, consumption:  2.6, netRatio: 1.30 },
    { code: "PB", name: "Punjab",          origination:  1.8, consumption:  2.4, netRatio: 1.33 },
  ],
  source: "GST Council 53rd Meeting · IGST Settlement reports FY 2024-25 · CGA",
}

// ═══════════════════════════════════════════════════════════════════════════════
// WAVE 3 DATA
// ═══════════════════════════════════════════════════════════════════════════════

// ── NŃ-324 Manifesto-to-Budget (2024 BJP manifesto sampling) ───────────────────
export const MANIFESTO_BUDGET = [
  { id: "MB-01", party: "BJP", promise: "Free ration to 80 cr beneficiaries continued till 2029",  category: "Food",       budgetHead: "PMGKAY (Food Subsidy)",          promisedINR: "Continued", allocatedINR: 2.03,  status: "kept",      note: "₹2.03 LC in FY27 BE — coverage maintained" },
  { id: "MB-02", party: "BJP", promise: "Tap water to every rural household (Jal Jeevan Mission)", category: "Rural",      budgetHead: "Jal Jeevan Mission",             promisedINR: 3.60,        allocatedINR: 0.74,  status: "partial",   note: "76% household coverage achieved; allocation cut from FY24 peak" },
  { id: "MB-03", party: "BJP", promise: "3 crore PM Awas houses (urban + rural)",                  category: "Housing",    budgetHead: "PMAY-G + PMAY-U",                promisedINR: 5.00,        allocatedINR: 0.74,  status: "partial",   note: "Pace insufficient; needs ~₹1.0 LC/yr to meet target" },
  { id: "MB-04", party: "BJP", promise: "Make India 3rd largest economy by 2027",                  category: "Macro",      budgetHead: "Capex + reforms",                promisedINR: "—",         allocatedINR: 11.50, status: "on-track",  note: "Capex ₹11.5 LC; nominal GDP trajectory aligns" },
  { id: "MB-05", party: "BJP", promise: "Vande Bharat trains to every state",                      category: "Railways",   budgetHead: "Railways Capex",                 promisedINR: 2.55,        allocatedINR: 2.65,  status: "kept",      note: "FY27 BE for railways capex matches commitment" },
  { id: "MB-06", party: "BJP", promise: "Free LPG cylinders to 75L women (Ujjwala)",               category: "Energy",     budgetHead: "DBT-Ujjwala subsidy",            promisedINR: 0.12,        allocatedINR: 0.09,  status: "partial",   note: "FY27 BE ₹9,000 cr; coverage near full but burner cost rising" },
  { id: "MB-07", party: "BJP", promise: "PM-KISAN: ₹6000/yr to all eligible farmers",              category: "Agriculture",budgetHead: "PM-KISAN",                       promisedINR: 0.63,        allocatedINR: 0.63,  status: "kept",      note: "₹63,500 cr matches 11 crore beneficiary base" },
  { id: "MB-08", party: "BJP", promise: "Ayushman Bharat — ₹5L health cover all 70+",              category: "Health",     budgetHead: "PMJAY",                          promisedINR: 0.10,        allocatedINR: 0.09,  status: "kept",      note: "FY27 BE ₹9,406 cr; senior expansion confirmed" },
  { id: "MB-09", party: "INC", promise: "MGNREGA — guarantee 100 days @ ₹400/day",                 category: "Rural",      budgetHead: "MGNREGS",                        promisedINR: 1.20,        allocatedINR: 0.86,  status: "partial",   note: "FY27 BE ₹86,000 cr; wage rate ₹289 average vs ₹400 demand" },
  { id: "MB-10", party: "INC", promise: "Mahalakshmi — ₹1L/yr to 1 woman per poor household",      category: "Welfare",    promisedINR: 5.50, budgetHead: "—",            allocatedINR: 0,     status: "not-funded", note: "Opposition manifesto; no Centre allocation" },
] as const

// ── NŃ-328 CSS Release Tracker — sample state × scheme × month ─────────────────
export interface CssRow { state: string; scheme: string; fy24Late: number; fy24Pct: number; fy25Late: number; fy25Pct: number; electionMonth: number; electionYear: number; note?: string }
export const CSS_RELEASES: CssRow[] = [
  // [state, scheme, monthsLate, releasedPct, electionFlag]
  { state: "Maharashtra",   scheme: "MGNREGS",        fy24Late: 1.2, fy24Pct: 92, fy25Late: 1.8, fy25Pct: 88, electionMonth: 11, electionYear: 2024, note: "Election Nov 2024" },
  { state: "Maharashtra",   scheme: "PMAY-G",         fy24Late: 0.9, fy24Pct: 95, fy25Late: 2.1, fy25Pct: 82, electionMonth: 11, electionYear: 2024 },
  { state: "Maharashtra",   scheme: "Jal Jeevan",     fy24Late: 1.5, fy24Pct: 78, fy25Late: 2.4, fy25Pct: 65, electionMonth: 11, electionYear: 2024 },
  { state: "Karnataka",     scheme: "MGNREGS",        fy24Late: 2.4, fy24Pct: 76, fy25Late: 2.8, fy25Pct: 71, electionMonth:  5, electionYear: 2023, note: "Opposition-ruled" },
  { state: "Karnataka",     scheme: "PMAY-G",         fy24Late: 1.8, fy24Pct: 82, fy25Late: 2.1, fy25Pct: 79, electionMonth:  5, electionYear: 2023 },
  { state: "Karnataka",     scheme: "Jal Jeevan",     fy24Late: 1.2, fy24Pct: 88, fy25Late: 1.6, fy25Pct: 81, electionMonth:  5, electionYear: 2023 },
  { state: "Tamil Nadu",    scheme: "MGNREGS",        fy24Late: 2.8, fy24Pct: 70, fy25Late: 3.4, fy25Pct: 62, electionMonth:  4, electionYear: 2026, note: "Pre-election year · opposition" },
  { state: "Tamil Nadu",    scheme: "PMAY-G",         fy24Late: 2.2, fy24Pct: 75, fy25Late: 2.6, fy25Pct: 68, electionMonth:  4, electionYear: 2026 },
  { state: "Tamil Nadu",    scheme: "Jal Jeevan",     fy24Late: 1.9, fy24Pct: 79, fy25Late: 2.5, fy25Pct: 71, electionMonth:  4, electionYear: 2026 },
  { state: "Uttar Pradesh", scheme: "MGNREGS",        fy24Late: 0.8, fy24Pct: 96, fy25Late: 0.9, fy25Pct: 94, electionMonth:  2, electionYear: 2027, note: "Ruling-party aligned" },
  { state: "Uttar Pradesh", scheme: "PMAY-G",         fy24Late: 0.6, fy24Pct: 98, fy25Late: 0.7, fy25Pct: 97, electionMonth:  2, electionYear: 2027 },
  { state: "Uttar Pradesh", scheme: "Jal Jeevan",     fy24Late: 0.7, fy24Pct: 95, fy25Late: 0.9, fy25Pct: 93, electionMonth:  2, electionYear: 2027 },
  { state: "Bihar",         scheme: "MGNREGS",        fy24Late: 1.0, fy24Pct: 93, fy25Late: 1.1, fy25Pct: 91, electionMonth: 10, electionYear: 2025, note: "Allied · election Oct 2025" },
  { state: "Bihar",         scheme: "PMAY-G",         fy24Late: 0.9, fy24Pct: 94, fy25Late: 0.8, fy25Pct: 96, electionMonth: 10, electionYear: 2025 },
  { state: "Bihar",         scheme: "Jal Jeevan",     fy24Late: 1.1, fy24Pct: 89, fy25Late: 1.0, fy25Pct: 92, electionMonth: 10, electionYear: 2025 },
  { state: "West Bengal",   scheme: "MGNREGS",        fy24Late: 3.6, fy24Pct: 58, fy25Late: 4.2, fy25Pct: 51, electionMonth:  4, electionYear: 2026, note: "Centre-state dispute · funds withheld" },
  { state: "West Bengal",   scheme: "PMAY-G",         fy24Late: 3.2, fy24Pct: 62, fy25Late: 3.8, fy25Pct: 56, electionMonth:  4, electionYear: 2026 },
  { state: "West Bengal",   scheme: "Jal Jeevan",     fy24Late: 2.4, fy24Pct: 74, fy25Late: 3.0, fy25Pct: 68, electionMonth:  4, electionYear: 2026 },
]

// ── NŃ-333 My Constituency — sample MPLADS data ────────────────────────────────
export const MPLADS_SAMPLE = [
  { pin: "110001", constituency: "New Delhi",        state: "Delhi",       sittingMP: "Bansuri Swaraj (BJP)",       mplads5yr: 17.0, utilisedPct: 84, topWork: "Community halls · school upgrades · CCTV",        neighbours: ["Chandni Chowk", "South Delhi", "East Delhi"] },
  { pin: "560001", constituency: "Bangalore Central",state: "Karnataka",   sittingMP: "P. C. Mohan (BJP)",          mplads5yr: 17.0, utilisedPct: 76, topWork: "BBMP infra · school labs · stormwater drains",   neighbours: ["Bangalore South", "Bangalore North"] },
  { pin: "400001", constituency: "Mumbai South",     state: "Maharashtra", sittingMP: "Arvind Sawant (Shiv Sena UBT)", mplads5yr: 17.0, utilisedPct: 92, topWork: "BMC ward upgrades · public toilets · libraries", neighbours: ["Mumbai South Central", "Mumbai North Central"] },
  { pin: "600001", constituency: "Chennai Central",  state: "Tamil Nadu",  sittingMP: "Dayanidhi Maran (DMK)",       mplads5yr: 17.0, utilisedPct: 88, topWork: "Greater Chennai Corp · drains · school blocks",  neighbours: ["Chennai North", "Chennai South"] },
  { pin: "700001", constituency: "Kolkata Uttar",    state: "West Bengal", sittingMP: "Sudip Bandyopadhyay (TMC)",   mplads5yr: 17.0, utilisedPct: 71, topWork: "KMC ward · drinking water · health subcentres",  neighbours: ["Kolkata Dakshin", "Howrah"] },
  { pin: "226001", constituency: "Lucknow",          state: "Uttar Pradesh", sittingMP: "Rajnath Singh (BJP)",       mplads5yr: 17.0, utilisedPct: 95, topWork: "Roads · schools · solar lighting",               neighbours: ["Lucknow Cantt MLA", "Mohanlalganj"] },
] as const

// ── NŃ-334 Outcome Budget Integrity scores ─────────────────────────────────────
export interface OomfRow { scheme: string; ministry: string; indicatorQ: number; targetReporting: number; achievement: number | null; disaggregation: number; total: number; grade: string; note?: string }
export const OOMF_SCORES: OomfRow[] = [
  { scheme: "PM-KISAN",                ministry: "Agriculture",    indicatorQ: 85, targetReporting: 90, achievement: 95, disaggregation: 75, total: 86, grade: "A" },
  { scheme: "MGNREGS",                 ministry: "Rural Dev",      indicatorQ: 90, targetReporting: 88, achievement: 78, disaggregation: 92, total: 87, grade: "A" },
  { scheme: "PMAY-G (Rural)",          ministry: "Rural Dev",      indicatorQ: 80, targetReporting: 75, achievement: 70, disaggregation: 65, total: 73, grade: "B" },
  { scheme: "PMAY-U (Urban)",          ministry: "Housing",        indicatorQ: 70, targetReporting: 60, achievement: 55, disaggregation: 50, total: 59, grade: "C" },
  { scheme: "Jal Jeevan Mission",      ministry: "Jal Shakti",     indicatorQ: 88, targetReporting: 92, achievement: 82, disaggregation: 78, total: 85, grade: "A" },
  { scheme: "PMJAY (Ayushman Bharat)", ministry: "Health",         indicatorQ: 75, targetReporting: 80, achievement: 88, disaggregation: 70, total: 78, grade: "B" },
  { scheme: "Samagra Shiksha",         ministry: "Education",      indicatorQ: 72, targetReporting: 70, achievement: 65, disaggregation: 80, total: 72, grade: "B" },
  { scheme: "POSHAN 2.0",              ministry: "WCD",            indicatorQ: 78, targetReporting: 82, achievement: 75, disaggregation: 85, total: 80, grade: "A" },
  { scheme: "PM Vishwakarma",          ministry: "MSME",           indicatorQ: 55, targetReporting: 50, achievement: 45, disaggregation: 40, total: 48, grade: "D" },
  { scheme: "PLI (14 sectors)",        ministry: "DPIIT",          indicatorQ: 60, targetReporting: 55, achievement: 50, disaggregation: 35, total: 50, grade: "C" },
  { scheme: "PM-Vidyalaxmi (loans)",   ministry: "Education",      indicatorQ: 45, targetReporting: 40, achievement: null, disaggregation: 30, total: 38, grade: "D", note: "Newly launched FY25 — first-year scoring limited" },
  { scheme: "DDU-GKY (skilling)",      ministry: "Rural Dev",      indicatorQ: 65, targetReporting: 68, achievement: 58, disaggregation: 72, total: 66, grade: "B" },
]

// ── NŃ-335 Tax brackets + budget share for "Where Does My Tax Go?" ─────────────
export const TAX_SLABS_NEW_REGIME = [
  { upTo:  300_000, rate: 0.00 },
  { upTo:  600_000, rate: 0.05 },
  { upTo:  900_000, rate: 0.10 },
  { upTo: 1_200_000, rate: 0.15 },
  { upTo: 1_500_000, rate: 0.20 },
  { upTo: Infinity,  rate: 0.30 },
] as const

// Per-₹100 of Centre's expenditure — how it's spent (FY27 BE)
export const RUPEE_GOES_TO = [
  { head: "Interest payments",          paisa: 24, color: "var(--status-broken)" },
  { head: "Tax devolution to states",   paisa: 19, color: "var(--blue)" },
  { head: "Centre's net schemes",       paisa: 16, color: "var(--accent)" },
  { head: "Centrally sponsored schemes",paisa: 8,  color: "#8b5cf6" },
  { head: "Defence",                    paisa: 8,  color: "#10b981" },
  { head: "Subsidies",                  paisa: 8,  color: "#f59e0b" },
  { head: "Pensions",                   paisa: 4,  color: "#ec4899" },
  { head: "Finance Comm. grants",       paisa: 8,  color: "#06b6d4" },
  { head: "Other expenditure",          paisa: 5,  color: "var(--text-disabled)" },
] as const
