import { HeroSection } from "@/components/hero-section"

/** HeroSection using the `className` prop to override spacing and add a bottom border, shows
 *  how to compose the root section element with utility classes. */
export default function Example() {
  return (
    <div className="overflow-x-clip w-full">
      <HeroSection
        className="space-y-6 border-b border-border pb-8"
        header={
          <h2 className="text-base font-semibold text-foreground">
            Custom spacing via className
          </h2>
        }
      >
        <div className="h-36 rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
          Full-bleed zone, spacing controlled by className prop
        </div>
      </HeroSection>
    </div>
  )
}
