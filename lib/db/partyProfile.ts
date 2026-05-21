// Party profile data — history, organisation snapshots, donor records, and
// legal cases against the party itself. Keyed by party slug.
//
// IMPORTANT: Real, verifiable data only. Where a real source URL is unknown,
// the `source_url` field is omitted entirely and `source_pending: true` is
// set instead. Do not fabricate URLs — the codebase has been bitten by this
// before. Empty arrays for any party we haven't hand-curated yet are fine;
// the UI renders a "Data being compiled" empty state.
//
// Conventions:
//   - donor amounts are in rupees (integer) so formatINR can render them.
//   - org snapshots are dated by year; UI exposes a year selector that picks
//     the snapshot whose `year` <= selectedYear (most recent valid).
//   - history events are sorted ascending by year in the UI.

export interface PartyHistoryEvent {
  year: number
  /** Month for sort stability when multiple events share a year. 1-12, optional. */
  month?: number
  /** Short kind tag — drives the dot color/icon in the timeline. */
  kind:
    | "founded"
    | "split"
    | "merger"
    | "alliance"
    | "election_win"
    | "election_loss"
    | "leadership"
    | "ideology"
    | "milestone"
    | "controversy"
  title: string
  description: string
  source_url?: string
  source_pending?: boolean
}

export interface OrgRole {
  /** Role title — President, General Secretary, Treasurer, Parliamentary Party Leader, etc. */
  role: string
  /** Person currently holding the role at this snapshot's year. */
  holder: string
  /** Optional: state/region the role is scoped to. */
  scope?: string
  /** Indentation level: 0 = top, 1 = direct report, 2 = sub-report. */
  level?: number
}

export interface PartyOrgSnapshot {
  /** Year this organisational structure was in effect. */
  year: number
  /** Optional one-line summary describing what changed this year. */
  note?: string
  roles: OrgRole[]
}

export interface PartyDonor {
  /** Donor name (individual, company, electoral trust, or "Electoral Bonds — anonymous"). */
  donor: string
  /** Rupees, integer. */
  amount_inr: number
  /** Financial year, e.g. "2022-23". */
  fy: string
  /** Source category — drives a small tag in the row. */
  kind: "electoral_bond" | "electoral_trust" | "corporate" | "individual" | "other"
  /** Optional source URL — ECI/ADR/news. Omit if not verifiable. */
  source_url?: string
  source_pending?: boolean
  /** Optional one-line note (e.g. "via Prudent Electoral Trust"). */
  note?: string
}

