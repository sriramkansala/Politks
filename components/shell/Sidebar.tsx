"use client"

import { useState } from "react"
import { motion, LayoutGroup } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  GitCompare,
  Globe,
  Home,
  Info,
  Landmark,
  Menu,
  ScrollText,
  Settings,
  Shield,
  User,
  IndianRupee,
} from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"

const navItems = [
  { href: "/",        label: "Overview",             icon: Home },
  { href: "/mp",      label: "Know your politician", icon: User },
  { href: "/parties", label: "Parties",              icon: Shield },
  { href: "/manifestos",  label: "Manifestos",  icon: BookOpen },
  { href: "/bills",       label: "Bills",       icon: Landmark },
  { href: "/compare",     label: "Compare",     icon: GitCompare },
  { href: "/atlas",       label: "Atlas",       icon: Globe },
  { href: "/budget",      label: "Budget",      icon: IndianRupee },
] as const

const bottomItems = [
  { href: "/settings",    label: "Settings",     icon: Settings },
  { href: "/methodology", label: "Methodology", icon: ScrollText },
  { href: "/about",       label: "About",        icon: Info },
] as const

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  external,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  external?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        // MEASURED on linear.app product sidebar:
        //   font-size 13px, weight 510, gap 8px, padding 0 6px, height 28px,
        //   color #d0d6e0 (idle), no accent bar. Radius follows --radius-card
        //   (12px) per the 2026-05 radius-scale migration (see TASTE_CHANGELOG).
        "relative flex items-center gap-2 px-1.5 h-[28px] rounded-[var(--radius-card)] text-[13px] transition-colors duration-100",
        active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--ff-hover)]"
      )}
      style={{ fontVariationSettings: "'wght' 510", transition: "color 80ms, background 80ms" }}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-[var(--radius-card)]"
          // Same flat grey we use for the active tab pill — keeps the
          // "selected" language consistent across sidebar nav + tab strips.
          style={{ background: "var(--bg-tertiary)" }}
          transition={springs.moderate}
        />
      )}
      <Icon
        size={14}
        strokeWidth={active ? 2 : 1.5}
        className="shrink-0 relative z-10 transition-[stroke-width] duration-100"
      />
      <span className="relative z-10">{label}</span>
    </Link>
  )
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
        style={{ background: "var(--accent)" }}
      >
        <span className="text-[10px]" style={{ color: "var(--text-on-accent)", fontVariationSettings: fontWeights.semibold }}>N</span>
      </div>
      <span
        className="text-[13px] truncate"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.015em", fontVariationSettings: fontWeights.medium }}
      >
        Neo Nīti
      </span>
    </div>
  )
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  useCommandPalette() // keep hook for palette availability

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <LayoutGroup id="sidebar-nav">
        <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {navItems.map((item) => {
            const { href, label, icon } = item
            const external = ("external" in item ? (item as { external?: boolean }).external : false) ?? false
            return (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={icon}
                external={external}
                active={!external && (pathname === href || (href !== "/" && pathname.startsWith(href)))}
                onClick={onNavigate}
              />
            )
          })}
        </nav>
        </ScrollArea>
      </LayoutGroup>

      <div
        className="flex flex-col gap-0.5 px-2 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {bottomItems.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname.startsWith(href)}
            onClick={onNavigate}
          />
        ))}
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-[11px] font-mono" style={{ color: "var(--text-disabled)" }}>
            v0.1.0 · beta
          </span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────

export function Sidebar() {
  return (
    <aside
      aria-label="Main navigation"
      className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{
        width: "var(--sidebar-width)",
        // MEASURED on linear.app: sidebar bg matches canvas, no elevation tier
        background: "var(--bg-base)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 shrink-0"
        style={{ height: "var(--topnav-height)", borderBottom: "1px solid var(--border)" }}
      >
        <Wordmark />
      </div>
      <NavContent />
    </aside>
  )
}

// ── Mobile top bar + sheet ────────────────────────────────────────────────────

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar — visible only on mobile */}
      <header
        className="flex md:hidden items-center justify-between px-4 shrink-0"
        style={{
          height: "var(--topnav-height)",
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Wordmark />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* UI_RULES.md §1 exception: mobile-nav hamburger trigger. Sized 32x32
              to match the topnav-height row context with a 16px icon. The
              closest <Button> variant (icon-sm = h-8/w-8 = 32px) ships a 14px
              icon and the wrapper's group-hover stroke-width/scale transitions
              change the icon's visual weight on tap, which we don't want on
              mobile. Keep as a bare <button> — documented exception. */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <Menu size={16} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Slide-in nav drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="p-0 flex flex-col"
          style={{
            background: "var(--bg-elevated)",
            borderRight: "1px solid var(--border)",
            width: "var(--sidebar-width)",
          }}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div
            className="flex items-center gap-2 px-4 shrink-0"
            style={{ height: "var(--topnav-height)", borderBottom: "1px solid var(--border)" }}
          >
            <Wordmark />
          </div>
          <NavContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
