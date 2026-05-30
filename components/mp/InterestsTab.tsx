"use client"

/**
 * MP Interests tab — declared business interests of the legislator.
 *
 * Scope (v1, safe): only co-owners explicitly named in the SAME source filing.
 * Inferred matches (shared registered address, shared auditor, shared DIN
 * across MPs) are typed in the data layer but NOT rendered yet — they will
 * appear behind an explicit "Show inferred links" toggle plus a methodology
 * note, once the affidavit + MCA21 ingest pipelines are live.
 *
 * Until that pipeline runs, every MP renders a structured "pending ingest"
 * empty state. We do NOT seed hand-curated co-owner pairs here, because a
 * libelous claim about who co-owns what is easier to invent than to refute.
 */

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Briefcase,
  ExternalLink,
  Building2,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Info,
} from "lucide-react"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import type {
  Mp,
  BusinessInterest,
  BusinessInterestCoOwner,
  BusinessInterestRole,
  BusinessInterestEntityKind,
  CoOwnerRelationship,
} from "@/lib/db/types"

// ── Vocabulary ────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<BusinessInterestRole, string> = {
  director: "Director",
  shareholder: "Shareholder",
  partner: "Partner",
  trustee: "Trustee",
  proprietor: "Proprietor",
  karta: "Karta (HUF)",
  beneficiary: "Beneficiary",
}

const KIND_LABEL: Record<BusinessInterestEntityKind, string> = {
  private_ltd: "Pvt Ltd",
  public_ltd: "Public Ltd",
  llp: "LLP",
  partnership: "Partnership",
  proprietorship: "Proprietorship",
  trust: "Trust",
  society: "Society",
  huf: "HUF",
  other: "Other",
}

const REL_LABEL: Record<CoOwnerRelationship, string> = {
  self: "Self",
  spouse: "Spouse",
  child: "Child",
  parent: "Parent",
  sibling: "Sibling",
  huf_member: "HUF member",
  politician: "Legislator",
  business: "Business partner",
  unknown: "Unknown",
}

const REL_TONE: Record<CoOwnerRelationship, "family" | "politician" | "business" | "neutral"> = {
  self: "neutral",
  spouse: "family",
  child: "family",
  parent: "family",
  sibling: "family",
  huf_member: "family",
  politician: "politician",
  business: "business",
  unknown: "neutral",
}

// ── Co-owner chip ─────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? "")
    .join("")
}

function CoOwnerRow({ owner }: { owner: BusinessInterestCoOwner }) {
  const tone = REL_TONE[owner.relationship]
  const toneFg =
    tone === "family"      ? "var(--accent)"
    : tone === "politician" ? "var(--status-broken)"
    : tone === "business"   ? "var(--text-secondary)"
    :                         "var(--text-tertiary)"

  const Wrap: React.ElementType =
    owner.linked_mp_slug ? Link : "div"
  const wrapProps = owner.linked_mp_slug
    ? { href: `/mp/${owner.linked_mp_slug}`, className: "group" }
    : { className: "" }

  return (
    <Wrap {...(wrapProps as Record<string, unknown>)}>
      <div
        className="flex items-center gap-2.5 py-2 px-2.5 rounded-md"
        style={{
          background: owner.linked_mp_slug
            ? "color-mix(in srgb, var(--bg-elevated) 60%, transparent)"
            : "transparent",
        }}
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10.5px] tabular-nums"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          {initials(owner.name)}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[12.5px] leading-tight truncate"
            style={{
              color: "var(--text-primary)",
              fontVariationSettings: fontWeights.medium,
            }}
          >
            {owner.name}
          </p>
          <p
            className="text-[10.5px] leading-tight mt-0.5"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span style={{ color: toneFg, fontVariationSettings: fontWeights.semibold }}>
              {REL_LABEL[owner.relationship]}
            </span>
            {owner.role && <> · {ROLE_LABEL[owner.role]}</>}
            {owner.din && <> · DIN {owner.din}</>}
          </p>
        </div>

        {/* Holding % */}
        {owner.holding_pct != null && (
          <span
            className="text-[11px] tabular-nums shrink-0"
            style={{
              color: "var(--text-secondary)",
              fontVariationSettings: fontWeights.semibold,
            }}
          >
            {owner.holding_pct.toFixed(owner.holding_pct % 1 === 0 ? 0 : 1)}%
          </span>
        )}

        {/* Link arrow */}
        {owner.linked_mp_slug && (
          <ArrowUpRight
            size={13}
            className="shrink-0 transition-transform duration-100 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
            style={{ color: "var(--text-tertiary)" }}
          />
        )}
      </div>
    </Wrap>
  )
}

