"use client"

// Small client-side wrapper around <Input> + <Button> so that
// `leadingIcon={Search}` (a lucide forwardRef component) doesn't cross the
// RSC boundary. Next 16 rejects non-plain props from server → client.

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LegislatorSearchFormProps {
  defaultQ?: string
  // Preserve other filter params on submit so search doesn't wipe them out.
  house?: string
  state?: string
  party?: string
  /** When rendered inside a tabbed layout, pass the active tab value so the
   *  form submit doesn't accidentally navigate away from the tab. */
  tab?: string
}

export function LegislatorSearchForm({
  defaultQ,
  house,
  state,
  party,
  tab,
}: LegislatorSearchFormProps) {
  return (
    <form method="get" className="flex flex-col md:flex-row gap-2 max-w-2xl">
      <Input
        name="q"
        defaultValue={defaultQ ?? ""}
        placeholder="Name, constituency, or portfolio"
        leadingIcon={Search}
        className="flex-1"
      />
      {tab   && <input type="hidden" name="tab"   value={tab} />}
      {house && <input type="hidden" name="house" value={house} />}
      {state && <input type="hidden" name="state" value={state} />}
      {party && <input type="hidden" name="party" value={party} />}
      <Button type="submit" className="md:w-auto w-full">
        Search
      </Button>
    </form>
  )
}
