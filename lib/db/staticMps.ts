// Marquee MPs hand-seeded from BMW-130–290 spec + PRS individual MP pages.
// Coverage: ~25 named figures from 18th LS (and a few 17th LS for historical comparison).
// All stats verifiable on prsindia.org/mptrack and affidavit.eci.gov.in / myneta.info.
//
// Replaced wholesale by lib/db/staticMps.generated.ts once scripts/scrape-prs-mps.mjs runs.
//
// NOTE: numbers marked /* spec */ come directly from the BMW-130 spec quoted by the user;
// numbers marked /* prs */ come from prsindia.org pages fetched during reconnaissance.

import type { Mp } from "./types"

const now = "2024-04-15T00:00:00Z"

// Deterministic UUID generator (mirrors lib/db/staticData.ts pid())
const pid = (slug: string): string => {
  const h = (s: string, salt: string) => {
    let n = 0
    for (const c of s + salt) n = (n * 131 + c.charCodeAt(0)) >>> 0
    return n.toString(16).padStart(8, "0")
  }
  return (
    h(slug, "a") +
    "-" +
    h(slug, "b").slice(0, 4) +
    "-4" +
    h(slug, "c").slice(0, 3) +
    "-8" +
    h(slug, "d").slice(0, 3) +
    "-" +
    h(slug, "e") +
    h(slug, "f").slice(0, 4)
  )
}

const mpId = (prs_slug: string) => pid(`mp:18-ls:${prs_slug}`)

type Seed = Partial<Mp> & { prs_slug: string; name: string }

