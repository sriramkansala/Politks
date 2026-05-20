import { Sidebar, MobileNav } from "@/components/shell/Sidebar"
import { CommandPalette } from "@/components/shell/CommandPalette"
import { MccBanner } from "@/components/shell/MccBanner"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip link — visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:rounded-[6px] focus:text-[13px]"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Skip to main content
      </a>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <MccBanner />
        <MobileNav />
        <main id="main-content" className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette />
    </div>
  )
}
