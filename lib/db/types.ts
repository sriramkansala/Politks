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

export interface Promise {
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

// Supabase Database generic type
export interface Database {
  public: {
    Tables: {
      parties: {
        Row: Party
        Insert: Omit<Party, "id" | "created_at">
        Update: Partial<Omit<Party, "id" | "created_at">>
      }
      manifestos: {
        Row: Manifesto
        Insert: Omit<Manifesto, "id" | "created_at">
        Update: Partial<Omit<Manifesto, "id" | "created_at">>
      }
      promises: {
        Row: Promise
        Insert: Omit<Promise, "id" | "created_at">
        Update: Partial<Omit<Promise, "id" | "created_at">>
      }
      sources: {
        Row: Source
        Insert: Omit<Source, "id" | "created_at">
        Update: Partial<Omit<Source, "id" | "created_at">>
      }
      status_updates: {
        Row: StatusUpdate
        Insert: Omit<StatusUpdate, "id" | "created_at">
        Update: Partial<Omit<StatusUpdate, "id" | "created_at">>
      }
      promise_comparisons: {
        Row: PromiseComparison
        Insert: Omit<PromiseComparison, "id" | "created_at">
        Update: Partial<Omit<PromiseComparison, "id" | "created_at">>
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
    Enums: {
      promise_status: PromiseStatus
      evidence_kind: EvidenceKind
    }
  }
}
