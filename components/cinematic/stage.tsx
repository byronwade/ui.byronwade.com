import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StageTone = "paper" | "theater";

type StageProps = {
  id?: string;
  tone?: StageTone;
  children: ReactNode;
  className?: string;
  fullBleed?: boolean;
};

function Stage({
  id,
  tone = "paper",
  children,
  className,
  fullBleed = true,
}: StageProps) {
  return (
    <section
      id={id}
      data-slot="cinema-stage"
      data-tone={tone}
      className={cn(
        "relative overflow-hidden",
        fullBleed && "min-h-dvh",
        tone === "theater"
          ? "bg-dock text-dock-foreground"
          : "bg-background text-foreground",
        className,
      )}
    >
      {children}
    </section>
  );
}

export { Stage };
export type { StageProps, StageTone };
