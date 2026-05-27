"use client"

/**
 * Per-component provenance footer. Replaces inline source strings.
 */

import { Info } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"

export function DataProvenance({
  source,
  url,
  lastUpdated,
  note,
}: {
  source: string
  url?: string
  lastUpdated?: string
  note?: string
}) {
  return (
    <div className="flex items-start gap-1.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
      <Info size={11} strokeWidth={1.5} className="shrink-0 mt-[1px]" />
      <span>
        Source:{" "}
        {url ? (
          <a
            href={url} target="_blank" rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
            style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}
          >
            {source}
          </a>
        ) : (
          <span style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}>
            {source}
          </span>
        )}
        {lastUpdated && <span> · Updated {lastUpdated}</span>}
        {note && <span> · {note}</span>}
      </span>
    </div>
  )
}
