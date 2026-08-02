"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Hero() {
  return (
    <section
      data-slot="hero"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-5 pb-16 pt-28 md:px-8 md:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-0 h-[70vh] w-[80vw] rounded-full bg-brand/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/5 bottom-1/4 h-[50vh] w-[55vw] rounded-full bg-foreground/[0.03] blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs tracking-[0.18em] text-brand uppercase"
        >
          Meridian
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-5 max-w-[14ch] text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.045em] text-foreground"
        >
          ui.byronwade.com
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-md text-base leading-relaxed tracking-tight text-muted-foreground md:text-lg"
        >
          Operational density meets editorial clarity — Polaris, Vercel, Linear,
          Cursor, and OpenAI distilled into one system that none of them own
          alone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a href="#system" className={cn(buttonVariants({ size: "lg" }))}>
            Explore the system
            <ArrowRight />
          </a>
          <a
            href="#density"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            See density
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export { Hero };
