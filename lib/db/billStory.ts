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

export const BILL_STORIES: Record<string, BillStory> = {
  "agnipath-no-bill": AGNIPATH,
  "wrb-2023": WRB_2023,
  "farm-laws-repeal-2021": FARM_LAWS,
  "three-criminal-laws-2023": BNS_BNSS_BSA,
  "dpdp-2023": DPDP,
  "caa-2019": CAA_2019,
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
