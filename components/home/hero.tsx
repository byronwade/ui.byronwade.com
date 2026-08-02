import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <Stage tone="theater" fullBleed className="flex flex-col justify-end">
      <MediaPlane />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
          Meridian
        </p>

        <h1 className="mt-6 max-w-[12ch] text-[clamp(3rem,10vw,7.25rem)] font-medium leading-[0.9] tracking-[-0.05em] text-dock-foreground">
          ui.byronwade.com
        </h1>

        <p className="mt-8 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/70 md:text-lg">
          One design system across application, marketing, mobile, and desktop —
          cinematic staging on shadcn, without the motion theater.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button variant="theater" size="pill" asChild>
            <a href="/surfaces">
              Explore surfaces
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button variant="theater-outline" size="pill" asChild>
            <a href="#system">System</a>
          </Button>
        </div>
      </div>
    </Stage>
  );
}

export { Hero };
