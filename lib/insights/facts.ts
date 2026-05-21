// BMW-160–185 + BMW-226–250 — "Did You Know" facts and shock cards.
// Each card has: text, source, category (filter), and an optional caveat.

export type FactCategory =
  | "parliamentary"
  | "financial"
  | "electoral"
  | "criminal"
  | "gender"
  | "attendance"
  | "trust"

export interface Fact {
  id: string                 // BMW-XXX
  text: string               // Headline text
  source: string             // PRS / ADR / ECI / etc.
  source_url?: string
  category: FactCategory
  caveat?: string
  era?: "17lh" | "18lh" | "longitudinal"
}

export const FACTS: Fact[] = [
  // ── Part 3: Surprising / counter-intuitive (BMW-160–185) ─────────────
  {
    id: "BMW-160",
    text: "The 17th Lok Sabha sat 274 days in 5 years (avg 55/yr) — the fewest of any full-term Lok Sabha, down from 135/yr in the 1st LS.",
    source: "PRS Legislative Research",
    source_url: "https://prsindia.org/parliamentvacancies/vital-stats",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-161",
    text: "Only 16% of bills were referred to committees in the 17th LS — versus 71% in the 15th LS.",
    source: "PRS Legislative Research",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-162",
    text: "35% of 17th Lok Sabha bills passed with under 1 hour of discussion.",
    source: "PRS / Indian Express",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-163",
    text: "The Farm Laws Repeal Bill (2021) passed the Lok Sabha in 4 minutes — 12:06 to 12:10 on 29 Nov 2021 — with zero debate.",
    source: "Lok Sabha record",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-164",
    text: "Three new criminal laws (BNS/BNSS/BSA) — replacing IPC, CrPC and the Evidence Act — were passed in Dec 2023 with 146 opposition MPs suspended.",
    source: "Multiple",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-165",
    text: "The 17th Lok Sabha had no Deputy Speaker for its entire term — a first in Indian history; violates Article 93.",
    source: "PRS Legislative Research",
    category: "parliamentary",
    era: "17lh",
    caveat: "Article 93 mandates the post but specifies no deadline.",
  },
  {
    id: "BMW-166",
    text: "BJP received ₹6,000+ cr of ₹12,769 cr in electoral bonds (47%) — more than the next six parties combined.",
    source: "SBI / ECI",
    source_url: "https://www.eci.gov.in",
    category: "financial",
    era: "longitudinal",
  },
  {
    id: "BMW-167",
    text: "182 of 405 (44.9%) MLAs who defected and re-contested between 2016–20 joined BJP; 42% of those defectors left INC.",
    source: "ADR",
    category: "electoral",
    era: "longitudinal",
  },
  {
    id: "BMW-168",
    text: "Future Gaming (under ED probe) was the #1 bond donor (₹1,365 cr), giving ₹542 cr to TMC and ₹503 cr to DMK.",
    source: "ECI / SBI",
    category: "financial",
    era: "longitudinal",
  },
  {
    id: "BMW-169",
    text: "Megha Engineering bought ₹100 cr of bonds within days of an ED raid — and gave ₹584 cr to BJP and ₹195 cr to BRS.",
    source: "Multiple",
    category: "financial",
    era: "longitudinal",
  },
  {
    id: "BMW-170",
    text: "Sonia Gandhi (INC) asked zero questions in the entire 17th Lok Sabha — as did Akhilesh Yadav (SP) and Shatrughan Sinha (TMC).",
    source: "PRS / ThePrint",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-171",
    text: "24 MPs in the 17th LS asked zero questions; 14 MPs participated in zero debates.",
    source: "PRS Legislative Research",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-172",
    text: "Atul Kumar Singh (BSP, Ghosi) had 1.5% attendance — yet served the full 17th LS term.",
    source: "PRS",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-173",
    text: "Only 2 MPs hit 100% attendance in the 17th LS: Mohan Mandavi (BJP, Kanker) and Bhagirath Chaudhary (BJP, Ajmer).",
    source: "PRS",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-174",
    text: "Maharashtra MPs asked 370 questions each on average — the highest of any state; 6 of the top-10 question askers were Maharashtrian.",
    source: "PRS",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-175",
    text: "Postgraduate MPs averaged 59 debates; those with up-to-higher-secondary averaged 34 — higher education correlates with more debate.",
    source: "PRS",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-176",
    text: "First-term MPs asked 199 questions on average; 6+ term MPs asked just 106. Tenure ≠ engagement.",
    source: "PRS",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-177",
    text: "Celebrity MPs' average attendance: 56.7% vs 79% for all MPs. Sunny Deol 17%, Mimi Chakraborty 21%, Nusrat Jahan 23%.",
    source: "IndiaSpend",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-178",
    text: "Only 14 Private Member Bills have ever become law since 1952; the last in 1970 — yet 729 PMBs were introduced in the 17th LS, with only 2 even discussed.",
    source: "PRS / Drishti",
    category: "parliamentary",
    era: "longitudinal",
  },
  {
    id: "BMW-179",
    text: "93% of 18th LS MPs are crorepatis — up from 58% in 2009.",
    source: "ADR",
    category: "financial",
    era: "18lh",
  },
  {
    id: "BMW-180",
    text: "Average MP wealth 2024 = ₹46.34 cr; BJP avg ₹50 cr; TDP avg ₹442 cr — skewed by Pemmasani's ₹5,705 cr.",
    source: "ADR",
    category: "financial",
    era: "18lh",
  },
  {
    id: "BMW-181",
    text: "Telangana's MPs are India's richest by average (₹262 cr/MP); Lakshadweep's the poorest (₹9.38 lakh).",
    source: "ADR",
    category: "financial",
    era: "18lh",
  },
  {
    id: "BMW-182",
    text: "18th LS: 46% of MPs have criminal cases; 31% serious — up from 29% and 21% in 2019 and 2009.",
    source: "ADR",
    category: "criminal",
    era: "18lh",
    caveat: "Distinguish 'any case' (often protest-related) from 'serious' (murder/rape/kidnap).",
  },
  {
    id: "BMW-183",
    text: "Women MP share: 4.5% (1952) → 14.4% (2019) → 13.6% (2024) — fell.",
    source: "ECI / Dataful",
    category: "gender",
    era: "longitudinal",
  },
  {
    id: "BMW-184",
    text: "Kerala elected zero women MPs in 2024 — from a 20-seat state.",
    source: "ECI",
    category: "gender",
    era: "18lh",
  },
  {
    id: "BMW-185",
    text: "FM Nirmala Sitharaman defended the electoral bond scheme weeks before the Supreme Court struck it down 5-0 as unconstitutional (15 Feb 2024).",
    source: "Supreme Court judgment",
    category: "financial",
    era: "18lh",
  },

  // ── Part 6: Daily DYK cards (BMW-226–250) — some overlap with above ──
  {
    id: "BMW-240",
    text: "Around 89% of the 2024 Union Budget was passed without discussion in the Lok Sabha.",
    source: "PRS Legislative Research (via Free Press Journal)",
    category: "parliamentary",
    era: "18lh",
  },
  {
    id: "BMW-241",
    text: "In 2023, the entire Union Budget passed without any discussion.",
    source: "PRS Legislative Research",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-242",
    text: "The 17th LS suspended MPs on 206 instances — the most in Indian history.",
    source: "Multiple",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-243",
    text: "In Dec 2023, 146 opposition MPs were suspended in one session — and the three new criminal laws were passed with them outside.",
    source: "Multiple",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-244",
    text: "Trust in the Election Commission fell from 78% to 58% between 2019 and 2024 (Lokniti-CSDS Pre-Poll surveys, 'some or great trust').",
    source: "Lokniti-CSDS",
    category: "trust",
    era: "longitudinal",
  },
  {
    id: "BMW-245",
    text: "Sunny Deol (Gurdaspur) attended 17% of 17th LS sittings, participated in 0 debates, asked 4 questions — and was paid his MP salary throughout.",
    source: "PRS",
    category: "attendance",
    era: "17lh",
  },
  {
    id: "BMW-246",
    text: "17 women MPs/MLAs are billionaires, with ₹100 cr+ in declared assets.",
    source: "ADR",
    category: "financial",
    era: "longitudinal",
  },
  {
    id: "BMW-247",
    text: "Unspent MPLADS funds doubled from 8.7% (16th LS) to 16% (17th LS).",
    source: "MoSPI",
    category: "financial",
    era: "longitudinal",
  },
  {
    id: "BMW-248",
    text: "Only 9% of 17th LS bills were passed with recorded voting — most were voice votes with no record of who voted yes or no.",
    source: "PRS",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-249",
    text: "The Jammu & Kashmir Reorganisation Bill was passed in 1.5 days, without committee referral.",
    source: "PRS bill track",
    category: "parliamentary",
    era: "17lh",
  },
  {
    id: "BMW-250",
    text: "121 candidates who declared themselves illiterate contested in 2024 — and all 121 lost.",
    source: "ADR",
    category: "electoral",
    era: "18lh",
  },
]

export const FACT_CATEGORIES: { key: FactCategory; label: string }[] = [
  { key: "parliamentary", label: "Parliamentary" },
  { key: "financial", label: "Financial" },
  { key: "electoral", label: "Electoral" },
  { key: "criminal", label: "Criminal" },
  { key: "gender", label: "Gender" },
  { key: "attendance", label: "Attendance" },
  { key: "trust", label: "Trust" },
]

/** Pick a deterministic daily fact based on the day-of-year. */
export function pickDailyFact(date = new Date()): Fact {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const diff = date.getTime() - start
  const doy = Math.floor(diff / (1000 * 60 * 60 * 24))
  return FACTS[doy % FACTS.length]
}
