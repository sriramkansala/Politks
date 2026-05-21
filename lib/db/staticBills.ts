// Static fallback for bills / mps / stage_events / issue_graph_edges / promise_ancestry.
// Mirrors supabase/seed_wrb_forensic.sql plus ~10 additional major 17th & 18th Lok Sabha bills.

import type {
  Bill,
  Mp,
  StageEvent,
  IssueGraphEdge,
  PromiseAncestry,
  BillVersion,
  BillClause,
} from "./types"
import { STATIC_PROMISES, STATIC_PARTIES } from "./staticData"

const bjpId = STATIC_PARTIES.find((p) => p.slug === "bjp")!.id
const incId = STATIC_PARTIES.find((p) => p.slug === "inc")!.id
const now = "2024-04-15T00:00:00Z"

// Deterministic UUIDs matching the SQL seed for WRB so /bills/wrb-2023 etc resolve cleanly
const wrb1996 = "bb000001-0000-0000-0000-000000000001"
const wrb1998 = "bb000001-0000-0000-0000-000000000002"
const wrb1999 = "bb000001-0000-0000-0000-000000000003"
const wrb2008 = "bb000001-0000-0000-0000-000000000004"
const wrb2023 = "bb000001-0000-0000-0000-000000000005"

const mpGeeta = "aa000001-0000-0000-0000-000000000001"
const mpSpyadav = "aa000001-0000-0000-0000-000000000002"
const mpOwaisi = "aa000001-0000-0000-0000-000000000003"
const mpJaleel = "aa000001-0000-0000-0000-000000000004"
const mpMeghwal = "aa000001-0000-0000-0000-000000000005"
const mpNirmala = "aa000001-0000-0000-0000-000000000006"

// Find BJP & INC women's-reservation promise IDs to link to wrb-2023
const womenPromiseBjp = STATIC_PROMISES.find(
  (p) => p.party_id === bjpId && /women.*reservation/i.test(p.title)
)?.id ?? null
const womenPromiseInc = STATIC_PROMISES.find(
  (p) => p.party_id === incId && /women.*reservation/i.test(p.title)
)?.id ?? null

const mkMp = (
  id: string,
  name: string,
  party_name: string | null,
  party_id: string | null,
  house: "lok_sabha" | "rajya_sabha",
  constituency: string | null,
  state_code: string | null,
  term_start: string | null,
  term_end: string | null
): Mp => ({
  id,
  name,
  name_translations: {},
  party_id,
  party_name,
  house,
  constituency,
  state_code,
  term_start,
  term_end,
  photo_url: null,
  myneta_id: null,
  created_at: now,
})

export const STATIC_MPS: Mp[] = [
  mkMp(mpGeeta, "Geeta Mukherjee", "CPI", null, "lok_sabha", "Panskura", "WB", "1989-01-01", "1999-01-01"),
  mkMp(mpSpyadav, "Surendra Prakash Yadav", "RJD", null, "lok_sabha", "Buxar", "BR", "1996-01-01", "1999-01-01"),
  mkMp(mpOwaisi, "Asaduddin Owaisi", "AIMIM", null, "lok_sabha", "Hyderabad", "TS", "2004-01-01", null),
  mkMp(mpJaleel, "Syed Imtiaz Jaleel", "AIMIM", null, "lok_sabha", "Aurangabad", "MH", "2019-01-01", "2024-01-01"),
  mkMp(mpMeghwal, "Arjun Ram Meghwal", "BJP", bjpId, "lok_sabha", "Bikaner", "RJ", "2009-01-01", null),
  mkMp(mpNirmala, "Nirmala Sitharaman", "BJP", bjpId, "rajya_sabha", null, "KA", "2016-01-01", null),
]

const mkBill = (
  partial: Partial<Bill> & { id: string; slug: string; title: string }
): Bill => ({
  id: partial.id,
  slug: partial.slug,
  title: partial.title,
  short_title: partial.short_title ?? null,
  bill_number: partial.bill_number ?? null,
  bill_type: partial.bill_type ?? null,
  house_introduced: partial.house_introduced ?? null,
  introduced_date: partial.introduced_date ?? null,
  mover_mp_id: partial.mover_mp_id ?? null,
  mover_party_id: partial.mover_party_id ?? null,
  ministry: partial.ministry ?? null,
  current_stage: partial.current_stage ?? null,
  predecessor_bill_id: partial.predecessor_bill_id ?? null,
  promise_ids: partial.promise_ids ?? [],
  is_money_bill_claimed: partial.is_money_bill_claimed ?? false,
  outcome: partial.outcome ?? null,
  lok_sabha_ayes: partial.lok_sabha_ayes ?? null,
  lok_sabha_noes: partial.lok_sabha_noes ?? null,
  rajya_sabha_ayes: partial.rajya_sabha_ayes ?? null,
  rajya_sabha_noes: partial.rajya_sabha_noes ?? null,
  assent_date: partial.assent_date ?? null,
  claude_summary: partial.claude_summary ?? null,
  created_at: now,
})