// ── Source pill ───────────────────────────────────────────────────────────────

function SourcePill({ source }: { source: BusinessInterest["source"] }) {
  const label =
    source.kind === "adr_affidavit" ? "ADR affidavit"
    : source.kind === "mca21"        ? "MCA21"
    : source.kind === "form26"       ? "Form 26"
    :                                   "Press"

  const date = source.filed_on
    ? new Date(source.filed_on).toLocaleDateString("en-IN", { year: "numeric", month: "short" })
    : null

  const content = (
    <span
      className="inline-flex items-center gap-1 text-[10.5px] px-2 py-1 rounded-md tabular-nums"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      <span style={{ fontVariationSettings: fontWeights.semibold }}>{label}</span>
      <span style={{ color: "var(--text-tertiary)" }}>· {source.filed_for}</span>
      {date && <span style={{ color: "var(--text-tertiary)" }}>· {date}</span>}
      {source.url && <ExternalLink size={10.5} style={{ color: "var(--text-tertiary)" }} />}
    </span>
  )

  if (source.url) {
    return (
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-block">
        {content}
      </a>
    )
  }
  return content
}

// ── Entity card ───────────────────────────────────────────────────────────────

function EntityCard({ entity, idx }: { entity: BusinessInterest; idx: number }) {
  const co = entity.co_owners

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay: 0.04 * idx }}
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <header className="px-4 pt-3.5 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: "color-mix(in srgb, var(--accent) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
            }}
          >
            <Building2 size={14} style={{ color: "var(--accent)" }} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-[14px] leading-tight"
              style={{
                color: "var(--text-primary)",
                fontVariationSettings: fontWeights.semibold,
              }}
            >
              {entity.entity_name}
            </h3>
            <p
              className="text-[11px] mt-1 leading-tight tabular-nums"
              style={{ color: "var(--text-tertiary)" }}
            >
              {KIND_LABEL[entity.entity_kind]}
              {entity.cin && <> · CIN {entity.cin}</>}
              {entity.incorporated_year && <> · est. {entity.incorporated_year}</>}
              {entity.state_code && <> · {entity.state_code}</>}
            </p>
          </div>

          {/* Role + holding */}
          <div className="text-right shrink-0">
            <p
              className="text-[10.5px] uppercase leading-none"
              style={{
                color: "var(--text-tertiary)",
                letterSpacing: "0.08em",
                fontVariationSettings: fontWeights.semibold,
              }}
            >
              {ROLE_LABEL[entity.role]}
            </p>
            {entity.holding_pct != null && (
              <p
                className="text-[16px] tabular-nums leading-none mt-1.5"
                style={{
                  color: "var(--text-primary)",
                  fontVariationSettings: fontWeights.bold,
                  letterSpacing: "-0.02em",
                }}
              >
                {entity.holding_pct.toFixed(entity.holding_pct % 1 === 0 ? 0 : 1)}%
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Co-owners */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-[10.5px] uppercase leading-none"
            style={{
              color: "var(--text-tertiary)",
              letterSpacing: "0.08em",
              fontVariationSettings: fontWeights.semibold,
            }}
          >
            Co-owners
          </p>
          <span
            className="text-[10.5px] tabular-nums"
            style={{ color: "var(--text-tertiary)" }}
          >
            {co.length === 0 ? "None declared" : `${co.length} declared`}
          </span>
        </div>

        {co.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {co.map((owner, i) => (
              <CoOwnerRow key={`${owner.name}-${i}`} owner={owner} />
            ))}
          </div>
        ) : (
          <p
            className="text-[11.5px] py-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            No other co-owners listed in the source filing.
          </p>
        )}
      </div>

      {/* Flags (future inferred-match overlay — null in v1) */}
      {entity.flags && entity.flags.length > 0 && (
        <div
          className="px-4 py-2.5 flex flex-col gap-1.5"
          style={{
            borderTop: "1px solid var(--border)",
            background: "color-mix(in srgb, var(--status-broken) 5%, transparent)",
          }}
        >
          {entity.flags.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertTriangle
                size={12}
                style={{ color: "var(--status-broken)" }}
                className="shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-[11.5px] leading-tight"
                  style={{
                    color: "var(--status-broken)",
                    fontVariationSettings: fontWeights.semibold,
                  }}
                >
                  {f.label}
                </p>
                {f.detail && (
                  <p
                    className="text-[11px] leading-snug mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.detail}
                  </p>
                )}
              </div>
              <Badge color="amber" size="sm">{f.confidence}</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Footer — source + note */}
      <footer
        className="px-4 py-2.5 flex flex-wrap items-center gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <SourcePill source={entity.source} />
        {entity.note && (
          <p
            className="text-[11px] flex-1 min-w-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            {entity.note}
          </p>
        )}
      </footer>
    </motion.article>
  )
}

// ── Empty / pending state ─────────────────────────────────────────────────────

function PendingIngestState({ mp }: { mp: Mp }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="rounded-lg px-5 py-6 flex flex-col gap-4"
      style={{
        background: "var(--bg-elevated)",
        border: "1px dashed var(--border)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
          }}
        >
          <Clock size={15} style={{ color: "var(--accent)" }} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p
            className="text-[14px] leading-tight"
            style={{
              color: "var(--text-primary)",
              fontVariationSettings: fontWeights.semibold,
            }}
          >
            Business interests not yet ingested
          </p>
          <p
            className="text-[12.5px] leading-relaxed mt-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            We surface only co-owners explicitly named in {mp.name}&rsquo;s sworn
            affidavit (ADR / Form&nbsp;26) or MCA21 corporate filings. The
            ingestion pipeline for these two sources is in build — until it
            ships, this tab stays blank rather than guess.
          </p>
        </div>
      </div>

      {/* Pipeline status */}
      <div
        className="rounded-md p-3.5 flex flex-col gap-2"
        style={{
          background: "color-mix(in srgb, var(--bg-elevated) 50%, var(--bg) 50%)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-[10.5px] uppercase"
          style={{
            color: "var(--text-tertiary)",
            letterSpacing: "0.08em",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          Pipeline
        </p>
        <ul className="flex flex-col gap-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
          <li className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: "var(--text-tertiary)" }}
            />
            <span>
              <strong style={{ color: "var(--text-primary)" }}>ADR / Form 26 parser</strong>
              {" — extracts entity, role, holding %, and co-signatories from each candidate’s affidavit PDF."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: "var(--text-tertiary)" }}
            />
            <span>
              <strong style={{ color: "var(--text-primary)" }}>MCA21 enrichment</strong>
              {" — by CIN, fetches the live directorship and shareholding pattern for cross-verification."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: "var(--text-tertiary)" }}
            />
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Inferred-match graph (gated)</strong>
              {" — shared registered address / auditor / DIN-across-MPs surfaced behind an explicit toggle with a methodology note. Off by default."}
            </span>
          </li>
        </ul>
      </div>

      <div className="flex items-start gap-2 text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
        <Info size={12} className="shrink-0 mt-[2px]" />
        <span>
          We publish only what {mp.name} sworn-declared, plus what the Registrar of
          Companies independently shows. Inferred relationships are computed but
          surfaced only with a methodology note attached &mdash; never silently.
        </span>
      </div>
    </motion.div>
  )
}

