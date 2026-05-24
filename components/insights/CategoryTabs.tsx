"use client"

// URL-driven category tab strip for the Insights page.
// Selecting a tab pushes ?category=<key>; "All" removes the param.

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabItem } from "@/components/ui/tabs"
import type { FactCategory } from "@/lib/insights/facts"

interface CategoryTabsProps {
  categories: { key: FactCategory; label: string; count: number }[]
  selected: FactCategory | null | undefined
  totalCount: number
}

export function CategoryTabs({ categories, selected, totalCount }: CategoryTabsProps) {
  const router = useRouter()
  const value = selected ?? "all"

  function navigate(next: string) {
    const params = new URLSearchParams(window.location.search)
    if (next === "all") {
      params.delete("category")
    } else {
      params.set("category", next)
    }
    const qs = params.toString()
    router.push(qs ? `?${qs}` : window.location.pathname)
  }

  return (
    <Tabs value={value} onValueChange={navigate}>
      <TabsList className="flex-wrap h-auto p-1 gap-0.5">
        <TabItem value="all" label={`All (${totalCount})`} />
        {categories.map(({ key, label, count }) => (
          <TabItem key={key} value={key} label={`${label} (${count})`} />
        ))}
      </TabsList>
    </Tabs>
  )
}
