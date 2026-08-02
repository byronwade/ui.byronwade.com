import { ArrowRight } from "lucide-react";
import { Surface } from "@/components/surfaces/surface";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function MarketingFrame({ className }: { className?: string }) {
  return (
    <Surface
      id="marketing"
      className={cn(
        "relative flex h-[28rem] flex-col justify-end overflow-hidden rounded-3xl bg-dock text-dock-foreground md:h-[32rem]",
        className,
      )}
    >
      <MediaPlane />
      <div className="relative z-10 space-y-5 p-6 md:p-8">
        <p className="font-mono text-[10px] tracking-[0.2em] text-brand uppercase">
          Marketing
        </p>
        <h3 className="max-w-[12ch] text-3xl font-medium tracking-[-0.04em] md:text-4xl">
          Ship interfaces that feel finished.
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-dock-foreground/65">
          Marketing lane — theater when the product is the subject, never when
          it is decoration.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="theater" size="pill" asChild>
            <a href="/surfaces#marketing">
              Explore
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button variant="theater-outline" size="pill">
            Docs
          </Button>
        </div>
      </div>
    </Surface>
  );
}

export { MarketingFrame };
