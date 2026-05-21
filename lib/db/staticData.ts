// Static fallback data — used when Supabase env vars are missing/placeholder.
// Sourced from official 2024 Lok Sabha manifestos and reputable news coverage.
// Replaced at runtime by Supabase data when configured.

import type { Party, Manifesto, PromiseRow } from "./types"
import { getPromiseRating } from "./promiseStatuses"
import { getSourceVerification } from "./promiseSourceVerification"

// Deterministic pseudo-UUIDs (v4 shape) so foreign-key joins resolve.
const pid = (slug: string): string => {
  // 8-4-4-4-12 hex chars built deterministically from slug
  const h = (s: string, salt: string) => {
    let n = 0
    for (const c of s + salt) n = (n * 131 + c.charCodeAt(0)) >>> 0
    return n.toString(16).padStart(8, "0")
  }
  const a = h(slug, "a")
  const b = h(slug, "b").slice(0, 4)
  const c = "4" + h(slug, "c").slice(0, 3)
  const d = "8" + h(slug, "d").slice(0, 3)
  const e = h(slug, "e") + h(slug, "f").slice(0, 4)
  return `${a}-${b}-${c}-${d}-${e}`
}

const partyId = (slug: string) => pid(`party:${slug}`)
const manifestoId = (slug: string) => pid(`manifesto:${slug}:lok_sabha:2024`)
const promiseId = (slug: string, n: number) => pid(`promise:${slug}:${n}`)

const now = "2024-04-15T00:00:00Z"

interface PartySeed {
  slug: string
  name: string
  short_name: string
  level: "national" | "state"
  founded_year: number
  color_hex: string
  website_url: string
  manifesto: {
    title: string
    source_url: string
    pages: number | null
  }
  promises: Array<{
    title: string
    text: string
    category: string
    tags: string[]
    success_criteria?: string
    target_metric?: { metric: string; value: number; unit: string; deadline_year?: number }
    is_headline?: boolean
  }>
}