export const STATIC_BILLS: Bill[] = [
  // ── WRB chain ─────────────────────────────────────────────────────────
  mkBill({
    id: wrb1996, slug: "wrb-1996",
    title: "The Constitution (81st Amendment) Bill, 1996",
    short_title: "Women's Reservation Bill 1996",
    bill_number: "CAB-81/1996", bill_type: "constitutional",
    house_introduced: "lok_sabha", introduced_date: "1996-09-12",
    ministry: "Ministry of Law and Justice", current_stage: 7, outcome: "lapsed",
    claude_summary:
      "First attempt at 33% reservation for women in Parliament. Referred to the Geeta Mukherjee JPC, which received 102 memoranda. Lapsed with the 11th Lok Sabha dissolution.",
  }),
  mkBill({
    id: wrb1998, slug: "wrb-1998",
    title: "The Constitution (84th Amendment) Bill, 1998",
    short_title: "Women's Reservation Bill 1998",
    bill_number: "CAB-84/1998", bill_type: "constitutional",
    house_introduced: "lok_sabha", introduced_date: "1998-01-01",
    mover_party_id: bjpId, ministry: "Ministry of Law and Justice",
    current_stage: 6, outcome: "lapsed",
    predecessor_bill_id: wrb1996,
    claude_summary:
      'Re-introduced by Vajpayee government. RJD MP Surendra Prakash Yadav snatched the bill from the Law Minister and tore it at the Speaker\'s table. The "Yadav triumvirate" opposed on OBC-quota grounds. Lapsed with the 12th Lok Sabha.',
  }),
  mkBill({
    id: wrb1999, slug: "wrb-1999",
    title: "The Constitution (85th Amendment) Bill, 1999",
    short_title: "Women's Reservation Bill 1999",
    bill_number: "CAB-85/1999", bill_type: "constitutional",
    house_introduced: "lok_sabha", introduced_date: "1999-12-23",
    mover_party_id: bjpId, ministry: "Ministry of Law and Justice",
    current_stage: 6, outcome: "lapsed",
    predecessor_bill_id: wrb1998,
    claude_summary:
      "Re-introduced by Law Minister Ram Jethmalani on 23 Dec 1999. Did not progress past introduction. Lapsed with the 13th Lok Sabha.",
  }),
  mkBill({
    id: wrb2008, slug: "wrb-2008",
    title: "The Constitution (108th Amendment) Bill, 2008",
    short_title: "Women's Reservation Bill 2008",
    bill_number: "CAB-108/2008", bill_type: "constitutional",
    house_introduced: "rajya_sabha", introduced_date: "2008-05-06",
    mover_party_id: incId, ministry: "Ministry of Law and Justice",
    current_stage: 11, outcome: "lapsed",
    rajya_sabha_ayes: 186, rajya_sabha_noes: 1,
    predecessor_bill_id: wrb1999,
    claude_summary:
      "Strategically introduced in Rajya Sabha by UPA-II to prevent lapse on LS dissolution. Passed Rajya Sabha 9 March 2010 (186-1). Dissent note by SP MPs demanding OBC sub-quota. Never tabled in Lok Sabha; lapsed with 15th LS (2014) and 16th LS (2019).",
  }),
  mkBill({
    id: wrb2023, slug: "wrb-2023",
    title: "The Constitution (128th Amendment) Bill, 2023",
    short_title: "Women's Reservation Act 2023",
    bill_number: "CAB-128/2023", bill_type: "constitutional",
    house_introduced: "lok_sabha", introduced_date: "2023-09-19",
    mover_party_id: bjpId, ministry: "Ministry of Law and Justice",
    current_stage: 16, outcome: "passed",
    lok_sabha_ayes: 454, lok_sabha_noes: 2,
    rajya_sabha_ayes: 214, rajya_sabha_noes: 0,
    assent_date: "2023-09-28",
    predecessor_bill_id: wrb2008,
    promise_ids: [womenPromiseBjp, womenPromiseInc].filter(
      (x): x is string => x != null
    ),
    claude_summary:
      "Introduced in the new Parliament building by Law Minister Arjun Ram Meghwal. Passed Lok Sabha 454-2 (only AIMIM's Owaisi and Jaleel voted against). Passed Rajya Sabha 214-0. Presidential assent 28 Sep 2023. Effective implementation linked to post-2026 census and delimitation via Article 334A — estimated 2029-2034.",
  }),

  // ── Other major 17th & 18th Lok Sabha bills ────────────────────────────
  mkBill({
    id: "cc000001-0000-0000-0000-000000000001", slug: "caa-2019",
    title: "The Citizenship (Amendment) Act, 2019",
    short_title: "Citizenship Amendment Act (CAA)",
    bill_number: "Bill No. 370 of 2019", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2019-12-09",
    mover_party_id: bjpId, ministry: "Ministry of Home Affairs",
    current_stage: 14, outcome: "passed",
    lok_sabha_ayes: 311, lok_sabha_noes: 80,
    rajya_sabha_ayes: 125, rajya_sabha_noes: 105,
    assent_date: "2019-12-12",
    claude_summary:
      "Grants Indian citizenship to non-Muslim refugees from Pakistan, Afghanistan and Bangladesh who arrived before 31 Dec 2014. Sparked nationwide protests; multiple writ petitions pending in Supreme Court. Rules notified by MHA on 11 March 2024.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000002", slug: "farm-laws-repeal-2021",
    title: "The Farm Laws Repeal Act, 2021",
    short_title: "Farm Laws Repeal",
    bill_number: "Bill No. 130 of 2021", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2021-11-29",
    mover_party_id: bjpId, ministry: "Ministry of Agriculture & Farmers Welfare",
    current_stage: 14, outcome: "passed",
    assent_date: "2021-12-01",
    claude_summary:
      "Repealed the three contentious 2020 farm laws (FPTC, FAPAFS, ECA Amendment) after 13 months of farmer protests. Passed within minutes in both Houses without debate. Followup committee on MSP legal guarantee yet to deliver final report.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000003", slug: "dpdp-2023",
    title: "The Digital Personal Data Protection Act, 2023",
    short_title: "DPDP Act",
    bill_number: "Bill No. 113 of 2023", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2023-08-03",
    mover_party_id: bjpId, ministry: "Ministry of Electronics & IT",
    current_stage: 14, outcome: "passed",
    assent_date: "2023-08-11",
    claude_summary:
      "India's first comprehensive personal-data protection law. Establishes the Data Protection Board, consent-based processing and significant fiduciaries. Implementation rules drafted; Board not yet constituted as of 2026.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000004", slug: "three-criminal-laws-2023",
    title: "Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, Bharatiya Sakshya Bills, 2023",
    short_title: "Three new criminal codes (BNS/BNSS/BSA)",
    bill_number: "Bills No. 121-123 of 2023", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2023-08-11",
    mover_party_id: bjpId, ministry: "Ministry of Home Affairs",
    current_stage: 14, outcome: "passed",
    assent_date: "2023-12-25",
    claude_summary:
      "Repealed and replaced the IPC (1860), CrPC (1973) and Indian Evidence Act (1872). Passed during the opposition suspension of 146 MPs. Came into force 1 July 2024. Bar associations and civil-society groups have flagged sedition-like provisions and expanded police-custody periods.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000005", slug: "telecom-act-2023",
    title: "The Telecommunications Act, 2023",
    short_title: "Telecom Act",
    bill_number: "Bill No. 156 of 2023", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2023-12-18",
    mover_party_id: bjpId, ministry: "Ministry of Communications",
    current_stage: 14, outcome: "passed",
    assent_date: "2023-12-24",
    claude_summary:
      "Replaces the 1885 Indian Telegraph Act. Authorises government to take over telecom networks 'in interest of national security'. Critics flag expanded interception powers and OTT-services ambiguity. Phased in force through 2024.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000006", slug: "waqf-amendment-2024",
    title: "The Waqf (Amendment) Bill, 2024",
    short_title: "Waqf Amendment Bill",
    bill_number: "Bill No. 109 of 2024", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2024-08-08",
    mover_party_id: bjpId, ministry: "Ministry of Minority Affairs",
    current_stage: 7, outcome: "pending",
    claude_summary:
      "Proposes to repeal the Waqf Act, 1995 and amend governance of waqf properties (including the inclusion of non-Muslims on State Waqf Boards). Referred to a Joint Parliamentary Committee chaired by Jagdambika Pal in August 2024.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000007", slug: "onoe-2024",
    title: "The Constitution (129th Amendment) Bill, 2024 — One Nation, One Election",
    short_title: "One Nation, One Election bill",
    bill_number: "CAB-129/2024", bill_type: "constitutional",
    house_introduced: "lok_sabha", introduced_date: "2024-12-17",
    mover_party_id: bjpId, ministry: "Ministry of Law and Justice",
    current_stage: 7, outcome: "pending",
    claude_summary:
      "Constitutional amendment to enable simultaneous Lok Sabha and state-assembly elections. Introduced after a division (269-198) on the motion. Referred to a 39-member Joint Parliamentary Committee. Two-thirds support and state-ratification thresholds make passage uncertain.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000008", slug: "broadcasting-2023",
    title: "The Broadcasting Services (Regulation) Bill, 2023 (draft)",
    short_title: "Broadcasting Bill (draft)",
    bill_number: "Draft — Nov 2023", bill_type: "ordinary",
    house_introduced: null, introduced_date: "2023-11-10",
    mover_party_id: bjpId, ministry: "Ministry of Information & Broadcasting",
    current_stage: 3, outcome: "withdrawn",
    claude_summary:
      "Draft circulated for public consultation Nov 2023, expanded scope to OTT and individual creators in second draft (July 2024). Industry pushback led to MIB pulling the second draft in August 2024. As of 2026 a revised draft is being prepared but no introduction in Parliament.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-000000000009", slug: "agnipath-no-bill",
    title: "Agnipath Scheme — Executive Order (no statute)",
    short_title: "Agnipath (executive order)",
    bill_number: "MoD notification 14 June 2022", bill_type: "ordinary",
    house_introduced: null, introduced_date: "2022-06-14",
    mover_party_id: bjpId, ministry: "Ministry of Defence",
    current_stage: 16, outcome: "pending",
    claude_summary:
      "Short-tenure (4-year) tri-services recruitment scheme implemented via executive order, not legislation. Major opposition demand to repeal it via Parliament; INDIA bloc parties have promised scrapping. Ongoing review under defence MoS as of 2026.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-00000000000a", slug: "ipc-sedition-deletion-2023",
    title: "Section 124A (Sedition) — Repeal via BNS",
    short_title: "Sedition repeal (via BNS)",
    bill_number: "Within Bill No. 121 of 2023", bill_type: "ordinary",
    house_introduced: "lok_sabha", introduced_date: "2023-12-12",
    mover_party_id: bjpId, ministry: "Ministry of Home Affairs",
    current_stage: 14, outcome: "passed",
    assent_date: "2023-12-25",
    predecessor_bill_id: "cc000001-0000-0000-0000-000000000004",
    claude_summary:
      "Sedition (IPC §124A) was formally deleted in the new Bharatiya Nyaya Sanhita, but critics note that BNS §152 introduces a broader 'acts endangering sovereignty, unity and integrity' offence often described as 'sedition-plus'. Supreme Court stay on §124A continues to operate.",
  }),
  mkBill({
    id: "cc000001-0000-0000-0000-00000000000b", slug: "msp-guarantee-pending",
    title: "MSP Legal Guarantee Bill (committee stage)",
    short_title: "MSP Legal Guarantee",
    bill_number: "Pending — committee", bill_type: "ordinary",
    house_introduced: null, introduced_date: "2022-07-18",
    mover_party_id: bjpId, ministry: "Ministry of Agriculture & Farmers Welfare",
    current_stage: 4, outcome: "pending",
    claude_summary:
      "Sanjay Agrawal Committee constituted July 2022 following farmer-protest commitments to examine making MSP legally enforceable. No bill introduced as of 2026; multiple INDIA-bloc manifestos have promised passage in next term.",
  }),
]

