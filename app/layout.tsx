import type { Metadata } from "next"
import { Geist, Geist_Mono, EB_Garamond } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/app/_components/theme-provider"
import { AppChrome } from "@/app/_components/chrome/app-chrome"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Editorial serif, backs the `font-serif` token for quotes / long-form moments.
const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "byronwade/ui, Design system",
  description:
    "A personal design system, token-driven components with one swappable green accent.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppChrome />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
