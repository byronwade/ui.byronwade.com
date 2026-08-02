import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StageTone = "paper" | "theater";

type StageProps = {
  id?: string;
  tone?: StageTone;
  children: ReactNode;
  className?: string;
  /** Full viewport height — only for hero/theater moments. */
  fullBleed?: boolean;
};

function Stage({
  id,
  tone = "paper",
  children,
  className,
  fullBleed = false,
}: StageProps) {
  return (
    <section
      id={id}
      data-slot="cinema-stage"
      data-tone={tone}
      className={cn(
        "relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_720px]",
        fullBleed && "min-h-dvh [content-visibility:visible]",
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
