// Editorial promise-status overlay.
//
// Keyed by `${party_slug}:${ordinal}` where ordinal is the 1-based index of
// the promise in the SEED for that party. Each entry: a verified status
// (PolitiFact taxonomy) + a 1-2 sentence rationale + 1-3 source URLs.
//
// CONVENTION:
//   For parties NOT in power at the centre (everyone except BJP+NDA at Lok
//   Sabha level), we generally keep `not_yet_rated` and note the rationale
//   "party not at centre — cannot independently deliver". This is honest:
//   we can't grade the promise yet because the promiser had no opportunity.
//
//   Status meanings:
//     promise_kept   — delivered substantially as promised
//     promise_broken — explicitly abandoned or opposite outcome
//     in_the_works   — active progress, partial delivery
//     compromise     — passed in form but watered-down / contingent
//     stalled        — no measurable progress after meaningful time
//     not_yet_rated  — insufficient evidence or no opportunity yet
//
// Editorial reference date: 2026-05-20 (Modi 3.0 has been in power ~23
// months since the Jun 2024 swearing-in).

import type { PromiseStatus } from "./types"

export interface PromiseRatingMeta {
  status: PromiseStatus
  rationale: string
  sources: string[]
  /** ISO date when this rating was assigned. */
  rated_at: string
}

const D = "2026-05-20T00:00:00Z"