// ── Stage events (WRB chain) ─────────────────────────────────────────────
let _stageEventCounter = 0
const mkEvent = (
  bill_id: string,
  stage: number,
  stage_label: string,
  event_date: string | null,
  house: string | null,
  description: string,
  source_url: string | null = null,
  source_label: string | null = null,
  verbatim_quote: string | null = null,
  verbatim_speaker_name: string | null = null
): StageEvent => ({
  id: `event-${++_stageEventCounter}-${bill_id.slice(0, 8)}`,
  bill_id,
  promise_id: null,
  stage,
  stage_label,
  event_date,
  house,
  description,
  source_url,
  source_label,
  verbatim_quote,
  verbatim_speaker_id: null,
  verbatim_speaker_name,
  created_at: now,
})

export const STATIC_STAGE_EVENTS: StageEvent[] = [
  // WRB 1996
  mkEvent(wrb1996, 1, "Manifesto Promise", "1996-01-01", null,
    "Women's 33% reservation appears in all major party manifestos for the 1996 general election including Congress and BJP."),
  mkEvent(wrb1996, 6, "Introduction in Parliament", "1996-09-12", "lok_sabha",
    "United Front government introduces CAB-81/1996 in Lok Sabha on 12 September 1996, the first ever bill to reserve 33% of parliamentary seats for women.",
    "https://eparlib.sansad.in", "Lok Sabha Debates"),
  mkEvent(wrb1996, 7, "Committee Referral", "1996-09-12", "lok_sabha",
    "Bill referred to a Joint Parliamentary Committee of 31 members chaired by Geeta Mukherjee (CPI, Panskura, West Bengal). Committee received 102 memoranda from women's organizations. Reported seven recommendations on 9 Dec 1996.",
    "https://eparlib.sansad.in", "JPC Report 1996"),
  mkEvent(wrb1996, 16, "Post-Enactment Lifecycle", "1997-01-01", null,
    "Bill lapses with dissolution of the 11th Lok Sabha. None of the JPC's seven recommendations are debated on the floor.",
    null, "Lapse record"),

  // WRB 1998
  mkEvent(wrb1998, 6, "Introduction in Parliament", "1998-01-01", "lok_sabha",
    "Vajpayee NDA government re-introduces bill. Floor disruption: RJD MP Surendra Prakash Yadav snatches the bill from Law Minister M. Thambidurai and tears it at the Speaker's table.",
    "https://en.wikipedia.org/wiki/Women%27s_Reservation_Bill_(India)", "Wikipedia / Outlook",
    "The present form of Women's Reservation Bill can only be passed in the Lok Sabha over my dead body. We want reservation within reservation.",
    "Lalu Prasad Yadav (RJD)"),
  mkEvent(wrb1998, 16, "Post-Enactment Lifecycle", "1999-01-01", null,
    "Bill lapses with dissolution of the 12th Lok Sabha. The 'Yadav triumvirate' (Mulayam, Lalu, Sharad) successfully blocked consideration by demanding OBC sub-quota within the 33%.",
    null, "Lapse record"),

  // WRB 2008
  mkEvent(wrb2008, 6, "Introduction in Parliament", "2008-05-06", "rajya_sabha",
    "UPA-II strategically introduces CAB-108/2008 in the Rajya Sabha (which does not dissolve with the Lok Sabha) to prevent lapse. Bill referred to the Standing Committee on Personnel, Public Grievances, Law and Justice.",
    "https://eparlib.sansad.in", "Rajya Sabha records"),
  mkEvent(wrb2008, 7, "Committee Referral", "2009-12-14", "rajya_sabha",
    "Standing Committee 36th Report adopted 14 Dec 2009. Chaired by Jayanthi Natarajan (INC). Recommended passage 'without further delay.' Dissent note by SP's Virendra Bhatia and Shailendra Kumar demanding OBC sub-quota.",
    "https://eparlib.sansad.in", "36th Standing Committee Report"),
  mkEvent(wrb2008, 11, "Inter-House Passage", "2010-03-09", "rajya_sabha",
    "Rajya Sabha passes the Women's Reservation Bill 186-1. It is never tabled in the Lok Sabha by the UPA government despite the ruling coalition holding enough seats.",
    "https://eparlib.sansad.in", "Rajya Sabha vote record"),
  mkEvent(wrb2008, 16, "Post-Enactment Lifecycle", "2014-01-01", null,
    "Bill lapses with dissolution of the 15th Lok Sabha after sitting in limbo for four years without being brought to the LS floor. Lapses again with 16th LS (2019). A 13-year stall.",
    null, "Lapse record"),

  // WRB 2023
  mkEvent(wrb2023, 5, "Cabinet Approval", "2023-09-18", null,
    "Union Cabinet approves the Women's Reservation Bill one day before its introduction in the new Parliament building. No pre-legislative consultation process observed.",
    "https://pib.gov.in", "PIB press release"),
  mkEvent(wrb2023, 6, "Introduction in Parliament", "2023-09-19", "lok_sabha",
    "Law Minister Arjun Ram Meghwal introduces CAB-128/2023 in the new Parliament building. Bill proposes inserting Articles 330A, 332A and 334A into the Constitution.",
    "https://sansad.in/ls", "Lok Sabha records"),
  mkEvent(wrb2023, 10, "Voting Splits", "2023-09-20", "lok_sabha",
    "Lok Sabha votes 454-2 in favour. The only dissenting votes come from AIMIM's Asaduddin Owaisi (Hyderabad) and Syed Imtiaz Jaleel (Aurangabad).",
    "https://sansad.in/ls", "Lok Sabha division list",
    "Muslim women account for 7% of the national population but their representation in legislative bodies is just 0.7%. This bill fails them.",
    "Asaduddin Owaisi (AIMIM)"),
  mkEvent(wrb2023, 11, "Inter-House Passage", "2023-09-21", "rajya_sabha",
    "Rajya Sabha passes the bill 214-0. Unanimous passage with no member voting against.",
    "https://sansad.in/rs", "Rajya Sabha division list"),
  mkEvent(wrb2023, 12, "Presidential Assent", "2023-09-28", null,
    "President Droupadi Murmu grants assent to the Constitution (106th Amendment) Act, 2023 on 28 September 2023.",
    "https://egazette.gov.in", "Gazette of India"),
  mkEvent(wrb2023, 13, "Gazette + Rules", "2023-09-28", null,
    "Act notified in the Gazette of India as the Constitution (One Hundred and Sixth Amendment) Act, 2023. Article 334A links effective implementation to the first post-commencement census and a subsequent delimitation exercise.",
    "https://egazette.gov.in", "Gazette notification",
    "the provisions of this Part relating to reservation of seats for women shall cease to have effect on the expiration of a period of 15 years from the date of commencement of this Act.",
    "Article 334A, Constitution (106th Amendment) Act 2023"),
  mkEvent(wrb2023, 14, "Implementation", "2026-04-16", null,
    "Union Ministry of Law and Justice issues gazette notification bringing the Act 'into force' on 16 April 2026 — but the 33% reservation itself remains inoperative pending the post-2026 census and a fresh delimitation. Effective representation not expected before 2029-2034.",
    "https://egazette.gov.in", "Gazette notification April 2026"),
]

