import { HeroSection } from "@/components/hero-section"

export default function Example() {
  return (
    <div className="overflow-x-clip w-full">
      <HeroSection
        header={
          <span className="text-sm font-medium text-muted-foreground">
            Overview
          </span>
        }
      >
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          Full-bleed hero content
        </div>
      </HeroSection>
    </div>
  )
}
