"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/manifestos", label: "Manifestos" },
  { href: "/admin/manifestos/new", label: "Upload" },
] as const

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {items.map(({ href, label }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "px-3 h-7 flex items-center text-[13px] rounded-xl transition-colors duration-100",
              active
                ? "bg-[var(--bg-elevated-2)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--ff-hover)]"
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
