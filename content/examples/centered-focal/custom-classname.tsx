import { CenteredFocal } from "@/components/centered-focal"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <CenteredFocal
      className="min-h-[40vh] bg-muted/30"
      backdrop={
        <div className="flex gap-3 opacity-40">
          {[80, 120, 96, 112, 64].map((h, i) => (
            <div
              key={i}
              className="w-8 rounded-full bg-brand/40"
              style={{ height: h }}
            />
          ))}
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-full bg-brand/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            No activity yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Charts will appear once your integration starts sending events.
          </p>
        </div>
        <Button size="sm" variant="outline">
          View setup guide
        </Button>
      </div>
    </CenteredFocal>
  )
}
