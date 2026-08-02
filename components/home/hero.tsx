import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Reveal } from "@/components/cinematic/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Hero() {
  return (
    <Stage tone="theater" className="flex flex-col justify-end">
      <MediaPlane />

      <Reveal className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <Badge
          variant="secondary"
          className="bg-brand/15 font-mono text-[10px] tracking-[0.22em] text-brand uppercase"
        >
          Meridian
        </Badge>

        <h1 className="mt-6 max-w-[12ch] text-[clamp(3rem,10vw,7.25rem)] font-medium leading-[0.9] tracking-[-0.05em] text-dock-foreground">
          ui.byronwade.com
        </h1>

        <p className="mt-8 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/70 md:text-lg">
          Cinematic staging on shadcn — operational density from Polaris,
          Linear, Vercel, Cursor, and OpenAI, without the motion theater.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="rounded-full bg-dock-foreground text-dock hover:bg-dock-foreground/90"
            asChild
          >
            <a href="#cinema">
              Explore
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-dock-foreground/25 bg-transparent text-dock-foreground hover:bg-dock-foreground/10 hover:text-dock-foreground"
            asChild
          >
            <a href="#density">See density</a>
          </Button>
        </div>
      </Reveal>
    </Stage>
  );
}

export { Hero };