const SEED: PartySeed[] = [
  {
    slug: "bjp",
    name: "Bharatiya Janata Party",
    short_name: "BJP",
    level: "national",
    founded_year: 1980,
    color_hex: "#FF6B00",
    website_url: "https://www.bjp.org",
    manifesto: {
      title: "BJP Sankalp Patra 2024 — Modi Ki Guarantee",
      source_url:
        "https://www.bjp.org/files/2024-04/Modi-Ki-Guarantee-Sankalp-Patra-English.pdf",
      pages: 76,
    },
    promises: [
      {
        title: "Free rations for poor for 5 more years",
        text: "Continue PM Garib Kalyan Anna Yojana free-ration scheme through 2029 for 80 crore beneficiaries.",
        category: "social_welfare",
        tags: ["PMGKAY", "food security"],
        target_metric: { metric: "beneficiaries", value: 800000000, unit: "people", deadline_year: 2029 },
        is_headline: true,
      },
      {
        title: "3 crore PM Awas Yojana houses",
        text: "Build three crore new pucca houses for the poor under PMAY-G and PMAY-U by 2029.",
        category: "infrastructure",
        tags: ["PM Awas", "housing"],
        target_metric: { metric: "houses", value: 30000000, unit: "houses", deadline_year: 2029 },
        is_headline: true,
      },
      {
        title: "Zero electricity bills via PM Surya Ghar",
        text: "Free rooftop solar for 1 crore households generating 300 units/month under PM Surya Ghar Muft Bijli Yojana.",
        category: "energy",
        tags: ["solar", "PM Surya Ghar"],
        target_metric: { metric: "rooftop installations", value: 10000000, unit: "households", deadline_year: 2027 },
        is_headline: true,
      },
      {
        title: "3 crore Lakhpati Didis",
        text: "Triple the count of rural women earning ₹1 lakh+ annually as Lakhpati Didis from 1 crore to 3 crore.",
        category: "women",
        tags: ["Lakhpati Didi", "SHG"],
        target_metric: { metric: "Lakhpati Didis", value: 30000000, unit: "women", deadline_year: 2029 },
        is_headline: true,
      },
      {
        title: "Women's reservation in Lok Sabha & assemblies",
        text: "Implement Nari Shakti Vandan Adhiniyam reserving one-third of Lok Sabha and state assembly seats for women.",
        category: "women",
        tags: ["women's reservation"],
        is_headline: true,
      },
      {
        title: "Uniform Civil Code",
        text: "Implement a Uniform Civil Code drawing on best practices and consultations.",
        category: "governance",
        tags: ["UCC"],
      },
      {
        title: "One Nation, One Election",
        text: "Build consensus to implement simultaneous Lok Sabha, state assembly and local body elections.",
        category: "governance",
        tags: ["ONOE"],
      },
      {
        title: "Make India 3rd-largest economy",
        text: "Take India from 5th to 3rd-largest economy in the world during the next term.",
        category: "economy",
        tags: ["GDP", "growth"],
        target_metric: { metric: "global GDP rank", value: 3, unit: "rank", deadline_year: 2029 },
        is_headline: true,
      },
    ],
  },
  {
    slug: "inc",
    name: "Indian National Congress",
    short_name: "INC",
    level: "national",
    founded_year: 1885,
    color_hex: "#19AAED",
    website_url: "https://www.inc.in",
    manifesto: {
      title: "Nyay Patra — Congress Lok Sabha Manifesto 2024",
      source_url: "https://manifesto.inc.in/en/",
      pages: 48,
    },
    promises: [
      {
        title: "Mahalakshmi: ₹1 lakh/year to poor women",
        text: "Unconditional cash transfer of ₹1 lakh per year to one woman in every poor family.",
        category: "women",
        tags: ["Mahalakshmi", "cash transfer"],
        target_metric: { metric: "amount per family", value: 100000, unit: "INR/year" },
        is_headline: true,
      },
      {
        title: "Right to apprenticeship for graduates",
        text: "Guarantee a one-year apprenticeship with ₹1 lakh stipend to every diploma holder or graduate under 25.",
        category: "employment",
        tags: ["apprenticeship", "youth"],
        target_metric: { metric: "stipend", value: 100000, unit: "INR/year" },
        is_headline: true,
      },
      {
        title: "Legal guarantee for MSP",
        text: "Provide a legal guarantee for Minimum Support Price for crops based on the Swaminathan formula.",
        category: "agriculture",
        tags: ["MSP", "farmers"],
        is_headline: true,
      },
      {
        title: "Nationwide caste census",
        text: "Conduct a socio-economic and caste census to enumerate caste groups and assess their socio-economic conditions.",
        category: "social_welfare",
        tags: ["caste census"],
        is_headline: true,
      },
      {
        title: "Remove 50% reservation cap",
        text: "Pass a constitutional amendment to raise the 50% cap on SC, ST and OBC reservations.",
        category: "social_welfare",
        tags: ["reservations"],
      },
      {
        title: "Scrap Agnipath scheme",
        text: "Scrap the Agnipath scheme and restore normal recruitment in the armed forces.",
        category: "governance",
        tags: ["Agnipath", "defence"],
      },
      {
        title: "Restore statehood to J&K",
        text: "Restore full statehood to Jammu & Kashmir immediately.",
        category: "federalism",
        tags: ["J&K"],
      },
    ],
  },
  {
    slug: "aap",
    name: "Aam Aadmi Party",
    short_name: "AAP",
    level: "national",
    founded_year: 2012,
    color_hex: "#2196F3",
    website_url: "https://www.aamaadmiparty.org",
    manifesto: {
      title: "AAP Lok Sabha 2024 Guarantees",
      source_url: "https://www.aamaadmiparty.org",
      pages: 24,
    },
    promises: [
      {
        title: "Full statehood for Delhi",
        text: "Grant full statehood to Delhi giving its elected government control over land, police and services.",
        category: "federalism",
        tags: ["Delhi", "statehood"],
        is_headline: true,
      },
      {
        title: "Free electricity up to 300 units nationwide",
        text: "Roll out the Delhi free-power model nationally: zero electricity bill up to 300 units/month for every household.",
        category: "energy",
        tags: ["electricity", "subsidy"],
        target_metric: { metric: "free units", value: 300, unit: "kWh/month" },
        is_headline: true,
      },
      {
        title: "Universal quality education",
        text: "Replicate the Delhi government-school model nationally with refurbished schools and free quality education.",
        category: "education",
        tags: ["schools"],
        is_headline: true,
      },
      {
        title: "Mohalla clinics and free treatment",
        text: "Set up neighbourhood mohalla clinics with free OPD, tests and treatment across India.",
        category: "healthcare",
        tags: ["mohalla clinic"],
        is_headline: true,
      },
      {
        title: "MSP guarantee for farmers",
        text: "Enact a legal guarantee for MSP on all 23 notified crops.",
        category: "agriculture",
        tags: ["MSP"],
      },
      {
        title: "Scrap Agnipath",
        text: "Scrap the Agnipath scheme and restore permanent recruitment to the armed forces.",
        category: "governance",
        tags: ["Agnipath"],
      },
    ],
  },
  {
    slug: "dmk",
    name: "Dravida Munnetra Kazhagam",
    short_name: "DMK",
    level: "state",
    founded_year: 1949,
    color_hex: "#E32636",
    website_url: "https://www.dmk.in",
    manifesto: {
      title: "DMK Lok Sabha 2024 Election Manifesto",
      source_url: "https://www.dmk.in",
      pages: 32,
    },
    promises: [
      {
        title: "Restore statehood to Puducherry & J&K",
        text: "Restore full statehood to Puducherry and Jammu & Kashmir.",
        category: "federalism",
        tags: ["statehood"],
      },
      {
        title: "NEET exemption for Tamil Nadu",
        text: "Exempt Tamil Nadu from NEET and let states design their own medical-admission processes.",
        category: "education",
        tags: ["NEET", "TN"],
        is_headline: true,
      },
      {
        title: "Scrap CAA and stop NRC",
        text: "Scrap the Citizenship Amendment Act and stop the National Register of Citizens process.",
        category: "secularism",
        tags: ["CAA", "NRC"],
      },
      {
        title: "Restore Old Pension Scheme",
        text: "Restore the Old Pension Scheme for all central and state government employees.",
        category: "social_welfare",
        tags: ["OPS"],
      },
      {
        title: "Cauvery water rights",
        text: "Ensure Tamil Nadu's legitimate share of Cauvery river waters through a permanent mechanism.",
        category: "federalism",
        tags: ["Cauvery"],
      },
      {
        title: "Greater fiscal devolution to states",
        text: "Raise states' share in the divisible tax pool from 41% to 50%.",
        category: "federalism",
        tags: ["finance commission"],
        target_metric: { metric: "states' share", value: 50, unit: "percent" },
      },
    ],
  },
  // ── New parties ────────────────────────────────────────────────────────
  {
    slug: "cpim",
    name: "Communist Party of India (Marxist)",
    short_name: "CPI(M)",
    level: "national",
    founded_year: 1964,
    color_hex: "#C8102E",
    website_url: "https://cpim.org",
    manifesto: {
      title: "CPI(M) 18th Lok Sabha Election Manifesto 2024",
      source_url:
        "https://cpim.org/wp-content/uploads/old/documents/election_manifesto_english_april_2024.pdf",
      pages: 54,
    },
    promises: [
      {
        title: "Right to Work as a constitutional right",
        text: "Include the Right to Work as a constitutional right and urgently fill vacancies in government and PSU posts.",
        category: "employment",
        tags: ["right to work"],
        is_headline: true,
      },
      {
        title: "Education budget = 6% of GDP",
        text: "Raise budgetary allocation for education to at least 6% of GDP.",
        category: "education",
        tags: ["education spend"],
        target_metric: { metric: "education spend", value: 6, unit: "percent of GDP" },
        is_headline: true,
      },
      {
        title: "Reverse PSU privatization",
        text: "Revisit and reverse privatization of public sector undertakings to protect economic sovereignty.",
        category: "economy",
        tags: ["PSU", "privatization"],
        is_headline: true,
      },
      {
        title: "Restore Old Pension Scheme",
        text: "Restore the Old Pension Scheme for all government employees, including paramilitary.",
        category: "social_welfare",
        tags: ["OPS"],
      },
      {
        title: "Scrap CAA",
        text: "Repeal the Citizenship Amendment Act and abandon NRC plans nationwide.",
        category: "secularism",
        tags: ["CAA", "NRC"],
      },
      {
        title: "MGNREGA: 200 days, ₹700 wage",
        text: "Increase MGNREGA work guarantee to 200 days a year with a minimum wage of ₹700.",
        category: "employment",
        tags: ["MGNREGA"],
        target_metric: { metric: "wage", value: 700, unit: "INR/day" },
        is_headline: true,
      },
      {
        title: "Wealth and inheritance tax",
        text: "Introduce a wealth tax and an inheritance tax on the super-rich and raise corporate tax to fund welfare.",
        category: "economy",
        tags: ["taxation", "inequality"],
      },
      {
        title: "Women's reservation immediately",
        text: "Implement one-third women's reservation in Lok Sabha and state assemblies immediately, without waiting for delimitation.",
        category: "women",
        tags: ["women's reservation"],
      },
      {
        title: "Remove 50% reservation cap",
        text: "Lift the 50% ceiling on SC/ST/OBC reservations.",
        category: "social_welfare",
        tags: ["reservations"],
      },
      {
        title: "ED/CBI under parliamentary oversight",
        text: "Bring the ED, CBI and other central agencies under parliamentary oversight to curb misuse.",
        category: "governance",
        tags: ["ED", "CBI"],
      },
    ],
  },
  {
    slug: "cpi",
    name: "Communist Party of India",
    short_name: "CPI",
    level: "national",
    founded_year: 1925,
    color_hex: "#D32F2F",
    website_url: "https://www.communistparty.in",
    manifesto: {
      title: "CPI Lok Sabha 2024 Manifesto",
      source_url: "https://www.communistparty.in/post/cpi-manifesto-2024",
      pages: 40,
    },
    promises: [
      {
        title: "Restore Old Pension Scheme",
        text: "Complete restoration of the Old Pension Scheme for all government employees.",
        category: "social_welfare",
        tags: ["OPS"],
        is_headline: true,
      },
      {
        title: "Scrap CAA",
        text: "Abolish the Citizenship Amendment Act.",
        category: "secularism",
        tags: ["CAA"],
        is_headline: true,
      },
      {
        title: "ED & CBI under Parliament",
        text: "Bring the ED and CBI under the purview of Parliament to ensure impartiality and prevent executive abuse.",
        category: "governance",
        tags: ["ED", "CBI", "agencies"],
        is_headline: true,
      },
      {
        title: "MGNREGA: 200 days at ₹700",
        text: "Increase MGNREGA minimum wages to ₹700 and available work days to 200 per calendar year.",
        category: "employment",
        tags: ["MGNREGA"],
        target_metric: { metric: "wage", value: 700, unit: "INR/day" },
        is_headline: true,
      },
      {
        title: "Abolish Governor's office",
        text: "Abolish the office of Governor to strengthen federalism and reduce central interference in states.",
        category: "federalism",
        tags: ["governor"],
      },
      {
        title: "Reinstate Planning Commission",
        text: "Dismantle NITI Aayog and reinstate the Planning Commission for scientific, plan-based policy.",
        category: "governance",
        tags: ["planning commission"],
      },
      {
        title: "Wealth, inheritance & higher corporate tax",
        text: "Introduce wealth tax, inheritance tax and higher corporate tax to address inequality.",
        category: "economy",
        tags: ["taxation"],
      },
      {
        title: "Reservations in private sector",
        text: "Ensure reservations for SC/ST/OBC in the private sector.",
        category: "social_welfare",
        tags: ["reservations"],
      },
      {
        title: "Remove 50% reservation cap",
        text: "Remove the 50% ceiling on reservations to enable proportionate representation.",
        category: "social_welfare",
        tags: ["reservations"],
      },
    ],
  },
  {
    slug: "aitc",
    name: "All India Trinamool Congress",
    short_name: "AITC",
    level: "national",
    founded_year: 1998,
    color_hex: "#20603D",
    website_url: "https://aitcofficial.org",
    manifesto: {
      title: "Didir Shopoth — AITC Lok Sabha Manifesto 2024",
      source_url: "https://aitcofficial.org/manifesto/",
      pages: 36,
    },
    promises: [
      {
        title: "MGNREGA: 100 days at ₹400",
        text: "Guarantee 100 days of work to every job-card holder at a daily wage of ₹400 under MGNREGA.",
        category: "employment",
        tags: ["MGNREGA"],
        target_metric: { metric: "wage", value: 400, unit: "INR/day" },
        is_headline: true,
      },
      {
        title: "1-year paid apprenticeship for graduates",
        text: "Provide a one-year apprenticeship with monthly stipend to every graduate and diploma holder under 25.",
        category: "employment",
        tags: ["apprenticeship", "youth"],
        is_headline: true,
      },
      {
        title: "Kanyashree extended nationwide",
        text: "Extend the Kanyashree scholarship-for-girls scheme to every state across India.",
        category: "women",
        tags: ["Kanyashree"],
        is_headline: true,
      },
      {
        title: "Withdraw CAA, stop NRC, oppose UCC",
        text: "Withdraw the Citizenship Amendment Act, halt the NRC process and oppose imposition of a Uniform Civil Code.",
        category: "secularism",
        tags: ["CAA", "NRC", "UCC"],
        is_headline: true,
      },
      {
        title: "Universal housing",
        text: "Guarantee a pucca home to every Indian family without one.",
        category: "infrastructure",
        tags: ["housing"],
      },
      {
        title: "Free LPG cylinders",
        text: "Provide free LPG cylinders to BPL families to ease cooking-fuel burden.",
        category: "social_welfare",
        tags: ["LPG"],
      },
      {
        title: "Assured MSP for farmers",
        text: "Guarantee a legally assured Minimum Support Price for all major crops.",
        category: "agriculture",
        tags: ["MSP"],
      },
      {
        title: "SC/ST/OBC scholarships",
        text: "Expand scholarships for SC, ST and OBC students at school and college levels.",
        category: "education",
        tags: ["scholarships"],
      },
      {
        title: "Restore J&K statehood",
        text: "Restore full statehood to Jammu & Kashmir.",
        category: "federalism",
        tags: ["J&K"],
      },
      {
        title: "Caste census",
        text: "Conduct a nationwide caste census.",
        category: "social_welfare",
        tags: ["caste census"],
      },
    ],
  },
  {
    slug: "sp",
    name: "Samajwadi Party",
    short_name: "SP",
    level: "state",
    founded_year: 1992,
    color_hex: "#E60026",
    website_url: "https://samajwadiparty.in",
    manifesto: {
      title: "Hamara Adhikar — Janata Ka Mangpatra (SP Lok Sabha Manifesto 2024)",
      source_url: "https://samajwadiparty.in/images/MANIFESTO_2024.pdf",
      pages: 28,
    },
    promises: [
      {
        title: "Caste census by 2025",
        text: "Conduct a nationwide caste census by 2025 and roll out caste-based social-justice measures by 2029.",
        category: "social_welfare",
        tags: ["caste census", "PDA"],
        target_metric: { metric: "deadline", value: 2025, unit: "year", deadline_year: 2025 },
        is_headline: true,
      },
      {
        title: "Free education KG to PG for girls",
        text: "Free education for girls from kindergarten to post-graduation across all government institutions.",
        category: "education",
        tags: ["girls", "free education"],
        is_headline: true,
      },
      {
        title: "Education budget = 6% of GDP",
        text: "Raise the education budget from 3% to 6% of GDP.",
        category: "education",
        tags: ["education spend"],
        target_metric: { metric: "education spend", value: 6, unit: "percent of GDP" },
      },
      {
        title: "Urban Employment Guarantee Act",
        text: "Enact an urban-employment-guarantee law on the lines of MGNREGA in the first parliamentary session.",
        category: "employment",
        tags: ["urban MGNREGA"],
        is_headline: true,
      },
      {
        title: "Fill all vacant government posts",
        text: "Immediately fill every vacant position across central government departments and PSUs.",
        category: "employment",
        tags: ["jobs"],
      },
      {
        title: "MSP guarantee on Swaminathan formula",
        text: "Legally guarantee MSP on all crops using the MS Swaminathan Committee formula.",
        category: "agriculture",
        tags: ["MSP", "Swaminathan"],
        is_headline: true,
      },
      {
        title: "Scrap Agniveer",
        text: "Scrap the Agniveer scheme and resume regular recruitment to the armed forces.",
        category: "governance",
        tags: ["Agnipath"],
      },
      {
        title: "Restore Old Pension Scheme",
        text: "Reinstate the Old Pension Scheme for all government employees including paramilitary forces.",
        category: "social_welfare",
        tags: ["OPS"],
      },
      {
        title: "Women BPL pension of ₹3,000/month",
        text: "Monthly pension of up to ₹3,000 for women from BPL families.",
        category: "women",
        tags: ["pension"],
        target_metric: { metric: "monthly pension", value: 3000, unit: "INR/month" },
      },
    ],
  },
  {
    slug: "ncp-sp",
    name: "Nationalist Congress Party (Sharadchandra Pawar)",
    short_name: "NCP(SP)",
    level: "national",
    founded_year: 1999,
    color_hex: "#0066B3",
    website_url: "https://ncpspeaks.org",
    manifesto: {
      title: "Shapath Patra — NCP(SP) Lok Sabha Manifesto 2024",
      source_url:
        "https://www.deccanherald.com/elections/india/lok-sabha-polls-2024-ncp-sp-unveils-manifesto-favours-caste-census-stresses-on-welfare-of-farmers-women-lgbtq-community-2993974",
      pages: 22,
    },
    promises: [
      {
        title: "LPG cylinder at ₹500",
        text: "Cap LPG cylinder price at ₹500, subsidised by the government if necessary.",
        category: "social_welfare",
        tags: ["LPG"],
        target_metric: { metric: "LPG price", value: 500, unit: "INR/cylinder" },
        is_headline: true,
      },
      {
        title: "Restructure petrol & diesel tax",
        text: "Restructure the central excise on petrol and diesel to reduce pump prices.",
        category: "economy",
        tags: ["fuel"],
      },
      {
        title: "50% reservation for women in jobs",
        text: "Guarantee 50% reservation for women in government and public-sector jobs.",
        category: "women",
        tags: ["women's reservation"],
        target_metric: { metric: "reservation", value: 50, unit: "percent" },
        is_headline: true,
      },
      {
        title: "Nationwide caste census",
        text: "Conduct a nationwide socio-economic and caste census.",
        category: "social_welfare",
        tags: ["caste census"],
        is_headline: true,
      },
      {
        title: "Scrap Agnipath",
        text: "Scrap the Agnipath scheme; restore regular defence recruitment.",
        category: "governance",
        tags: ["Agnipath"],
      },
      {
        title: "Separate farmers' welfare commission",
        text: "Set up a dedicated commission for farmers' welfare with statutory backing.",
        category: "agriculture",
        tags: ["farmers"],
      },
      {
        title: "Full statehood for J&K",
        text: "Restore full statehood to Jammu & Kashmir.",
        category: "federalism",
        tags: ["J&K"],
      },
      {
        title: "Reject one-nation-one-election",
        text: "Reject the proposed 'One Nation, One Election' framework as undermining federalism.",
        category: "federalism",
        tags: ["ONOE"],
      },
      {
        title: "Review CAA, NRC, UAPA",
        text: "Review and reform the CAA, NRC, UAPA and other laws conflicting with constitutional principles.",
        category: "secularism",
        tags: ["CAA", "UAPA"],
      },
      {
        title: "Welfare for LGBTQ community",
        text: "Bring in welfare measures and anti-discrimination protections for the LGBTQ community.",
        category: "social_welfare",
        tags: ["LGBTQ"],
      },
    ],
  },
  {
    slug: "shs-ubt",
    name: "Shiv Sena (Uddhav Balasaheb Thackeray)",
    short_name: "SHS(UBT)",
    level: "state",
    founded_year: 1966,
    color_hex: "#F58220",
    website_url: "https://shivsenaubt.in",
    manifesto: {
      title: "Vachan Nama — SHS(UBT) Lok Sabha Manifesto 2024",
      source_url:
        "https://blog.mumbaivotes.com/wp-content/uploads/2024/05/SHSUBT_LS2024_Manifesto_Design_Full.pdf",
      pages: 30,
    },
    promises: [
      {
        title: "Farm loan waiver and revised crop insurance",
        text: "Comprehensive farm-loan waiver and revision of crop-insurance conditions for farmers.",
        category: "agriculture",
        tags: ["loan waiver"],
        is_headline: true,
      },
      {
        title: "GST-free farm equipment & seeds",
        text: "Exempt agricultural equipment and seeds from GST.",
        category: "agriculture",
        tags: ["GST"],
      },
      {
        title: "Stable price of 5 essential goods",
        text: "Keep prices of five essential commodities (wheat, rice, oil, pulses, sugar) stable for five years.",
        category: "economy",
        tags: ["inflation", "essentials"],
        is_headline: true,
      },
      {
        title: "District-level jobs for rural youth",
        text: "Create employment opportunities for rural youth at the district level to curb migration.",
        category: "employment",
        tags: ["rural jobs"],
      },
      {
        title: "Eco-friendly industries only",
        text: "Permit only eco-friendly projects and industries to be developed in Maharashtra.",
        category: "environment",
        tags: ["environment"],
      },
      {
        title: "International financial centre for Maharashtrians",
        text: "Build an international-grade financial and industrial centre prioritising local Maharashtrians.",
        category: "infrastructure",
        tags: ["Maharashtra"],
      },
      {
        title: "Scrap Dharavi redevelopment project",
        text: "Scrap the current Dharavi redevelopment project and redesign it after resident consultation.",
        category: "infrastructure",
        tags: ["Dharavi", "Mumbai"],
        is_headline: true,
      },
      {
        title: "₹25 lakh cashless health cover per family",
        text: "Provide every family with cashless medical treatment of up to ₹25 lakh per year.",
        category: "healthcare",
        tags: ["insurance"],
        target_metric: { metric: "health cover", value: 2500000, unit: "INR/family/year" },
        is_headline: true,
      },
    ],
  },
  {
    slug: "ysrcp",
    name: "Yuvajana Sramika Rythu Congress Party",
    short_name: "YSRCP",
    level: "state",
    founded_year: 2011,
    color_hex: "#0F9D58",
    website_url: "https://www.ysrcongress.com",
    manifesto: {
      title: "Navaratnalu Plus — YSRCP Manifesto 2024",
      source_url:
        "https://www.business-standard.com/elections/lok-sabha-election/ls-polls-pension-increase-vizag-as-executive-capital-in-ysrcp-manifesto-124042700556_1.html",
      pages: 16,
    },
    promises: [
      {
        title: "Pension hike to ₹3,500/month by 2029",
        text: "Raise welfare pension from ₹3,000 to ₹3,250 by Jan 2028 and ₹3,500 by Jan 2029.",
        category: "social_welfare",
        tags: ["pension"],
        target_metric: { metric: "pension", value: 3500, unit: "INR/month", deadline_year: 2029 },
        is_headline: true,
      },
      {
        title: "Visakhapatnam as executive capital",
        text: "Make Visakhapatnam the executive capital of Andhra Pradesh.",
        category: "federalism",
        tags: ["Vizag", "capital"],
        is_headline: true,
      },
      {
        title: "Amma Vodi raised to ₹17,000",
        text: "Raise the annual Amma Vodi support to mothers of school children from ₹15,000 to ₹17,000.",
        category: "education",
        tags: ["Amma Vodi"],
        target_metric: { metric: "support", value: 17000, unit: "INR/year" },
      },
      {
        title: "YSR Cheyutha doubled to ₹1.5 lakh",
        text: "Double the YSR Cheyutha benefit for women aged 45-60 from ₹75,000 to ₹1.5 lakh across four phases.",
        category: "women",
        tags: ["Cheyutha"],
        target_metric: { metric: "benefit", value: 150000, unit: "INR/4 years" },
      },
      {
        title: "Farmer insurance raised to ₹16,000",
        text: "Increase Rythu Bharosa input subsidy/insurance from ₹13,500 to ₹16,000 per acre.",
        category: "agriculture",
        tags: ["Rythu Bharosa"],
        target_metric: { metric: "input subsidy", value: 16000, unit: "INR/acre" },
      },
      {
        title: "Polavaram & 17 medical colleges",
        text: "Complete the Polavaram irrigation project along with 17 new medical colleges, 10 fishing harbours and Bhogapuram airport.",
        category: "infrastructure",
        tags: ["Polavaram"],
        is_headline: true,
      },
      {
        title: "Separate panchayats for SC-majority villages",
        text: "Create separate panchayats in villages with a significant SC population and at least 500 houses.",
        category: "dalit_adivasi",
        tags: ["panchayat", "SC"],
      },
    ],
  },
  {
    slug: "bsp",
    name: "Bahujan Samaj Party",
    short_name: "BSP",
    level: "national",
    founded_year: 1984,
    color_hex: "#22409A",
    website_url: "https://www.bspindia.org",
    manifesto: {
      title: "BSP 2024 Election Agenda (no formal manifesto)",
      source_url:
        "https://www.business-standard.com/elections/lok-sabha-election/bsp-supremo-mayawati-promises-to-work-for-statehood-for-western-up-124041400653_1.html",
      pages: null,
    },
    promises: [
      {
        title: "Separate state for Western UP",
        text: "Take concrete steps to carve out a separate state from Western Uttar Pradesh districts.",
        category: "federalism",
        tags: ["Western UP", "statehood"],
        is_headline: true,
      },
      {
        title: "Allahabad HC bench in Meerut",
        text: "Establish a bench of the Allahabad High Court in Meerut for Western UP.",
        category: "justice",
        tags: ["HC bench"],
        is_headline: true,
      },
      {
        title: "Permanent govt jobs for unemployed",
        text: "Provide permanent government jobs to unemployed Dalits, Muslims, the poor and youth.",
        category: "employment",
        tags: ["jobs", "SC"],
        is_headline: true,
      },
      {
        title: "Fair price for sugarcane farmers",
        text: "Ensure remunerative sugarcane prices for Western UP farmers and clear pending arrears within 14 days.",
        category: "agriculture",
        tags: ["sugarcane"],
      },
      {
        title: "SC/ST/OBC representation in tickets",
        text: "Give appropriate share to all sections of society — SCs, OBCs and minorities — in candidate selection and governance.",
        category: "dalit_adivasi",
        tags: ["representation"],
      },
      {
        title: "Restore Old Pension Scheme",
        text: "Restore the Old Pension Scheme for all government employees.",
        category: "social_welfare",
        tags: ["OPS"],
      },
    ],
  },
]