// ── Status banner (for `none_declared` and `unavailable`) ─────────────────────

function StatusBanner({
  title,
  body,
  tone = "neutral",
}: {
  title: string
  body: string
  tone?: "neutral" | "muted"
}) {
  return (
    <div
      className="rounded-lg px-4 py-3.5 flex items-start gap-3"
      style={{
        background:
          tone === "muted"
            ? "var(--bg-elevated)"
            : "color-mix(in srgb, var(--status-kept) 6%, transparent)",
        border:
          tone === "muted"
            ? "1px solid var(--border)"
            : "1px solid color-mix(in srgb, var(--status-kept) 22%, transparent)",
      }}
    >
      <Info
        size={14}
        style={{
          color: tone === "muted" ? "var(--text-tertiary)" : "var(--status-kept)",
        }}
        className="shrink-0 mt-0.5"
      />
      <div>
        <p
          className="text-[13px] leading-tight"
          style={{
            color: "var(--text-primary)",
            fontVariationSettings: fontWeights.semibold,
          }}
        >
          {title}
        </p>
        <p
          className="text-[12px] leading-relaxed mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

// ── Tab ───────────────────────────────────────────────────────────────────────

export function InterestsTab({ mp }: { mp: Mp }) {
  const status = mp.business_interests_status ?? { kind: "pending" as const }
  const entities = mp.business_interests ?? []

  // Summary stats
  const total = entities.length
  const politicianCoOwners = entities.flatMap(e =>
    e.co_owners.filter(o => o.relationship === "politician")
  )
  const totalCoOwners = entities.reduce((sum, e) => sum + e.co_owners.length, 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-[15px] leading-tight"
            style={{
              color: "var(--text-primary)",
              fontVariationSettings: fontWeights.semibold,
              letterSpacing: "-0.013em",
            }}
          >
            Business interests
          </h2>
          <p
            className="text-[12px] mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Companies, LLPs, trusts and HUFs declared by {mp.name}, with
            co-owners named in the same source filing. Inferred-only links
            are excluded.
          </p>
        </div>

        {/* Mini KPI strip — only when ingested */}
        {status.kind === "ingested" && total > 0 && (
          <div
            className="flex items-stretch rounded-md overflow-hidden"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            <Stat label="Entities" value={total} />
            <Stat label="Co-owners" value={totalCoOwners} divider />
            <Stat
              label="Legislators"
              value={politicianCoOwners.length}
              tone={politicianCoOwners.length > 0 ? "warn" : "neutral"}
              divider
            />
          </div>
        )}
      </div>

      {/* Body */}
      {status.kind === "pending" && <PendingIngestState mp={mp} />}

      {status.kind === "none_declared" && (
        <StatusBanner
          title="No business interests declared"
          body={`Affidavit ingestion ran on ${new Date(status.ingested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}. ${mp.name} declared no companies, LLPs, partnerships, trusts, proprietorships or HUF interests in the latest source filing.`}
        />
      )}

      {status.kind === "unavailable" && (
        <StatusBanner
          tone="muted"
          title="Source filing unavailable"
          body={status.reason}
        />
      )}

      {status.kind === "ingested" && total === 0 && (
        <StatusBanner
          title="No entities returned"
          body={`Ingestion completed on ${new Date(status.ingested_at).toLocaleDateString("en-IN")}, but no declared entities were parsed. This may indicate a parser gap — open a data issue if you have a source.`}
        />
      )}

      {status.kind === "ingested" && total > 0 && (
        <div className="flex flex-col gap-3">
          {entities.map((e, i) => (
            <EntityCard key={e.id} entity={e} idx={i} />
          ))}
        </div>
      )}

      {/* Methodology footer — always visible */}
      <div
        className="rounded-md px-3.5 py-3 text-[11.5px] leading-relaxed flex items-start gap-2"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <Briefcase size={12} className="shrink-0 mt-0.5" />
        <span>
          <strong style={{ color: "var(--text-secondary)" }}>How we read this:</strong>{" "}
          Only co-owners named in the same source filing (ADR affidavit, Form 26
          or MCA21 shareholding pattern) are listed here. We do not infer
          co-ownership from shared addresses, shared auditors or DIN graph
          overlap; that map is computed separately and shown only behind an
          explicit toggle with its own methodology note. Reach the source
          document via the pill on each entity.
        </span>
      </div>
    </div>
  )
}

// ── Small stat cell ───────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  divider = false,
  tone = "neutral",
}: {
  label: string
  value: number
  divider?: boolean
  tone?: "neutral" | "warn"
}) {
  const valueColor =
    tone === "warn" && value > 0 ? "var(--status-broken)" : "var(--text-primary)"

  return (
    <div
      className="px-3 py-2 flex flex-col items-start min-w-[68px]"
      style={{
        borderLeft: divider ? "1px solid var(--border)" : undefined,
      }}
    >
      <p
        className="text-[10px] uppercase leading-none"
        style={{
          color: "var(--text-tertiary)",
          letterSpacing: "0.08em",
          fontVariationSettings: fontWeights.semibold,
        }}
      >
        {label}
      </p>
      <p
        className="text-[15px] leading-none mt-1.5 tabular-nums"
        style={{
          color: valueColor,
          fontVariationSettings: fontWeights.bold,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>
    </div>
  )
}
