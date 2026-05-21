"use client"

// Client wrapper around the MP-hub search form. Required because lucide
// icons are function-typed React components that cannot be serialised
// across the React Server Components boundary as props.

import { MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MpSearchForm({
  defaultPin = "",
  defaultQ = "",
}: {
  defaultPin?: string
  defaultQ?: string
}) {
  return (
    <form method="get" className="flex flex-col md:flex-row gap-2 max-w-2xl">
      <Input
        name="pin"
        defaultValue={defaultPin}
        placeholder="PIN code (e.g. 160001)"
        inputMode="numeric"
        maxLength={6}
        leadingIcon={MapPin}
        className="flex-1"
      />
      <Input
        name="q"
        defaultValue={defaultQ}
        placeholder="MP name or constituency"
        leadingIcon={Search}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="md">
        Find
      </Button>
    </form>
  )
}