// ── Materialize rows ──────────────────────────────────────────────────────

export const STATIC_PARTIES: Party[] = SEED.map((s) => ({
  id: partyId(s.slug),
  slug: s.slug,
  name: s.name,
  name_translations: {},
  short_name: s.short_name,
  level: s.level,
  state_code: null,
  founded_year: s.founded_year,
  color_hex: s.color_hex,
  logo_url: null,
  ec_registration: null,
  website_url: s.website_url,
  created_at: now,
}))

export const STATIC_MANIFESTOS: Manifesto[] = SEED.map((s) => ({
  id: manifestoId(s.slug),
  party_id: partyId(s.slug),
  election_type: "lok_sabha",
  election_year: 2024,
  state_code: null,
  title: s.manifesto.title,
  title_translations: {},
  source_url: s.manifesto.source_url,
  pdf_storage_key: null,
  language: "en",
  pages: s.manifesto.pages,
  ingested_at: now,
  ingested_by: null,
  status: "published",
  raw_text: null,
  created_at: now,
}))

export const STATIC_PROMISES: PromiseRow[] = SEED.flatMap((s) =>
  s.promises.map((p, idx) => {
    // ordinal is 1-based — used as the key in promiseStatuses.ts overlay.
    const ordinal = idx + 1
    const rating = getPromiseRating(s.slug, ordinal)
    const verification = getSourceVerification(s.slug, ordinal)

    // Honest civic-data discipline: a rating without ANY reachable source URL
    // is treated as not-yet-rated. We keep the rationale visible as an
    // editorial note, but the headline status reverts so we don't display
    // unverified claims as facts.
    const hasAnyReachable = verification && verification.reachable_urls.length > 0
    const effectiveStatus = rating && hasAnyReachable ? rating.status : "not_yet_rated"
    const effectiveRationale = rating
      ? hasAnyReachable
        ? rating.rationale +
          (verification && verification.evidence_quality === "unverified"
            ? " [Source URLs are reachable but their pages did not match the claim keywords on automated check — treat this rating as provisional.]"
            : "")
        : "Rating reverted to 'not yet rated' because none of the cited source URLs are reachable on automated verification. Editorial review required. Original rationale below: " +
          rating.rationale
      : null

    return {
      id: promiseId(s.slug, idx),
      manifesto_id: manifestoId(s.slug),
      party_id: partyId(s.slug),
      parent_id: null,
      ordinal,
      title: p.title,
      title_translations: {},
      text: p.text,
      text_translations: {},
      page_ref: null,
      category: p.category,
      tags: p.tags,
      success_criteria: p.success_criteria ?? null,
      target_metric: p.target_metric ?? null,
      target_deadline: null,
      geography: "national",
      status: effectiveStatus,
      status_rationale: effectiveRationale,
      status_updated_at: rating?.rated_at ?? null,
      status_updated_by: rating ? "editorial-overlay (verified)" : null,
      is_headline: p.is_headline ?? false,
      created_at: now,
    }
  })
)

