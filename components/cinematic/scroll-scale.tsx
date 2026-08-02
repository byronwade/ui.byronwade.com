"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

type ScrollScaleProps = {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
};

function ScrollScale({
  children,
  className,
  from = 0.92,
  to = 1,
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={{ scale, opacity }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

export { ScrollScale };
export type { ScrollScaleProps };
