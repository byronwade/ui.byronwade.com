import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Button } from "@/components/ui/button";

function Closing() {
  return (
    <Stage
      tone="theater"
      className="relative flex flex-col items-center justify-center px-5 py-28 md:px-8 md:py-36"
    >
      <MediaPlane />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
          Next frame
        </p>
        <h2 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-dock-foreground">
          Four lanes. One philosophy.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/60">
          Application, marketing, mobile, and desktop — same tokens, same
          primitives, clean everywhere.
        </p>
        <Button variant="theater" size="pill" className="mt-10" asChild>
          <a href="/surfaces">
            Open surfaces
            <ArrowRight data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </Stage>
  );
}

export { Closing };
