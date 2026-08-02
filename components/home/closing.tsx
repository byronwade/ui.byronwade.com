import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Button } from "@/components/ui/button";

function Closing() {
  return (
    <Stage
      tone="theater"
      className="relative px-5 py-28 md:px-8 md:py-36"
    >
      <MediaPlane />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
          Meridian
        </p>
        <h2 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-dock-foreground">
          Fewer decisions. Clearer product UI.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-dock-foreground/60">
          Useful by default. Meaningful signals. Proven in the workbench — not
          a mood board of other brands.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button variant="theater" size="pill" asChild>
            <a href="#workbench">
              Back to workbench
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button variant="theater-outline" size="pill" asChild>
            <a href="/surfaces">Surfaces</a>
          </Button>
        </div>
      </div>
    </Stage>
  );
}

export { Closing };
