"use client"

// Unified single-input search — accepts PIN codes, MP names, or constituencies.
// Detection happens server-side in /mp/page.tsx (6 digits → PIN lookup, else → text search).

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MpSearchForm({
  defaultValue = "",
  className,
}: {
  defaultValue?: string
  className?: string
}) {
  return (
    <form method="get" className={cn("flex items-center gap-2", className)}>
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="PIN code, MP name, or constituency…"
        autoComplete="off"
        leadingIcon={Search}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="md">
        Search
      </Button>
    </form>
  )
}
