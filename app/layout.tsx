import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
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
    "Fail-closed design systems that install as MCP — with design.md as the law book and optional skills as the cookbook. get_contract before UI, validate_ui before done.",
  metadataBase: new URL("https://ui.byronwade.com"),
  openGraph: {
    title: "Design systems that install as MCP",
    description:
      "MCP · markdown · skills. Runtime law, law book, optional cookbook — free and open source.",
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
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