// ── Issue graph edges (WRB) ──────────────────────────────────────────────
let _edgeCounter = 0
const mkEdge = (
  source_type: string,
  source_id: string,
  source_label: string,
  target_type: string,
  target_id: string,
  target_label: string,
  edge_type: IssueGraphEdge["edge_type"],
  description: string,
  confidence: number
): IssueGraphEdge => ({
  id: `edge-${++_edgeCounter}`,
  source_type,
  source_id,
  source_label,
  target_type,
  target_id,
  target_label,
  edge_type,
  description,
  evidence_source_url: null,
  confidence,
  created_at: now,
})

export const STATIC_GRAPH_EDGES: IssueGraphEdge[] = [
  mkEdge("bill", wrb1996, "WRB 1996", "bill", wrb1998, "WRB 1998", "superseded_by",
    "1996 bill lapsed with 11th LS dissolution; 1998 bill is its immediate re-introduction by the incoming Vajpayee government.", 1.0),
  mkEdge("bill", wrb1998, "WRB 1998", "bill", wrb1999, "WRB 1999", "superseded_by",
    "1998 bill lapsed with 12th LS dissolution; 1999 bill re-introduced by Ram Jethmalani.", 1.0),
  mkEdge("bill", wrb1999, "WRB 1999", "bill", wrb2008, "WRB 2008", "superseded_by",
    "1999 bill lapsed with 13th LS dissolution; 2008 UPA-II version moved strategically to Rajya Sabha.", 1.0),
  mkEdge("bill", wrb2008, "WRB 2008", "bill", wrb2023, "WRB 2023", "superseded_by",
    "2008 bill lapsed with 15th and 16th LS dissolutions; the 2023 NDA version finally broke the deadlock.", 1.0),
  mkEdge("mp", mpSpyadav, "Surendra Prakash Yadav (RJD)", "bill", wrb1998, "WRB 1998", "blocked_by",
    "Yadav tore the bill on the floor of the Lok Sabha, triggering pandemonium. RJD/SP/JD-U bloc demanded OBC sub-quota within the 33%.", 0.95),
  mkEdge("bill", wrb1998, "WRB 1998", "bill", wrb2008, "WRB 2008", "linked_to",
    "OBC sub-quota demand that derailed 1998-1999 bills continued to be raised by the SP dissent note in the 2008 Standing Committee.", 0.9),
  mkEdge("bill", wrb2023, "WRB 2023 (Article 334A)", "bill", wrb2008, "WRB 2008", "amended_by",
    "Article 334A — the delimitation precondition — was absent from the 2008 Bill. Its insertion in 2023 achieves symbolic passage while delaying operational reservation by an estimated 6-11 years.", 0.85),
  mkEdge("bill", wrb2023, "WRB 2023", "bill", wrb1996, "WRB 1996", "descended_from",
    "27-year legislative lineage from the first 1996 JPC bill through six attempts. The 2023 Act is the culmination of the same constitutional amendment objective.", 1.0),
  mkEdge("mp", mpOwaisi, "Asaduddin Owaisi (AIMIM)", "bill", wrb2023, "WRB 2023", "opposed_by",
    "One of only two MPs to vote against the 2023 bill. Argued it excludes OBC and Muslim women whose representation (0.7%) is far below their 7% population share.", 1.0),
  mkEdge("mp", mpMeghwal, "Arjun Ram Meghwal (BJP)", "bill", wrb2023, "WRB 2023", "endorsed_by",
    "Law Minister Meghwal moved the bill in the new Parliament building and shepherded it through both houses in 48 hours.", 1.0),
  mkEdge("mp", mpNirmala, "Nirmala Sitharaman (BJP)", "bill", wrb2023, "WRB 2023", "endorsed_by",
    "Defended the delimitation-linked Article 334A in Rajya Sabha on 21 September 2023, characterising it as procedurally necessary.", 0.9),
  mkEdge("mp", mpGeeta, "Geeta Mukherjee (CPI)", "bill", wrb1996, "WRB 1996", "linked_to",
    "Chaired the 31-member JPC that evaluated the 1996 bill and made 7 recommendations.", 1.0),
]

