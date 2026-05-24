"use client"

// URL-driven tab nav for the party profile page. SSR-safe (each tab is a
// real link with ?tab=…), keyboard-friendly, no client routing logic.
//
// We don't use the shadcn Tabs primitive because it's a client-side
// context-based component — the party page is a server component and we
// want shareable URLs (so the user can paste /parties/bjp?tab=donors and
// land on the right tab without a flicker).
//
// Visually, the active state matches the <Tabs> primitive (components/ui/tabs.tsx):
// a rounded "pill" sits behind the active tab and slides between tabs via
// framer-motion's `layoutId`. Per UI_RULES.md §9: structural transitions use
// FF springs, not CSS class swaps. Marking the file "use client" purely for
// this motion — the routing itself stays SSR-driven via real <Link>s.

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
              className="relative px-3 py-1.5 rounded-[var(--radius-card)] text-[13px] whitespace-nowrap transition-colors"
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                textDecoration: "none",
                fontVariationSettings: isActive
                  ? fontWeights.semibold
                  : fontWeights.normal,
              }}
            >
              {/* Animated active pill — slides between tabs via framer-motion
                  layoutId. Mirrors the <Tabs> primitive (components/ui/tabs.tsx)
                  active-segment indicator so all tab strips share one visual
                  language. Per UI_RULES.md §9: structural transitions use FF
                  springs, not CSS class swaps. */}
              {isActive && (
                <motion.span
                  layoutId="party-tab-pill"
                  className="absolute inset-0 rounded-[var(--radius-card)]"
                  style={{ background: "var(--bg-tertiary)" }}
                  transition={springs.moderate}
                  aria-hidden
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}
