import { HeroSection } from "@/components/hero-section";

/** HeroSection with a title on the left and a right-aligned action link — the standard
 *  "section heading + navigation shortcut" pattern. */
export default function Example() {
  return (
    <div className="overflow-x-clip w-full">
      <HeroSection
        header={
          <>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm font-semibold text-foreground">Activity</h2>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              See all ›
            </a>
          </>
        }
      >
        <div className="h-40 rounded-xl border border-border bg-card flex items-center justify-center text-sm text-muted-foreground">
          Full-bleed activity chart
        </div>
      </HeroSection>
    </div>
  );
}
