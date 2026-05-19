import type { Metadata } from "next"
import { ThemeProvider } from "@/components/ui/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Bharat Manifesto Watch",
  description:
    "A citizen accountability dashboard tracking political promises across India.",
  openGraph: {
    title: "Bharat Manifesto Watch",
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
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
