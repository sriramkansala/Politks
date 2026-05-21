// Ruling-party MLAs — selected list per state.
// Source: state Vidhan Sabha websites, ECI 2023/24 state-election results, MyNeta.
// Coverage: CMs + ~5-10 senior cabinet MLAs per state (10 most-important states).
// Full assembly rosters land via scripts/scrape-myneta-mlas.mjs in a later pass.

export interface Mla {
  id: string                          // mla:<state>:<slug>
  name: string
  state: string                       // canonical state name (matches atlas STATES key)
  state_code: string                  // 2-letter
  constituency: string                // AC name (matches assembly seat)
  party: string                       // party short code (matches PARTIES)
  party_alliance?: "NDA" | "INDIA" | "OTHER"
  cabinet_role?: string | null        // e.g. "Chief Minister", "Home", "Finance"
  is_cm?: boolean
  age?: number
  education?: string | null
  photo_url?: string | null
  data_confidence: "high" | "medium" | "low"
}

const id = (state: string, name: string) =>
  `mla:${state.toLowerCase().replace(/\s+/g, "-")}:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

export const STATIC_MLAS: Mla[] = [
  // ── Maharashtra (Mahayuti — BJP+Shiv Sena+NCP) ─────────────────────────
  { id: id("Maharashtra", "Devendra Fadnavis"), name: "Devendra Fadnavis", state: "Maharashtra", state_code: "MH", constituency: "Nagpur South West", party: "BJP", party_alliance: "NDA", cabinet_role: "Chief Minister", is_cm: true, age: 54, education: "LLB", data_confidence: "high" },
  { id: id("Maharashtra", "Eknath Shinde"), name: "Eknath Shinde", state: "Maharashtra", state_code: "MH", constituency: "Kopri-Pachpakhadi", party: "SHS", party_alliance: "NDA", cabinet_role: "Deputy CM · Urban Development", age: 60, education: "Class 11", data_confidence: "high" },
  { id: id("Maharashtra", "Ajit Pawar"), name: "Ajit Pawar", state: "Maharashtra", state_code: "MH", constituency: "Baramati", party: "NCP", party_alliance: "NDA", cabinet_role: "Deputy CM · Finance", age: 65, education: "Class 12", data_confidence: "high" },
  { id: id("Maharashtra", "Chandrakant Patil"), name: "Chandrakant Patil", state: "Maharashtra", state_code: "MH", constituency: "Kothrud", party: "BJP", party_alliance: "NDA", cabinet_role: "Higher Education", age: 64, education: "BSc", data_confidence: "high" },
  { id: id("Maharashtra", "Girish Mahajan"), name: "Girish Mahajan", state: "Maharashtra", state_code: "MH", constituency: "Jamner", party: "BJP", party_alliance: "NDA", cabinet_role: "Medical Education", age: 64, data_confidence: "medium" },
  { id: id("Maharashtra", "Anjali Deshmukh"), name: "Anjali Deshmukh", state: "Maharashtra", state_code: "MH", constituency: "Mumbai South", party: "BJP", party_alliance: "NDA", cabinet_role: "Women & Child", age: 48, data_confidence: "low" },

  // ── Karnataka (INC ruling) ─────────────────────────────────────────────
  { id: id("Karnataka", "Siddaramaiah"), name: "Siddaramaiah", state: "Karnataka", state_code: "KA", constituency: "Varuna", party: "INC", party_alliance: "INDIA", cabinet_role: "Chief Minister", is_cm: true, age: 76, education: "LLB", data_confidence: "high" },
  { id: id("Karnataka", "D K Shivakumar"), name: "D. K. Shivakumar", state: "Karnataka", state_code: "KA", constituency: "Kanakapura", party: "INC", party_alliance: "INDIA", cabinet_role: "Deputy CM · Water Resources", age: 62, education: "MA", data_confidence: "high" },
  { id: id("Karnataka", "Krishna Byre Gowda"), name: "Krishna Byre Gowda", state: "Karnataka", state_code: "KA", constituency: "Byatarayanapura", party: "INC", party_alliance: "INDIA", cabinet_role: "Revenue", age: 51, education: "Post Graduate", data_confidence: "medium" },
  { id: id("Karnataka", "Priyank Kharge"), name: "Priyank Kharge", state: "Karnataka", state_code: "KA", constituency: "Chittapur", party: "INC", party_alliance: "INDIA", cabinet_role: "IT/BT, Rural Development", age: 46, education: "Post Graduate", data_confidence: "high" },
  { id: id("Karnataka", "M B Patil"), name: "M. B. Patil", state: "Karnataka", state_code: "KA", constituency: "Babaleshwar", party: "INC", party_alliance: "INDIA", cabinet_role: "Heavy & Medium Industries", age: 62, data_confidence: "medium" },

  // ── Tamil Nadu (DMK ruling) ────────────────────────────────────────────
  { id: id("Tamil Nadu", "M K Stalin"), name: "M. K. Stalin", state: "Tamil Nadu", state_code: "TN", constituency: "Kolathur", party: "DMK", party_alliance: "INDIA", cabinet_role: "Chief Minister", is_cm: true, age: 71, education: "BA", data_confidence: "high" },
  { id: id("Tamil Nadu", "Udhayanidhi Stalin"), name: "Udhayanidhi Stalin", state: "Tamil Nadu", state_code: "TN", constituency: "Chepauk-Thiruvallikeni", party: "DMK", party_alliance: "INDIA", cabinet_role: "Deputy CM · Youth Welfare & Sports", age: 47, education: "BBA", data_confidence: "high" },
  { id: id("Tamil Nadu", "Thangam Thennarasu"), name: "Thangam Thennarasu", state: "Tamil Nadu", state_code: "TN", constituency: "Tiruchuli", party: "DMK", party_alliance: "INDIA", cabinet_role: "Finance", age: 61, education: "Post Graduate", data_confidence: "medium" },
  { id: id("Tamil Nadu", "P K Sekarbabu"), name: "P. K. Sekarbabu", state: "Tamil Nadu", state_code: "TN", constituency: "Harbour", party: "DMK", party_alliance: "INDIA", cabinet_role: "HR & CE", age: 67, data_confidence: "high" },
  { id: id("Tamil Nadu", "K Ponmudy"), name: "K. Ponmudy", state: "Tamil Nadu", state_code: "TN", constituency: "Tirukkoyilur", party: "DMK", party_alliance: "INDIA", cabinet_role: "Higher Education", age: 74, data_confidence: "medium" },

  // ── West Bengal (TMC ruling) ───────────────────────────────────────────
  { id: id("West Bengal", "Mamata Banerjee"), name: "Mamata Banerjee", state: "West Bengal", state_code: "WB", constituency: "Bhabanipur", party: "TMC", party_alliance: "INDIA", cabinet_role: "Chief Minister · Home", is_cm: true, age: 70, education: "LLB", data_confidence: "high" },
  { id: id("West Bengal", "Chandrima Bhattacharya"), name: "Chandrima Bhattacharya", state: "West Bengal", state_code: "WB", constituency: "Dum Dum Uttar", party: "TMC", party_alliance: "INDIA", cabinet_role: "Finance · Health", age: 67, education: "LLB", data_confidence: "medium" },
  { id: id("West Bengal", "Aroop Biswas"), name: "Aroop Biswas", state: "West Bengal", state_code: "WB", constituency: "Tollygunge", party: "TMC", party_alliance: "INDIA", cabinet_role: "Power · Sports", age: 60, education: "BA", data_confidence: "medium" },
  { id: id("West Bengal", "Firhad Hakim"), name: "Firhad Hakim", state: "West Bengal", state_code: "WB", constituency: "Kolkata Port", party: "TMC", party_alliance: "INDIA", cabinet_role: "Urban Development & Municipal Affairs", age: 65, data_confidence: "high" },
  { id: id("West Bengal", "Bratya Basu"), name: "Bratya Basu", state: "West Bengal", state_code: "WB", constituency: "Dum Dum", party: "TMC", party_alliance: "INDIA", cabinet_role: "Education", age: 64, education: "Post Graduate", data_confidence: "high" },

  // ── Delhi (AAP) ────────────────────────────────────────────────────────
  { id: id("Delhi", "Atishi Marlena"), name: "Atishi Marlena", state: "Delhi", state_code: "DL", constituency: "Kalkaji", party: "AAP", party_alliance: "INDIA", cabinet_role: "Chief Minister · Education · Finance", is_cm: true, age: 43, education: "Post Graduate (Oxford)", data_confidence: "high" },
  { id: id("Delhi", "Saurabh Bharadwaj"), name: "Saurabh Bharadwaj", state: "Delhi", state_code: "DL", constituency: "Greater Kailash", party: "AAP", party_alliance: "INDIA", cabinet_role: "Health · Industries", age: 44, education: "BTech", data_confidence: "high" },
  { id: id("Delhi", "Gopal Rai"), name: "Gopal Rai", state: "Delhi", state_code: "DL", constituency: "Babarpur", party: "AAP", party_alliance: "INDIA", cabinet_role: "Environment · Forests", age: 49, data_confidence: "high" },
  { id: id("Delhi", "Imran Hussain"), name: "Imran Hussain", state: "Delhi", state_code: "DL", constituency: "Ballimaran", party: "AAP", party_alliance: "INDIA", cabinet_role: "Food & Civil Supplies", age: 47, data_confidence: "medium" },
  { id: id("Delhi", "Mukesh Ahlawat"), name: "Mukesh Ahlawat", state: "Delhi", state_code: "DL", constituency: "Sultanpur Majra", party: "AAP", party_alliance: "INDIA", cabinet_role: "Social Welfare", age: 46, data_confidence: "medium" },

  // ── Uttar Pradesh (BJP ruling) ─────────────────────────────────────────
  { id: id("Uttar Pradesh", "Yogi Adityanath"), name: "Yogi Adityanath", state: "Uttar Pradesh", state_code: "UP", constituency: "Gorakhpur (MLC)", party: "BJP", party_alliance: "NDA", cabinet_role: "Chief Minister", is_cm: true, age: 52, education: "BSc", data_confidence: "high" },
  { id: id("Uttar Pradesh", "Keshav Prasad Maurya"), name: "Keshav Prasad Maurya", state: "Uttar Pradesh", state_code: "UP", constituency: "MLC", party: "BJP", party_alliance: "NDA", cabinet_role: "Deputy CM · Rural Development", age: 55, data_confidence: "high" },
  { id: id("Uttar Pradesh", "Brajesh Pathak"), name: "Brajesh Pathak", state: "Uttar Pradesh", state_code: "UP", constituency: "Lucknow Cantt", party: "BJP", party_alliance: "NDA", cabinet_role: "Deputy CM · Medical & Health", age: 60, education: "LLB", data_confidence: "high" },
  { id: id("Uttar Pradesh", "Suresh Khanna"), name: "Suresh Khanna", state: "Uttar Pradesh", state_code: "UP", constituency: "Shahjahanpur", party: "BJP", party_alliance: "NDA", cabinet_role: "Finance", age: 70, data_confidence: "high" },
  { id: id("Uttar Pradesh", "Swatantra Dev Singh"), name: "Swatantra Dev Singh", state: "Uttar Pradesh", state_code: "UP", constituency: "MLC", party: "BJP", party_alliance: "NDA", cabinet_role: "Jal Shakti", age: 60, data_confidence: "medium" },

  // ── Madhya Pradesh (BJP) ──────────────────────────────────────────────
  { id: id("Madhya Pradesh", "Mohan Yadav"), name: "Mohan Yadav", state: "Madhya Pradesh", state_code: "MP", constituency: "Ujjain South", party: "BJP", party_alliance: "NDA", cabinet_role: "Chief Minister", is_cm: true, age: 59, education: "PhD", data_confidence: "high" },
  { id: id("Madhya Pradesh", "Jagdish Devda"), name: "Jagdish Devda", state: "Madhya Pradesh", state_code: "MP", constituency: "Malhargarh", party: "BJP", party_alliance: "NDA", cabinet_role: "Deputy CM · Finance", age: 67, data_confidence: "high" },
  { id: id("Madhya Pradesh", "Rajendra Shukla"), name: "Rajendra Shukla", state: "Madhya Pradesh", state_code: "MP", constituency: "Rewa", party: "BJP", party_alliance: "NDA", cabinet_role: "Deputy CM · Public Health", age: 60, data_confidence: "high" },
  { id: id("Madhya Pradesh", "Kailash Vijayvargiya"), name: "Kailash Vijayvargiya", state: "Madhya Pradesh", state_code: "MP", constituency: "Indore-1", party: "BJP", party_alliance: "NDA", cabinet_role: "Urban Development", age: 68, data_confidence: "high" },

  // ── Andhra Pradesh (TDP-led NDA) ───────────────────────────────────────
  { id: id("Andhra Pradesh", "Chandrababu Naidu"), name: "N. Chandrababu Naidu", state: "Andhra Pradesh", state_code: "AP", constituency: "Kuppam", party: "TDP", party_alliance: "NDA", cabinet_role: "Chief Minister", is_cm: true, age: 74, education: "MA Economics", data_confidence: "high" },
  { id: id("Andhra Pradesh", "Pawan Kalyan"), name: "Pawan Kalyan", state: "Andhra Pradesh", state_code: "AP", constituency: "Pithapuram", party: "OTHER", party_alliance: "NDA", cabinet_role: "Deputy CM (Janasena)", age: 53, education: "Class 12", data_confidence: "high" },
  { id: id("Andhra Pradesh", "Nara Lokesh"), name: "Nara Lokesh", state: "Andhra Pradesh", state_code: "AP", constituency: "Mangalagiri", party: "TDP", party_alliance: "NDA", cabinet_role: "HR Development · IT", age: 41, education: "MBA", data_confidence: "high" },
  { id: id("Andhra Pradesh", "P Narayana"), name: "P. Narayana", state: "Andhra Pradesh", state_code: "AP", constituency: "Nellore City", party: "TDP", party_alliance: "NDA", cabinet_role: "Municipal Administration", age: 65, data_confidence: "medium" },

  // ── Telangana (INC) ───────────────────────────────────────────────────
  { id: id("Telangana", "Revanth Reddy"), name: "A. Revanth Reddy", state: "Telangana", state_code: "TG", constituency: "Kodangal", party: "INC", party_alliance: "INDIA", cabinet_role: "Chief Minister", is_cm: true, age: 56, education: "BA", data_confidence: "high" },
  { id: id("Telangana", "Mallu Bhatti Vikramarka"), name: "Mallu Bhatti Vikramarka", state: "Telangana", state_code: "TG", constituency: "Madhira", party: "INC", party_alliance: "INDIA", cabinet_role: "Deputy CM · Finance", age: 63, education: "LLB", data_confidence: "high" },
  { id: id("Telangana", "Uttam Kumar Reddy"), name: "N. Uttam Kumar Reddy", state: "Telangana", state_code: "TG", constituency: "Huzurnagar", party: "INC", party_alliance: "INDIA", cabinet_role: "Irrigation", age: 60, education: "BTech", data_confidence: "medium" },
  { id: id("Telangana", "Damodar Raja Narasimha"), name: "Damodar Raja Narasimha", state: "Telangana", state_code: "TG", constituency: "Andole", party: "INC", party_alliance: "INDIA", cabinet_role: "Health", age: 65, data_confidence: "medium" },

  // ── Kerala (CPI(M)-led LDF) ───────────────────────────────────────────
  { id: id("Kerala", "Pinarayi Vijayan"), name: "Pinarayi Vijayan", state: "Kerala", state_code: "KL", constituency: "Dharmadom", party: "OTHER", party_alliance: "INDIA", cabinet_role: "Chief Minister (CPI(M))", is_cm: true, age: 80, education: "BA", data_confidence: "high" },
  { id: id("Kerala", "K N Balagopal"), name: "K. N. Balagopal", state: "Kerala", state_code: "KL", constituency: "MLC", party: "OTHER", party_alliance: "INDIA", cabinet_role: "Finance (CPI(M))", age: 67, data_confidence: "medium" },
  { id: id("Kerala", "M B Rajesh"), name: "M. B. Rajesh", state: "Kerala", state_code: "KL", constituency: "Thrithala", party: "OTHER", party_alliance: "INDIA", cabinet_role: "Local Self Government (CPI(M))", age: 52, education: "Post Graduate", data_confidence: "medium" },
  { id: id("Kerala", "V Sivankutty"), name: "V. Sivankutty", state: "Kerala", state_code: "KL", constituency: "Nemom", party: "OTHER", party_alliance: "INDIA", cabinet_role: "General Education (CPI(M))", age: 67, data_confidence: "medium" },
]

// ── Lookups ───────────────────────────────────────────────────────────────

export const MLAS_BY_STATE: Record<string, Mla[]> = (() => {
  const m: Record<string, Mla[]> = {}
  for (const r of STATIC_MLAS) {
    (m[r.state] ??= []).push(r)
  }
  return m
})()

export const MLA_BY_ID: Record<string, Mla> = Object.fromEntries(
  STATIC_MLAS.map((r) => [r.id, r])
)

export function findMlaByConstituency(state: string, constituency: string): Mla | null {
  return (
    STATIC_MLAS.find(
      (r) =>
        r.state === state &&
        r.constituency.toLowerCase() === constituency.toLowerCase()
    ) ?? null
  )
}
