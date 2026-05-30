"use client"

// Client component: renders one row per party with a Switch that toggles
// the party's visibility across the app. Backed by useHiddenParties zustand
// store (persisted to localStorage).

import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useHiddenParties } from "@/hooks/use-hidden-parties"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"

interface PartyOption {
  id: string
  name: string
  short_name: string | null
  color: string
}

export function PartyVisibilityList({ parties }: { parties: PartyOption[] }) {
  const { hidden, toggle, clear } = useHiddenParties()

  const visibleCount = parties.length - hidden.length

  return (
    <div className="space-y-4">
      {/* Summary + reset */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-card)]"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Showing{" "}
          <strong style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}>
            {visibleCount}
          </strong>{" "}
          of {parties.length} parties
          {hidden.length > 0 && (
            <span style={{ color: "var(--text-tertiary)" }}>
              {" "}· {hidden.length} hidden
            </span>
          )}
        </span>
        {hidden.length > 0 && (
          <Button variant="tertiary" size="sm" onClick={clear}>
            Show all
          </Button>
        )}
      </div>

      {/* Party list */}
      <ul
        className="rounded-[var(--radius-card)] overflow-hidden"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        {parties.map((p, i) => {
          const isHidden = hidden.includes(p.id)
          return (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: i * 0.02 }}
              className="flex items-center justify-between gap-4 px-4 py-3"
              style={{
                borderBottom: i < parties.length - 1 ? "1px solid var(--border)" : "none",
                opacity: isHidden ? 0.55 : 1,
                transition: "opacity 180ms var(--ease-out-quart)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="inline-block rounded-full shrink-0"
                  style={{ width: 10, height: 10, background: p.color }}
                />
                <div className="min-w-0">
                  <div
                    className="text-[14px] truncate"
                    style={{
                      color: "var(--text-primary)",
                      fontVariationSettings: fontWeights.medium,
                    }}
                  >
                    {p.short_name ?? p.name}
                  </div>
                  {p.short_name && (
                    <div
                      className="text-[12px] truncate"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {p.name}
                    </div>
                  )}
                </div>
              </div>
              <Switch
                label={`Show ${p.short_name ?? p.name}`}
                hideLabel
                checked={!isHidden}
                onToggle={() => toggle(p.id)}
              />
            </motion.li>
          )
        })}
      </ul>

      <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
        Hidden parties are filtered out of the Promise Tracker, the Parties grid, and
        the Compare picker. Methodology, About, and historical data remain unaffected.
        Settings are stored locally in your browser.
      </p>
    </div>
  )
}
