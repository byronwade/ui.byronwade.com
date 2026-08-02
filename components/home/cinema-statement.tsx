import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Reveal } from "@/components/cinematic/reveal";
import { Separator } from "@/components/ui/separator";

function CinemaStatement() {
  return (
    <Stage
      id="cinema"
      tone="theater"
      className="flex min-h-dvh flex-col justify-center"
    >
      <MediaPlane />

      <Reveal className="relative z-10 mx-auto w-full max-w-5xl px-5 md:px-8">
        <p className="font-mono text-xs tracking-[0.22em] text-brand uppercase">
          Cinema
        </p>
        <h2 className="mt-6 space-y-3 text-[clamp(2rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.04em]">
          <span className="block text-dock-foreground">
            Media owns the frame.
          </span>
          <span className="block text-dock-foreground">One idea per cut.</span>
          <span className="block text-dock-foreground/55">
            Style over spectacle.
          </span>
        </h2>
        <Separator className="my-8 max-w-xs bg-dock-foreground/15" />
        <p className="max-w-lg text-base leading-relaxed tracking-tight text-dock-foreground/55 md:text-lg">
          Apple framing, Tesla theater, YouTube-scale media — composed as still
          stages. Simple fades only. No scroll choreography.
        </p>
      </Reveal>
    </Stage>
  );
}

export { CinemaStatement };
