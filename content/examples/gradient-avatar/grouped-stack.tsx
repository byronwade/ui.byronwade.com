import { GradientAvatar } from "@/components/ui/gradient-avatar"

const participants = ["atlas-a", "beacon-b", "cedar-c", "dune-d", "echo-e"]
const overflow = 8

// Cut a clean notch out of each disc where the next element overlaps it, so the
// stack shows a crisp background gap instead of the underlying disc's dark edge.
// (size-8 = 32px discs, -8px overlap → the next element is centered at 40px with
// a 16px radius; the 18px notch leaves a ~2px gap around it.)
const NOTCH =
  "radial-gradient(circle 18px at 40px 16px, transparent 17px, #000 18px)"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Overlapping avatar stack */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Collaborators
        </p>
        <div className="flex items-center">
          {participants.map((seed, i) => (
            <span
              key={seed}
              className="inline-flex rounded-full"
              style={{
                marginLeft: i === 0 ? 0 : "-8px",
                zIndex: i,
                maskImage: NOTCH,
                WebkitMaskImage: NOTCH,
              }}
            >
              <GradientAvatar seed={seed} size="md" />
            </span>
          ))}
          <span
            className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold ring-2 ring-background"
            style={{ marginLeft: "-8px", zIndex: participants.length }}
          >
            +{overflow}
          </span>
        </div>
      </div>

      {/* Flat row with names */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recently Active
        </p>
        <div className="flex gap-4">
          {participants.slice(0, 3).map((seed) => (
            <div key={seed} className="flex flex-col items-center gap-1.5">
              <GradientAvatar seed={seed} size="lg" />
              <span className="text-xs text-muted-foreground capitalize">
                {seed.split("-")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
