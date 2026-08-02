import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StageTone = "paper" | "theater";

type StageProps = {
  id?: string;
  tone?: StageTone;
  children: ReactNode;
  className?: string;
  /**
   * Full viewport height — hero only.
   * Uses svh (stable), never dvh: dynamic viewport resizes when mobile
   * chrome shows/hides on scroll-direction change and jerks the page.
   */
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
        "relative",
        /* overflow-anchor: reverse-scroll jumps when a tall stage reflows */
        fullBleed && "flex min-h-svh flex-col [overflow-anchor:none]",
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
