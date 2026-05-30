// A faithful Linear ⌘K command menu, self-contained (built on cmdk + Radix
// Dialog) so it can be demoed in isolation. Structure:
//   ┌──────────────────────────────────────────┐
//   │ 🔍  Type a command or search…             │  ← input, no border box
//   ├──────────────────────────────────────────┤
//   │ NAVIGATION                                │  ← group heading (uppercase)
//   │   ◻ Inbox                            G I  │  ← item + kbd hint
//   │ ISSUES                                    │
//   │   ◖ ENG-128  Fix filter pill overflow     │
//   │ COMMANDS                                  │
//   │   ＋ Create new issue                  C  │
//   ├──────────────────────────────────────────┤
//   │ ↵ to select   ↑↓ to navigate   esc to close│  ← footer hint bar
//   └──────────────────────────────────────────┘
// Arrow keys + enter + esc are handled by cmdk; ⌘K toggles open.

"use client"

import { useEffect, useState } from "react"
import { Command } from "cmdk"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"
import { Kbd } from "./Kbd"

export interface CommandEntry {
  id: string
  label: string
  /** Leading glyph. */
  icon?: React.ReactNode
  /** Secondary muted text after the label (e.g. an issue id). */
  hint?: string
  /** Keyboard shortcut shown right-aligned. */
  shortcut?: string[]
  /** Words added to the fuzzy-match haystack. */
  keywords?: string[]
  onSelect?: () => void
}

export interface CommandGroupSpec {
  heading: string
  items: CommandEntry[]
}

interface CommandMenuProps {
  groups: CommandGroupSpec[]
  open: boolean
  onOpenChange: (open: boolean) => void
  placeholder?: string
}

export function CommandMenu({
  groups,
  open,
  onOpenChange,
  placeholder = "Type a command or search…",
}: CommandMenuProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-label="Command menu">
              <motion.div
                className="fixed left-1/2 top-[18%] z-50 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 outline-none"
                initial={{ opacity: 0, scale: 0.98, y: -6, x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.98, y: -6, x: "-50%" }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <Command
                  loop
                  className="overflow-hidden"
                  style={{
                    background: "var(--bg-elevated-2)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "var(--radius-12)",
                    boxShadow: "var(--shadow-s7)",
                  }}
                >
                  <Dialog.Title className="sr-only">Command menu</Dialog.Title>

                  {/* Input */}
                  <div
                    className="flex items-center gap-2.5 px-4"
                    style={{ height: 52, borderBottom: "1px solid var(--border)" }}
                  >
                    <Search size={16} strokeWidth={1.75} style={{ color: "var(--text-tertiary)" }} />
                    <Command.Input
                      autoFocus
                      placeholder={placeholder}
                      className="flex-1 bg-transparent outline-none text-[14px]"
                      style={{ color: "var(--text-primary)" }}
                    />
                  </div>

                  {/* Results */}
                  <Command.List
                    className="max-h-[360px] overflow-y-auto p-1.5"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    <Command.Empty>
                      <div
                        className="py-10 text-center text-[13px]"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        No results found.
                      </div>
                    </Command.Empty>

                    {groups.map((group) => (
                      <Command.Group
                        key={group.heading}
                        heading={group.heading}
                        className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-group-heading]]:text-[color:var(--text-quaternary)] [&_[cmdk-group-heading]]:font-medium"
                      >
                        {group.items.map((item) => (
                          <Command.Item
                            key={item.id}
                            value={`${item.label} ${item.hint ?? ""} ${(item.keywords ?? []).join(" ")}`}
                            onSelect={() => {
                              item.onSelect?.()
                              onOpenChange(false)
                            }}
                            className="flex items-center gap-2.5 px-2.5 rounded-[6px] cursor-default data-[selected=true]:bg-[var(--ff-hover)]"
                            style={{ height: 38 }}
                          >
                            {item.icon != null && (
                              <span
                                className="inline-flex items-center justify-center w-4 h-4 [&_svg]:w-4 [&_svg]:h-4 shrink-0"
                                style={{ color: "var(--text-tertiary)" }}
                              >
                                {item.icon}
                              </span>
                            )}
                            <span
                              className="text-[13px] truncate"
                              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.normal }}
                            >
                              {item.label}
                            </span>
                            {item.hint && (
                              <span className="text-[12px] truncate" style={{ color: "var(--text-tertiary)" }}>
                                {item.hint}
                              </span>
                            )}
                            {item.shortcut && (
                              <span className="ml-auto flex items-center gap-1 shrink-0">
                                {item.shortcut.map((k, i) => (
                                  <Kbd key={i}>{k}</Kbd>
                                ))}
                              </span>
                            )}
                          </Command.Item>
                        ))}
                      </Command.Group>
                    ))}
                  </Command.List>

                  {/* Footer hint bar */}
                  <div
                    className="flex items-center gap-4 px-3"
                    style={{ height: 36, borderTop: "1px solid var(--border)", color: "var(--text-tertiary)" }}
                  >
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Kbd>↵</Kbd> to select
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Kbd>↑</Kbd>
                      <Kbd>↓</Kbd> to navigate
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Kbd>esc</Kbd> to close
                    </span>
                  </div>
                </Command>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

/** Convenience hook: wires ⌘K / Ctrl+K to toggle a CommandMenu's open state. */
export function useCommandMenu() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])
  return { open, setOpen }
}
