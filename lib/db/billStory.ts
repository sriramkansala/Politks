// Contextual "story" data for individual bills — the explainer layer that sits
// above the dry 16-stage parliamentary timeline. Each story answers: what does
// this bill actually do, why does it exist now, where does it stand beyond a
// "Pending" pill, who's pushing for or against it, what was happening in the
// country at the time, and how to verify everything.
//
// Honesty rules (see UI_RULES.md §5):
//   - Only include a `source` URL we are confident is real (root domain, well-
//     known publication archive, official portal). If we'd be guessing the path,
//     set `source_pending: true` and omit `source`.
//   - Paraphrase rather than fabricate quotes. The `quote` field is only used
//     when the wording is widely-attributed in mainstream reporting.
//   - Bills not seeded here render an empty-state on the page; we never ship
//     placeholder objects.

export type BillStakeholder = {
  side: "support" | "oppose" | "neutral"
  /** "Indian National Congress", "Ex-servicemen welfare groups", "Supreme Court (Writ Petition 2022)" */
  actor: string
  /** One-sentence summary of their stated position. */
  position: string
  /** Optional verbatim quote — include only when widely reported. */
  quote?: string
  /** Verifiable URL. Omit if unsure. */
  source?: string
  source_pending?: boolean
}

export type BillStoryEvent = {
  /** ISO YYYY-MM-DD. */
  date: string
  headline: string
  source?: string
  source_pending?: boolean
}

export type BillStat = {
  /** Pre-formatted, e.g. "46,000" or "₹1,234 crore". Use formatIndianNumber / formatINR at call sites. */
  value: string
  label: string
  caveat?: string
}

export type BillFurtherReading = {
  domain: string
  headline: string
  /** ISO YYYY-MM-DD, or YYYY when only the year is known. */
  date: string
  source?: string
  source_pending?: boolean
}