// ── Promise ancestry (linked to BJP women's reservation promise) ───────
let _ancCounter = 0
const mkAnc = (
  promise_id: string,
  ancestor_name: string,
  ancestor_year: number,
  ancestor_govt: string,
  relationship_note: string,
  sort_order: number
): PromiseAncestry => ({
  id: `anc-${++_ancCounter}`,
  promise_id,
  ancestor_name,
  ancestor_year,
  ancestor_govt,
  relationship_note,
  sort_order,
  created_at: now,
})

// ── Bill versions + clauses (WRB-2008 vs WRB-2023 diff) ──────────────────
const ver2008 = "cc000001-0000-0000-0000-000000000001"
const ver2023 = "cc000001-0000-0000-0000-000000000002"

export const STATIC_BILL_VERSIONS: BillVersion[] = [
  {
    id: ver2008,
    bill_id: wrb2008,
    version_label: "CAB-108/2008 — As introduced in Rajya Sabha",
    version_date: "2008-05-06",
    source_url: "https://prsindia.org/billtrack/the-constitution-one-hundred-and-eighth-amendment-bill-2008",
    raw_pdf_url: null,
    created_at: now,
  },
  {
    id: ver2023,
    bill_id: wrb2023,
    version_label: "CAB-128/2023 — As passed by both Houses",
    version_date: "2023-09-21",
    source_url: "https://prsindia.org/billtrack/the-constitution-one-hundred-and-twenty-eighth-amendment-bill-2023",
    raw_pdf_url: null,
    created_at: now,
  },
]