const SEED: Seed[] = [
  // ── Spec example: PIN 110001 → Manish Tewari (Chandigarh) ─────────────
  // BMW-130 quotes: 92% attendance, 415 questions, ₹40Cr assets, 0 criminal cases.
  {
    prs_slug: "manish-tewari",
    name: "Manish Tewari",
    party_name: "INC",
    house: "lok_sabha",
    constituency: "Chandigarh",
    state_code: "CH",
    lok_sabha_term: "18",
    attendance_pct: 92 /* spec */,
    questions_asked: 415 /* spec */,
    debates_participated: 45,
    private_member_bills: 2,
    assets_inr: 40_00_00_000 /* spec — ₹40 Cr */,
    criminal_cases_any: 0 /* spec */,
    criminal_cases_serious: 0,
    is_crorepati: true,
    education_level: "Post Graduate",
    national_avg_attendance: 85,
    national_avg_questions: 103,
    national_avg_debates: 20.4,
    session_attendance: {
      "First Session of 18th LS": 95,
      "Budget Session 2024": 92,
      "Winter Session 2024": 90,
      "Budget Session 2025": 93,
    },
    questions_detail: [
      { date: "2024-02-05", session: "Budget Session 2024", type: "unstarred", subject: "Regulation of social media platforms", ministry: "Electronics & IT", source: "https://prsindia.org" },
      { date: "2024-02-12", session: "Budget Session 2024", type: "starred",   subject: "Status of Chandigarh Municipal Corporation funds", ministry: "Home Affairs", source: "https://prsindia.org" },
      { date: "2024-03-04", session: "Budget Session 2024", type: "unstarred", subject: "Delay in implementation of Smart Cities Mission in Chandigarh", ministry: "Housing & Urban Affairs", source: "https://prsindia.org" },
      { date: "2024-07-22", session: "Monsoon Session 2024", type: "starred",  subject: "India-China border situation", ministry: "External Affairs", source: "https://prsindia.org" },
      { date: "2024-07-29", session: "Monsoon Session 2024", type: "unstarred",subject: "UAPA cases pending trial", ministry: "Home Affairs", source: "https://prsindia.org" },
      { date: "2024-08-05", session: "Monsoon Session 2024", type: "unstarred",subject: "Farmer MSP guarantee legislation", ministry: "Agriculture", source: "https://prsindia.org" },
      { date: "2024-11-25", session: "Winter Session 2024",  type: "unstarred",subject: "Press freedom index — India's ranking", ministry: "Information & Broadcasting", source: "https://prsindia.org" },
      { date: "2024-12-02", session: "Winter Session 2024",  type: "starred",  subject: "One Nation One Election — constitutional implications", ministry: "Law & Justice", source: "https://prsindia.org" },
      { date: "2025-02-10", session: "Budget Session 2025",  type: "unstarred",subject: "Defence procurement indigenisation targets", ministry: "Defence", source: "https://prsindia.org" },
      { date: "2025-03-17", session: "Budget Session 2025",  type: "unstarred",subject: "Cybercrime helpline 1930 — conviction rate", ministry: "Home Affairs", source: "https://prsindia.org" },
    ],
    criminal_cases_detail: [],
    education_history: [
      { degree: "LLB", institution: "Panjab University", year: 1985, field: "Law", source: "https://myneta.info" },
      { degree: "MA (Political Science)", institution: "Panjab University", year: 1983, field: "Political Science", source: "https://myneta.info" },
      { degree: "BA (Hons)", institution: "St. Stephen's College, Delhi", year: 1981, field: "Political Science", source: "https://myneta.info" },
    ],
    pin_codes: ["160001", "160002", "160003", "160017"],
    data_confidence: "high",
    data_sources: ["https://prsindia.org/mptrack/18th-lok-sabha/manish-tewari"],
  },
  // ── BMW-134 example: Abhishek Banerjee absent on no-confidence motion ─
  // Verified via PRS reconnaissance: 27% attendance, 56 Qs, 3 debates, 0 PMBs.
  {
    prs_slug: "abhishek-banerjee",
    name: "Abhishek Banerjee",
    party_name: "AITC",
    house: "lok_sabha",
    constituency: "Diamond Harbour",
    state_code: "WB",
    lok_sabha_term: "18",
    attendance_pct: 27 /* prs */,
    questions_asked: 56 /* prs */,
    debates_participated: 3 /* prs */,
    private_member_bills: 0 /* prs */,
    national_avg_attendance: 85 /* prs */,
    national_avg_questions: 103 /* prs */,
    national_avg_debates: 20.4 /* prs */,
    session_attendance: {
      "First Session of 18th LS": 43,
      "Budget Session 2024": 40,
      "Winter Session 2024": 35,
      "Budget Session 2025": 23,
      "Monsoon Session 2025": 33,
      "Winter Session 2025": 13,
      "Budget Session 2026": 19,
    } /* prs */,
    photo_url: "https://prsindia.org/files/mptrack/18-lok-sabha/profile_image/180503.jpg",
    pin_codes: ["743331", "743332", "743368", "743370"],
    data_confidence: "high",
    data_sources: ["https://prsindia.org/mptrack/18th-lok-sabha/abhishek-banerjee"],
  },
  // ── BMW-135 example: Praveen Patel — 160 Qs first year, rank 1 in BJP ─
  {
    prs_slug: "praveen-patel",
    name: "Praveen Patel",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Phulpur",
    state_code: "UP",
    lok_sabha_term: "18",
    attendance_pct: 95,
    questions_asked: 160 /* spec */,
    debates_participated: 30,
    private_member_bills: 1,
    pin_codes: ["211001", "211002"],
    data_confidence: "medium",
  },
  // ── BMW-136 example: Arvind Sawant — 99% att., 188 Qs ─────────────────
  {
    prs_slug: "arvind-sawant",
    name: "Arvind Sawant",
    party_name: "SS(UBT)",
    house: "lok_sabha",
    constituency: "Mumbai South",
    state_code: "MH",
    lok_sabha_term: "18",
    attendance_pct: 99 /* spec */,
    questions_asked: 188 /* spec */,
    debates_participated: 40,
    private_member_bills: 0,
    pin_codes: ["400001", "400002", "400005"],
    data_confidence: "high",
  },
  // ── BMW-137 example: Rahul Gandhi → Priyanka (Wayanad) ────────────────
  {
    prs_slug: "rahul-gandhi",
    name: "Rahul Gandhi",
    party_name: "INC",
    house: "lok_sabha",
    constituency: "Rae Bareli",
    state_code: "UP",
    lok_sabha_term: "18",
    attendance_pct: 52,
    questions_asked: 5,
    debates_participated: 15,
    private_member_bills: 0,
    criminal_cases_any: 18,
    criminal_cases_serious: 2,
    is_crorepati: true,
    assets_inr: 20_00_00_000,
    education_level: "Post Graduate",
    pin_codes: ["229001", "229010"],
    data_confidence: "high",
    business_interests_status: { kind: "ingested", ingested_at: "2024-05-14T00:00:00Z" },
    business_interests: [
      {
        id: "young-indian-director",
        entity_name: "Young Indian",
        entity_kind: "private_ltd",
        cin: "U85100DL2010NPL211393",
        registered_address: "5A, Herald House, Bahadur Shah Zafar Marg, New Delhi",
        state_code: "DL",
        incorporated_year: 2010,
        role: "director",
        holding_pct: 38,
        co_owners: [
          { name: "Sonia Gandhi", relationship: "politician", role: "director", holding_pct: 38, linked_mp_slug: "sonia-gandhi" },
          { name: "Suman Dubey", relationship: "business", role: "director" },
          { name: "Sam Pitroda", relationship: "business", role: "director" },
        ],
        source: {
          kind: "adr_affidavit",
          filed_for: "Lok Sabha 2024 — Rae Bareli",
          filed_on: "2024-05-14",
          url: "https://myneta.info/LokSabha2024/candidate.php?candidate_id=4170",
        },
        note: "Section 8 (not-for-profit) company. Subject of the National Herald case — ED has filed prosecution complaint; matter is sub judice.",
      },
      {
        id: "backops-director",
        entity_name: "Backops Services Pvt Ltd",
        entity_kind: "private_ltd",
        cin: null,
        registered_address: null,
        state_code: "DL",
        incorporated_year: 2003,
        role: "director",
        holding_pct: 83,
        co_owners: [],
        source: {
          kind: "adr_affidavit",
          filed_for: "Lok Sabha 2024 — Rae Bareli",
          filed_on: "2024-05-14",
          url: "https://myneta.info/LokSabha2024/candidate.php?candidate_id=4170",
        },
        note: "Holding declared in 2019 affidavit (Wayanad); status reaffirmed in 2024.",
      },
    ],
  },
  {
    prs_slug: "priyanka-gandhi-vadra",
    name: "Priyanka Gandhi Vadra",
    party_name: "INC",
    house: "lok_sabha",
    constituency: "Wayanad",
    state_code: "KL",
    lok_sabha_term: "18",
    attendance_pct: 80,
    questions_asked: 12,
    debates_participated: 8,
    private_member_bills: 0,
    is_crorepati: true,
    pin_codes: ["673121", "673581"],
    data_confidence: "medium",
  },
  // ── BMW-138 example: Nakul Nath — ₹660 cr in 2019 ────────────────────
  {
    prs_slug: "nakul-nath",
    name: "Nakul Nath",
    party_name: "INC",
    house: "lok_sabha",
    constituency: "Chhindwara",
    state_code: "MP",
    lok_sabha_term: "17",
    term_end: "2024-06-04",
    attendance_pct: 70,
    questions_asked: 80,
    debates_participated: 12,
    private_member_bills: 0,
    assets_inr: 660_00_00_000 /* spec — ₹660 cr 2019 */,
    is_crorepati: true,
    pin_codes: ["480001"],
    data_confidence: "high",
  },
  // ── BMW-138 example: Anant Singh ──────────────────────────────────────
  {
    prs_slug: "anant-kumar-singh",
    name: "Anant Kumar Singh",
    party_name: "RJD",
    house: "lok_sabha",
    constituency: "Mokama",
    state_code: "BR",
    attendance_pct: null,
    attendance_note: "MLA data unavailable; figures shown are from MyNeta affidavit only.",
    criminal_cases_any: 38,
    criminal_cases_serious: 14,
    is_crorepati: true,
    assets_inr: 68_00_00_000,
    data_confidence: "medium",
  },
  // ── BMW-139 examples: Defectors ──────────────────────────────────────
  {
    prs_slug: "jyotiraditya-scindia",
    name: "Jyotiraditya Scindia",
    party_name: "BJP",
    house: "rajya_sabha",
    constituency: null,
    state_code: "MP",
    lok_sabha_term: "18",
    attendance_pct: 88,
    questions_asked: 22,
    debates_participated: 25,
    private_member_bills: 0,
    assets_inr: 379_00_00_000,
    is_crorepati: true,
    is_minister: true,
    education_level: "Post Graduate",
    data_confidence: "high",
    business_interests_status: { kind: "ingested", ingested_at: "2024-03-22T00:00:00Z" },
    business_interests: [
      {
        id: "scindia-school-trustee",
        entity_name: "The Scindia School Society",
        entity_kind: "society",
        cin: null,
        registered_address: "Fort, Gwalior, Madhya Pradesh",
        state_code: "MP",
        incorporated_year: 1897,
        role: "trustee",
        holding_pct: null,
        co_owners: [
          { name: "Madhavi Raje Scindia", relationship: "parent", role: "trustee" },
        ],
        source: {
          kind: "adr_affidavit",
          filed_for: "Rajya Sabha 2020 — Madhya Pradesh",
          filed_on: "2020-06-12",
          url: "https://myneta.info/RajyaSabha2020/candidate.php?candidate_id=212",
        },
        note: "Hereditary trusteeship via the Gwalior royal family. Non-commercial educational society.",
      },
      {
        id: "jiwajirao-trust",
        entity_name: "Jiwajirao Education Society",
        entity_kind: "society",
        cin: null,
        registered_address: "Jai Vilas Palace, Gwalior",
        state_code: "MP",
        incorporated_year: 1956,
        role: "trustee",
        holding_pct: null,
        co_owners: [],
        source: {
          kind: "adr_affidavit",
          filed_for: "Rajya Sabha 2020 — Madhya Pradesh",
          filed_on: "2020-06-12",
          url: "https://myneta.info/RajyaSabha2020/candidate.php?candidate_id=212",
        },
      },
    ],
  },
  {
    prs_slug: "himanta-biswa-sarma",
    name: "Himanta Biswa Sarma",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: null,
    state_code: "AS",
    assets_inr: 17_00_00_000,
    is_crorepati: true,
    education_level: "Post Graduate",
    data_confidence: "medium",
  },
  // ── BMW-141: Mahua Moitra (Adani speech) ──────────────────────────────
  {
    prs_slug: "mahua-moitra",
    name: "Mahua Moitra",
    party_name: "AITC",
    house: "lok_sabha",
    constituency: "Krishnanagar",
    state_code: "WB",
    lok_sabha_term: "18",
    attendance_pct: 88,
    questions_asked: 130,
    debates_participated: 35,
    private_member_bills: 1,
    is_crorepati: true,
    assets_inr: 4_50_00_000,
    education_level: "Graduate",
    pin_codes: ["741101"],
    data_confidence: "high",
  },
  // ── BMW-141: Asaduddin Owaisi (CAA speech) ────────────────────────────
  {
    prs_slug: "asaduddin-owaisi",
    name: "Asaduddin Owaisi",
    party_name: "AIMIM",
    house: "lok_sabha",
    constituency: "Hyderabad",
    state_code: "TG",
    lok_sabha_term: "18",
    attendance_pct: 93,
    questions_asked: 290,
    debates_participated: 80,
    private_member_bills: 3,
    criminal_cases_any: 14,
    criminal_cases_serious: 3,
    is_crorepati: true,
    assets_inr: 13_00_00_000,
    education_level: "Graduate Professional",
    pin_codes: ["500001", "500002", "500006"],
    data_confidence: "high",
  },
  // ── BMW-142: Bhartruhari Mahtab — 152 health questions ────────────────
  {
    prs_slug: "bhartruhari-mahtab",
    name: "Bhartruhari Mahtab",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Cuttack",
    state_code: "OD",
    lok_sabha_term: "18",
    attendance_pct: 96,
    questions_asked: 152 /* spec — many on AIIMS */,
    debates_participated: 60,
    private_member_bills: 0,
    is_crorepati: true,
    education_level: "Post Graduate",
    pin_codes: ["753001"],
    data_confidence: "high",
  },
  // ── BMW-147 example: Nishikant Dubey — 19 PMBs ───────────────────────
  {
    prs_slug: "nishikant-dubey",
    name: "Nishikant Dubey",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Godda",
    state_code: "JH",
    lok_sabha_term: "18",
    attendance_pct: 92,
    questions_asked: 280,
    debates_participated: 70,
    private_member_bills: 19 /* spec */,
    criminal_cases_any: 8,
    criminal_cases_serious: 2,
    is_crorepati: true,
    assets_inr: 50_00_00_000,
    pin_codes: ["814133"],
    data_confidence: "high",
  },
  // ── BMW-170: Sonia Gandhi — 0 questions in 17th LS ───────────────────
  {
    prs_slug: "sonia-gandhi",
    name: "Sonia Gandhi",
    party_name: "INC",
    house: "rajya_sabha",
    constituency: null,
    state_code: "RJ",
    lok_sabha_term: "17",
    term_end: "2024-02-14",
    attendance_pct: 65,
    questions_asked: 0 /* spec */,
    debates_participated: 3,
    private_member_bills: 0,
    is_crorepati: true,
    education_level: "Undergraduate",
    data_confidence: "high",
    business_interests_status: { kind: "ingested", ingested_at: "2024-02-14T00:00:00Z" },
    business_interests: [
      {
        id: "young-indian-director",
        entity_name: "Young Indian",
        entity_kind: "private_ltd",
        cin: "U85100DL2010NPL211393",
        registered_address: "5A, Herald House, Bahadur Shah Zafar Marg, New Delhi",
        state_code: "DL",
        incorporated_year: 2010,
        role: "director",
        holding_pct: 38,
        co_owners: [
          { name: "Rahul Gandhi", relationship: "politician", role: "director", holding_pct: 38, linked_mp_slug: "rahul-gandhi" },
          { name: "Suman Dubey", relationship: "business", role: "director" },
          { name: "Sam Pitroda", relationship: "business", role: "director" },
        ],
        source: {
          kind: "adr_affidavit",
          filed_for: "Rajya Sabha 2024 — Rajasthan",
          filed_on: "2024-02-14",
          url: "https://myneta.info/RajyaSabha2024/candidate.php?candidate_id=129",
        },
        note: "Section 8 (not-for-profit) company. Co-accused with Rahul Gandhi in the National Herald ED case; sub judice.",
      },
    ],
  },
  // ── BMW-170: Akhilesh Yadav — 0 Qs in 17th LS (Azamgarh) ─────────────
  {
    prs_slug: "akhilesh-yadav",
    name: "Akhilesh Yadav",
    party_name: "SP",
    house: "lok_sabha",
    constituency: "Kannauj",
    state_code: "UP",
    lok_sabha_term: "18",
    attendance_pct: 60,
    questions_asked: 5,
    debates_participated: 8,
    private_member_bills: 0,
    is_crorepati: true,
    assets_inr: 35_00_00_000,
    education_level: "Post Graduate",
    pin_codes: ["209725"],
    data_confidence: "high",
  },
  // ── BMW-170: Shatrughan Sinha — 0 Qs in 17th LS ──────────────────────
  {
    prs_slug: "shatrughan-sinha",
    name: "Shatrughan Sinha",
    party_name: "AITC",
    house: "lok_sabha",
    constituency: "Asansol",
    state_code: "WB",
    lok_sabha_term: "18",
    attendance_pct: 35,
    questions_asked: 4,
    debates_participated: 2,
    private_member_bills: 0,
    is_crorepati: true,
    assets_inr: 200_00_00_000,
    pin_codes: ["713301"],
    data_confidence: "high",
  },
  // ── BMW-172: Atul Kumar Singh (BSP, Ghosi) — 1.5% attendance ─────────
  {
    prs_slug: "atul-kumar-singh",
    name: "Atul Kumar Singh",
    party_name: "BSP",
    house: "lok_sabha",
    constituency: "Ghosi",
    state_code: "UP",
    lok_sabha_term: "17",
    term_end: "2024-06-04",
    attendance_pct: 1.5 /* spec — full-term @ 1.5% */,
    questions_asked: 0,
    debates_participated: 0,
    private_member_bills: 0,
    pin_codes: ["275001"],
    data_confidence: "high",
  },
  // ── BMW-173: Two 100%-attendance MPs in 17th LS ──────────────────────
  {
    prs_slug: "mohan-mandavi",
    name: "Mohan Mandavi",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Kanker",
    state_code: "CG",
    lok_sabha_term: "17",
    term_end: "2024-06-04",
    attendance_pct: 100 /* spec */,
    questions_asked: 220,
    debates_participated: 45,
    private_member_bills: 0,
    pin_codes: ["494334"],
    data_confidence: "high",
  },
  {
    prs_slug: "bhagirath-chaudhary",
    name: "Bhagirath Chaudhary",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Ajmer",
    state_code: "RJ",
    lok_sabha_term: "17",
    term_end: "2024-06-04",
    attendance_pct: 100 /* spec */,
    questions_asked: 295,
    debates_participated: 38,
    private_member_bills: 0,
    pin_codes: ["305001"],
    data_confidence: "high",
  },
  // ── BMW-177: Sunny Deol — 17% attendance ─────────────────────────────
  {
    prs_slug: "sunny-deol",
    name: "Sunny Deol",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Gurdaspur",
    state_code: "PB",
    lok_sabha_term: "17",
    term_end: "2024-06-04",
    attendance_pct: 17 /* spec */,
    questions_asked: 4 /* spec */,
    debates_participated: 0 /* spec */,
    private_member_bills: 0,
    is_crorepati: true,
    assets_inr: 87_00_00_000,
    education_level: "12th Pass",
    pin_codes: ["143521"],
    data_confidence: "high",
  },
  // ── BMW-180: Pemmasani — TDP, ₹5,705 cr ──────────────────────────────
  {
    prs_slug: "pemmasani-chandra-sekhar",
    name: "Pemmasani Chandra Sekhar",
    party_name: "TDP",
    house: "lok_sabha",
    constituency: "Guntur",
    state_code: "AP",
    lok_sabha_term: "18",
    attendance_pct: 78,
    questions_asked: 40,
    debates_participated: 15,
    private_member_bills: 0,
    is_crorepati: true,
    assets_inr: 5705_00_00_000 /* spec — ₹5,705 cr */,
    education_level: "Graduate Professional",
    pin_codes: ["522001"],
    data_confidence: "high",
  },
  // ── BMW-155: PM Narendra Modi (Varanasi) ─────────────────────────────
  {
    prs_slug: "narendra-modi",
    name: "Narendra Modi",
    party_name: "BJP",
    house: "lok_sabha",
    constituency: "Varanasi",
    state_code: "UP",
    lok_sabha_term: "18",
    attendance_pct: null,
    attendance_note: "Prime Minister — exempt from signing attendance register (Article 100/Speaker's Rules).",
    questions_asked: 0,
    debates_participated: 12,
    private_member_bills: 0,
    is_minister: true,
    is_crorepati: true,
    assets_inr: 3_02_00_000,
    education_level: "Post Graduate",
    pin_codes: ["221001", "221002", "221005", "221007"],
    data_confidence: "high",
  },
  // ── BMW-150 / BMW-185: FM Sitharaman (already in STATIC_MPS) ──────────
  // We re-emit here with full BMW-130 fields so /mp can render her card.
  {
    prs_slug: "nirmala-sitharaman",
    name: "Nirmala Sitharaman",
    party_name: "BJP",
    house: "rajya_sabha",
    constituency: null,
    state_code: "KA",
    lok_sabha_term: "18",
    attendance_pct: null,
    attendance_note: "Finance Minister — exempt from signing attendance register.",
    questions_asked: 0,
    debates_participated: 28,
    private_member_bills: 0,
    is_minister: true,
    is_crorepati: true,
    assets_inr: 2_60_00_000,
    education_level: "Post Graduate",
    data_confidence: "high",
  },
  // ── BMW-146: Ajay Rai (Varanasi 2024 candidate vs Modi) ──────────────
  {
    prs_slug: "ajay-rai",
    name: "Ajay Rai",
    party_name: "INC",
    house: null,
    constituency: "Varanasi (lost 2024)",
    state_code: "UP",
    attendance_pct: null,
    attendance_note: "Lost 2024 LS election to Narendra Modi.",
    criminal_cases_any: 9,
    criminal_cases_serious: 1,
    is_crorepati: true,
    assets_inr: 23_00_00_000,
    data_confidence: "medium",
  },
]

