"use client"

// Tab strip for the Know Your Politician hub (/mp).
// "Find MP"    — search by PIN / name / constituency + featured MPs.
// "Legislators" — full browseable roster with house/state/party filters.
//
// Tab state is URL-driven: ?tab=legislators switches to the second panel.
// Switching removes irrelevant params so the URL stays clean.

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabItem, TabPanel } from "@/components/ui/tabs"

interface MpHubTabsProps {
  activeTab: "find" | "legislators"
  findPanel: React.ReactNode
  legislatorsPanel: React.ReactNode
  /** Label shown on the Legislators tab, e.g. "Legislators (543)". */
  legislatorsLabel: string
}

export function MpHubTabs({
  activeTab,
  findPanel,
  legislatorsPanel,
  legislatorsLabel,
}: MpHubTabsProps) {
  const router = useRouter()

  function navigate(tab: string) {
    const params = new URLSearchParams(window.location.search)

    if (tab === "find") {
      // Clear legislators-only params; keep nothing (search lands fresh)
      params.delete("tab")
      params.delete("house")
      params.delete("state")
      params.delete("party")
    } else {
      // Going to legislators: set tab, clear the find-mp search query
      params.set("tab", tab)
      params.delete("q")
      params.delete("pin")
    }

    const qs = params.toString()
    router.push(qs ? `?${qs}` : window.location.pathname)
  }

  return (
    <Tabs value={activeTab} onValueChange={navigate}>
      <div className="mb-8">
        <TabsList className="bg-transparent p-0 gap-1">
          <TabItem value="find" label="Overview" />
          <TabItem value="legislators" label={legislatorsLabel} />
        </TabsList>
      </div>

      <TabPanel value="find">{findPanel}</TabPanel>
      <TabPanel value="legislators">{legislatorsPanel}</TabPanel>
    </Tabs>
  )
}
