import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/** Pass-through wrapper — keep motion out of the scroll path. */
function Reveal({ children, className }: RevealProps) {
  return (
    <div data-slot="reveal" className={cn(className)}>
      {children}
    </div>
  );
}

export { Reveal };
export type { RevealProps };
