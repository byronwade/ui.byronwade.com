import Link from "next/link";
import { Stage } from "@/components/cinematic/stage";
import { ApplicationShell } from "@/components/surfaces/application-shell";
import { MarketingFrame } from "@/components/surfaces/marketing-frame";
import { MobileFrame } from "@/components/surfaces/mobile-frame";
import { DesktopFrame } from "@/components/surfaces/desktop-frame";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function SurfaceLane() {
  return (
    <Stage id="surfaces" tone="paper" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Surfaces
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] md:text-4xl">
              Same tokens. Density by task.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Application, marketing, mobile, and desktop share primitives —
              hit targets and chrome adapt to the job, not a new visual kit.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/surfaces">Open gallery</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="pointer-events-none">
            <Badge variant="secondary" className="mb-3 font-mono text-[10px]">
              Web · Application
            </Badge>
            <ApplicationShell className="h-[22rem] md:h-[24rem]" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-3 font-mono text-[10px]">
              Web · Marketing
            </Badge>
            <MarketingFrame className="h-[22rem] md:h-[24rem]" />
          </div>
          <div className="pointer-events-none">
            <Badge variant="secondary" className="mb-3 font-mono text-[10px]">
              Mobile Native
            </Badge>
            <MobileFrame />
          </div>
          <div className="pointer-events-none">
            <Badge variant="secondary" className="mb-3 font-mono text-[10px]">
              Desktop Native
            </Badge>
            <DesktopFrame />
          </div>
        </div>
      </div>
    </Stage>
  );
}

export { SurfaceLane };
