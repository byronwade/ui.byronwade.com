import { PlatformFooter } from "@/components/chrome/platform-footer"
import { PlatformHeader } from "@/components/chrome/platform-header"

/**
 * Platform shell — cool technical catalog. Distinct from every contract skin.
 */
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-site="platform" data-slot="platform-shell" className="min-h-svh">
      <PlatformHeader />
      {children}
      <PlatformFooter />
    </div>
  )
}
