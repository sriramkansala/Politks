"use client"

import { useState } from "react"
import { AlertTriangle, Flag, Scale, ShieldAlert } from "lucide-react"
import { tokens } from "@/lib/tokens"

const SIGNALS = [
  {
    icon: AlertTriangle,
    severity: "high" as const,
    title: "Issue-Laundering Detected",
    signal: "Article 334A / Delimitation Poison Pill",
    description:
      "The enacted bill links reservation activation to a delimitation exercise that has no fixed deadline. This embeds an indefinite delay into law — the promise of 33% reservation is effectively laundered into a future promise with no accountability mechanism.",
  },
  {
    icon: ShieldAlert,
    severity: "medium" as const,
    title: "Whip Adherence Signal",
    signal: "RS Vote 186–1 (2010), LS Vote 454–2 (2023)",
    description:
      "Near-unanimous votes in both houses (186:1 in RS 2010, 454:2 in LS 2023) indicate strict party whip enforcement. Independent dissent was structurally suppressed despite substantive OBC representation concerns raised in committee.",
  },
  {
    icon: Scale,
    severity: "low" as const,
    title: "PLCP Compliance: Fail",
    signal: "Pre-Legislative Consultation Policy",
    description:
      "The 2023 Constitution (106th Amendment) Bill was introduced and passed within 5 days without the 30-day public consultation period mandated by the Ministry of Law's 2014 Pre-Legislative Consultation Policy. No exceptions were formally invoked.",
  },
]

const SEVERITY_COLOR: Record<"high" | "medium" | "low", string> = {
  high:   "var(--status-broken)",
  medium: "var(--status-stalled)",
  low:    "var(--status-inworks)",
}

function SignalCard({
  icon: Icon,
  severity,
  title,
  signal,
  description,
}: (typeof SIGNALS)[number]) {
  const [challenged, setChallenged] = useState(false)
  const color = SEVERITY_COLOR[severity]

  return (
    <div
      className="rounded-[var(--radius-card)] p-4"
      style={{
        background: tokens.color.bgElevated,
        border: "1px solid var(--border)",
        // Linear-mono: severity → tiny dot, not a 3px coloured border
      }}
    >
      <div className="flex items-start gap-3">
        <Icon size={14} strokeWidth={1.5} style={{ color: tokens.color.textTertiary, marginTop: 2, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[12px]" style={{ color: tokens.color.textPrimary, fontVariationSettings: "'wght' 510" }}>
              {title}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase" style={{ color: tokens.color.textTertiary }}>
              <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: color }} aria-hidden="true" />
              {severity}
            </span>
          </div>
          <div className="text-[11px] mb-1" style={{ color: tokens.color.textSecondary, fontVariationSettings: "'wght' 510" }}>
            {signal}
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: tokens.color.textSecondary }}>
            {description}
          </p>

          {/* BMW-095: Challenge this finding */}
          <div className="mt-3">
            {challenged ? (
              <p
                className="text-[11px]"
                style={{ color: tokens.color.textTertiary }}
                aria-live="polite"
              >
                Thanks — your challenge has been recorded. We review all submissions.
              </p>
            ) : (
              // UI_RULES.md §1 exception: 11px inline link-styled action. The
              // smallest <Button> variant (sm = h-7 = 28px, 12px text) is too
              // tall and visually heavy for an inline tertiary action that
              // reads as a hyperlink (note the hover:underline). Keep as a
              // bare <button> — documented exception.
              <button
                onClick={() => setChallenged(true)}
                className="inline-flex items-center gap-1.5 text-[11px] transition-colors duration-80 hover:underline"
                style={{ color: tokens.color.textDisabled }}
              >
                <Flag size={10} strokeWidth={1.5} />
                Challenge this finding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ForensicSignals() {
  return (
    <div className="grid grid-cols-1 gap-3">
      {SIGNALS.map((s) => (
        <SignalCard key={s.title} {...s} />
      ))}
    </div>
  )
}
