import { HeroSection } from "@/components/hero-section";

export default function Example() {
  return (
    <HeroSection
      header={<span className="text-sm font-medium text-muted-foreground">Overview</span>}
    >
      <div className="rounded-xl border border-border p-10 text-center text-muted-foreground">
        Hero content
      </div>
    </HeroSection>
  );
}
