"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Stage } from "@/components/cinematic/stage";
import { MediaPlane } from "@/components/cinematic/media-plane";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Hero() {
  const reduce = useReducedMotion();

  return (
    <Stage tone="theater" className="flex flex-col justify-end">
      <MediaPlane />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs tracking-[0.22em] text-brand uppercase"
        >
          Meridian
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-6 max-w-[12ch] text-[clamp(3rem,10vw,7.25rem)] font-medium leading-[0.9] tracking-[-0.05em] text-dock-foreground"
        >
          ui.byronwade.com
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 max-w-md text-base leading-relaxed tracking-tight text-dock-foreground/70 md:text-lg"
        >
          Operational density, staged like film — Apple cuts, Tesla theater,
          YouTube-scale media, bound by one design system.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: 0.34,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#cinema"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-dock-foreground text-dock hover:bg-dock-foreground/90",
            )}
          >
            Enter the reel
            <ArrowRight />
          </a>
          <a
            href="#density"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-dock-foreground/20 text-dock-foreground hover:bg-dock-foreground/10",
            )}
          >
            See density
          </a>
        </motion.div>
      </div>
    </Stage>
  );
}

export { Hero };