let _clauseCounter = 0
const mkClause = (
  bill_version_id: string,
  clause_number: string,
  clause_title: string,
  clause_text: string,
  topic_tags: string[],
  ordinal: number,
  is_poison_pill = false,
  attribution_note: string | null = null
): BillClause => ({
  id: `clause-${++_clauseCounter}`,
  bill_version_id,
  clause_number,
  clause_title,
  clause_text,
  parent_clause_id: null,
  topic_tags,
  references_act: null,
  is_poison_pill,
  attribution_note,
  ordinal,
  created_at: now,
})

// Shared clause text (identical across both versions for clauses 1-4)
const SHORT_TITLE_2008 =
  "This Act may be called the Constitution (One Hundred and Eighth Amendment) Act. It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint."
const SHORT_TITLE_2023 =
  "This Act may be called the Constitution (One Hundred and Sixth Amendment) Act, 2023. It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint."
const ARTICLE_239AA =
  'In article 239AA of the Constitution, in clause (2), in sub-clause (b), the following proviso shall be inserted, namely:— "Provided that not less than one-third (including the number of seats reserved for women belonging to the Scheduled Castes) of the total number of seats in the Legislative Assembly of the National Capital Territory of Delhi shall be reserved for women by rotation and such rotation of reserved seats shall be determined by such authority and in such manner as the Parliament may, by law, provide."'
