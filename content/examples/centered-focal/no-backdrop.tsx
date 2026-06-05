import { CenteredFocal } from "@/components/centered-focal"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <CenteredFocal>
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            No messages yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your inbox is empty. New messages will appear here.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Compose message
        </Button>
      </div>
    </CenteredFocal>
  )
}
