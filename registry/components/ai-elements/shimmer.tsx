"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import {
  type CSSProperties,
  type ElementType,
  type JSX,
  memo,
  useMemo,
} from "react";

/**
 * Animated text-shimmer (adapted from Vercel AI Elements). A light sweep glides
 * across muted-foreground text — handy for "thinking…" / streaming states.
 *
 * Token-only: the gradient is built in an inline `style` from `var(--background)`
 * and `var(--muted-foreground)` (the highlight follows whatever the surface and
 * muted text resolve to, so dark mode and re-skins come for free). The base text
 * tone is set via the `tone` variant; size via `size`.
 */
const shimmerVariants = cva(
  "relative inline-block bg-clip-text text-transparent",
  {
    variants: {
      tone: {
        muted: "[--shimmer-base:var(--muted-foreground)]",
        brand: "[--shimmer-base:var(--brand)]",
        foreground: "[--shimmer-base:var(--foreground)]",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
    defaultVariants: {
      tone: "muted",
      size: "default",
    },
  }
);

export type TextShimmerProps = VariantProps<typeof shimmerVariants> & {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
  tone,
  size,
}: TextShimmerProps) => {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread]
  );

  return (
    <MotionComponent
      data-slot="shimmer"
      animate={{ backgroundPosition: "0% center" }}
      className={cn(shimmerVariants({ tone, size }), className)}
      initial={{ backgroundPosition: "100% center" }}
      style={
        {
          "--shimmer-spread": `${dynamicSpread}px`,
          backgroundImage:
            "linear-gradient(90deg, transparent calc(50% - var(--shimmer-spread)), var(--background), transparent calc(50% + var(--shimmer-spread))), linear-gradient(var(--shimmer-base), var(--shimmer-base))",
          backgroundSize: "250% 100%, auto",
          backgroundRepeat: "no-repeat, padding-box",
        } as CSSProperties
      }
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration,
        ease: "linear",
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const Shimmer = memo(ShimmerComponent);
