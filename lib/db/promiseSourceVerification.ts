// Source verification overlay for promise ratings.
//
// At module load time we read the raw verification JSON produced by
// scripts/verify-promise-sources.mjs and compute, per promise:
//   - which source URLs are REACHABLE (HTTP 2xx/3xx)
//   - which source URLs had keyword matches on the rendered page
//   - an overall evidence_quality grade:
//       "verified"   — at least one URL reachable AND keyword-matched
//       "unverified" — at least one URL reachable, no keyword match
//       "no_evidence"— no URL reachable
//
// Ratings whose evidence_quality is "no_evidence" should be DEMOTED back to
// `not_yet_rated` in the UI — otherwise we'd be displaying an AI-generated
// status with no traceable backing, which is exactly what civic-data work
// must not do.

import verification from "../../data/promise-source-verification.json"

export type EvidenceQuality = "verified" | "unverified" | "no_evidence"

interface RawCheck {
  key: string
  url: string
  status: number | null
  reachable: boolean
  page_title: string | null
  keywords_match: boolean | null
  error: string | null
}

const raw = verification as RawCheck[]

// Group checks by promise key
const _byKey: Record<string, RawCheck[]> = {}
for (const c of raw) (_byKey[c.key] ??= []).push(c)

export interface SourceVerification {
  evidence_quality: EvidenceQuality
  /** URLs that returned 2xx/3xx (subset of the rating's sources). */
  reachable_urls: string[]
  /** URLs whose rendered body matched the claim keywords. */
  keyword_match_urls: string[]
  /** URLs that 404'd, DNS-failed, or timed out. */
  dead_urls: string[]
  /** Per-URL detail with HTTP status + page title for display. */
  details: Array<{
    url: string
    status: number | null
    reachable: boolean
    page_title: string | null
    keywords_match: boolean | null
  }>
}

export function getSourceVerification(
  party_slug: string,
  ordinal: number
): SourceVerification | null {
  const checks = _byKey[`${party_slug}:${ordinal}`]
  if (!checks || checks.length === 0) return null

  const reachable = checks.filter((c) => c.reachable)
  const kwMatch = checks.filter((c) => c.keywords_match === true)
  const dead = checks.filter((c) => !c.reachable)

  let evidence_quality: EvidenceQuality = "no_evidence"
  if (kwMatch.length > 0) evidence_quality = "verified"
  else if (reachable.length > 0) evidence_quality = "unverified"

  return {
    evidence_quality,
    reachable_urls: reachable.map((c) => c.url),
    keyword_match_urls: kwMatch.map((c) => c.url),
    dead_urls: dead.map((c) => c.url),
    details: checks.map((c) => ({
      url: c.url,
      status: c.status,
      reachable: c.reachable,
      page_title: c.page_title,
      keywords_match: c.keywords_match,
    })),
  }
}

/** Aggregate stats for dashboards: how many ratings have verified sources? */
export function getVerificationStats(): {
  total_urls: number
  reachable: number
  keyword_matched: number
  dead: number
} {
  const total_urls = raw.length
  const reachable = raw.filter((c) => c.reachable).length
  const keyword_matched = raw.filter((c) => c.keywords_match === true).length
  const dead = raw.filter((c) => !c.reachable).length
  return { total_urls, reachable, keyword_matched, dead }
}
