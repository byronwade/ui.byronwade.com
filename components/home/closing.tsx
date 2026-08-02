import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Reveal } from "@/components/cinematic/reveal";
import { Button } from "@/components/ui/button";

function Closing() {
  return (
    <Stage
      tone="theater"
      className="flex flex-col items-center justify-center px-5 py-32 md:px-8 md:py-40"
    >
      <MediaPlane />
      <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs tracking-[0.22em] text-brand uppercase">
          Next frame
        </p>
        <h2 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-dock-foreground">
          Build the interface. Stage the feeling.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/60">
          Meridian styling on the full shadcn set — ready for catalog, docs, and
          product UI.
        </p>
        <Button
          size="lg"
          className="mt-10 rounded-full bg-dock-foreground text-dock hover:bg-dock-foreground/90"
          asChild
        >
          <a href="#system">
            Back to the system
            <ArrowRight data-icon="inline-end" />
          </a>
        </Button>
      </Reveal>
    </Stage>
  );
}

export { Closing };
