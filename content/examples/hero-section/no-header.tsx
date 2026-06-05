import { HeroSection } from "@/components/hero-section"

/** HeroSection with no header — children fill the full-bleed zone directly. */
export default function Example() {
  return (
    <div className="overflow-x-clip w-full">
      <HeroSection>
        <div className="rounded-xl border border-border bg-muted/40 p-14 text-center text-muted-foreground">
          Hero content without a header row
        </div>
      </HeroSection>
    </div>
  )
}
