"use client"

import { useState } from "react"
import { motion, LayoutGroup } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  GitCompare,
  Globe,
  Home,
  Info,
  Landmark,
  Lightbulb,
  Menu,
  ScrollText,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"

const navItems = [
  { href: "/",            label: "Overview",    icon: Home },
  { href: "/mp",          label: "Know your politician", icon: User },
  { href: "/legislators", label: "Legislators", icon: Users },
  { href: "/parties",     label: "Parties",     icon: Shield },
  { href: "/manifestos",  label: "Manifestos",  icon: BookOpen },
  { href: "/bills",       label: "Bills",       icon: Landmark },
  { href: "/compare",     label: "Compare",     icon: GitCompare },
  { href: "/tracker",     label: "Tracker",     icon: BarChart3 },
  { href: "/atlas",       label: "Atlas",       icon: Globe },
  { href: "/insights",    label: "Insights",    icon: Lightbulb },
] as const

const bottomItems = [
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
        //   font-size 13px, weight 510, gap 8px, padding 0 6px,
        //   height 28px, radius 6px, color #d0d6e0 (idle), no accent bar.
        "relative flex items-center gap-2 px-1.5 h-[28px] rounded-[var(--radius-card)] text-[13px] transition-colors duration-100",
        active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      )}
      style={{ fontVariationSettings: "'wght' 510" }}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-[var(--radius-card)]"
          // Linear's active state is just a subtle bg-tint, no accent bar.
          style={{ background: "var(--bg-elevated)" }}
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
        className="w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0"
        style={{ background: "var(--accent)" }}
      >
        <span className="text-[10px]" style={{ color: "var(--text-on-accent)", fontVariationSettings: fontWeights.semibold }}>B</span>
      </div>
      <span
        className="text-[13px] truncate"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.015em", fontVariationSettings: fontWeights.medium }}
      >
        Manifesto Watch
      </span>
    </div>
  )
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { open } = useCommandPalette()

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <LayoutGroup id="sidebar-nav">
        <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
          {/* UI_RULES.md §1 exception: command-palette trigger row. Sized at
              h-[26px]/12px to match the NavItem rows directly below it (also
              h-[28px]/13px — measured from linear.app sidebar). The smallest
              <Button> variant (sm = h-7 = 28px) is taller and has different
              hover semantics (filled bg pill vs sidebar's flat hover-tint).
              Converting would visually break the sidebar's column rhythm. */}
          <button
            onClick={() => { open(); onNavigate?.() }}
            className="flex items-center gap-2 px-2 h-[26px] rounded-[var(--radius-4)] text-[12px] transition-colors duration-100 w-full mb-1 hover:bg-[var(--bg-elevated-2)]"
            style={{
              color: "var(--text-tertiary)",
              border: "1px solid var(--border)",
              fontVariationSettings: fontWeights.normal,
            }}
          >
            <Search size={13} strokeWidth={1.5} className="shrink-0" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="text-[11px] font-mono shrink-0" style={{ color: "var(--text-disabled)" }}>⌘K</kbd>
          </button>

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
        <div className="px-3 pt-2">
          <span className="text-[11px] font-mono" style={{ color: "var(--text-disabled)" }}>
            v0.1.0 · beta
          </span>
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
        {/* UI_RULES.md §1 exception: mobile-nav hamburger trigger. Sized 32x32
            to match the topnav-height row context with a 16px icon. The
            closest <Button> variant (icon-sm = h-8/w-8 = 32px) ships a 14px
            icon and the wrapper's group-hover stroke-width/scale transitions
            change the icon's visual weight on tap, which we don't want on
            mobile. Keep as a bare <button> — documented exception. */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="flex items-center justify-center w-8 h-8 rounded-[6px] transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <Menu size={16} strokeWidth={1.5} />
        </button>
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
