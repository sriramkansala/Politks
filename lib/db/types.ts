export type PromiseStatus =
  | "not_yet_rated"
  | "in_the_works"
  | "stalled"
  | "compromise"
  | "promise_kept"
  | "promise_broken"

export type EvidenceKind =
  | "gov_data"
  | "news_article"
  | "official_statement"
  | "rti_response"
  | "citizen_report"
  | "academic"

export type ElectionType = "lok_sabha" | "vidhan_sabha" | "local"
export type PartyLevel = "national" | "state"
export type ManifestoStatus = "draft" | "review" | "published"

export interface Party {
  id: string
  slug: string
  name: string
  name_translations: Record<string, string>
  short_name: string | null
  level: PartyLevel
  state_code: string | null
  founded_year: number | null
  color_hex: string
  logo_url: string | null
  ec_registration: string | null
  website_url: string | null
  created_at: string
}

export interface Manifesto {
  id: string
  party_id: string
  election_type: ElectionType
  election_year: number
  state_code: string | null
  title: string
  title_translations: Record<string, string>
  source_url: string | null
  pdf_storage_key: string | null
  language: string
  pages: number | null
  ingested_at: string | null
  ingested_by: string | null
  status: ManifestoStatus
  raw_text: string | null
  created_at: string
}

export interface PromiseRow {
  id: string
  manifesto_id: string | null
  party_id: string | null
  parent_id: string | null
  ordinal: number | null
  title: string
  title_translations: Record<string, string>
  text: string
  text_translations: Record<string, string>
  page_ref: number | null
  category: string
  tags: string[]
  success_criteria: string | null
  target_metric: TargetMetric | null
  target_deadline: string | null
  geography: string
  status: PromiseStatus
  status_rationale: string | null
  status_updated_at: string | null
  status_updated_by: string | null
  is_headline: boolean
  created_at: string
}

export interface TargetMetric {
  metric: string
  value: number
  unit: string
  deadline_year?: number
}

export interface Source {
  id: string
  promise_id: string
  kind: EvidenceKind
  url: string
  title: string | null
  publisher: string | null
  published_at: string | null
  excerpt: string | null
  supports_status: PromiseStatus | null
  archived_url: string | null
  added_by: string | null
  created_at: string
}

export interface StatusUpdate {
  id: string
  promise_id: string
  from_status: PromiseStatus | null
  to_status: PromiseStatus
  rationale: string
  updated_by: string | null
  created_at: string
}

export interface PromiseComparison {
  id: string
  topic: string
  promise_ids: string[]
  created_at: string
}

// ── Forensic platform types ────────────────────────────────────────────────

export type BillType = "constitutional" | "ordinary" | "money" | "private_member"
export type BillOutcome = "passed" | "lapsed" | "withdrawn" | "repealed" | "pending"
export type HouseType =
  | "lok_sabha"        // Union — directly elected (MPs)
  | "rajya_sabha"      // Union — indirectly elected (MPs)
  | "vidhan_sabha"     // State — directly elected (MLAs)
  | "vidhan_parishad"  // State — indirectly elected (MLCs); only in 6 states
export type EdgeType =
  | "blocked_by" | "amended_by" | "linked_to" | "opposed_by"
  | "lapsed_with" | "superseded_by" | "descended_from"
  | "weakened_by" | "endorsed_by" | "caused_by"