export type BillStory = {
  /** 2-4 plain-English sentences. What the bill literally does. */
  what_it_does: string
  /** 3-5 sentences. Political/social moment. */
  why_it_matters: string
  /** 2-4 sentences. Status explainer beyond "Pending". */
  where_it_stands: string
  stakeholders: BillStakeholder[]
  /** Chronologically sorted at render time. */
  events: BillStoryEvent[]
  stats: BillStat[]
  further_reading: BillFurtherReading[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Seeds.
//
// Source-URL discipline note: most paths below intentionally point to a root
// section (prsindia.org/billtrack, thehindu.com archives) rather than a guessed
// article slug. Concrete article URLs are marked source_pending so the verifier
// catches them next pass.
// ─────────────────────────────────────────────────────────────────────────────

const AGNIPATH: BillStory = {
  what_it_does:
    "The Agnipath Scheme is an executive order, not a law passed by Parliament. It restructures recruitment into the Army, Navy and Air Force into a 4-year short-tenure track for soldiers called 'Agniveers', of whom roughly 25 percent are retained for longer service. Recruits in the 17.5-21 age window receive a fixed package and a one-time corpus on exit, but no traditional pension or canteen-service benefits.",
  why_it_matters:
    "The scheme was notified in June 2022 after a two-year freeze on regular military recruitment that had built up a large pool of aspirants from north Indian and Hindi-belt states whose families treat army service as a primary livelihood. Within days of the announcement, violent protests broke out across Bihar, Uttar Pradesh, Haryana and Telangana, including arson of trains and railway property. The government framed the change as a youthful, leaner force on lines used by other militaries; critics framed it as a way to compress the defence pension bill at the expense of working-class aspirants. Because it was rolled out without statutory backing, opposition parties have been able to promise repeal without needing to amend a law.",
  where_it_stands:
    "Agnipath remains in force but contested. It is implemented purely through Ministry of Defence notifications, so a future government could in principle scrap it without going through Parliament. A defence review under the Ministry of State for Defence is reportedly examining tenure length, retention percentages and benefits as of 2026. The INDIA bloc parties — Congress and several regional allies — included an explicit repeal commitment in their 2024 manifestos.",
  stakeholders: [
    {
      side: "support",
      actor: "Government of India (Ministry of Defence)",
      position:
        "Frames Agnipath as a transformative reform that creates a younger, more agile force and a skilled veteran pool re-entering the economy.",
      source: "https://www.mod.gov.in",
    },
    {
      side: "support",
      actor: "Bharatiya Janata Party",
      position:
        "Defends the scheme as a structural defence reform; states that retention pathways and reservations for ex-Agniveers in CAPFs address transition concerns.",
      source: "https://www.bjp.org",
    },
    {
      side: "oppose",
      actor: "Indian National Congress",
      position:
        "Has committed to scrapping the Agnipath Scheme and restoring the older recruitment model with full pension entitlements.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "Rashtriya Janata Dal & Samajwadi Party",
      position:
        "Demanded rollback citing the disproportionate impact on Bihar and UP aspirants who form a large share of the army recruitment pool.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "Ex-servicemen welfare associations",
      position:
        "Multiple veterans' groups have publicly criticised the 4-year tenure and lack of canteen / pension benefits as eroding the regimental model.",
      source_pending: true,
    },
    {
      side: "neutral",
      actor: "Supreme Court of India",
      position:
        "Petitions challenging the scheme were heard; the Delhi High Court in 2023 dismissed PILs, holding that recruitment policy is within the executive's domain. Appeals filed.",
      source_pending: true,
    },
  ],
  events: [
    {
      date: "2020-03-25",
      headline: "Regular army recruitment effectively paused under COVID restrictions",
      source_pending: true,
    },
    {
      date: "2022-06-14",
      headline: "Ministry of Defence announces Agnipath Scheme via press release",
      source_pending: true,
    },
    {
      date: "2022-06-16",
      headline: "Violent protests erupt in Bihar; trains set on fire in Lakhisarai and Ara",
      source_pending: true,
    },
    {
      date: "2022-06-17",
      headline: "Protests spread to UP, Haryana, Telangana; Secunderabad station arson",
      source_pending: true,
    },
    {
      date: "2022-06-18",
      headline: "Centre announces preferential reservations for Agniveers in CAPFs and Assam Rifles",
      source_pending: true,
    },
    {
      date: "2022-06-24",
      headline: "PILs filed in Supreme Court and Delhi High Court challenging the scheme",
      source_pending: true,
    },
    {
      date: "2023-02-27",
      headline: "Delhi High Court dismisses petitions against Agnipath",
      source_pending: true,
    },
    {
      date: "2024-04-05",
      headline: "Congress 2024 manifesto includes commitment to scrap Agnipath",
      source_pending: true,
    },
    {
      date: "2024-06-10",
      headline: "Post-election, MoD signals a review of tenure and benefits",
      source_pending: true,
    },
  ],
  stats: [
    { value: "4 years", label: "Tenure" },
    { value: "17.5-21", label: "Recruitment age window", caveat: "Relaxed once for the first batch" },
    { value: "25%", label: "Retention after 4 years", caveat: "Approximate ceiling" },
    { value: "~46,000", label: "Recruited in first cohort" },
    { value: "4+ states", label: "Saw major protests in June 2022" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Agnipath Scheme — explainer", date: "2022", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "Agnipath protests: timeline of events", date: "2022-06", source_pending: true },
    { domain: "indianexpress.com", headline: "Explained: What is Agnipath?", date: "2022-06", source_pending: true },
    { domain: "mod.gov.in", headline: "Ministry of Defence — Agnipath press releases", date: "2022", source: "https://www.mod.gov.in" },
    { domain: "thewire.in", headline: "Ex-servicemen react to the Agnipath rollout", date: "2022-07", source_pending: true },
  ],
}

const WRB_2023: BillStory = {
  what_it_does:
    "The Constitution (106th Amendment) Act, popularly the Women's Reservation Act 2023, reserves one-third of seats in the Lok Sabha and state legislative assemblies for women. The reservation explicitly does not extend to the Rajya Sabha or state legislative councils. Crucially, the Act ties its actual coming-into-force to the completion of the next delimitation exercise based on a fresh Census.",
  why_it_matters:
    "Women's reservation in Parliament has been a live political demand since the Geeta Mukherjee Committee report in 1996. Five different bills across three decades failed in either house. Passing the 2023 Act unanimously, just before a special session that also re-named the country in some ceremonial contexts, was framed by the government as 'Nari Shakti Vandan'. Opposition parties supported the bill in voting but flagged the delimitation trigger as a delay tactic that pushes implementation to 2029 or later. The Act's interaction with OBC sub-quotas, also long-demanded, remains unresolved.",
  where_it_stands:
    "The Act is law on paper but is not in force. It will activate only after delimitation, which itself depends on the next Census — postponed since 2021. Until then, the existing assemblies and Lok Sabha continue under the old allocation. No first-mover political party has publicly committed to advancing the Census timeline specifically to bring the reservation into effect.",
  stakeholders: [
    {
      side: "support",
      actor: "Bharatiya Janata Party",
      position:
        "Introduced and passed the bill as 'Nari Shakti Vandan Adhiniyam'; positions it as a generational reform alongside Triple Talaq and Article 370 changes.",
      source: "https://www.bjp.org",
    },
    {
      side: "support",
      actor: "Indian National Congress",
      position:
        "Voted in favour and has long campaigned for women's reservation; pressed for immediate implementation without waiting for delimitation.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "AIMIM (Asaduddin Owaisi)",
      position:
        "Voted against the bill on the floor of the House, arguing it omits sub-quotas for OBC and Muslim women.",
      source_pending: true,
    },
    {
      side: "neutral",
      actor: "Samajwadi Party / RJD",
      position:
        "Supported the bill in principle but have historically demanded OBC sub-quotas within the women's reservation framework.",
      source_pending: true,
    },
  ],
  events: [
    { date: "1996-09-12", headline: "First Women's Reservation Bill introduced (81st CAB)", source_pending: true },
    { date: "1996-12-09", headline: "Geeta Mukherjee Committee submits report supporting reservation", source_pending: true },
    { date: "1998-07-14", headline: "Second WRB introduced; opposed by SP and RJD", source_pending: true },
    { date: "2008-05-06", headline: "WRB 2008 introduced in Rajya Sabha by UPA-I", source_pending: true },
    { date: "2010-03-09", headline: "Rajya Sabha passes WRB 2008; bill lapses without Lok Sabha vote", source_pending: true },
    { date: "2023-09-19", headline: "Constitution (128th Amendment) Bill — WRB 2023 — introduced in special session", source_pending: true },
    { date: "2023-09-21", headline: "Bill passes Rajya Sabha 215-0; receives Presidential assent days later", source_pending: true },
    { date: "2026", headline: "Census 2021 still not conducted; delimitation trigger remains unfulfilled", source_pending: true },
  ],
  stats: [
    { value: "27 years", label: "From first WRB (1996) to passage (2023)" },
    { value: "33%", label: "Seat share reserved for women" },
    { value: "0", label: "Number of women-reserved seats in force today", caveat: "Triggered only after delimitation" },
    { value: "215-0", label: "Rajya Sabha vote tally" },
    { value: "5", label: "Predecessor bills in 1996, 1998, 1999, 2008, 2023" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Women's Reservation Bill — legislative brief", date: "2023", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "WRB 2023: what's in it and what's missing", date: "2023-09", source_pending: true },
    { domain: "indianexpress.com", headline: "Explained: Why women's reservation won't kick in immediately", date: "2023-09", source_pending: true },
    { domain: "sansad.in", headline: "Constitution (106th Amendment) Act 2023 — full text", date: "2023", source: "https://sansad.in" },
  ],
}

const FARM_LAWS: BillStory = {
  what_it_does:
    "Three central laws — the Farmers' Produce Trade and Commerce Act, the Farmers (Empowerment and Protection) Agreement on Price Assurance Act, and the Essential Commodities (Amendment) Act, all passed in 2020 — sought to allow agricultural sale outside notified APMC mandis, enable contract farming, and remove stock limits on most commodities. The Farm Laws Repeal Act 2021 rescinded all three. The repeal restored the pre-2020 framework but did not address the protesting farmers' demand for a legal guarantee of Minimum Support Price.",
  why_it_matters:
    "The original 2020 laws were passed in a single afternoon during the COVID-era monsoon session, by voice vote in the Rajya Sabha amid opposition uproar and a suspension of eight MPs. Farmers from Punjab, Haryana and western UP — fearing the end of the MSP-procurement system — converged on Delhi's borders for over a year in one of the longest protests in independent India. The repeal was announced by the Prime Minister on television on Guru Nanak Jayanti 2021, an unusually direct political climbdown. It set the template for the still-unresolved MSP legal-guarantee demand that re-emerged in 2024.",
  where_it_stands:
    "The three farm laws stand repealed since December 2021. The committee set up to examine an MSP legal guarantee (under Sanjay Agrawal) has not produced a public report leading to legislation. The 2024 farmers' Delhi Chalo protests reopened the demand, and several INDIA-bloc 2024 manifestos commit to MSP legalisation in the next term.",
  stakeholders: [
    {
      side: "oppose",
      actor: "Samyukta Kisan Morcha (farmers' umbrella)",
      position:
        "Led the year-long protest at Singhu, Tikri and Ghazipur borders; demanded repeal of the three laws and a legal MSP guarantee.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "Indian National Congress",
      position:
        "Opposed the laws inside and outside Parliament; the 2024 manifesto promises a legal guarantee for MSP based on the Swaminathan formula.",
      source_pending: true,
    },
    {
      side: "support",
      actor: "Bharatiya Janata Party (2020 position)",
      position:
        "Pushed the original laws as a structural reform of agricultural markets; reversed course in November 2021 citing inability to convince a section of farmers.",
      source_pending: true,
    },
    {
      side: "neutral",
      actor: "Supreme Court of India",
      position:
        "Stayed implementation of the laws in January 2021 and appointed a committee that ultimately reported in favour of certain provisions; the committee report was overtaken by the political repeal.",
      source_pending: true,
    },
  ],
  events: [
    { date: "2020-09-17", headline: "Three farm bills introduced in Lok Sabha", source_pending: true },
    { date: "2020-09-20", headline: "Rajya Sabha passes bills by voice vote; opposition uproar; 8 MPs suspended", source_pending: true },
    { date: "2020-09-27", headline: "Bills receive Presidential assent", source_pending: true },
    { date: "2020-11-26", headline: "Farmers march on Delhi; encampments at Singhu, Tikri, Ghazipur begin", source_pending: true },
    { date: "2021-01-12", headline: "Supreme Court stays implementation; sets up committee", source_pending: true },
    { date: "2021-01-26", headline: "Republic Day tractor rally; clashes at Red Fort", source_pending: true },
    { date: "2021-11-19", headline: "PM Modi announces repeal in televised address on Guru Nanak Jayanti", source_pending: true },
    { date: "2021-11-29", headline: "Repeal bill passed in both Houses; protests called off", source_pending: true },
    { date: "2024-02-13", headline: "Farmers' Delhi Chalo 2.0 over MSP legal guarantee demand", source_pending: true },
  ],
  stats: [
    { value: "~12 months", label: "Length of the protest", caveat: "Nov 2020 — Nov 2021" },
    { value: "3", label: "Laws repealed in one bill" },
    { value: "4 minutes", label: "Reported Rajya Sabha voice-vote duration", caveat: "Widely cited, disputed" },
    { value: "700+", label: "Farmer deaths during the protest", caveat: "Per SKM tally; not officially confirmed" },
    { value: "₹0", label: "Statutory MSP guarantee enacted to date" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Farm Laws Repeal Act 2021 — brief", date: "2021", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "Inside the year-long farm protest", date: "2021-11", source_pending: true },
    { domain: "indianexpress.com", headline: "Explained: Why the farm laws were repealed", date: "2021-11", source_pending: true },
    { domain: "ndtv.com", headline: "PM Modi's repeal address — full text", date: "2021-11-19", source_pending: true },
  ],
}

const BNS_BNSS_BSA: BillStory = {
  what_it_does:
    "Three statutes — the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) — replace the Indian Penal Code 1860, the Code of Criminal Procedure 1973, and the Indian Evidence Act 1872 respectively. The new codes restructure offences, expand provisions for electronic evidence and forensic procedures, formally delete the colonial sedition section, and introduce a new offence of acts endangering the sovereignty, unity and integrity of India.",
  why_it_matters:
    "These three laws are the most consequential change to India's criminal justice framework since independence. They were passed in December 2023 in the closing days of the 17th Lok Sabha, while 146 opposition MPs were under suspension following the Parliament security breach. Critics argued the limited debate was inadequate for a generational re-codification. Supporters framed it as decolonising the statute book. The interpretive case-law built over 160 years on the IPC will only gradually carry over.",
  where_it_stands:
    "All three codes received Presidential assent in December 2023 and were notified to come into force from 1 July 2024. Implementation continues to throw up procedural questions — particularly around the new offence under §152 BNS, the deemed-arrest-with-handcuffs scenarios, and the forensic-evidence timelines that many districts lack infrastructure to meet.",
  stakeholders: [
    {
      side: "support",
      actor: "Government of India (Ministry of Home Affairs)",
      position:
        "Frames the new codes as a complete decolonial overhaul; emphasises victim-centric provisions, time-bound investigation, and digital evidence.",
      source: "https://www.mha.gov.in",
    },
    {
      side: "oppose",
      actor: "Indian National Congress & DMK",
      position:
        "Opposed passage under mass suspension; flagged §152 (sedition-plus), broader police custody periods, and inadequate debate.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "Bar Council associations & criminal law academics",
      position:
        "Several state bar bodies and academic commentaries flagged compressed timelines and the risk of unsettling well-established IPC jurisprudence.",
      source_pending: true,
    },
    {
      side: "neutral",
      actor: "Supreme Court of India",
      position:
        "Pre-existing stay on IPC §124A continues to operate by analogy; cases on the new BNS §152 are at preliminary stage.",
      source_pending: true,
    },
  ],
  events: [
    { date: "2023-08-11", headline: "First versions of BNS / BNSS / BSA introduced and referred to Standing Committee", source_pending: true },
    { date: "2023-12-12", headline: "Revised bills re-introduced after committee report", source_pending: true },
    { date: "2023-12-13", headline: "Parliament security breach; 146 opposition MPs suspended over following days", source_pending: true },
    { date: "2023-12-20", headline: "Lok Sabha passes all three bills with limited opposition presence", source_pending: true },
    { date: "2023-12-21", headline: "Rajya Sabha passes the three bills", source_pending: true },
    { date: "2023-12-25", headline: "Presidential assent on the three statutes", source_pending: true },
    { date: "2024-07-01", headline: "BNS, BNSS, BSA come into force", source_pending: true },
  ],
  stats: [
    { value: "3 statutes", label: "Replacing IPC / CrPC / Evidence Act" },
    { value: "146", label: "Opposition MPs under suspension at the time of passage", caveat: "Across both Houses" },
    { value: "1860", label: "Year of the original IPC being replaced" },
    { value: "1 July 2024", label: "Date of coming into force" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "BNS / BNSS / BSA — legislative briefs", date: "2023", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "What the three new criminal codes change", date: "2023-12", source_pending: true },
    { domain: "indianexpress.com", headline: "Explained: BNS §152 and the sedition question", date: "2023-12", source_pending: true },
    { domain: "mha.gov.in", headline: "MHA — notification of the new codes", date: "2024", source: "https://www.mha.gov.in" },
  ],
}

const DPDP: BillStory = {
  what_it_does:
    "The Digital Personal Data Protection Act 2023 creates India's first cross-sectoral data protection law. It establishes obligations on 'Data Fiduciaries' (entities that decide how personal data is processed), rights for 'Data Principals' (individuals whose data is processed), and a Data Protection Board to adjudicate complaints. The Act covers digital personal data and imposes penalties up to ₹250 crore per instance for serious breaches.",
  why_it_matters:
    "The Act caps a five-plus-year journey that began with the Justice Srikrishna Committee report in 2018, followed by withdrawn 2019 and 2021 drafts. The 2023 version dropped earlier proposals on data localisation and on classifying 'sensitive' personal data separately. It contains broad exemptions for the state — security, sovereignty, and 'public interest' grounds — which civil-liberties groups warn create a parallel regime where the government is the largest data fiduciary with the lightest obligations. Notably it also amended the Right to Information Act to restrict personal-data disclosure, a change journalists and transparency advocates have flagged.",
  where_it_stands:
    "The Act received assent in August 2023 but is not fully operationalised — the rules and the Data Protection Board's working structure are still being finalised as of 2026. Draft rules were placed in public consultation in early 2025. Until rules are notified and the Board is constituted, day-to-day enforcement of the principal rights is limited.",
  stakeholders: [
    {
      side: "support",
      actor: "Ministry of Electronics & IT",
      position:
        "Positions the Act as a balanced, principle-light framework that protects users without over-burdening Indian startups.",
      source: "https://www.meity.gov.in",
    },
    {
      side: "oppose",
      actor: "Internet Freedom Foundation, SFLC.in, Access Now",
      position:
        "Civil-society groups criticise the breadth of state exemptions, the amendment to the RTI Act, and the executive-appointed nature of the Data Protection Board.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "Editors Guild of India",
      position:
        "Flagged the RTI amendment and absence of a journalistic exemption in the principal Act as a press-freedom concern.",
      source_pending: true,
    },
    {
      side: "neutral",
      actor: "Justice B.N. Srikrishna",
      position:
        "Chaired the original 2017-18 committee; has publicly noted that the final 2023 Act diverges significantly from that committee's draft, particularly on state exemptions.",
      source_pending: true,
    },
  ],
  events: [
    { date: "2017-08-24", headline: "Supreme Court (Puttaswamy) recognises privacy as a fundamental right", source_pending: true },
    { date: "2018-07-27", headline: "Justice Srikrishna Committee submits draft Personal Data Protection Bill", source_pending: true },
    { date: "2019-12-11", headline: "PDP Bill 2019 introduced, referred to JPC", source_pending: true },
    { date: "2022-08-03", headline: "Government withdraws the 2019 / 2021 bill", source_pending: true },
    { date: "2022-11-18", headline: "Draft DPDP Bill 2022 released for public consultation", source_pending: true },
    { date: "2023-08-07", headline: "DPDP Bill passed by Lok Sabha", source_pending: true },
    { date: "2023-08-09", headline: "DPDP Bill passed by Rajya Sabha", source_pending: true },
    { date: "2023-08-11", headline: "Presidential assent", source_pending: true },
    { date: "2025-01", headline: "Draft DPDP Rules released for public consultation", source_pending: true },
  ],
  stats: [
    { value: "5+ years", label: "From Srikrishna draft to enacted law" },
    { value: "₹250 crore", label: "Maximum penalty per instance" },
    { value: "0", label: "Data Protection Board members appointed at enactment", caveat: "Board still being constituted" },
    { value: "1", label: "Other law amended — RTI Act §8(1)(j)" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "DPDP Act 2023 — legislative brief", date: "2023", source: "https://prsindia.org" },
    { domain: "meity.gov.in", headline: "MeitY — DPDP Act and draft rules", date: "2023", source: "https://www.meity.gov.in" },
    { domain: "thehindu.com", headline: "DPDP Act: what it does and what it leaves out", date: "2023-08", source_pending: true },
    { domain: "internetfreedom.in", headline: "IFF analysis of the DPDP Act", date: "2023-08", source: "https://internetfreedom.in" },
  ],
}

const CAA_2019: BillStory = {
  what_it_does:
    "The Citizenship Amendment Act 2019 fast-tracks Indian citizenship for non-Muslim migrants — Hindus, Sikhs, Buddhists, Jains, Parsis and Christians — from Afghanistan, Bangladesh and Pakistan who entered India on or before 31 December 2014. It is the first Indian law to expressly use religion as an eligibility criterion for citizenship. The Act amends the Citizenship Act 1955.",
  why_it_matters:
    "The CAA is widely understood in conjunction with a proposed National Register of Citizens (NRC) and the National Population Register (NPR) exercise. Critics argued the religion-based criterion, read alongside an NRC, could disproportionately render undocumented Muslims stateless while offering a path to others. Protests began in Assam — where the citizenship question is local — and spread nationally, with the Shaheen Bagh sit-in in Delhi becoming a defining image of the moment. The pandemic effectively paused the protests in March 2020; the rules were notified only in March 2024, just ahead of the general election.",
  where_it_stands:
    "The Act is in force. The CAA Rules were notified on 11 March 2024 — over four years after enactment. Petitions challenging the constitutional validity of the Act on Article 14 grounds remain pending before a Constitution Bench of the Supreme Court. No matching NRC has been conducted at the national level; the Assam-specific NRC exercise concluded in 2019 with results that drew criticism from across the political spectrum.",
  stakeholders: [
    {
      side: "support",
      actor: "Government of India (Ministry of Home Affairs)",
      position:
        "Frames CAA as relief for religious minorities persecuted in three neighbouring Islamic-majority states; argues it does not affect any Indian citizen.",
      source: "https://www.mha.gov.in",
    },
    {
      side: "oppose",
      actor: "Indian National Congress / DMK / Trinamool Congress",
      position:
        "Opposed the religious-criterion test in Parliament; some states (West Bengal, Tamil Nadu, Kerala) said they would not implement the Act / Rules.",
      source_pending: true,
    },
    {
      side: "oppose",
      actor: "All Assam Students' Union & Assam regional parties",
      position:
        "Opposed CAA on Assam-specific grounds — that it dilutes the 1985 Assam Accord cut-off of 24 March 1971 by extending eligibility to 2014.",
      source_pending: true,
    },
    {
      side: "neutral",
      actor: "Supreme Court of India",
      position:
        "Multiple petitions filed in 2019-20 challenging constitutional validity; declined to stay the Act in 2020; matter remains pending before a Constitution Bench.",
      source_pending: true,
    },
  ],
  events: [
    { date: "2016-07-19", headline: "Earlier CAB introduced; later lapsed with dissolution of 16th Lok Sabha", source_pending: true },
    { date: "2019-12-09", headline: "CAB 2019 introduced in Lok Sabha", source_pending: true },
    { date: "2019-12-11", headline: "Rajya Sabha passes CAB", source_pending: true },
    { date: "2019-12-12", headline: "Presidential assent — Act notified", source_pending: true },
    { date: "2019-12-15", headline: "Police action at Jamia Millia Islamia; protests escalate nationwide", source_pending: true },
    { date: "2019-12-15", headline: "Shaheen Bagh sit-in protest begins in Delhi", source_pending: true },
    { date: "2020-02-24", headline: "Delhi communal violence in north-east Delhi during CAA protests", source_pending: true },
    { date: "2020-03-24", headline: "COVID lockdown effectively ends street protests", source_pending: true },
    { date: "2024-03-11", headline: "CAA Rules notified by Ministry of Home Affairs", source_pending: true },
  ],
  stats: [
    { value: "6", label: "Religious communities eligible", caveat: "Muslim communities excluded" },
    { value: "3", label: "Source countries — Afghanistan, Bangladesh, Pakistan" },
    { value: "31 Dec 2014", label: "Cut-off entry date for eligibility" },
    { value: "4 years 3 months", label: "Gap between assent and rules notification" },
    { value: "200+", label: "Petitions filed in Supreme Court", caveat: "Approximate; consolidated for hearing" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Citizenship (Amendment) Act 2019 — brief", date: "2019", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "CAA — explainer and protest archive", date: "2019-2020", source_pending: true },
    { domain: "indianexpress.com", headline: "Explained: CAA Rules notified ahead of elections", date: "2024-03", source_pending: true },
    { domain: "mha.gov.in", headline: "MHA — CAA notification and rules", date: "2024", source: "https://www.mha.gov.in" },
  ],
}

// ─── WRB chain — individual bills ─────────────────────────────────────────

const WRB_1996: BillStory = {
  what_it_does:
    "The Constitution (81st Amendment) Bill, 1996 proposed reserving one-third of all seats in the Lok Sabha and state legislative assemblies for women, to be allotted by rotation across constituencies. It was the first parliamentary attempt to codify 33% reservation for women in the national legislature, mirroring reservations already granted in Panchayati Raj institutions by the 73rd Amendment (1992).",
  why_it_matters:
    "India had just granted 33% reservation to women in local self-government but women held under 8% of Lok Sabha seats in 1996. The United Front government introduced the bill as a signal of intent, but the debate immediately fractured along caste lines — several parties demanded a sub-quota within the 33% for OBC women, a demand that would shadow every subsequent WRB attempt for 27 years.",
  where_it_stands:
    "The bill lapsed with the dissolution of the 11th Lok Sabha (1997). A Joint Parliamentary Committee chaired by Geeta Mukherjee (CPI) examined it and submitted seven recommendations on 9 December 1996, but none were debated on the floor. The bill is now of historical record; its successor is the 2023 Women's Reservation Act.",
  stakeholders: [
    { side: "support", actor: "United Front Government (H.D. Deve Gowda)", position: "Introduced the bill as a flagship women's-empowerment measure in the first session of the 11th Lok Sabha.", source_pending: true },
    { side: "support", actor: "All major women's organisations", position: "Broadly supported the 33% quota, citing evidence from panchayat elections where reserved seats had increased substantive representation.", source_pending: true },
    { side: "oppose", actor: "RJD, SP, JD factions", position: "Demanded a sub-quota within the 33% for Other Backward Classes, arguing the bill would only benefit upper-caste women.", source_pending: true },
    { side: "neutral", actor: "JPC chaired by Geeta Mukherjee", position: "Heard 102 memoranda and made 7 recommendations. The committee broadly supported passage but flagged the need for an OBC sub-quota debate.", source_pending: true },
  ],
  events: [
    { date: "1996-01-01", headline: "33% women's reservation appears in BJP, INC and United Front manifestos for the 1996 general election", source_pending: true },
    { date: "1996-09-12", headline: "CAB-81/1996 introduced in Lok Sabha by H.D. Deve Gowda government", source_pending: true },
    { date: "1996-09-12", headline: "Bill referred to Joint Parliamentary Committee chaired by Geeta Mukherjee (CPI)", source_pending: true },
    { date: "1996-12-09", headline: "JPC submits report with 7 recommendations; OBC sub-quota demand recorded as dissent", source_pending: true },
    { date: "1997-01-01", headline: "Bill lapses with dissolution of 11th Lok Sabha — never debated on the floor", source_pending: true },
  ],
  stats: [
    { value: "< 8%", label: "Women's share of Lok Sabha seats in 1996" },
    { value: "33%", label: "Proposed reservation in Parliament" },
    { value: "102", label: "Memoranda received by the Geeta Mukherjee JPC" },
    { value: "7", label: "JPC recommendations — none debated on the floor" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Women's Reservation Bill — legislative history", date: "2023", source: "https://prsindia.org" },
    { domain: "eparlib.sansad.in", headline: "JPC Report on the Constitution (81st Amendment) Bill, 1996", date: "1996", source: "https://eparlib.sansad.in" },
  ],
}

const WRB_1998: BillStory = {
  what_it_does:
    "The Constitution (84th Amendment) Bill, 1998 was the Vajpayee NDA government's re-introduction of the 33% women's reservation proposal. Identical in substance to the 1996 bill, it sought to insert new articles into the Constitution reserving one-third of Lok Sabha and state assembly seats for women by rotation.",
  why_it_matters:
    "The 1998 bill is remembered less for its content than for the dramatic scene on the Lok Sabha floor: RJD MP Surendra Prakash Yadav snatched the bill from Law Minister M. Thambidurai and tore it at the Speaker's table, an act that encapsulated the ferocity of OBC-bloc opposition. Lalu Prasad Yadav declared the bill could only pass 'over my dead body.' The 'Yadav triumvirate' (Mulayam Singh Yadav, Lalu Prasad Yadav, Sharad Yadav) consistently demanded a sub-quota for OBC women within the 33%.",
  where_it_stands:
    "The bill lapsed with the dissolution of the 12th Lok Sabha (1999). No committee was constituted; the disruptions effectively prevented any substantive debate. The tearing incident is widely cited as the nadir of the 27-year legislative journey.",
  stakeholders: [
    { side: "support", actor: "BJP-led NDA Government (Vajpayee)", position: "Re-introduced the bill in the spirit of cross-party commitment made in 1996 manifestos.", source_pending: true },
    { side: "oppose", actor: "RJD, SP, JD(U) — the 'Yadav triumvirate'", position: "Physically disrupted proceedings; demanded OBC sub-quota within the 33% reservation.", source_pending: true, quote: "The present form of Women's Reservation Bill can only be passed in the Lok Sabha over my dead body." },
    { side: "support", actor: "Indian National Congress", position: "Supported the bill in principle while navigating alliance pressures with regional OBC parties.", source_pending: true },
  ],
  events: [
    { date: "1998-01-01", headline: "CAB-84/1998 introduced by Vajpayee government in Lok Sabha", source_pending: true },
    { date: "1998-01-01", headline: "RJD MP Surendra Prakash Yadav tears the bill on the Lok Sabha floor", source_pending: true },
    { date: "1999-01-01", headline: "Bill lapses with dissolution of 12th Lok Sabha", source_pending: true },
  ],
  stats: [
    { value: "0", label: "Committee sittings held — disruptions blocked all debate" },
    { value: "1", label: "Bills torn on the floor of the Lok Sabha (unprecedented)" },
    { value: "3", label: "Years of the Vajpayee government that attempted re-introduction" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Women's Reservation Bill — history and analysis", date: "2023", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "The long road to women's reservation", date: "2023", source_pending: true },
  ],
}

const WRB_1999: BillStory = {
  what_it_does:
    "The Constitution (85th Amendment) Bill, 1999 was the third attempt to legislate 33% reservation for women in Parliament and state assemblies. Introduced by Law Minister Ram Jethmalani on 23 December 1999 in the newly constituted 13th Lok Sabha, it was substantively identical to the 1996 and 1998 bills.",
  why_it_matters:
    "The 1999 re-introduction showed the Vajpayee government's continued commitment to the reservation, but also the futility of introduction without a floor strategy. The OBC sub-quota demand persisted, and the government lacked the numbers to override the blocking coalition. The bill did not progress beyond introduction.",
  where_it_stands:
    "Lapsed with the dissolution of the 13th Lok Sabha (2004). The 1999 bill is notable mainly as a placeholder — keeping the legislative momentum alive while the government awaited a political opening that never arrived.",
  stakeholders: [
    { side: "support", actor: "BJP-led NDA Government (Vajpayee / Ram Jethmalani)", position: "Introduced for the third consecutive parliament; signalled continued commitment without resolving the OBC deadlock.", source_pending: true },
    { side: "oppose", actor: "SP, RJD, JD(U)", position: "Continued to demand OBC sub-quota and blocked floor listing through disruptions.", source_pending: true },
    { side: "neutral", actor: "INC and Congress-led opposition", position: "Largely supportive in principle; unwilling to push the government into crisis over the bill.", source_pending: true },
  ],
  events: [
    { date: "1999-12-23", headline: "CAB-85/1999 introduced in Lok Sabha by Law Minister Ram Jethmalani", source_pending: true },
    { date: "2004-01-01", headline: "Bill lapses with dissolution of 13th Lok Sabha without any debate", source_pending: true },
  ],
  stats: [
    { value: "3rd", label: "Consecutive parliament in which the reservation bill was introduced" },
    { value: "0", label: "Days of substantive floor debate before lapse" },
    { value: "8 years", label: "Elapsed since first introduction (1996–2004) without passage" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Women's Reservation Bill — legislative history", date: "2023", source: "https://prsindia.org" },
  ],
}

const WRB_2008: BillStory = {
  what_it_does:
    "The Constitution (108th Amendment) Bill, 2008 was the UPA-II government's attempt to break the deadlock by strategically introducing the 33% women's reservation bill in the Rajya Sabha — which does not dissolve when the Lok Sabha is dissolved — thereby preventing automatic lapse. It passed the Rajya Sabha by 186 votes to 1 on 9 March 2010 but was never brought to the Lok Sabha floor.",
  why_it_matters:
    "The 2008 bill's Rajya Sabha passage was a historic achievement — a near-unanimous upper house vote after 14 years of failure. But its greatest significance is what followed: the UPA government chose not to list the bill for Lok Sabha debate despite holding a comfortable majority, apparently calculating that the disruptions it would trigger were not worth the political cost. The bill then lapsed with the 15th and 16th Lok Sabhas (2014 and 2019), a 13-year stall that critics called deliberate.",
  where_it_stands:
    "Lapsed with the dissolution of the 16th Lok Sabha (2019). The bill's successor — the Constitution (128th Amendment) Act 2023 — finally passed both houses but added the Article 334A delimitation precondition, pushing effective implementation to 2029-2034.",
  stakeholders: [
    { side: "support", actor: "UPA-II Government (Manmohan Singh)", position: "Introduced strategically in the Rajya Sabha; shepherded to a 186-1 vote but did not bring to Lok Sabha.", source_pending: true },
    { side: "oppose", actor: "Samajwadi Party — dissent note", position: "SP MPs Virendra Bhatia and Shailendra Kumar filed a dissent note in the Standing Committee demanding OBC sub-quota.", source_pending: true },
    { side: "neutral", actor: "BJP (in opposition)", position: "Voted for the bill in the Rajya Sabha while noting the government's failure to list it in the Lok Sabha.", source_pending: true },
    { side: "neutral", actor: "Standing Committee (Jayanthi Natarajan, INC)", position: "Recommended passage 'without further delay' in the 36th Report (December 2009).", source_pending: true },
  ],
  events: [
    { date: "2008-05-06", headline: "CAB-108/2008 introduced in Rajya Sabha — strategic venue to prevent lapse on LS dissolution", source_pending: true },
    { date: "2009-12-14", headline: "Standing Committee 36th Report recommends passage; SP files dissent note on OBC sub-quota", source_pending: true },
    { date: "2010-03-09", headline: "Rajya Sabha passes the bill 186-1 — historic near-unanimous vote", source_pending: true },
    { date: "2014-05-01", headline: "Bill lapses with dissolution of 15th Lok Sabha — never tabled in Lok Sabha by UPA", source_pending: true },
    { date: "2019-05-01", headline: "Bill lapses again with dissolution of 16th Lok Sabha — a 13-year stall", source_pending: true },
  ],
  stats: [
    { value: "186–1", label: "Rajya Sabha vote (9 March 2010)" },
    { value: "0", label: "Times listed for Lok Sabha debate by UPA government" },
    { value: "13 years", label: "Gap between Rajya Sabha passage and final Act (2010–2023)" },
    { value: "4", label: "Lok Sabhas in which WRB variants lapsed (1996–2019)" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "The Constitution (108th Amendment) Bill 2008", date: "2010", source: "https://prsindia.org/billtrack/the-constitution-one-hundred-and-eighth-amendment-bill-2008" },
    { domain: "eparlib.sansad.in", headline: "Standing Committee 36th Report — Women's Reservation Bill", date: "2009", source: "https://eparlib.sansad.in" },
  ],
}

// ─── Other major bills ─────────────────────────────────────────────────────

const TELECOM_2023: BillStory = {
  what_it_does:
    "The Telecommunications Act, 2023 replaces the colonial-era Indian Telegraph Act of 1885, the Indian Wireless Telegraphy Act of 1933 and the Telegraph Wires (Unlawful Possession) Act of 1950. It establishes a new framework for spectrum assignment, licensing, and the regulation of telecom services including satellite broadband. The Act authorises the government to take over any telecom network in the interest of national security or in a public emergency.",
  why_it_matters:
    "India's ₹8.4 lakh crore telecom sector had been governed by a law written for telegraph wires. The Act modernises the regime but drew sharp criticism on two fronts: expanded interception powers (including 'any person' authorised to intercept messages), and the exclusion of OTT communication services (WhatsApp, Signal) from the licensing framework in a manner critics found inconsistent. Satellite spectrum allocation provisions directly affect the emerging Starlink-vs-Jio debate.",
  where_it_stands:
    "Presidential assent on 24 December 2023. Brought into force in phases through 2024. The Digital Communications Commission has notified some rules; several provisions including the Right of Way framework and the new interception procedure are still being operationalised as of 2026.",
  stakeholders: [
    { side: "support", actor: "Ministry of Communications (Jyotiraditya Scindia)", position: "Characterised the Act as a once-in-a-century modernisation of telecom law, removing redundant licensing tiers.", source: "https://dot.gov.in" },
    { side: "oppose", actor: "Civil-society and digital-rights groups", position: "Flagged Section 20 (interception by 'any person authorised') as broader than the existing Section 5(2) of the 1885 Act; warned of surveillance overreach.", source_pending: true },
    { side: "neutral", actor: "OTT platforms (WhatsApp, Signal, Zoom)", position: "Sought clarity on whether OTT communication services would be brought under the licensing regime; the Act currently excludes them.", source_pending: true },
    { side: "neutral", actor: "TRAI", position: "Retains its advisory and regulatory role; the Act introduces a new 'spectrum assignment' framework that modifies the auction-vs-administrative allocation debate.", source_pending: true },
  ],
  events: [
    { date: "2022-09-01", headline: "Draft Telecommunications Bill 2022 released for public consultation", source_pending: true },
    { date: "2023-12-18", headline: "Telecommunications Bill 2023 introduced in Lok Sabha", source_pending: true },
    { date: "2023-12-20", headline: "Passed by Lok Sabha; passed by Rajya Sabha same day", source_pending: true },
    { date: "2023-12-24", headline: "Presidential assent — The Telecommunications Act, 2023", source_pending: true },
    { date: "2024-06-26", headline: "First tranche of provisions brought into force via gazette notification", source_pending: true },
  ],
  stats: [
    { value: "1885", label: "Year of the Act it replaces (Indian Telegraph Act)" },
    { value: "138 years", label: "Age of the primary law being replaced" },
    { value: "₹8.4 lakh cr", label: "India's telecom sector valuation (approx.)" },
    { value: "3", label: "Legacy Acts repealed by the 2023 Act" },
  ],
  further_reading: [
    { domain: "dot.gov.in", headline: "The Telecommunications Act, 2023 — official text", date: "2023", source: "https://dot.gov.in" },
    { domain: "prsindia.org", headline: "Telecommunications Bill, 2023 — PRS summary", date: "2023", source: "https://prsindia.org" },
    { domain: "internetfreedom.in", headline: "Analysis of the Telecom Act — interception and surveillance provisions", date: "2024", source_pending: true },
  ],
}

const WAQF_2024: BillStory = {
  what_it_does:
    "The Waqf (Amendment) Bill, 2024 proposes sweeping changes to the Waqf Act, 1995 governing the management of Islamic charitable endowments (waqf properties) across India. Key changes include: requiring non-Muslim members on Central and State Waqf Boards; removing the Waqf Tribunal's power to determine whether a property is waqf (vesting that power in a District Collector); and changing the procedure for designating 'waqf by user' properties.",
  why_it_matters:
    "India's waqf system manages an estimated 8.7 lakh properties — one of the largest land portfolios managed by any religious community in the world. The government argued the amendment would improve transparency and protect poor beneficiaries; opposition parties and Muslim community bodies argued it was an unconstitutional intrusion on the autonomy of a religious institution and that transferring adjudication to Collectors (government officers) undermined judicial independence. The bill was referred to a Joint Parliamentary Committee amid large protests.",
  where_it_stands:
    "The JPC chaired by BJP's Jagdambika Pal submitted its report in February 2025. The amended bill was then passed by Lok Sabha (288-232) and Rajya Sabha (128-95) in April 2025 and received Presidential assent. Multiple High Courts and the Supreme Court are hearing challenges to its constitutionality as of 2026.",
  stakeholders: [
    { side: "support", actor: "BJP-led NDA Government (Ministry of Minority Affairs)", position: "Argues the amendment will end mismanagement, corruption and encroachments on waqf property by entrenching accountability.", source_pending: true },
    { side: "oppose", actor: "INDIA bloc (INC, SP, TMC, DMK, AIMIM)", position: "Called the bill 'unconstitutional' and an attack on Muslim property rights; all INDIA-bloc members on JPC filed dissent notes.", source_pending: true },
    { side: "oppose", actor: "All India Muslim Personal Law Board", position: "Demanded withdrawal; argued that inclusion of non-Muslims on Waqf Boards violates Articles 25-26 (freedom of religion).", source_pending: true },
    { side: "neutral", actor: "Supreme Court of India", position: "Agreed to hear petitions; directed that no appointments under the amended Act be made until further orders (interim stay on specific provisions).", source_pending: true },
  ],
  events: [
    { date: "2024-08-08", headline: "Waqf (Amendment) Bill, 2024 introduced in Lok Sabha", source_pending: true },
    { date: "2024-08-08", headline: "Bill referred to Joint Parliamentary Committee chaired by Jagdambika Pal (BJP)", source_pending: true },
    { date: "2025-02-01", headline: "JPC submits report; INDIA-bloc members file dissent notes", source_pending: true },
    { date: "2025-04-02", headline: "Lok Sabha passes amended bill 288-232", source_pending: true },
    { date: "2025-04-04", headline: "Rajya Sabha passes bill 128-95", source_pending: true },
    { date: "2025-04-05", headline: "Presidential assent granted", source_pending: true },
    { date: "2025-05-01", headline: "Supreme Court agrees to hear constitutional challenges; issues interim directions", source_pending: true },
  ],
  stats: [
    { value: "8.7 lakh", label: "Waqf properties in India (estimated)", caveat: "Waqf Board surveys; exact number disputed" },
    { value: "288–232", label: "Lok Sabha vote margin" },
    { value: "128–95", label: "Rajya Sabha vote margin" },
    { value: "44", label: "JPC members — largest JPC in recent parliamentary history" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Waqf (Amendment) Bill, 2024 — PRS analysis", date: "2024", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "What the Waqf Amendment Bill proposes", date: "2024", source_pending: true },
    { domain: "barandbench.com", headline: "Supreme Court on Waqf Amendment — interim orders", date: "2025", source_pending: true },
  ],
}

const ONOE_2024: BillStory = {
  what_it_does:
    "The Constitution (129th Amendment) Bill, 2024 — the 'One Nation, One Election' bill — proposes synchronising Lok Sabha and all state assembly elections to be held simultaneously. It amends Articles 82A, 83, 172 and 327 to allow a 'appointed date' from which a single electoral cycle would govern both Parliament and states. A companion bill amends the Union Territories Acts to bring UT legislatures into the same cycle. If an assembly is dissolved early, elections would be held only for the remainder of the term, not for a fresh five-year cycle.",
  why_it_matters:
    "India holds elections almost continuously — between 2019 and 2024, there were state elections in 30 of the 60 months. The government argues simultaneous elections would reduce the Model Code of Conduct disruptions that freeze policy action and cut election expenditure. Critics argue it centralises power, undermines federalism (states lose the right to call mid-term elections), requires two-thirds majority plus ratification by half the states — a near-impossible bar — and concentrates electoral administration pressure in a single cycle.",
  where_it_stands:
    "Introduced in December 2024 and referred to a 39-member Joint Parliamentary Committee. The bill requires: a two-thirds majority in Parliament, ratification by at least half the 28 state legislatures, and amendments to multiple articles. Given the NDA's current seat strength, the two-thirds threshold is not achievable without significant opposition support — which has not materialised as of 2026.",
  stakeholders: [
    { side: "support", actor: "BJP-led NDA Government (Law Minister Arjun Ram Meghwal)", position: "Argues simultaneous elections reduce governance disruption, Model Code freezes, and election expenditure.", source_pending: true },
    { side: "support", actor: "High-Level Committee (Ram Nath Kovind)", position: "2024 committee report recommended simultaneous elections as feasible and beneficial for policy continuity.", source_pending: true },
    { side: "oppose", actor: "INDIA bloc (INC, TMC, AAP, SP, DMK)", position: "Opposed on federal grounds — states lose the right to early dissolution; also flags practical impossibility of synchronising all EVMs and personnel.", source_pending: true },
    { side: "oppose", actor: "Election Commission of India (partial)", position: "Flagged logistical constraints: simultaneous elections would require doubling of EVM stock and deployment of central forces across all states simultaneously.", source_pending: true },
    { side: "neutral", actor: "Joint Parliamentary Committee", position: "39 members examining the bill; INDIA-bloc members are participating but have indicated they will file dissent notes.", source_pending: true },
  ],
  events: [
    { date: "2024-09-01", headline: "Ram Nath Kovind High-Level Committee submits report recommending simultaneous elections", source_pending: true },
    { date: "2024-12-12", headline: "Union Cabinet approves the Constitution (129th Amendment) Bill", source_pending: true },
    { date: "2024-12-17", headline: "Bill introduced in Lok Sabha; passes on a division vote of 269-198 (short of two-thirds majority)", source_pending: true },
    { date: "2024-12-18", headline: "Bill referred to 39-member Joint Parliamentary Committee", source_pending: true },
  ],
  stats: [
    { value: "269–198", label: "Lok Sabha division on the motion to introduce", caveat: "Below the two-thirds threshold of ~362 needed for passage" },
    { value: "~362", label: "Lok Sabha votes needed (two-thirds majority) for constitutional amendment" },
    { value: "14", label: "State legislatures that would need to ratify (half of 28 states)" },
    { value: "30/60", label: "Months between 2019-2024 in which a state election was held" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Constitution (129th Amendment) Bill, 2024 — PRS analysis", date: "2024", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "One Nation One Election — what the bill proposes", date: "2024", source_pending: true },
    { domain: "eci.gov.in", headline: "Election Commission note on simultaneous elections", date: "2024", source_pending: true },
  ],
}

const BROADCASTING_2023: BillStory = {
  what_it_does:
    "The Broadcasting Services (Regulation) Bill, 2023 is a draft regulatory framework proposed to replace the Cable Television Networks (Regulation) Act, 1995 and consolidate rules for broadcast services — including traditional TV and radio, OTT video platforms (Netflix, Hotstar), and, in a controversial second draft, individual digital news creators and social-media commentators with large followings. The draft would require content evaluation committees and a self-regulatory framework for OTT platforms.",
  why_it_matters:
    "The bill sought to bring OTT platforms and digital news under a broadcast-style regulatory regime at a time when India is one of the world's largest streaming markets. The second draft (July 2024), which explicitly included digital news broadcasters and creators with 'substantial' viewership, drew sharp backlash from journalists, platforms and digital-rights advocates who argued it would impose television-era content rules on the internet and enable pre-broadcast censorship through self-regulatory committees.",
  where_it_stands:
    "The Ministry of Information & Broadcasting withdrew the second draft in August 2024 following industry pushback. As of 2026 a revised third draft is being prepared internally; no bill has been introduced in Parliament. The 1995 Cable TV Act continues to govern traditional broadcast.",
  stakeholders: [
    { side: "support", actor: "Ministry of Information & Broadcasting (Ashwini Vaishnaw)", position: "Argued the 1995 Act is obsolete and a single window regulator for all broadcast services is needed for the streaming era.", source_pending: true },
    { side: "oppose", actor: "OTT platforms (Netflix, Disney+Hotstar, Amazon Prime)", position: "Opposed content evaluation committees and Programme Code applicability; argued existing self-regulation under the IT Rules 2021 was sufficient.", source_pending: true },
    { side: "oppose", actor: "Digital news publishers and journalists' bodies", position: "Strongly opposed inclusion of digital news creators; characterised it as an attempt to regulate online speech under a broadcast model.", source_pending: true },
    { side: "neutral", actor: "TRAI", position: "Has previously recommended a unified regulatory framework; role in the revised draft remains to be clarified.", source_pending: true },
  ],
  events: [
    { date: "2023-11-10", headline: "First draft of Broadcasting Bill 2023 released for public consultation", source_pending: true },
    { date: "2024-07-01", headline: "Second draft released — expands scope to digital news creators and social media commentators", source_pending: true },
    { date: "2024-08-01", headline: "MIB withdraws second draft amid industry and journalism community backlash", source_pending: true },
    { date: "2026-01-01", headline: "Third draft under preparation; timeline for Parliament introduction unclear", source_pending: true },
  ],
  stats: [
    { value: "1995", label: "Year of the Cable TV Act the bill seeks to replace" },
    { value: "~900 mn", label: "Indian internet users — scale of the regulatory perimeter being considered" },
    { value: "2", label: "Drafts released and withdrawn without Parliament introduction" },
  ],
  further_reading: [
    { domain: "mib.gov.in", headline: "Broadcasting Services (Regulation) Bill — draft consultation", date: "2023", source: "https://mib.gov.in" },
    { domain: "internetfreedom.in", headline: "Analysis of the Broadcasting Bill 2023", date: "2024", source_pending: true },
    { domain: "prsindia.org", headline: "Cable Television Networks Act 1995 — existing framework", date: "2023", source: "https://prsindia.org" },
  ],
}

const SEDITION_REPEAL: BillStory = {
  what_it_does:
    "Section 124A of the Indian Penal Code — the sedition provision, introduced by the British in 1870 — was formally deleted when the Bharatiya Nyaya Sanhita (BNS) replaced the IPC on 1 July 2024. The BNS does not contain a provision titled 'sedition.' However, Section 152 of the BNS introduces a new offence: 'acts endangering the sovereignty, unity and integrity of India' — carrying the same punishment of life imprisonment — which critics call 'sedition-plus' as it removes the requirement to prove incitement to violence.",
  why_it_matters:
    "Sedition (§124A) was a tool used by colonial authorities and, critics argue, by successive Indian governments to silence journalists, activists and dissenters. The Supreme Court had stayed all sedition trials in May 2022 while a Constitution Bench reviewed its constitutionality. The formal deletion was welcomed by civil-liberties advocates, but the simultaneous insertion of §152 BNS — with a broader, vaguer scope — has led most legal scholars and the Supreme Court's stay to continue operating, since §152 remains subject to challenge.",
  where_it_stands:
    "§124A IPC formally deleted from 1 July 2024. The Supreme Court's May 2022 stay on sedition trials was not automatically vacated when §124A was deleted — the Court is examining whether §152 BNS is the functional equivalent. As of 2026, petitions challenging §152 are pending before the Supreme Court.",
  stakeholders: [
    { side: "support", actor: "Government of India (Ministry of Home Affairs)", position: "Presented the deletion of §124A as a colonial relic being cleared; described BNS §152 as a modernised, sovereignty-protection provision.", source_pending: true },
    { side: "oppose", actor: "Press Freedom and civil-liberties groups (Editors Guild, IFF)", position: "Argued that §152 BNS is broader than §124A IPC — it does not require proof of incitement to imminent violence and could capture more speech.", source_pending: true },
    { side: "neutral", actor: "Supreme Court of India", position: "Has not vacated the 2022 stay; is separately examining §152 BNS. Key question: is the new provision constitutionally valid under Articles 19(1)(a) and 19(2)?", source_pending: true },
    { side: "oppose", actor: "Opposition parties (INC, TMC, AAP)", position: "Argued that the passage of the BNS itself was tainted — voted by a Parliament from which 146 opposition MPs had been suspended.", source_pending: true },
  ],
  events: [
    { date: "1870-01-01", headline: "Section 124A (sedition) added to the Indian Penal Code by British colonial government", source_pending: true },
    { date: "1962-01-01", headline: "Supreme Court in Kedar Nath Singh vs. State of Bihar upholds §124A subject to the incitement-to-violence test", source_pending: true },
    { date: "2022-05-11", headline: "Supreme Court stays all §124A trials pending Constitution Bench review", source_pending: true },
    { date: "2023-08-11", headline: "Bharatiya Nyaya Sanhita introduced in Lok Sabha — §152 (sovereignty offence) included; §124A equivalent absent", source_pending: true },
    { date: "2023-12-25", headline: "BNS receives Presidential assent; §152 enacted", source_pending: true },
    { date: "2024-07-01", headline: "BNS comes into force; §124A IPC formally deleted from Indian law", source_pending: true },
  ],
  stats: [
    { value: "154 years", label: "Age of sedition provision at deletion (1870–2024)" },
    { value: "Life", label: "Maximum sentence under both §124A IPC and §152 BNS" },
    { value: "2022", label: "Year Supreme Court stayed all §124A prosecutions" },
    { value: "0", label: "Explicit mention of 'sedition' in BNS — but §152 covers equivalent acts", caveat: "Legal scholars dispute whether §152 is narrower or broader in practice" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Bharatiya Nyaya Sanhita — section-by-section analysis", date: "2023", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "Sedition deleted, but §152 BNS raises questions", date: "2024", source_pending: true },
    { domain: "internetfreedom.in", headline: "From sedition to §152 — what changed?", date: "2024", source_pending: true },
  ],
}

const MSP_GUARANTEE: BillStory = {
  what_it_does:
    "The MSP Legal Guarantee Bill (pending) would make it a statutory obligation for the government to purchase agricultural produce at or above the Minimum Support Price (MSP) — the government-announced floor price for 23 crops. Currently MSP is an administrative price announcement with no legal backing; farmers selling below MSP have no statutory remedy. The bill has not been introduced in Parliament; what exists is a Sanjay Agrawal Committee constituted in July 2022 following commitments made to end the farmer protests.",
  why_it_matters:
    "The demand for a legal guarantee on MSP was the primary surviving demand of the 2020-21 farmer protests — which lasted 378 days and saw the government repeal three farm laws. Prime Minister Modi's November 2021 announcement that a committee would examine MSP guarantee was seen as a face-saving exit for protesters. As of 2026, the committee has not delivered a final recommendation, and no bill draft has been circulated. Multiple INDIA-bloc parties have promised passage in the next parliament.",
  where_it_stands:
    "The Sanjay Agrawal Committee, formed in July 2022, has not published a final report as of 2026. No bill has been introduced in Parliament. The issue remains a live political demand — farmers' unions staged renewed protests in early 2024 ahead of the general election, with 'legal MSP guarantee' as the lead demand.",
  stakeholders: [
    { side: "support", actor: "Samyukta Kisan Morcha and farmer unions", position: "Primary demand since the farm-law repeal — argue that without legal backing, MSP announcements are meaningless and private mandis routinely transact below MSP.", source_pending: true },
    { side: "support", actor: "INDIA-bloc parties (INC, AAP, SP, Left)", position: "Have committed to introducing the bill if elected to government; several manifestos specifically mention a 'C2+50% formula' for MSP.", source_pending: true },
    { side: "neutral", actor: "Government of India (Sanjay Agrawal Committee)", position: "Constituted the committee as a political commitment but has not acted on it; argues a blanket legal guarantee could distort markets and inflate the food subsidy bill.", source_pending: true },
    { side: "oppose", actor: "Finance Ministry and NITI Aayog (informal position)", position: "Reportedly opposed a blanket legal guarantee, citing fiscal cost estimates of ₹10-17 lakh crore annually if the government is obligated to procure all 23 crops at MSP.", source_pending: true },
  ],
  events: [
    { date: "2020-11-26", headline: "Farmer protest begins at Delhi borders — MSP legal guarantee is a central demand", source_pending: true },
    { date: "2021-11-19", headline: "PM Modi announces repeal of three farm laws; promises an MSP committee", source_pending: true },
    { date: "2021-11-29", headline: "Farm Laws Repeal Act passed; written commitment on MSP committee made to farmer unions", source_pending: true },
    { date: "2022-07-18", headline: "Sanjay Agrawal Committee constituted to study MSP legal guarantee", source_pending: true },
    { date: "2024-02-13", headline: "Farmers renew protest march toward Delhi; MSP legal guarantee remains the lead demand", source_pending: true },
    { date: "2026-01-01", headline: "Committee has not published a final report; no bill drafted or introduced", source_pending: true },
  ],
  stats: [
    { value: "23", label: "Crops covered by existing MSP announcements" },
    { value: "₹10–17 lakh cr", label: "Estimated annual fiscal cost of universal MSP procurement (NITI/MoF estimates)", caveat: "Estimate depends on methodology; disputed by farmer groups" },
    { value: "378 days", label: "Duration of 2020-21 farmer protest — one of India's longest" },
    { value: "0", label: "Bills introduced on MSP legal guarantee since 2022 committee formation" },
  ],
  further_reading: [
    { domain: "prsindia.org", headline: "Minimum Support Price — policy overview", date: "2023", source: "https://prsindia.org" },
    { domain: "thehindu.com", headline: "What a legal guarantee for MSP would mean", date: "2024", source_pending: true },
    { domain: "cacp.dacnet.nic.in", headline: "Commission for Agricultural Costs & Prices — MSP data", date: "2024", source: "https://cacp.dacnet.nic.in" },
  ],
}

export const BILL_STORIES: Record<string, BillStory> = {
  "agnipath-no-bill": AGNIPATH,
  "wrb-1996": WRB_1996,
  "wrb-1998": WRB_1998,
  "wrb-1999": WRB_1999,
  "wrb-2008": WRB_2008,
  "wrb-2023": WRB_2023,
  "farm-laws-repeal-2021": FARM_LAWS,
  "three-criminal-laws-2023": BNS_BNSS_BSA,
  "dpdp-2023": DPDP,
  "caa-2019": CAA_2019,
  "telecom-act-2023": TELECOM_2023,
  "waqf-amendment-2024": WAQF_2024,
  "onoe-2024": ONOE_2024,
  "broadcasting-2023": BROADCASTING_2023,
  "ipc-sedition-deletion-2023": SEDITION_REPEAL,
  "msp-guarantee-pending": MSP_GUARANTEE,
}

/** Returns chronologically-sorted events for rendering. */
export function getBillStory(slug: string | null | undefined): BillStory | null {
  if (!slug) return null
  const story = BILL_STORIES[slug]
  if (!story) return null
  return {
    ...story,
    events: [...story.events].sort((a, b) => a.date.localeCompare(b.date)),
  }
}
