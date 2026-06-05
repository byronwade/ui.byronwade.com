import { CenteredFocal } from "@/components/centered-focal"

function PulsingRings() {
  return (
    <div
      className="relative flex size-48 items-center justify-center"
      aria-hidden
    >
      <div className="absolute size-48 animate-ping rounded-full bg-brand/10 [animation-duration:2s]" />
      <div className="absolute size-36 animate-ping rounded-full bg-brand/15 [animation-duration:2s] [animation-delay:0.3s]" />
      <div className="absolute size-24 animate-ping rounded-full bg-brand/20 [animation-duration:2s] [animation-delay:0.6s]" />
    </div>
  )
}

export default function Example() {
  return (
    <CenteredFocal backdrop={<PulsingRings />}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full border border-border bg-card">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin text-muted-foreground"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Syncing data&hellip;
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This may take a few seconds.
          </p>
        </div>
      </div>
    </CenteredFocal>
  )
}
