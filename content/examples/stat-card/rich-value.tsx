import { StatCard } from "@/components/stat-card";

/**
 * The `value` prop accepts any ReactNode.
 * This example shows formatted currency, a two-part display, and a colored status inline.
 */
export default function Example() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 max-w-2xl">
      {/* Currency with superscript symbol */}
      <StatCard
        label="Monthly Revenue"
        value={
          <span className="flex items-start gap-0.5">
            <span className="mt-1 text-base font-semibold text-muted-foreground">$</span>
            <span>84,312</span>
          </span>
        }
        delta={{ value: "+9.1%", direction: "up" }}
        hint="USD, excl. taxes"
      />

      {/* Fraction display */}
      <StatCard
        label="Tasks Complete"
        value={
          <span className="flex items-baseline gap-1">
            <span>142</span>
            <span className="text-base font-normal text-muted-foreground">/ 160</span>
          </span>
        }
        hint="88% done this sprint"
      />

      {/* Inline colored status badge */}
      <StatCard
        label="Incident Status"
        value={
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-success" />
            <span>Resolved</span>
          </span>
        }
        hint="last updated 3 min ago"
      />
    </div>
  );
}