export interface PartyLegalCase {
  /** Year case was filed or major action taken. */
  year: number
  /** Filing agency or court — ED, CBI, EC, Supreme Court, Delhi HC, etc. */
  forum: string
  title: string
  description: string
  status: "pending" | "dismissed" | "closed" | "ongoing" | "settled"
  source_url?: string
  source_pending?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// BJP
// ─────────────────────────────────────────────────────────────────────────────

const BJP_HISTORY: PartyHistoryEvent[] = [
  {
    year: 1951,
    kind: "founded",
    title: "Bharatiya Jana Sangh founded",
    description:
      "Predecessor party founded by Syama Prasad Mookerjee in Delhi on 21 October 1951, after his break with Nehru's cabinet over Hindu-refugee policy.",
    source_url: "https://www.bjp.org/about-the-party/our-history",
  },
  {
    year: 1977,
    kind: "merger",
    title: "Merged into Janata Party",
    description:
      "Jana Sangh merged into the post-Emergency Janata Party coalition that defeated Indira Gandhi. The merger broke down by 1979 over the RSS dual-membership question.",
    source_url: "https://www.bjp.org/about-the-party/our-history",
  },
  {
    year: 1980,
    kind: "founded",
    title: "Bharatiya Janata Party founded",
    description:
      "Formed on 6 April 1980 after Janata Party broke up. Atal Bihari Vajpayee elected first national president.",
    source_url: "https://www.bjp.org/about-the-party/our-history",
  },
  {
    year: 1984,
    kind: "election_loss",
    title: "First general election: 2 Lok Sabha seats",
    description:
      "Won only 2 of 543 LS seats in the post-Indira-assassination wave. Lowest-ever showing.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 1989,
    kind: "alliance",
    title: "National Front outside support",
    description:
      "Supported V.P. Singh's National Front government from outside; withdrew in 1990 after the L.K. Advani Rath Yatra arrest.",
    source_pending: true,
  },
  {
    year: 1996,
    kind: "election_win",
    title: "Single largest party — first Vajpayee government (13 days)",
    description:
      "Won 161 LS seats. Vajpayee sworn in 16 May 1996; resigned 13 days later, failing to prove majority.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 1998,
    kind: "election_win",
    title: "NDA government formed",
    description:
      "Won 182 LS seats and formed the National Democratic Alliance. Government fell in 1999 after AIADMK withdrew support over Jayalalithaa demands.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 1999,
    kind: "election_win",
    title: "Full-term Vajpayee government",
    description:
      "Won 182 LS seats again; led NDA to a full five-year term — the first non-Congress government to complete its term.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2004,
    kind: "election_loss",
    title: "India Shining defeat",
    description:
      "Lost to UPA-1 despite the 'India Shining' campaign. Dropped to 138 LS seats.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2013,
    kind: "leadership",
    title: "Narendra Modi declared PM candidate",
    description:
      "BJP Parliamentary Board named Narendra Modi as the prime ministerial candidate on 13 September 2013, over L.K. Advani's reported objection.",
    source_pending: true,
  },
  {
    year: 2014,
    kind: "election_win",
    title: "First single-party majority since 1984",
    description:
      "Won 282 LS seats, the first single-party majority in 30 years. Narendra Modi sworn in as PM on 26 May 2014.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2019,
    kind: "election_win",
    title: "Re-elected with 303 seats",
    description:
      "Improved tally to 303 LS seats. NDA total 353. Modi sworn in for a second term on 30 May 2019.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2019,
    month: 8,
    kind: "milestone",
    title: "Article 370 abrogated",
    description:
      "Government revoked Jammu & Kashmir's special status under Article 370 and bifurcated the state into two Union Territories — fulfilling a core manifesto commitment.",
    source_url: "https://www.prsindia.org/billtrack/jammu-and-kashmir-reorganisation-bill-2019",
  },
  {
    year: 2024,
    kind: "election_win",
    title: "Third term, coalition majority",
    description:
      "Won 240 LS seats — short of majority on its own. Returned to power with NDA partners TDP and JD(U) providing the cushion.",
    source_url: "https://results.eci.gov.in/PcResultGenJune2024/index.htm",
  },
]

const BJP_ORG: PartyOrgSnapshot[] = [
  {
    year: 2024,
    note: "Post-2024 general election leadership",
    roles: [
      { role: "National President", holder: "J.P. Nadda", level: 0 },
      { role: "Prime Minister", holder: "Narendra Modi", level: 0 },
      { role: "Home Minister", holder: "Amit Shah", level: 1 },
      { role: "Defence Minister", holder: "Rajnath Singh", level: 1 },
      { role: "Leader of the House (Lok Sabha)", holder: "Narendra Modi", level: 1 },
      { role: "Leader of the House (Rajya Sabha)", holder: "J.P. Nadda", level: 1 },
      { role: "National General Secretary (Organisation)", holder: "B.L. Santhosh", level: 1 },
      { role: "National Treasurer", holder: "Rajesh Agarwal", level: 1 },
      { role: "BJP Parliamentary Board member", holder: "Nitin Gadkari", level: 2 },
      { role: "BJP Parliamentary Board member", holder: "Yogi Adityanath", level: 2 },
      { role: "BJP Parliamentary Board member", holder: "Sudha Yadav", level: 2 },
    ],
  },
  {
    year: 2020,
    note: "J.P. Nadda takes over as President from Amit Shah",
    roles: [
      { role: "National President", holder: "J.P. Nadda", level: 0 },
      { role: "Prime Minister", holder: "Narendra Modi", level: 0 },
      { role: "Home Minister", holder: "Amit Shah", level: 1 },
      { role: "Defence Minister", holder: "Rajnath Singh", level: 1 },
      { role: "Leader of the House (Lok Sabha)", holder: "Narendra Modi", level: 1 },
      { role: "National General Secretary (Organisation)", holder: "B.L. Santhosh", level: 1 },
    ],
  },
  {
    year: 2014,
    note: "First Modi government",
    roles: [
      { role: "National President", holder: "Amit Shah", level: 0 },
      { role: "Prime Minister", holder: "Narendra Modi", level: 0 },
      { role: "Home Minister", holder: "Rajnath Singh", level: 1 },
      { role: "Finance Minister", holder: "Arun Jaitley", level: 1 },
      { role: "External Affairs Minister", holder: "Sushma Swaraj", level: 1 },
      { role: "Leader of the House (Lok Sabha)", holder: "Narendra Modi", level: 1 },
      { role: "National General Secretary (Organisation)", holder: "Ramlal", level: 1 },
    ],
  },
  {
    year: 1999,
    note: "Second Vajpayee government — NDA-1",
    roles: [
      { role: "National President", holder: "Kushabhau Thakre", level: 0 },
      { role: "Prime Minister", holder: "Atal Bihari Vajpayee", level: 0 },
      { role: "Deputy Prime Minister / Home Minister", holder: "L.K. Advani", level: 1 },
      { role: "External Affairs Minister", holder: "Jaswant Singh", level: 1 },
      { role: "Defence Minister", holder: "George Fernandes (Samata Party)", level: 1 },
    ],
  },
]

// Electoral-bond figures are total declared receipts to the party per ADR's
// annual contribution-report analysis. Anonymous bond donors are aggregated.
const BJP_DONORS: PartyDonor[] = [
  {
    donor: "Electoral Bonds (anonymous donors, total)",
    amount_inr: 60_60_00_00_000, // ₹6,060 crore lifetime, ADR 2018-2024
    fy: "2018-19 to 2023-24",
    kind: "electoral_bond",
    source_url: "https://adrindia.org/content/analysis-electoral-bonds-encashed-political-parties",
    note: "BJP received the largest share of all electoral bonds redeemed before the scheme was struck down by the Supreme Court in February 2024.",
  },
  {
    donor: "Prudent Electoral Trust",
    amount_inr: 2_56_00_00_000, // ₹256 cr FY22-23
    fy: "2022-23",
    kind: "electoral_trust",
    source_url: "https://adrindia.org/content/analysis-contributions-electoral-trusts-political-parties-fy-2022-23",
    note: "Largest electoral-trust donor that year; pooled corporate contributions.",
  },
  {
    donor: "Triumph Electoral Trust",
    amount_inr: 50_00_00_000, // ₹50 cr FY22-23
    fy: "2022-23",
    kind: "electoral_trust",
    source_url: "https://adrindia.org/content/analysis-contributions-electoral-trusts-political-parties-fy-2022-23",
  },
  {
    donor: "Total declared income (annual audit)",
    amount_inr: 2_360_00_00_000, // ₹2,360 cr FY22-23
    fy: "2022-23",
    kind: "other",
    source_url: "https://adrindia.org/content/analysis-income-and-expenditure-national-political-parties-fy-2022-23",
    note: "Audit-report total income as filed with ECI.",
  },
]

const BJP_LEGAL: PartyLegalCase[] = [
  {
    year: 2024,
    forum: "Supreme Court of India",
    title: "Electoral Bonds scheme struck down",
    description:
      "Constitution bench unanimously held the Electoral Bonds scheme unconstitutional. BJP was the principal beneficiary and a respondent in the proceedings.",
    status: "closed",
    source_url: "https://main.sci.gov.in/supremecourt/2017/27935/27935_2017_1_1501_50573_Judgement_15-Feb-2024.pdf",
  },
  {
    year: 2024,
    forum: "Election Commission of India",
    title: "Model Code complaints — 2024 LS campaign",
    description:
      "Multiple MCC complaints filed against the PM and senior leaders for communally-charged speeches during the 2024 LS campaign. ECI issued notices to the BJP president to ensure star campaigner compliance.",
    status: "closed",
    source_url: "https://eci.gov.in/files/file/15876-letter-to-shri-jp-nadda-president-of-bjp-on-mcc-violations/",
  },
  {
    year: 2015,
    forum: "Delhi High Court / ECI",
    title: "Foreign-funding allegation (FCRA)",
    description:
      "Delhi HC held in March 2014 that BJP and INC had received donations from Vedanta subsidiaries in violation of FCRA. Both parties subsequently lobbied for retrospective FCRA amendments.",
    status: "closed",
    source_url: "https://indiankanoon.org/doc/127067786/",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// INC
// ─────────────────────────────────────────────────────────────────────────────

const INC_HISTORY: PartyHistoryEvent[] = [
  {
    year: 1885,
    kind: "founded",
    title: "Indian National Congress founded",
    description:
      "Founded in Bombay on 28 December 1885 by A.O. Hume, Dadabhai Naoroji and Dinshaw Wacha. Womesh Chunder Bonnerjee elected first president.",
    source_url: "https://www.inc.in/about-congress/history",
  },
  {
    year: 1907,
    kind: "split",
    title: "Surat split (Moderates vs Extremists)",
    description:
      "Congress split at the Surat session between the Moderate faction led by Gokhale and the Extremist faction led by Tilak.",
    source_url: "https://www.inc.in/about-congress/history",
  },
  {
    year: 1947,
    kind: "election_win",
    title: "Forms first government of independent India",
    description:
      "Jawaharlal Nehru sworn in as the first Prime Minister of independent India on 15 August 1947.",
    source_pending: true,
  },
  {
    year: 1969,
    kind: "split",
    title: "Congress split (O vs R)",
    description:
      "Party split into Congress (O) led by the Syndicate and Congress (R) led by Indira Gandhi. Indira's faction won the 1971 election decisively.",
    source_pending: true,
  },
  {
    year: 1975,
    kind: "controversy",
    title: "Emergency declared",
    description:
      "PM Indira Gandhi declared a state of internal Emergency on 25 June 1975 following the Allahabad HC verdict against her election. Lasted until March 1977.",
    source_pending: true,
  },
  {
    year: 1977,
    kind: "election_loss",
    title: "First post-Independence defeat",
    description:
      "Congress lost the post-Emergency election to the Janata Party coalition. Indira Gandhi lost her own Rae Bareli seat.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 1978,
    kind: "split",
    title: "Congress (I) formed",
    description:
      "Indira Gandhi formed Congress (I) — the 'I' faction — after a further split. This faction became today's INC.",
    source_pending: true,
  },
  {
    year: 1984,
    kind: "election_win",
    title: "Largest mandate in Indian history — 414 seats",
    description:
      "Rajiv Gandhi led Congress to 414 of 533 LS seats following Indira Gandhi's assassination — the largest single-party mandate ever in Indian elections.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 1991,
    kind: "election_win",
    title: "Narasimha Rao government, economic liberalisation",
    description:
      "P.V. Narasimha Rao led a minority Congress government that launched the 1991 liberalisation reforms with Manmohan Singh as Finance Minister.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 1999,
    kind: "split",
    title: "Sharad Pawar splits to form NCP",
    description:
      "Sharad Pawar, P.A. Sangma and Tariq Anwar were expelled and went on to form the Nationalist Congress Party over Sonia Gandhi's foreign origin.",
    source_pending: true,
  },
  {
    year: 2004,
    kind: "election_win",
    title: "UPA-1 government formed",
    description:
      "Congress led the United Progressive Alliance to victory; Manmohan Singh sworn in as Prime Minister on 22 May 2004.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2009,
    kind: "election_win",
    title: "UPA-2 re-elected, 206 LS seats",
    description:
      "Congress won 206 LS seats — best individual performance since 1991. Manmohan Singh re-sworn for a second term.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2014,
    kind: "election_loss",
    title: "Historic low — 44 seats",
    description:
      "Congress crashed to 44 LS seats, its worst-ever showing. Failed to win even the 10% required for Leader of Opposition status.",
    source_url: "https://eci.gov.in/statistical-report/statistical-reports/",
  },
  {
    year: 2022,
    kind: "leadership",
    title: "Kharge elected President — first non-Gandhi since 1998",
    description:
      "Mallikarjun Kharge elected Congress President in the October 2022 election, defeating Shashi Tharoor. First non-Gandhi to lead the party in 24 years.",
    source_url: "https://www.inc.in/leadership/national",
  },
  {
    year: 2024,
    kind: "election_win",
    title: "99 seats — best showing in a decade",
    description:
      "Congress nearly doubled its 2019 tally to 99 LS seats; Rahul Gandhi took up the Leader of Opposition role after the party crossed the 10% threshold for the first time since 2014.",
    source_url: "https://results.eci.gov.in/PcResultGenJune2024/index.htm",
  },
]

const INC_ORG: PartyOrgSnapshot[] = [
  {
    year: 2024,
    note: "Post-2024 LS election",
    roles: [
      { role: "Congress President", holder: "Mallikarjun Kharge", level: 0 },
      { role: "Leader of Opposition (Lok Sabha)", holder: "Rahul Gandhi", level: 0 },
      { role: "Leader of Opposition (Rajya Sabha)", holder: "Mallikarjun Kharge", level: 1 },
      { role: "General Secretary (Organisation)", holder: "K.C. Venugopal", level: 1 },
      { role: "Treasurer", holder: "Ajay Maken", level: 1 },
      { role: "Congress Working Committee (CWC) member", holder: "Sonia Gandhi", level: 2 },
      { role: "Congress Working Committee (CWC) member", holder: "Priyanka Gandhi Vadra", level: 2 },
      { role: "Congress Working Committee (CWC) member", holder: "P. Chidambaram", level: 2 },
      { role: "Congress Working Committee (CWC) member", holder: "Jairam Ramesh", level: 2 },
    ],
  },
  {
    year: 2022,
    note: "Kharge elected president; first non-Gandhi since 1998",
    roles: [
      { role: "Congress President", holder: "Mallikarjun Kharge", level: 0 },
      { role: "Leader of Congress Parliamentary Party", holder: "Sonia Gandhi", level: 0 },
      { role: "Leader of Opposition (Rajya Sabha)", holder: "Mallikarjun Kharge", level: 1 },
      { role: "General Secretary (Organisation)", holder: "K.C. Venugopal", level: 1 },
      { role: "Treasurer", holder: "Pawan Kumar Bansal", level: 1 },
    ],
  },
  {
    year: 2017,
    note: "Rahul Gandhi takes over as President",
    roles: [
      { role: "Congress President", holder: "Rahul Gandhi", level: 0 },
      { role: "UPA Chairperson", holder: "Sonia Gandhi", level: 0 },
      { role: "Leader in Lok Sabha", holder: "Mallikarjun Kharge", level: 1 },
      { role: "Leader of Opposition (Rajya Sabha)", holder: "Ghulam Nabi Azad", level: 1 },
    ],
  },
  {
    year: 2004,
    note: "UPA-1 government",
    roles: [
      { role: "Congress President", holder: "Sonia Gandhi", level: 0 },
      { role: "Prime Minister", holder: "Manmohan Singh", level: 0 },
      { role: "Finance Minister", holder: "P. Chidambaram", level: 1 },
      { role: "External Affairs Minister", holder: "Natwar Singh", level: 1 },
      { role: "Defence Minister", holder: "Pranab Mukherjee", level: 1 },
      { role: "General Secretary (Organisation)", holder: "Janardan Dwivedi", level: 1 },
    ],
  },
]

const INC_DONORS: PartyDonor[] = [
  {
    donor: "Electoral Bonds (anonymous donors, total)",
    amount_inr: 14_22_00_00_000, // ₹1,422 cr lifetime per ADR
    fy: "2018-19 to 2023-24",
    kind: "electoral_bond",
    source_url: "https://adrindia.org/content/analysis-electoral-bonds-encashed-political-parties",
    note: "Second-largest national-party recipient of electoral bonds before the scheme was struck down in February 2024.",
  },
  {
    donor: "Prudent Electoral Trust",
    amount_inr: 50_00_00_000,
    fy: "2022-23",
    kind: "electoral_trust",
    source_url: "https://adrindia.org/content/analysis-contributions-electoral-trusts-political-parties-fy-2022-23",
  },
  {
    donor: "Total declared income (annual audit)",
    amount_inr: 452_00_00_000, // ₹452 cr FY22-23 per ADR audit analysis
    fy: "2022-23",
    kind: "other",
    source_url: "https://adrindia.org/content/analysis-income-and-expenditure-national-political-parties-fy-2022-23",
    note: "Audit-report total income as filed with ECI.",
  },
]

const INC_LEGAL: PartyLegalCase[] = [
  {
    year: 2024,
    forum: "Income Tax Appellate Tribunal / Delhi HC",
    title: "Income-tax recovery — ₹135 crore",
    description:
      "ITAT and Delhi HC upheld an income-tax demand against the Congress party for AY 2018-19 over alleged delay in filing returns. Party bank accounts were temporarily frozen during the 2024 LS campaign.",
    status: "ongoing",
    source_url: "https://indiankanoon.org/doc/52814996/",
  },
  {
    year: 2024,
    forum: "Supreme Court of India",
    title: "Electoral Bonds scheme — petitioner alignment",
    description:
      "CPI(M) and ADR were the lead petitioners; Congress separately welcomed the ruling. Congress was a major recipient of the scheme being struck down.",
    status: "closed",
    source_url: "https://main.sci.gov.in/supremecourt/2017/27935/27935_2017_1_1501_50573_Judgement_15-Feb-2024.pdf",
  },
  {
    year: 2015,
    forum: "Delhi High Court",
    title: "Foreign-funding case (FCRA)",
    description:
      "Delhi HC held in March 2014 that Congress (along with BJP) had accepted donations from Vedanta subsidiaries in violation of FCRA. Government subsequently amended FCRA retrospectively.",
    status: "closed",
    source_url: "https://indiankanoon.org/doc/127067786/",
  },
  {
    year: 1985,
    forum: "Supreme Court / various",
    title: "Bofors investigation (legacy)",
    description:
      "Investigation into kickbacks in the 1986 Bofors howitzer deal dogged the Rajiv Gandhi government and successor administrations for decades. Multiple cases were ultimately closed or quashed.",
    status: "closed",
    source_pending: true,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Exports keyed by party slug
// ─────────────────────────────────────────────────────────────────────────────

export const PARTY_HISTORY: Record<string, PartyHistoryEvent[]> = {
  bjp: BJP_HISTORY,
  inc: INC_HISTORY,
}

export const PARTY_ORGANISATION: Record<string, PartyOrgSnapshot[]> = {
  bjp: BJP_ORG,
  inc: INC_ORG,
}

export const PARTY_DONORS: Record<string, PartyDonor[]> = {
  bjp: BJP_DONORS,
  inc: INC_DONORS,
}

export const PARTY_LEGAL_CASES: Record<string, PartyLegalCase[]> = {
  bjp: BJP_LEGAL,
  inc: INC_LEGAL,
}

// Map party slug → array of party_name short codes used in lib/db/staticMps*
// (so we can filter STATIC_MPS_ALL by party). Static-MPs uses ECI-style short
// codes; some parties share a slug but appear under multiple short codes
// historically (e.g. SHS / SS(UBT)).
export const PARTY_MP_SHORTCODES: Record<string, string[]> = {
  bjp: ["BJP"],
  inc: ["INC"],
  aap: ["AAP"],
  dmk: ["DMK"],
  aitc: ["AITC"],
  sp: ["SP"],
  "cpi-m": ["CPI(M)"],
  cpi: ["CPI"],
  "ncp-sp": ["Nationalist Congress Party Sharadchandra Pawar", "NCP(SP)"],
  "shs-ubt": ["SS(UBT)", "SHS(UBT)"],
  ysrcp: ["YSRCP"],
  bsp: ["BSP"],
}