export interface Mp {
  id: string
  name: string
  name_translations: Record<string, string>
  party_id: string | null
  party_name: string | null
  house: HouseType | null
  constituency: string | null
  state_code: string | null
  term_start: string | null
  term_end: string | null
  photo_url: string | null
  myneta_id: string | null
  created_at: string
  // ── BMW-130 extensions (PRS + ADR/MyNeta + MPLADS) ─────────────────────
  prs_slug?: string | null                    // matches prsindia.org/mptrack/18th-lok-sabha/<slug>
  lok_sabha_term?: string | null              // e.g. "17" or "18"
  attendance_pct?: number | null              // 0-100; null = data unavailable
  attendance_note?: string | null             // e.g. "Ministers exempt"
  session_attendance?: Record<string, number> // { "Budget 2024": 40, "Winter 2024": 35, ... }
  questions_asked?: number | null
  debates_participated?: number | null
  private_member_bills?: number | null
  national_avg_attendance?: number | null
  national_avg_questions?: number | null
  national_avg_debates?: number | null
  // Financial / criminal (MyNeta-sourced)
  myneta_url?: string | null
  assets_inr?: number | null                  // total declared assets, rupees
  liabilities_inr?: number | null
  criminal_cases_any?: number | null          // count of any cases
  criminal_cases_serious?: number | null      // murder/rape/kidnap/etc.
  is_crorepati?: boolean | null
  education_level?: string | null             // "Post Graduate" | "Graduate" | ...
  age_at_election?: number | null
  // MPLADS spending
  mplads_sanctioned_inr?: number | null
  mplads_released_inr?: number | null
  mplads_spent_inr?: number | null
  mplads_unspent_inr?: number | null
  // Detail lists (for tab views)
  questions_detail?: Array<{
    date: string           // "YYYY-MM-DD"
    session: string        // e.g. "Budget Session 2024"
    type: "starred" | "unstarred"
    subject: string
    ministry: string
    source?: string
  }>
  criminal_cases_detail?: Array<{
    case_number?: string
    court?: string
    year?: number
    offence: string
    section?: string
    status: "pending" | "acquitted" | "convicted" | "discharged"
    is_serious: boolean
    source?: string
  }>
  education_history?: Array<{
    degree: string
    institution: string
    year?: number
    field?: string
    source?: string
  }>
  // Misc derived
  is_minister?: boolean | null                // attendance register exemption
  pin_codes?: string[]                        // PINs that route to this MP's constituency
  data_confidence?: "high" | "medium" | "low" | "unavailable"
  data_sources?: string[]                     // URLs cited
  // ── Business interests (declared) ─────────────────────────────────────
  // Always populated from sworn ADR / Form-26 affidavits or MCA21 filings.
  // Inferred-only matches (shared address, shared auditor) NEVER live here —
  // they would be surfaced via a separate `inferred_links` field gated behind
  // a "show inferred" toggle and a methodology note.
  business_interests?: BusinessInterest[]
  business_interests_status?: BusinessInterestsIngestStatus
}

// ── Business interests ──────────────────────────────────────────────────────
export type BusinessInterestRole =
  | "director"
  | "shareholder"
  | "partner"       // LLP / partnership
  | "trustee"
  | "proprietor"
  | "karta"         // HUF
  | "beneficiary"

export type BusinessInterestEntityKind =
  | "private_ltd"
  | "public_ltd"
  | "llp"
  | "partnership"
  | "proprietorship"
  | "trust"
  | "society"
  | "huf"
  | "other"

export type CoOwnerRelationship =
  | "self"
  | "spouse"
  | "child"
  | "parent"
  | "sibling"
  | "huf_member"
  | "politician"   // co-owner is themselves an elected legislator in our DB
  | "business"     // arms-length business partner
  | "unknown"

export interface BusinessInterestCoOwner {
  name: string
  relationship: CoOwnerRelationship
  holding_pct?: number | null          // null if undisclosed in the source filing
  role?: BusinessInterestRole          // their role in the same entity
  /** If this person is themselves an MP/MLA in our DB, link to their slug. */
  linked_mp_slug?: string | null
  /** DIN (Director Identification Number) — for MCA21-sourced rows. */
  din?: string | null
}

export interface BusinessInterest {
  /** Stable id within the MP — entity slug + role */
  id: string
  entity_name: string
  entity_kind: BusinessInterestEntityKind
  /** MCA21 Corporate Identification Number (Ltd / LLP), if registered. */
  cin?: string | null
  /** Registered address as filed. Required for the (future) inferred-match graph. */
  registered_address?: string | null
  state_code?: string | null
  incorporated_year?: number | null
  role: BusinessInterestRole
  /** Holding % when declared. Null when undeclared (HUF, trusts, etc.). */
  holding_pct?: number | null
  /** Declared co-owners from the SAME filing only. No inferred entries. */
  co_owners: BusinessInterestCoOwner[]
  /** Provenance — every entity must cite at least one source filing. */
  source: {
    kind: "adr_affidavit" | "mca21" | "form26" | "press"
    filed_for: string              // e.g. "Lok Sabha 2024 — Rae Bareli"
    filed_on?: string              // ISO date
    url?: string
  }
  /** Editor notes (e.g. "Reported in 2019 affidavit; not in 2024 — exit?"). */
  note?: string
  /** Flag for the future inferred-match overlay; never auto-set in v1. */
  flags?: Array<{
    kind: "shared_address" | "shared_auditor" | "shared_director" | "press_dispute"
    label: string
    detail?: string
    confidence: "high" | "medium" | "low"
  }>
}

export type BusinessInterestsIngestStatus =
  | { kind: "pending" }                       // not yet ingested — show placeholder
  | { kind: "ingested"; ingested_at: string } // ADR/MCA21 fetched on this date
  | { kind: "none_declared"; ingested_at: string } // ingestion ran, MP declared nothing
  | { kind: "unavailable"; reason: string }   // affidavit missing / RS member etc.