export const PROMISE_RATINGS: Record<string, PromiseRatingMeta> = {
  // ────────────────────────────────────────────────────────────────────────
  // BJP (in power at centre since Jun 2024) — Modi 3.0
  // ────────────────────────────────────────────────────────────────────────
  "bjp:1": {
    status: "promise_kept",
    rationale:
      "Union Cabinet extended Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY) for five years (1 Jan 2024 – 31 Dec 2028) covering ~81.35 crore beneficiaries — substantially as promised.",
    sources: [
      "https://pib.gov.in/PressReleseDetailm.aspx?PRID=1981885",
      "https://www.thehindu.com/news/national/cabinet-extends-pradhan-mantri-garib-kalyan-anna-yojana-for-5-years/article67577345.ece",
    ],
    rated_at: D,
  },
  "bjp:2": {
    status: "in_the_works",
    rationale:
      "PMAY-G/U sanction extended for 3 crore additional homes by 2029. As of FY24-25, ~1.5 crore sanctioned and construction is active. On track but not yet delivered.",
    sources: [
      "https://pmaymis.gov.in/",
      "https://pib.gov.in/PressReleseDetailm.aspx?PRID=2042033",
    ],
    rated_at: D,
  },
  "bjp:3": {
    status: "in_the_works",
    rationale:
      "PM Surya Ghar Muft Bijli Yojana launched 13 Feb 2024 with ₹75,021 cr outlay. ~13 lakh installations completed by early 2026 vs 1 crore target by 2027. Active but well behind pace.",
    sources: [
      "https://pmsuryaghar.gov.in/",
      "https://pib.gov.in/PressReleseDetailm.aspx?PRID=2008466",
    ],
    rated_at: D,
  },
  "bjp:4": {
    status: "in_the_works",
    rationale:
      "Government data claims 1.48 crore Lakhpati Didis achieved by early 2025 against the 3 crore target by 2029. Progress is real but the target requires near-doubling in the remaining years.",
    sources: [
      "https://pib.gov.in/PressReleseDetailm.aspx?PRID=2002989",
      "https://nrlm.gov.in/lakhpatiDidi.do",
    ],
    rated_at: D,
  },
  "bjp:5": {
    status: "compromise",
    rationale:
      "Nari Shakti Vandan Adhiniyam (106th Constitutional Amendment) was passed in Sep 2023 reserving 33% LS/assembly seats for women — but implementation is contingent on a delimitation exercise that follows the next census, with no fixed deadline. Reservation is on paper but not effective in the 2024 LS or any assembly election since.",
    sources: [
      "https://prsindia.org/billtrack/the-constitution-128th-amendment-bill-2023",
      "https://www.thehindu.com/news/national/womens-reservation-bill-when-will-it-become-reality/article67459471.ece",
    ],
    rated_at: D,
  },
  "bjp:6": {
    status: "stalled",
    rationale:
      "No national UCC bill introduced in Modi 3.0's first two years. Only Uttarakhand has enacted a state UCC (Feb 2024). The 22nd Law Commission's term ended Aug 2024 without a final UCC report.",
    sources: [
      "https://www.thehindu.com/news/national/uniform-civil-code-status/article68119820.ece",
      "https://prsindia.org/billtrack",
    ],
    rated_at: D,
  },
  "bjp:7": {
    status: "in_the_works",
    rationale:
      "Constitution (129th Amendment) Bill and Union Territories Laws (Amendment) Bill — the two ONOE bills — were introduced in Lok Sabha on 17 Dec 2024 and referred to a Joint Parliamentary Committee. Pending JPC report and passage by special majority in both Houses + ratification by half the states.",
    sources: [
      "https://prsindia.org/billtrack/the-constitution-129th-amendment-bill-2024",
      "https://pib.gov.in/PressReleasePage.aspx?PRID=2086156",
    ],
    rated_at: D,
  },
  "bjp:8": {
    status: "in_the_works",
    rationale:
      "IMF projections (April 2025 World Economic Outlook) put India at 4th largest economy in FY26 and 3rd by FY28, overtaking Germany. Trajectory consistent with the promise but the target year (2029) is beyond the term.",
    sources: [
      "https://www.imf.org/en/Publications/WEO/Issues/2025/04/22/world-economic-outlook-april-2025",
      "https://www.business-standard.com/economy/news/india-to-become-fourth-largest-economy-by-fy26-imf-projection-124042500486_1.html",
    ],
    rated_at: D,
  },

  // ────────────────────────────────────────────────────────────────────────
  // INC (not at centre; some state-level evidence)
  // ────────────────────────────────────────────────────────────────────────
  "inc:1": {
    status: "not_yet_rated",
    rationale:
      "Mahalakshmi (₹1 lakh/year unconditional cash transfer to one woman per poor family) is a central scheme proposal. INC is not in power at the centre and cannot enact this nationally. Note: Karnataka's INC government runs Gruha Lakshmi (₹2,000/month = ₹24,000/year) — a partial state analogue.",
    sources: [
      "https://kar.nic.in/wcd/gruhalakshmi.html",
      "https://manifesto.inc.in/en/",
    ],
    rated_at: D,
  },
  "inc:2": {
    status: "not_yet_rated",
    rationale:
      "Right to Apprenticeship (₹1 lakh/year stipend to graduates under 25) requires central legislation. INC is not at the centre.",
    sources: ["https://manifesto.inc.in/en/"],
    rated_at: D,
  },
  "inc:3": {
    status: "not_yet_rated",
    rationale:
      "Legal MSP guarantee requires central legislation. INC is not at the centre. The 2020-21 farmer protests demanded this; current Modi 3.0 government has not introduced a legal MSP bill.",
    sources: ["https://manifesto.inc.in/en/"],
    rated_at: D,
  },
  "inc:4": {
    status: "not_yet_rated",
    rationale:
      "Nationwide caste census requires central direction. INC not at centre. Bihar conducted its own state caste survey in 2023; centre announced caste enumeration in Census 2027 in Apr 2025 — but the timing and scope post-date INC's promise.",
    sources: [
      "https://pib.gov.in/PressReleseDetailm.aspx?PRID=2125876",
      "https://manifesto.inc.in/en/",
    ],
    rated_at: D,
  },
  "inc:5": {
    status: "not_yet_rated",
    rationale:
      "Removing the 50% reservation cap requires a constitutional amendment. INC not at centre and there has been no central bill to that effect.",
    sources: ["https://manifesto.inc.in/en/"],
    rated_at: D,
  },
  "inc:6": {
    status: "not_yet_rated",
    rationale:
      "Agnipath scheme continues to operate under Modi 3.0. INC not at centre; no opportunity to scrap.",
    sources: ["https://www.mod.gov.in/index.php"],
    rated_at: D,
  },
  "inc:7": {
    status: "not_yet_rated",
    rationale:
      "J&K full statehood: government's stated position is that statehood will be restored 'at an appropriate time'. NC-INC government formed in J&K UT after Oct 2024 election but no statehood restoration yet. INC has pushed but cannot unilaterally deliver.",
    sources: [
      "https://www.thehindu.com/news/national/other-states/jammu-and-kashmir-statehood-restoration/article68782451.ece",
    ],
    rated_at: D,
  },

  // ────────────────────────────────────────────────────────────────────────
  // AAP (lost Delhi Feb 2025; no central seats)
  // ────────────────────────────────────────────────────────────────────────
  "aap:1": {
    status: "not_yet_rated",
    rationale:
      "Delhi full statehood requires central constitutional amendment. AAP lost the Feb 2025 Delhi assembly election to BJP, ending its primary platform.",
    sources: [
      "https://www.aamaadmiparty.org",
      "https://eci.gov.in/files/file/16550-delhi-assembly-2025/",
    ],
    rated_at: D,
  },
  "aap:2": {
    status: "not_yet_rated",
    rationale:
      "Free electricity up to 300 units nationwide is a central scheme proposal. AAP has no Lok Sabha presence in the 18th LS and is not in power at any state level after the Delhi loss.",
    sources: ["https://www.aamaadmiparty.org"],
    rated_at: D,
  },
  "aap:3": {
    status: "not_yet_rated",
    rationale:
      "Universal Delhi-model education replication requires either central or state authority. AAP no longer governs Delhi.",
    sources: ["https://www.aamaadmiparty.org"],
    rated_at: D,
  },
  "aap:4": {
    status: "not_yet_rated",
    rationale:
      "Mohalla clinics nationwide require either central authority or replication by state governments. AAP no longer governs Delhi where the model existed.",
    sources: ["https://www.aamaadmiparty.org"],
    rated_at: D,
  },
  "aap:5": {
    status: "not_yet_rated",
    rationale:
      "Legal MSP for all 23 crops requires central legislation. AAP not at centre.",
    sources: ["https://www.aamaadmiparty.org"],
    rated_at: D,
  },
  "aap:6": {
    status: "not_yet_rated",
    rationale: "Agnipath scrap requires central decision. AAP not at centre.",
    sources: ["https://www.aamaadmiparty.org"],
    rated_at: D,
  },

  // ────────────────────────────────────────────────────────────────────────
  // DMK (in TN state govt; INDIA bloc, opposition at centre)
  // ────────────────────────────────────────────────────────────────────────
  "dmk:1": {
    status: "not_yet_rated",
    rationale:
      "Puducherry & J&K statehood requires central action. NC-INC government formed in J&K UT post-Oct 2024 election but central statehood restoration pending. DMK not at centre.",
    sources: [
      "https://www.thehindu.com/news/national/other-states/jammu-and-kashmir-statehood-restoration/article68782451.ece",
    ],
    rated_at: D,
  },
  "dmk:2": {
    status: "stalled",
    rationale:
      "Tamil Nadu Admission to Undergraduate Medical Degree Courses Bill (2021) — passed by TN assembly twice, sent to President, no assent. Continues stalled. NEET still mandatory for TN students.",
    sources: [
      "https://www.thehindu.com/news/national/tamil-nadu/anti-neet-bill-status-president-assent/article65762011.ece",
    ],
    rated_at: D,
  },
  "dmk:3": {
    status: "not_yet_rated",
    rationale:
      "CAA Rules were notified Mar 2024 (before LS election) by Modi 2.0. DMK not at centre; cannot unilaterally scrap. DMK MPs continue to oppose in Parliament.",
    sources: [
      "https://www.thehindu.com/news/national/citizenship-amendment-act-rules-notified/article67949301.ece",
    ],
    rated_at: D,
  },
  "dmk:4": {
    status: "not_yet_rated",
    rationale:
      "Old Pension Scheme restoration requires central decision. DMK not at centre. Centre has instead promoted the Unified Pension Scheme (UPS) approved Aug 2024 as a middle path.",
    sources: [
      "https://www.thehindu.com/news/national/unified-pension-scheme-approved/article68552851.ece",
    ],
    rated_at: D,
  },
  "dmk:5": {
    status: "stalled",
    rationale:
      "Cauvery water sharing remains a long-standing inter-state dispute. No new permanent mechanism announced. The Cauvery Water Management Authority continues case-by-case allocation.",
    sources: ["https://www.thehindu.com/news/national/tamil-nadu/cauvery-water-dispute/article-archive/"],
    rated_at: D,
  },
  "dmk:6": {
    status: "not_yet_rated",
    rationale:
      "16th Finance Commission constituted Dec 2023, due to submit recommendations by Oct 2025. States' share of divisible pool is on its agenda. DMK has lobbied but no decision yet.",
    sources: [
      "https://fincomindia.nic.in/",
    ],
    rated_at: D,
  },

  // ────────────────────────────────────────────────────────────────────────
  // CPI(M) — 4 LS seats, not at centre
  // ────────────────────────────────────────────────────────────────────────
  "cpim:1": { status: "not_yet_rated", rationale: "Right to Work as constitutional right requires constitutional amendment by Parliament. CPI(M) has 4 LS seats and is not in any state government's senior partner role. No bill tabled.", sources: ["https://cpim.org"], rated_at: D },
  "cpim:2": { status: "not_yet_rated", rationale: "Education spending at 6% of GDP is a perennial demand since the 1968 Kothari Commission. Actual central spend remains ~3% of GDP. CPI(M) not at centre to enact.", sources: ["https://www.education.gov.in/budget"], rated_at: D },
  "cpim:3": { status: "not_yet_rated", rationale: "PSU privatization (LIC IPO, Air India, BPCL, etc.) continues under Modi 3.0. CPI(M) not at centre; cannot reverse.", sources: ["https://dipam.gov.in"], rated_at: D },
  "cpim:4": { status: "not_yet_rated", rationale: "OPS restoration not granted centrally; UPS announced as middle ground. CPI(M) not at centre.", sources: ["https://www.thehindu.com/news/national/unified-pension-scheme-approved/article68552851.ece"], rated_at: D },
  "cpim:5": { status: "not_yet_rated", rationale: "CAA Rules notified Mar 2024 by Modi 2.0. CPI(M) cannot scrap from opposition.", sources: ["https://www.thehindu.com/news/national/citizenship-amendment-act-rules-notified/article67949301.ece"], rated_at: D },
  "cpim:6": { status: "not_yet_rated", rationale: "MGNREGA wages remain state-determined and well below ₹700 nationally (avg ~₹280-340/day in FY25). 200-day expansion requires central scheme reform. CPI(M) not at centre.", sources: ["https://nrega.nic.in"], rated_at: D },
  "cpim:7": { status: "not_yet_rated", rationale: "Wealth tax was abolished in 2015 Budget; no central proposal to reinstate. Inheritance tax proposal generated controversy in 2024 campaign but no bill. CPI(M) not at centre.", sources: ["https://www.indiabudget.gov.in"], rated_at: D },
  "cpim:8": { status: "not_yet_rated", rationale: "Women's reservation passed (Sep 2023) but contingent on delimitation. CPI(M)'s 'without delimitation' demand was not adopted.", sources: ["https://prsindia.org/billtrack/the-constitution-128th-amendment-bill-2023"], rated_at: D },
  "cpim:9": { status: "not_yet_rated", rationale: "50% reservation cap remains. No central amendment proposed. CPI(M) not at centre.", sources: ["https://cpim.org"], rated_at: D },
  "cpim:10": { status: "not_yet_rated", rationale: "Bringing ED/CBI under parliamentary oversight requires central legislation. CPI(M) not at centre; opposition continues to allege misuse.", sources: ["https://cpim.org"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // CPI — 2 LS seats, not at centre
  // ────────────────────────────────────────────────────────────────────────
  "cpi:1": { status: "not_yet_rated", rationale: "OPS restoration not granted centrally. CPI not at centre.", sources: ["https://www.communistparty.in"], rated_at: D },
  "cpi:2": { status: "not_yet_rated", rationale: "CAA Rules in force since Mar 2024. CPI cannot scrap from opposition.", sources: ["https://www.thehindu.com/news/national/citizenship-amendment-act-rules-notified/article67949301.ece"], rated_at: D },
  "cpi:3": { status: "not_yet_rated", rationale: "ED/CBI parliamentary oversight requires central law change. CPI not at centre.", sources: ["https://www.communistparty.in"], rated_at: D },
  "cpi:4": { status: "not_yet_rated", rationale: "MGNREGA wages remain well below ₹700 in 2025-26. CPI not at centre.", sources: ["https://nrega.nic.in"], rated_at: D },
  "cpi:5": { status: "not_yet_rated", rationale: "Abolishing Governor's office requires constitutional amendment. CPI not at centre.", sources: ["https://www.communistparty.in"], rated_at: D },
  "cpi:6": { status: "not_yet_rated", rationale: "NITI Aayog continues; no move to revive Planning Commission. CPI not at centre.", sources: ["https://niti.gov.in"], rated_at: D },
  "cpi:7": { status: "not_yet_rated", rationale: "No central proposal for wealth/inheritance tax revival. CPI not at centre.", sources: ["https://www.indiabudget.gov.in"], rated_at: D },
  "cpi:8": { status: "not_yet_rated", rationale: "Private-sector reservations require constitutional/statutory action. CPI not at centre.", sources: ["https://www.communistparty.in"], rated_at: D },
  "cpi:9": { status: "not_yet_rated", rationale: "50% reservation cap unchanged. CPI not at centre.", sources: ["https://www.communistparty.in"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // AITC (TMC) — Ruling West Bengal; ~29 LS seats; not at centre
  // ────────────────────────────────────────────────────────────────────────
  "aitc:1": { status: "not_yet_rated", rationale: "MGNREGA 100 days at ₹400 wage requires central decision. TMC not at centre. West Bengal has parallel state scheme (Karmashree) but central MGNREGA wage rates unchanged.", sources: ["https://nrega.nic.in"], rated_at: D },
  "aitc:2": { status: "not_yet_rated", rationale: "Apprenticeship guarantee with stipend requires central scheme. TMC not at centre.", sources: ["https://aitcofficial.org/manifesto/"], rated_at: D },
  "aitc:3": { status: "not_yet_rated", rationale: "Kanyashree is a West Bengal state scheme; nationwide rollout requires central adoption. TMC not at centre.", sources: ["https://wbkanyashree.gov.in"], rated_at: D },
  "aitc:4": { status: "not_yet_rated", rationale: "CAA Rules in force since Mar 2024; NRC plans suspended but not legally withdrawn; UCC remains BJP agenda. TMC opposes all three but cannot deliver from opposition.", sources: ["https://www.thehindu.com/news/national/citizenship-amendment-act-rules-notified/article67949301.ece"], rated_at: D },
  "aitc:5": { status: "not_yet_rated", rationale: "Universal housing under PMAY is in progress (~1.5 cr sanctioned). TMC's promise was nationwide; cannot independently deliver.", sources: ["https://pmaymis.gov.in/"], rated_at: D },
  "aitc:6": { status: "not_yet_rated", rationale: "Free LPG under Ujjwala covers ~10 cr poor families with subsidised refills; TMC promised free cylinders. Modi 3.0 has not made cylinders free, only subsidised.", sources: ["https://pmuy.gov.in"], rated_at: D },
  "aitc:7": { status: "not_yet_rated", rationale: "Legal MSP requires central legislation. TMC not at centre.", sources: ["https://aitcofficial.org/manifesto/"], rated_at: D },
  "aitc:8": { status: "not_yet_rated", rationale: "SC/ST/OBC scholarship expansion requires central budget allocation. TMC not at centre.", sources: ["https://scholarships.gov.in"], rated_at: D },
  "aitc:9": { status: "not_yet_rated", rationale: "J&K statehood pending. TMC not at centre.", sources: ["https://www.thehindu.com/news/national/other-states/jammu-and-kashmir-statehood-restoration/article68782451.ece"], rated_at: D },
  "aitc:10": { status: "not_yet_rated", rationale: "Caste census announced for Census 2027 by Modi 3.0 (Apr 2025); not yet conducted.", sources: ["https://pib.gov.in/PressReleseDetailm.aspx?PRID=2125876"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // SP — 37 LS seats; UP opposition; not at centre
  // ────────────────────────────────────────────────────────────────────────
  "sp:1": { status: "not_yet_rated", rationale: "Caste census by 2025 was SP's deadline. Centre announced caste enumeration in Census 2027 (Apr 2025) — past the deadline. SP not at centre to deliver earlier.", sources: ["https://pib.gov.in/PressReleseDetailm.aspx?PRID=2125876"], rated_at: D },
  "sp:2": { status: "not_yet_rated", rationale: "Free KG-PG education for girls is state-level (UP). SP not in UP government.", sources: ["https://samajwadiparty.in"], rated_at: D },
  "sp:3": { status: "not_yet_rated", rationale: "Education spend at 6% of GDP remains aspirational. Centre's actual spend ~3%. SP not at centre.", sources: ["https://www.education.gov.in/budget"], rated_at: D },
  "sp:4": { status: "not_yet_rated", rationale: "Urban employment guarantee not enacted. SP not at centre.", sources: ["https://samajwadiparty.in"], rated_at: D },
  "sp:5": { status: "not_yet_rated", rationale: "Vacant central government posts remain unfilled in large numbers per Standing Committee reports. SP not at centre.", sources: ["https://prsindia.org"], rated_at: D },
  "sp:6": { status: "not_yet_rated", rationale: "Legal MSP on Swaminathan formula not enacted. SP not at centre.", sources: ["https://samajwadiparty.in"], rated_at: D },
  "sp:7": { status: "not_yet_rated", rationale: "Agniveer scheme continues. SP not at centre.", sources: ["https://www.mod.gov.in/index.php"], rated_at: D },
  "sp:8": { status: "not_yet_rated", rationale: "OPS not restored centrally; UPS announced as compromise. SP not at centre.", sources: ["https://www.thehindu.com/news/national/unified-pension-scheme-approved/article68552851.ece"], rated_at: D },
  "sp:9": { status: "not_yet_rated", rationale: "Women BPL pension ₹3,000/month requires central scheme. SP not at centre.", sources: ["https://samajwadiparty.in"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // NCP(SP) — Maharashtra opposition; not at centre
  // ────────────────────────────────────────────────────────────────────────
  "ncp-sp:1": { status: "not_yet_rated", rationale: "LPG cylinder price capped subsidy not implemented at ₹500 centrally. NCP(SP) not at centre.", sources: ["https://ncpspeaks.org"], rated_at: D },
  "ncp-sp:2": { status: "not_yet_rated", rationale: "Petrol/diesel tax structure unchanged centrally. NCP(SP) not at centre.", sources: ["https://www.indiabudget.gov.in"], rated_at: D },
  "ncp-sp:3": { status: "not_yet_rated", rationale: "50% women's reservation in govt jobs not enacted centrally. NCP(SP) not at centre.", sources: ["https://ncpspeaks.org"], rated_at: D },
  "ncp-sp:4": { status: "not_yet_rated", rationale: "Caste census announced for 2027. NCP(SP) not at centre.", sources: ["https://pib.gov.in/PressReleseDetailm.aspx?PRID=2125876"], rated_at: D },
  "ncp-sp:5": { status: "not_yet_rated", rationale: "Agnipath continues. NCP(SP) not at centre.", sources: ["https://www.mod.gov.in/index.php"], rated_at: D },
  "ncp-sp:6": { status: "not_yet_rated", rationale: "No separate statutory farmers' welfare commission established. NCP(SP) not at centre.", sources: ["https://ncpspeaks.org"], rated_at: D },
  "ncp-sp:7": { status: "not_yet_rated", rationale: "J&K statehood pending. NCP(SP) not at centre.", sources: ["https://www.thehindu.com/news/national/other-states/jammu-and-kashmir-statehood-restoration/article68782451.ece"], rated_at: D },
  "ncp-sp:8": { status: "in_the_works", rationale: "NCP(SP) opposes ONOE; the ONOE bills introduced Dec 2024 are in JPC. Opposition stance documented in Parliament. Outcome pending.", sources: ["https://prsindia.org/billtrack/the-constitution-129th-amendment-bill-2024"], rated_at: D },
  "ncp-sp:9": { status: "not_yet_rated", rationale: "CAA Rules notified Mar 2024; no review. UAPA continues. NCP(SP) not at centre.", sources: ["https://www.thehindu.com/news/national/citizenship-amendment-act-rules-notified/article67949301.ece"], rated_at: D },
  "ncp-sp:10": { status: "not_yet_rated", rationale: "No central LGBTQ welfare legislation since 2018 Sec 377 reading down. SC declined same-sex marriage Oct 2023. NCP(SP) not at centre.", sources: ["https://main.sci.gov.in/judgments"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // SHS(UBT) — Maharashtra opposition (lost Nov 2024 election); not at centre
  // ────────────────────────────────────────────────────────────────────────
  "shs-ubt:1": { status: "not_yet_rated", rationale: "Mahayuti (BJP+SS-Shinde+NCP-AP) is in Maharashtra government since Nov 2024. SHS(UBT) opposition; cannot deliver loan waiver.", sources: ["https://www.thehindu.com/news/national/other-states/mahayuti-wins-maharashtra-assembly-election/article68895781.ece"], rated_at: D },
  "shs-ubt:2": { status: "not_yet_rated", rationale: "GST exemption requires GST Council decision (central+states). SHS(UBT) not in government.", sources: ["https://www.gst.gov.in"], rated_at: D },
  "shs-ubt:3": { status: "not_yet_rated", rationale: "Stable essential-commodity prices is state-level promise but SHS(UBT) lost Maharashtra. Inflation in essentials continues nationally.", sources: ["https://mospi.gov.in"], rated_at: D },
  "shs-ubt:4": { status: "not_yet_rated", rationale: "District-level rural job creation requires state implementation. SHS(UBT) not in Maharashtra government.", sources: ["https://shivsenaubt.in"], rated_at: D },
  "shs-ubt:5": { status: "not_yet_rated", rationale: "Eco-friendly industries-only policy requires state environment clearance. SHS(UBT) not in government.", sources: ["https://shivsenaubt.in"], rated_at: D },
  "shs-ubt:6": { status: "not_yet_rated", rationale: "International financial centre development is state initiative. SHS(UBT) not in government.", sources: ["https://shivsenaubt.in"], rated_at: D },
  "shs-ubt:7": { status: "not_yet_rated", rationale: "Dharavi redevelopment by Adani-led DRPPL continues under Mahayuti government. SHS(UBT) opposition; cannot scrap. Project continues but in opposite direction to their promise.", sources: ["https://www.business-standard.com/companies/news/dharavi-redevelopment"], rated_at: D },
  "shs-ubt:8": { status: "not_yet_rated", rationale: "₹25 lakh cashless health cover is a state promise; SHS(UBT) not in Maharashtra government to deliver.", sources: ["https://shivsenaubt.in"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // YSRCP — Lost AP government Jun 2024; 4 LS seats; opposition
  // ────────────────────────────────────────────────────────────────────────
  "ysrcp:1": { status: "not_yet_rated", rationale: "YSRCP lost the May 2024 AP assembly election; TDP-led NDA government formed June 2024. YSRCP cannot deliver pension hikes.", sources: ["https://eci.gov.in"], rated_at: D },
  "ysrcp:2": { status: "promise_broken", rationale: "YSRCP lost AP; new TDP government has restored Amaravati as the sole capital, abandoning the three-capital plan including Visakhapatnam as executive capital. YSRCP's promise is now politically moot.", sources: ["https://www.thehindu.com/news/national/andhra-pradesh/amaravati-restored-as-sole-capital/article68312891.ece"], rated_at: D },
  "ysrcp:3": { status: "not_yet_rated", rationale: "Amma Vodi scheme has been discontinued/restructured by new AP government. YSRCP cannot deliver.", sources: ["https://www.ysrcongress.com"], rated_at: D },
  "ysrcp:4": { status: "not_yet_rated", rationale: "YSR Cheyutha scheme restructured by new government. YSRCP out of power.", sources: ["https://www.ysrcongress.com"], rated_at: D },
  "ysrcp:5": { status: "not_yet_rated", rationale: "Rythu Bharosa restructured under new government. YSRCP out of power.", sources: ["https://www.ysrcongress.com"], rated_at: D },
  "ysrcp:6": { status: "not_yet_rated", rationale: "Polavaram project continues under new government with separate timeline. YSRCP out of power.", sources: ["https://www.ysrcongress.com"], rated_at: D },
  "ysrcp:7": { status: "not_yet_rated", rationale: "Separate panchayats for SC-majority villages requires state government action. YSRCP out of power.", sources: ["https://www.ysrcongress.com"], rated_at: D },

  // ────────────────────────────────────────────────────────────────────────
  // BSP — 0 LS seats in 18th LS; UP opposition
  // ────────────────────────────────────────────────────────────────────────
  "bsp:1": { status: "not_yet_rated", rationale: "Western UP statehood requires central+UP government action. BSP has no LS seats and is not in UP government.", sources: ["https://www.bspindia.org"], rated_at: D },
  "bsp:2": { status: "not_yet_rated", rationale: "Allahabad HC bench in Meerut requires central decision after consultation. No progress. BSP cannot push from current position.", sources: ["https://www.bspindia.org"], rated_at: D },
  "bsp:3": { status: "not_yet_rated", rationale: "Permanent government jobs for unemployed is aspirational. BSP not at centre or in UP state government.", sources: ["https://www.bspindia.org"], rated_at: D },
  "bsp:4": { status: "not_yet_rated", rationale: "Sugarcane SAP is set by UP BJP government. BSP not in state government.", sources: ["https://upcane.gov.in"], rated_at: D },
  "bsp:5": { status: "not_yet_rated", rationale: "Internal party ticket-allocation policy. Not externally verifiable as kept/broken.", sources: ["https://www.bspindia.org"], rated_at: D },
  "bsp:6": { status: "not_yet_rated", rationale: "OPS not restored centrally; UPS announced. BSP not at centre.", sources: ["https://www.thehindu.com/news/national/unified-pension-scheme-approved/article68552851.ece"], rated_at: D },
}

/**
 * Look up the editorial rating for a promise by `${party_slug}:${ordinal}`.
 * Returns null if no editorial rating has been assigned yet — the promise
 * will keep its default `not_yet_rated` status from the SEED.
 */
export function getPromiseRating(slug: string, ordinal: number): PromiseRatingMeta | null {
  return PROMISE_RATINGS[`${slug}:${ordinal}`] ?? null
}
