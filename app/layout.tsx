import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Design contracts · ui.byronwade.com",
    template: "%s · ui.byronwade.com",
  },
  description:
    "Strict AI design contracts agents install over MCP — Meridian and siblings. Soft catalog, fail-closed grammar, $9/mo per server.",
  metadataBase: new URL("https://ui.byronwade.com"),
  openGraph: {
    title: "Design contracts",
    description:
      "Fail-closed AI design systems. Install a contract MCP — ship coherent app UI.",
    url: "https://ui.byronwade.com",
    siteName: "ui.byronwade.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body data-surface="application">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
