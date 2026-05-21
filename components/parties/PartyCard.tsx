import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PartySymbol } from "@/components/parties/PartySymbol"
import { hexAlpha } from "@/lib/partyColors"
import { fontWeights } from "@/lib/font-weight"
import type { Party } from "@/lib/db/types"
import { cn } from "@/lib/utils"

interface PartyCardProps {
  party: Party
  promiseCount?: number
  keptCount?: number
  className?: string
}

// Card layout (not list-row) with party symbol prominent at top-left,
// party color reserved for the symbol tint + the 1px hairline top band.
export function PartyCard({ party, promiseCount = 0, keptCount = 0, className }: PartyCardProps) {
  const keptPct = promiseCount > 0 ? Math.round((keptCount / promiseCount) * 100) : 0
  const color = party.color_hex

  return (
    <Link
      href={`/parties/${party.slug}`}
      className={cn("party-card group", className)}
      style={{ textDecoration: "none" }}
    >
      {/* Top hairline accent in party color */}
      <span className="party-card__band" style={{ background: color }} />

      <div className="party-card__inner">
        {/* Symbol slot — large, tinted */}
        <div
          className="party-card__symbol"
          style={{ background: hexAlpha(color, 0.10), border: `1px solid ${hexAlpha(color, 0.30)}` }}
        >
          <PartySymbol slug={party.slug} color={color} size={36} />
        </div>

        {/* Title row */}
        <div className="party-card__title">
          <span
            className="party-card__name"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
          >
            {party.name}
          </span>
          {party.short_name && (
            <span
              className="party-card__short"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
            >
              {party.short_name}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="party-card__stats">
          <div className="party-card__stat">
            <span className="value">{promiseCount}</span>
            <span className="label">Promises</span>
          </div>
          <div className="party-card__stat">
            <span className="value" style={{ color: keptPct > 0 ? "var(--status-kept)" : "var(--text-primary)" }}>
              {keptPct}%
            </span>
            <span className="label">Kept</span>
          </div>
          <div className="party-card__stat">
            <span className="value uppercase tracking-[0.06em]" style={{ fontSize: 11 }}>
              {party.level}
            </span>
            <span className="label">Scope</span>
          </div>
        </div>

        {/* Hover affordance */}
        <ArrowRight
          size={14}
          strokeWidth={1.5}
          className="party-card__arrow transition-transform duration-100 group-hover:translate-x-0.5"
          style={{ color: "var(--text-disabled)" }}
        />
      </div>
    </Link>
  )
}