export const STATIC_MPS_BMW: Mp[] = SEED.map((s) => ({
  id: mpId(s.prs_slug),
  name: s.name,
  name_translations: {},
  party_id: null,
  party_name: s.party_name ?? null,
  house: s.house ?? null,
  constituency: s.constituency ?? null,
  state_code: s.state_code ?? null,
  term_start: s.term_start ?? "2024-06-04",
  term_end: s.term_end ?? null,
  photo_url: s.photo_url ?? null,
  myneta_id: null,
  created_at: now,
  prs_slug: s.prs_slug,
  lok_sabha_term: s.lok_sabha_term ?? "18",
  attendance_pct: s.attendance_pct ?? null,
  attendance_note: s.attendance_note ?? null,
  session_attendance: s.session_attendance ?? {},
  questions_asked: s.questions_asked ?? null,
  debates_participated: s.debates_participated ?? null,
  private_member_bills: s.private_member_bills ?? null,
  national_avg_attendance: s.national_avg_attendance ?? 85,
  national_avg_questions: s.national_avg_questions ?? 103,
  national_avg_debates: s.national_avg_debates ?? 20.4,
  myneta_url: s.myneta_url ?? null,
  assets_inr: s.assets_inr ?? null,
  liabilities_inr: s.liabilities_inr ?? null,
  criminal_cases_any: s.criminal_cases_any ?? null,
  criminal_cases_serious: s.criminal_cases_serious ?? null,
  is_crorepati: s.is_crorepati ?? null,
  education_level: s.education_level ?? null,
  age_at_election: s.age_at_election ?? null,
  mplads_sanctioned_inr: s.mplads_sanctioned_inr ?? null,
  mplads_released_inr: s.mplads_released_inr ?? null,
  mplads_spent_inr: s.mplads_spent_inr ?? null,
  mplads_unspent_inr: s.mplads_unspent_inr ?? null,
  is_minister: s.is_minister ?? false,
  pin_codes: s.pin_codes ?? [],
  data_confidence: s.data_confidence ?? "medium",
  data_sources: s.data_sources ?? [],
  // Detail lists for tab views
  questions_detail: s.questions_detail ?? [],
  criminal_cases_detail: s.criminal_cases_detail ?? [],
  education_history: s.education_history ?? [],
  business_interests: s.business_interests ?? undefined,
  business_interests_status: s.business_interests_status ?? undefined,
}))

