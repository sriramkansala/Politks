"use client"

// Tiny client wrapper around the PIN-search form on the home page. Lives in
// its own file because lucide icons are function-typed React components and
// React Server Components cannot serialise function references across the
// server→client boundary — the icon component has to be imported by the
// client itself.

import Link from "next/link"
import { MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fontWeights } from "@/lib/font-weight"

export function PinSearchForm({
  defaultPin = "",
  showBrowseAll = true,
}: {
  defaultPin?: string
  showBrowseAll?: boolean
}) {
  return (
    <form action="/mp" method="get" className="flex flex-col sm:flex-row gap-2 max-w-xl">
      <Input
        name="pin"
        defaultValue={defaultPin}
        placeholder="PIN code (e.g. 160001)"
        inputMode="numeric"
        maxLength={6}
        leadingIcon={MapPin}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="md">
        Find
      </Button>
      {showBrowseAll && (
        <Link
          href="/mp"
          className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-[13px] rounded-[var(--radius-card)] border transition-colors"
          style={{
            background: "var(--bg-elevated-2)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontVariationSettings: fontWeights.medium,
          }}
        >
          <Search size={13} strokeWidth={1.5} />
          Browse all
        </Link>
      )}
    </form>
  )
}