const ARTICLE_330A =
  'After article 330 of the Constitution, the following article shall be inserted, namely:— "330A. Reservation of seats for women in the House of the People.— (1) As nearly as may be, one-third of the total number of seats reserved under article 330 for the Scheduled Castes and the Scheduled Tribes respectively shall be reserved by rotation for women belonging to the Scheduled Castes or the Scheduled Tribes, as the case may be. (2) As nearly as may be, one-third of the total number of seats in the House of the People shall be reserved for women. (3) The seats reserved for women under this article shall be allotted by rotation to different constituencies in the State or Union territory and such rotation shall be determined by such authority and in such manner as Parliament may by law provide."'
const ARTICLE_332A =
  'After article 332 of the Constitution, the following article shall be inserted, namely:— "332A. Reservation of seats for women in State Legislative Assemblies.— (1) As nearly as may be, one-third of the total number of seats reserved under article 332 for the Scheduled Castes and the Scheduled Tribes respectively in the Legislative Assembly of every State shall be reserved by rotation for women belonging to the Scheduled Castes or the Scheduled Tribes, as the case may be. (2) As nearly as may be, one-third of the total number of seats in the Legislative Assembly of every State shall be reserved for women. (3) The seats reserved for women under this article shall be allotted by rotation to different constituencies in the State and such rotation shall be determined by such authority and in such manner as the Legislature of the State may, by law, provide."'
