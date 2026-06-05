import { HeroSection } from "@/components/hero-section";

/** HeroSection with a multi-metric row in the header and a full-bleed chart area. */
const metrics = [
  { label: "Total Users", value: "24,830", delta: "+12.4%", up: true },
  { label: "Revenue", value: "$91,200", delta: "+8.1%", up: true },
  { label: "Bounce Rate", value: "34.5%", delta: "-2.3%", up: false },
];

export default function Example() {
  return (
    <div className="overflow-x-clip w-full">
      <HeroSection
        header={
          <>
            <div className="flex flex-wrap gap-8">
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  <span className="text-2xl font-semibold tabular-nums">{m.value}</span>
                  <span
                    className={`text-xs font-medium ${
                      m.up ? "text-success" : "text-destructive"
                    }`}
                  >
                    {m.delta}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Full report ›
            </a>
          </>
        }
      >
        <div className="h-48 rounded-xl border border-border bg-gradient-to-b from-success/10 to-transparent flex items-end justify-center pb-6 text-sm text-muted-foreground">
          Full-bleed area chart
        </div>
      </HeroSection>
    </div>
  );
}
