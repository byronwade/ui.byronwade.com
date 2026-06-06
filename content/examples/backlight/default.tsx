import { Backlight } from "@/components/ui/backlight"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      {/* The glow is a saturated, blurred copy of the child's own pixels, so a
          multi-hue gradient throws a full-spectrum RGB halo, like an ambient
          album backlight. */}
      <Backlight blur={24}>
        <div className="relative size-60 overflow-hidden rounded-3xl bg-gradient-to-br from-chart-1 via-chart-4 to-chart-2">
          {/* extra colour pools so the halo reads full-spectrum, not one hue */}
          <div className="absolute -top-8 -left-6 size-28 rounded-full bg-chart-5 blur-2xl" />
          <div className="absolute -right-4 -bottom-10 size-32 rounded-full bg-chart-3 blur-2xl" />
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 font-mono text-[10px] tracking-widest text-foreground uppercase backdrop-blur">
              Now playing
            </span>
            <div className="flex flex-col gap-0.5 rounded-xl bg-background/85 p-3 backdrop-blur">
              <span className="text-base font-medium tracking-tight text-foreground">
                Spectral Drift
              </span>
              <span className="text-sm text-muted-foreground">byronwade</span>
            </div>
          </div>
        </div>
      </Backlight>
    </div>
  )
}