const ARTICLE_334A_POISON =
  'After article 334 of the Constitution, the following article shall be inserted, namely:— "334A. Reservation under articles 330A and 332A to have effect after commencement and census figures publication.— Notwithstanding anything contained in articles 330A and 332A, the reservation of seats for women under the said articles shall be effective after the date of publication of the figures of the first census taken after the commencement of the Constitution (One Hundred and Sixth Amendment) Act, 2023 and the subsequent delimitation of constituencies based on such census figures: Provided that such reservation shall cease to have effect on the expiration of a period of fifteen years from the date on which such reservation first becomes effective under this article."'
const ARTICLE_334_2008 =
  'In article 334 of the Constitution, for the words "sixty years", the words "sixty years or until the expiry of the period specified in clause (1) of article 330A or clause (1) of article 332A, whichever is later" shall be substituted.'
const ARTICLE_334_2023 =
  'In article 334 of the Constitution, for the words "sixty years", the following shall be substituted, namely:— "sixty years or until the expiry of the period mentioned in article 334A, whichever is later".'
const POISON_PILL_NOTE =
  "Article 334A was inserted by the NDA government during the 2023 revision and was absent from every prior WRB bill. It ties activation of reservation to (a) the first post-2026 census and (b) a subsequent delimitation exercise — neither with a fixed deadline. Opposition parties including AAP, TMC and AIMIM argued this embeds an indefinite delay. PRS estimates effective implementation no earlier than 2029-2034."

export const STATIC_BILL_CLAUSES: BillClause[] = [
  // CAB-108/2008
  mkClause(ver2008, "1", "Short title and commencement", SHORT_TITLE_2008, ["commencement", "title"], 1),
  mkClause(ver2008, "2", "Amendment of article 239AA", ARTICLE_239AA, ["delhi", "reservation", "rotation"], 2),
  mkClause(ver2008, "3", "Insertion of new article 330A — Reservation of seats for women in House of the People", ARTICLE_330A, ["lok_sabha", "women", "reservation", "rotation"], 3),
  mkClause(ver2008, "4", "Insertion of new article 332A — Reservation of seats for women in State Legislative Assemblies", ARTICLE_332A, ["state_assembly", "women", "reservation", "rotation"], 4),
  mkClause(ver2008, "5", "Amendment of article 334", ARTICLE_334_2008, ["sunset", "termination"], 5),

  // CAB-128/2023
  mkClause(ver2023, "1", "Short title and commencement", SHORT_TITLE_2023, ["commencement", "title"], 1),
  mkClause(ver2023, "2", "Amendment of article 239AA", ARTICLE_239AA, ["delhi", "reservation", "rotation"], 2),
  mkClause(ver2023, "3", "Insertion of new article 330A — Reservation of seats for women in House of the People", ARTICLE_330A, ["lok_sabha", "women", "reservation", "rotation"], 3),
  mkClause(ver2023, "4", "Insertion of new article 332A — Reservation of seats for women in State Legislative Assemblies", ARTICLE_332A, ["state_assembly", "women", "reservation", "rotation"], 4),
  mkClause(ver2023, "5", "Insertion of new article 334A — Commencement of reservation",
    ARTICLE_334A_POISON,
    ["commencement", "census", "delimitation", "sunset"], 5, true, POISON_PILL_NOTE),
  mkClause(ver2023, "6", "Amendment of article 334", ARTICLE_334_2023, ["sunset", "termination"], 6, false,
    "Article 334 was amended to reference the new Article 334A rather than specifying a direct 60-year sunset, linking the termination of women's reservation to the Article 334A commencement mechanism."),
]

export const STATIC_PROMISE_ANCESTRY: PromiseAncestry[] = womenPromiseBjp
  ? [
      mkAnc(womenPromiseBjp, "73rd Constitutional Amendment — 33% Panchayat Reservation",
        1992, "Congress (Narasimha Rao)",
        "Established the precedent of 33% reservation for women in Panchayati Raj institutions. The same ratio (not 50%) was used in all Parliamentary WRB drafts.", 1),
      mkAnc(womenPromiseBjp, "74th Constitutional Amendment — 33% Municipality Reservation",
        1993, "Congress (Narasimha Rao)",
        "Extended the 33% women's reservation to urban local bodies. Together with the 73rd Amendment, created the constitutional basis for expanding it to Parliament.", 2),
      mkAnc(womenPromiseBjp, "Sarojini Naidu Committee on Women's Status", 1974, "Congress (Indira Gandhi)",
        "The 1974 CSWI recommended reservation as a temporary measure to bring women into mainstream political life — the intellectual precursor to all WRB bills.", 3),
      mkAnc(womenPromiseBjp, "Constituent Assembly Debates on Women's Rights", 1946, "Constituent Assembly",
        "Hansa Mehta and other women delegates to the Constituent Assembly argued for constitutional provisions ensuring women's political representation.", 4),
    ]
  : []
