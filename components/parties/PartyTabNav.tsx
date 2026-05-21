"use client"

// URL-driven tab nav for the party profile page. SSR-safe (each tab is a
// real link with ?tab=…), keyboard-friendly, no client routing logic.
//
// We don't use the shadcn Tabs primitive because it's a client-side
// context-based component — the party page is a server component and we
// want shareable URLs (so the user can paste /parties/bjp?tab=donors and
// land on the right tab without a flicker).
//
// BUT per UI_RULES.md §9 (Fluid Functionalism), the active indicator must
// slide between tabs using framer-motion's `layoutId` + a spring transition.
// Marking the file "use client" purely for the motion animation — the routing
// itself stays SSR-driven via real <Link>s, so this is still URL-shareable.

import Link from "next/link"
import { motion, LayoutGroup } from "framer-motion"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"

export interface TabSpec {
  value: string
  label: string
  /** If true, the tab is the implicit default (no ?tab= query param). */
  isDefault?: boolean
}

interface Props {
  tabs: TabSpec[]
  active: string
  /** Base href, e.g. "/parties/bjp". */
  basePath: string
  /** Other query params to preserve. */
  preserveParams?: Record<string, string | null | undefined>
}

export function PartyTabNav({ tabs, active, basePath, preserveParams = {} }: Props) {
  return (
    <LayoutGroup id="party-tab-nav">
      <nav
        role="tablist"
        aria-label="Party profile sections"
        className="flex items-center gap-0 overflow-x-auto relative"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.value
          const params = new URLSearchParams()
          for (const [k, v] of Object.entries(preserveParams)) {
            if (v != null && v !== "") params.set(k, v)
          }
          if (!tab.isDefault) params.set("tab", tab.value)
          const qs = params.toString()
          const href = qs ? `${basePath}?${qs}` : basePath
          return (
            <Link
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              href={href}
              scroll={false}
              className="relative px-3 py-2 text-[13px] whitespace-nowrap transition-colors"
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                marginBottom: -1,
                textDecoration: "none",
                fontVariationSettings: isActive
                  ? fontWeights.semibold
                  : fontWeights.medium,
              }}
            >
              <span className="relative z-10">{tab.label}</span>
              {/* Animated active underline — slides between tabs via framer-motion
                  layoutId. Per UI_RULES.md §9: structural state changes use FF
                  springs, not CSS transitions. */}
              {isActive && (
                <motion.span
                  layoutId="party-tab-underline"
                  className="absolute left-0 right-0"
                  style={{
                    bottom: -1,
                    height: 1.5,
                    background: "var(--text-primary)",
                  }}
                  transition={springs.moderate}
                  aria-hidden
                />
              )}
            </Link>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}