export interface Bill {
  id: string
  slug: string
  title: string
  short_title: string | null
  bill_number: string | null
  bill_type: BillType | null
  house_introduced: "lok_sabha" | "rajya_sabha" | null
  introduced_date: string | null
  mover_mp_id: string | null
  mover_party_id: string | null
  ministry: string | null
  current_stage: number | null
  predecessor_bill_id: string | null
  promise_ids: string[]
  is_money_bill_claimed: boolean
  outcome: BillOutcome | null
  lok_sabha_ayes: number | null
  lok_sabha_noes: number | null
  rajya_sabha_ayes: number | null
  rajya_sabha_noes: number | null
  assent_date: string | null
  claude_summary: string | null
  created_at: string
}

export interface StageEvent {
  id: string
  bill_id: string | null
  promise_id: string | null
  stage: number
  stage_label: string
  event_date: string | null
  house: string | null
  description: string
  source_url: string | null
  source_label: string | null
  verbatim_quote: string | null
  verbatim_speaker_id: string | null
  verbatim_speaker_name: string | null
  created_at: string
}

export interface IssueGraphEdge {
  id: string
  source_type: string
  source_id: string
  source_label: string
  target_type: string
  target_id: string
  target_label: string
  edge_type: EdgeType
  description: string | null
  evidence_source_url: string | null
  confidence: number
  created_at: string
}

export interface PromiseAncestry {
  id: string
  promise_id: string | null
  ancestor_name: string
  ancestor_year: number | null
  ancestor_govt: string | null
  relationship_note: string | null
  sort_order: number
  created_at: string
}

export interface BillVersion {
  id: string
  bill_id: string
  version_label: string
  version_date: string
  source_url: string | null
  raw_pdf_url: string | null
  created_at: string
}

export interface BillClause {
  id: string
  bill_version_id: string
  clause_number: string
  clause_title: string | null
  clause_text: string
  parent_clause_id: string | null
  topic_tags: string[]
  references_act: string | null
  is_poison_pill: boolean
  attribution_note: string | null
  ordinal: number
  created_at: string
}

// ── Supabase Database generic type ────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      parties: {
        Row: Party
        Insert: Omit<Party, "id" | "created_at">
        Update: Partial<Omit<Party, "id" | "created_at">>
        Relationships: []
      }
      manifestos: {
        Row: Manifesto
        Insert: Omit<Manifesto, "id" | "created_at">
        Update: Partial<Omit<Manifesto, "id" | "created_at">>
        Relationships: []
      }
      promises: {
        Row: PromiseRow
        Insert: Omit<PromiseRow, "id" | "created_at">
        Update: Partial<Omit<PromiseRow, "id" | "created_at">>
        Relationships: []
      }
      sources: {
        Row: Source
        Insert: Omit<Source, "id" | "created_at">
        Update: Partial<Omit<Source, "id" | "created_at">>
        Relationships: []
      }
      status_updates: {
        Row: StatusUpdate
        Insert: Omit<StatusUpdate, "id" | "created_at">
        Update: Partial<Omit<StatusUpdate, "id" | "created_at">>
        Relationships: []
      }
      promise_comparisons: {
        Row: PromiseComparison
        Insert: Omit<PromiseComparison, "id" | "created_at">
        Update: Partial<Omit<PromiseComparison, "id" | "created_at">>
        Relationships: []
      }
      mps: {
        Row: Mp
        Insert: Omit<Mp, "id" | "created_at">
        Update: Partial<Omit<Mp, "id" | "created_at">>
        Relationships: []
      }
      bills: {
        Row: Bill
        Insert: Omit<Bill, "id" | "created_at">
        Update: Partial<Omit<Bill, "id" | "created_at">>
        Relationships: []
      }
      stage_events: {
        Row: StageEvent
        Insert: Omit<StageEvent, "id" | "created_at">
        Update: Partial<Omit<StageEvent, "id" | "created_at">>
        Relationships: []
      }
      issue_graph_edges: {
        Row: IssueGraphEdge
        Insert: Omit<IssueGraphEdge, "id" | "created_at">
        Update: Partial<Omit<IssueGraphEdge, "id" | "created_at">>
        Relationships: []
      }
      promise_ancestry: {
        Row: PromiseAncestry
        Insert: Omit<PromiseAncestry, "id" | "created_at">
        Update: Partial<Omit<PromiseAncestry, "id" | "created_at">>
        Relationships: []
      }
    }
    Functions: {
      hybrid_search: {
        Args: {
          query_text: string
          query_embedding: number[]
          match_count?: number
          party_filter?: string | null
          category_filter?: string | null
        }
        Returns: Array<{
          id: string
          title: string
          text: string
          category: string
          status: PromiseStatus
          party_id: string
          score: number
        }>
      }
    }
    Views: Record<string, never>
    CompositeTypes: Record<string, never>
    Enums: {
      promise_status: PromiseStatus
      evidence_kind: EvidenceKind
    }
  }
}
