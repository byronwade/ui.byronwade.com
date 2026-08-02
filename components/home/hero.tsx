import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Workbench } from "@/components/surfaces/workbench";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <Stage
      tone="theater"
      fullBleed
      className="justify-end pb-10 md:justify-center md:pb-0"
    >
      <MediaPlane />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 pt-24 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] md:items-end md:gap-12 md:px-8 md:pt-28 lg:items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
            Meridian
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,7vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.045em] text-dock-foreground">
            A theme system for AIs.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed tracking-tight text-dock-foreground/70">
            Not another custom component zoo — tokens, surfaces,{" "}
            <span className="font-mono text-dock-foreground/90">design.md</span>
            , skills, and agents so models ship on-brand UI.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="theater" size="pill" asChild>
              <a href="/theme">
                Theme showcase
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button variant="theater-outline" size="pill" asChild>
              <a href="/for-agents">For agents</a>
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block" aria-hidden>
          <div className="absolute -inset-3 rounded-[1.35rem] bg-dock-foreground/5" />
          <Workbench className="pointer-events-none relative h-[22rem] shadow-none md:h-[26rem]" />
        </div>
      </div>
    </Stage>
  );
}

export { Hero };
