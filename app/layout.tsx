import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ShapeProvider } from "@/lib/shape-context"
import { WiggleExplainProvider } from "@/components/ai-explain/WiggleExplainProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Neo Nīti",
  description:
    "A citizen accountability dashboard tracking political promises across India.",
  openGraph: {
    title: "Neo Nīti",
    description: "Track what was promised. See what was delivered.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          enableSystem
          storageKey="neoniti-theme"
        >
          <ShapeProvider defaultShape="rounded">
            {children}
            <WiggleExplainProvider />
            <Analytics />
          </ShapeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
