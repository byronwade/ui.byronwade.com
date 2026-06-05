/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: the indicator/delta colors map to
 * semantic tokens (success/destructive/warning/brand) instead of raw
 * emerald/rose/amber/sky, composes the house avatar/badge/button, and each part
 * carries a `data-slot`.
 */
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PillProps = ComponentProps<typeof Badge> & {
  themed?: boolean;
};

export const Pill = ({ variant = "secondary", className, ...props }: PillProps) => (
  <Badge
    data-slot="pill"
    className={cn("gap-2 rounded-full px-3 py-1.5 font-normal", className)}
    variant={variant}
    {...props}
  />
);

export type PillAvatarProps = ComponentProps<typeof AvatarImage> & {
  fallback?: string;
};

export const PillAvatar = ({ fallback, className, ...props }: PillAvatarProps) => (
  <Avatar data-slot="pill-avatar" className={cn("-ml-1 h-4 w-4", className)}>
    <AvatarImage {...props} />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

export type PillButtonProps = ComponentProps<typeof Button>;

export const PillButton = ({ className, ...props }: PillButtonProps) => (
  <Button
    data-slot="pill-button"
    className={cn("-my-2 -mr-2 size-6 rounded-full p-0.5 hover:bg-foreground/5", className)}
    size="icon"
    variant="ghost"
    {...props}
  />
);

export type PillStatusProps = {
  children: ReactNode;
  className?: string;
};

export const PillStatus = ({ children, className, ...props }: PillStatusProps) => (
  <div
    data-slot="pill-status"
    className={cn("flex items-center gap-2 border-r pr-2 font-medium", className)}
    {...props}
  >
    {children}
  </div>
);

type PillTone = "success" | "error" | "warning" | "info";

// Semantic token per tone — the accent (success/info) follows --brand, so these
// re-skin with the system instead of being pinned to raw greens/blues.
const toneDot: Record<PillTone, string> = {
  success: "bg-success",
  error: "bg-destructive",
  warning: "bg-warning",
  info: "bg-brand",
};

export type PillIndicatorProps = {
  variant?: PillTone;
  pulse?: boolean;
};

export const PillIndicator = ({
  variant = "success",
  pulse = false,
}: PillIndicatorProps) => (
  <span data-slot="pill-indicator" className="relative flex size-2">
    {pulse && (
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          toneDot[variant],
        )}
      />
    )}
    <span className={cn("relative inline-flex size-2 rounded-full", toneDot[variant])} />
  </span>
);

export type PillDeltaProps = {
  className?: string;
  delta: number;
};

export const PillDelta = ({ className, delta }: PillDeltaProps) => {
  if (!delta) {
    return <MinusIcon data-slot="pill-delta" className={cn("size-3 text-muted-foreground", className)} />;
  }
  if (delta > 0) {
    return <ChevronUpIcon data-slot="pill-delta" className={cn("size-3 text-success", className)} />;
  }
  return <ChevronDownIcon data-slot="pill-delta" className={cn("size-3 text-destructive", className)} />;
};

export type PillIconProps = {
  icon: typeof ChevronUpIcon;
  className?: string;
};

export const PillIcon = ({ icon: Icon, className, ...props }: PillIconProps) => (
  <Icon data-slot="pill-icon" className={cn("size-3 text-muted-foreground", className)} size={12} {...props} />
);

export type PillAvatarGroupProps = {
  children: ReactNode;
  className?: string;
};

export const PillAvatarGroup = ({ children, className, ...props }: PillAvatarGroupProps) => (
  <div
    data-slot="pill-avatar-group"
    className={cn(
      "-space-x-1 flex items-center",
      "[&>*:not(:first-of-type)]:[mask-image:radial-gradient(circle_9px_at_-4px_50%,transparent_99%,white_100%)]",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
