"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Stage } from "@/components/cinematic/stage";

function CinemaStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const line1 = useTransform(scrollYProgress, [0, 0.35], [0.25, 1]);
  const line2 = useTransform(scrollYProgress, [0.2, 0.55], [0.25, 1]);
  const line3 = useTransform(scrollYProgress, [0.4, 0.75], [0.25, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1.02]);

  return (
    <div ref={ref} className="relative h-[220vh]">
      <Stage
        id="cinema"
        tone="theater"
        className="sticky top-0 flex min-h-dvh items-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 cinema-light opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 cinema-grain"
        />

        <motion.div
          style={reduce ? undefined : { scale }}
          className="relative z-10 mx-auto w-full max-w-5xl px-5 md:px-8"
        >
          <p className="font-mono text-xs tracking-[0.22em] text-brand uppercase">
            Cinema
          </p>
          <h2 className="mt-6 space-y-2 text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            <motion.span
              style={reduce ? undefined : { opacity: line1 }}
              className="block text-dock-foreground"
            >
              Media owns the frame.
            </motion.span>
            <motion.span
              style={reduce ? undefined : { opacity: line2 }}
              className="block text-dock-foreground"
            >
              One idea per cut.
            </motion.span>
            <motion.span
              style={reduce ? undefined : { opacity: line3 }}
              className="block text-dock-foreground/55"
            >
              Scroll is the edit.
            </motion.span>
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed tracking-tight text-dock-foreground/55 md:text-lg">
            Borrow the discipline of Apple product films, Tesla interfaces, and
            YouTube immersion — without borrowing their chrome.
          </p>
        </motion.div>
      </Stage>
    </div>
  );
}

export { CinemaStatement };