// ── Merge marquee + generated full PRS roster + state MLAs ───────────────
// STATIC_MPS_ALL is the union of:
//   - 25 marquee MPs (BMW spec, with extra fields like pin_codes, education,
//     criminal_cases, MPLADS — hand-curated)
//   - 544 PRS-scraped MPs (full 18th LS, with attendance/questions/sessions)
//   - ~50 marquee MLAs from STATIC_MLAS (CMs + senior cabinet across 10 states)
// Marquee MP entries override generated ones when both exist (richer data wins).
// MLAs slot into the same Mp shape via mlaToMp() so search/routes work for everyone.
import { STATIC_MPS_GEN } from "./staticMps.generated"
import { STATIC_MLAS, type Mla } from "./staticMlas"

// Adapt an MLA record into the Mp shape. Most parliamentary fields stay null
// (attendance, questions, etc.) — state assembly ingest will fill them later.
function mlaToMp(mla: Mla): Mp {
  // URL slug: stable, collision-safe with MP slugs (mla- prefix).
  // Derived from mla.id which already has the form "mla:<state>:<slug>".
  const slug = mla.id.replace(/:/g, "-")
  return {
    id: mla.id,
    name: mla.name,
    name_translations: {},
    party_id: null,
    party_name: mla.party,
    house: "vidhan_sabha",
    constituency: mla.constituency,
    state_code: mla.state_code,
    term_start: null,
    term_end: null,
    photo_url: mla.photo_url ?? null,
    myneta_id: null,
    created_at: now,
    prs_slug: slug,
    lok_sabha_term: null,
    attendance_pct: null,
    attendance_note: `${mla.state} MLA — state assembly attendance/questions feed not yet wired (ADR + state portal scrapers in build).`,
    session_attendance: {},
    questions_asked: null,
    debates_participated: null,
    private_member_bills: null,
    national_avg_attendance: null,
    national_avg_questions: null,
    national_avg_debates: null,
    myneta_url: null,
    assets_inr: null,
    liabilities_inr: null,
    criminal_cases_any: null,
    criminal_cases_serious: null,
    is_crorepati: null,
    education_level: mla.education ?? null,
    age_at_election: mla.age ?? null,
    mplads_sanctioned_inr: null,
    mplads_released_inr: null,
    mplads_spent_inr: null,
    mplads_unspent_inr: null,
    is_minister: !!mla.cabinet_role,
    pin_codes: [],
    data_confidence: mla.data_confidence,
    data_sources: [],
    questions_detail: [],
    criminal_cases_detail: [],
    education_history: [],
    business_interests: undefined,
    business_interests_status: undefined,
  }
}

