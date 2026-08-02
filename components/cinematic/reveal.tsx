import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/** Lightweight enter fade — CSS only, no scroll choreography. */
function Reveal({ children, className }: RevealProps) {
  return (
    <div
      data-slot="reveal"
      className={cn(
        "animate-in fade-in duration-500 fill-mode-both motion-reduce:animate-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Reveal };
export type { RevealProps };
