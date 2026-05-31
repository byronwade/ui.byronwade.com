import { Gauge, scoreTone } from "@/components/ui/gauge";

/**
 * scoreTone(value, [low, high]) maps a 0–100 number to a tone.
 * Default thresholds: <50 → danger, <90 → warning, ≥90 → success.
 * Pass custom thresholds to suit different scales.
 */
export default function Example() {
  const scores = [22, 48, 61, 85, 96];

  return (
    <div className="space-y-6 p-8">
      <div>
        <p className="mb-4 text-sm font-medium">Default thresholds (&lt;50 danger, &lt;90 warning)</p>
        <div className="flex flex-wrap items-center gap-6">
          {scores.map((v) => (
            <div key={v} className="flex flex-col items-center gap-1">
              <Gauge value={v} tone={scoreTone(v)} size={100} thickness={7} />
              <span className="text-xs text-muted-foreground">{scoreTone(v)}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium">Strict thresholds (&lt;70 danger, &lt;95 warning)</p>
        <div className="flex flex-wrap items-center gap-6">
          {scores.map((v) => (
            <div key={v} className="flex flex-col items-center gap-1">
              <Gauge value={v} tone={scoreTone(v, [70, 95])} size={100} thickness={7} />
              <span className="text-xs text-muted-foreground">{scoreTone(v, [70, 95])}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