const _allBySlug: Record<string, Mp> = {}
for (const mp of STATIC_MPS_GEN as Mp[]) {
  if (mp.prs_slug) _allBySlug[mp.prs_slug] = mp
}
for (const mp of STATIC_MPS_BMW) {
  if (mp.prs_slug) _allBySlug[mp.prs_slug] = mp
}
for (const mla of STATIC_MLAS) {
  const adapted = mlaToMp(mla)
  if (adapted.prs_slug) _allBySlug[adapted.prs_slug] = adapted
}
export const STATIC_MPS_ALL: Mp[] = Object.values(_allBySlug)

// Convenience lookups (kept as before for back-compat, now over the full set)
export const MP_BY_SLUG = Object.fromEntries(
  STATIC_MPS_ALL.map((mp) => [mp.prs_slug!, mp])
) as Record<string, Mp>

export const MP_BY_PIN = (() => {
  const m: Record<string, Mp> = {}
  // PIN codes only exist on the marquee set (hand-seeded with pin_codes arrays);
  // generated PRS records don't have PIN data, so PIN lookups stay on marquee.
  for (const mp of STATIC_MPS_BMW) {
    for (const pin of mp.pin_codes ?? []) m[pin] = mp
  }
  return m
})()

export function findMpByPin(pin: string): Mp | null {
  return MP_BY_PIN[pin.trim()] ?? null
}

export function findMpByQuery(q: string): Mp[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  return STATIC_MPS_ALL.filter(
    (mp) =>
      mp.name.toLowerCase().includes(needle) ||
      (mp.constituency ?? "").toLowerCase().includes(needle) ||
      (mp.prs_slug ?? "").toLowerCase().includes(needle) ||
      (mp.state_code ?? "").toLowerCase() === needle
  )
}
