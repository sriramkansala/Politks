"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3, BookOpen, GitCompare, Home, Info, ScrollText, Shield,
} from "lucide-react"
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command"
import { StatusPill } from "@/components/promises/StatusPill"
import { useCommandPalette } from "@/hooks/use-command-palette"
import type { PromiseStatus } from "@/lib/db/types"

const pages = [
  { href: "/",            label: "Overview",    icon: Home },
  { href: "/parties",     label: "Parties",     icon: Shield },
  { href: "/manifestos",  label: "Manifestos",  icon: BookOpen },
  { href: "/compare",     label: "Compare",     icon: GitCompare },
  { href: "/tracker",     label: "Tracker",     icon: BarChart3 },
  { href: "/methodology", label: "Methodology", icon: ScrollText },
  { href: "/about",       label: "About",       icon: Info },
]

const parties = [
  { href: "/parties/bjp", label: "BJP — Bharatiya Janata Party" },
  { href: "/parties/inc", label: "INC — Indian National Congress" },
  { href: "/parties/aap", label: "AAP — Aam Aadmi Party" },
  { href: "/parties/dmk", label: "DMK — Dravida Munnetra Kazhagam" },
]

interface SearchResult {
  id: string; title: string; status: string; party: string
}

export function CommandPalette() {
  const { isOpen, close, toggle } = useCommandPalette()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 200)
    return () => clearTimeout(t)
  }, [query, search])

  function navigate(href: string) {
    router.push(href)
    close()
    setQuery("")
    setResults([])
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(v) => { if (!v) { close(); setQuery(""); setResults([]) } }}>
      <CommandInput
        placeholder="Search pages, parties, promises…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{searching ? "Searching…" : "No results."}</CommandEmpty>

        {results.length > 0 && (
          <>
            <CommandGroup heading="Promises">
              {results.slice(0, 6).map((r) => (
                <CommandItem key={r.id} onSelect={() => navigate(`/promises/${r.id}`)}>
                  <div className="flex items-center justify-between w-full gap-3 min-w-0">
                    <span className="truncate">{r.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>{r.party}</span>
                      <StatusPill status={r.status as PromiseStatus} />
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigate">
          {pages.map(({ href, label, icon: Icon }) => (
            <CommandItem key={href} onSelect={() => navigate(href)}>
              <Icon size={14} strokeWidth={1.5} className="mr-2 shrink-0" />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Parties">
          {parties.map(({ href, label }) => (
            <CommandItem key={href} onSelect={() => navigate(href)}>{label}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
