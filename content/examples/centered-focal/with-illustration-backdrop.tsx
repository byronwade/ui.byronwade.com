import { CenteredFocal } from "@/components/centered-focal"
import { Button } from "@/components/ui/button"

function GridBackdrop() {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      className="text-border"
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 44 + 22}
            y={row * 44 + 22}
            width="8"
            height="8"
            rx="2"
            fill="currentColor"
          />
        )),
      )}
    </svg>
  )
}

export default function Example() {
  return (
    <CenteredFocal backdrop={<GridBackdrop />}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Connect your data source
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a source to start streaming events into your workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Get started</Button>
          <Button variant="ghost" size="sm">
            View docs
          </Button>
        </div>
      </div>
    </CenteredFocal>
  )
}
