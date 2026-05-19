"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  GitCompare,
  Home,
  Info,
  ScrollText,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/",          label: "Overview",    icon: Home },
  { href: "/parties",   label: "Parties",     icon: Shield },
  { href: "/manifestos",label: "Manifestos",  icon: BookOpen },
  { href: "/compare",   label: "Compare",     icon: GitCompare },
  { href: "/tracker",   label: "Tracker",     icon: BarChart3 },
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
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 h-8 rounded-[6px] text-[13px] font-[400] transition-colors duration-100 relative group",
        active
          ? "text-[var(--text-primary)] bg-[var(--bg-elevated-2)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated-2)]"
      )}
      style={
        active
          ? {
              boxShadow: "inset 2px 0 0 var(--accent)",
            }
          : undefined
      }
    >
      <Icon size={14} strokeWidth={1.5} className="shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo / wordmark */}
      <div
        className="flex items-center gap-2 px-4 shrink-0"
        style={{ height: "var(--topnav-height)", borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <span className="text-white text-[10px] font-[590]">B</span>
        </div>
        <span
          className="text-[13px] font-[510] truncate"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          Manifesto Watch
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
        {navItems.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href || (href !== "/" && pathname.startsWith(href))}
          />
        ))}
      </nav>

      {/* Bottom nav */}
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
          />
        ))}
        <div className="px-3 pt-2">
          <span
            className="text-[11px] font-mono"
            style={{ color: "var(--text-disabled)" }}
          >
            v0.1.0 · beta
          </span>
        </div>
      </div>
    </aside>
  )
}
