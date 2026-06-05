import { CenteredFocal } from "@/components/centered-focal"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <CenteredFocal
      backdrop={<div className="size-72 rounded-full bg-brand/10" />}
    >
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Waiting for data
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the script tag to your site to start seeing activity here.
          </p>
        </div>
        <Button size="sm">Copy script tag</Button>
      </div>
    </CenteredFocal>
  )
}
