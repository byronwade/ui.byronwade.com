import { ThemeToggle } from "@/app/_components/theme-toggle";

/** Sticky top bar lifted from SignalRoute's styleguide layout, re-skinned for the showcase. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-foreground">
            <span className="size-1.5 rounded-full bg-brand" />
          </span>
          <span className="text-sm font-medium">Design system</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            · byronwade/ui
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
