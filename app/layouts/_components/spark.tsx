// Tiny deterministic inline sparkline for archetype tiles and table rows.
// App-local (no registry/test obligation). Color follows `currentColor`, so set
// `text-brand` / `text-success` on a parent to theme it (and re-skin via --brand).
import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  className,
  fill = false,
  width = 100,
  height = 28,
  strokeWidth = 1.5,
}: {
  data: number[];
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 2;
  const pts = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : 0;
    const y = height - pad - ((d - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-7 w-full overflow-visible", className)}
      aria-hidden
    >
      {fill && <path d={area} className="fill-current opacity-[0.08]" />}
      <path
        d={line}
        className="fill-none stroke-current"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {pts.length > 0 && (
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r={2.5}
          className="fill-current"
        />
      )}
    </svg>
  );
}
