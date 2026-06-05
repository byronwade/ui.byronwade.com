"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Soft tonal treatment — mirrors StatusPill (`bg-<tone>/10` + `text-<tone>`) so
// the banner reads as native to the design system. `info` resolves to `--brand`
// like every other accent (never a literal blue); `critical` reuses
// `--destructive`. Color lives in the surface tint + icon; body copy stays
// `foreground`/`muted` so the block never turns rainbow.
const bannerVariants = cva(
  "group/banner relative flex w-full gap-3 rounded-lg text-left text-sm",
  {
    variants: {
      tone: {
        info: "bg-brand/10 text-foreground",
        success: "bg-success/10 text-foreground",
        warning: "bg-warning/10 text-foreground",
        critical: "bg-destructive/10 text-foreground",
      },
      variant: {
        prominent: "edge p-4",
        inline: "px-3 py-2",
      },
    },
    defaultVariants: {
      tone: "info",
      variant: "prominent",
    },
  },
)

const toneIconClass: Record<BannerTone, string> = {
  info: "text-brand",
  success: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
}

const toneIcon: Record<BannerTone, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  critical: XCircle,
}

type BannerTone = "info" | "success" | "warning" | "critical"

type BannerProps = Omit<React.ComponentProps<"div">, "title"> &
  Omit<VariantProps<typeof bannerVariants>, "tone"> & {
    tone?: BannerTone
    title?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
    /** Override the leading status icon, or pass `false`/`null` to hide it. */
    icon?: React.ReactNode
    actions?: React.ReactNode
  }

function Banner({
  className,
  tone = "info",
  variant = "prominent",
  title,
  dismissible = false,
  onDismiss,
  icon,
  actions,
  children,
  ...props
}: BannerProps) {
  const Icon = toneIcon[tone]
  const showIcon = icon !== false && icon !== null
  const leadingIcon =
    icon === undefined ? (
      <Icon className={cn("size-4", toneIconClass[tone])} aria-hidden />
    ) : (
      icon
    )

  return (
    <div
      data-slot="banner"
      data-tone={tone}
      role={tone === "critical" ? "alert" : "status"}
      className={cn(bannerVariants({ tone, variant }), className)}
      {...props}
    >
      {showIcon && (
        <span
          data-slot="banner-icon"
          className="mt-0.5 flex shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          {leadingIcon}
        </span>
      )}

      <div data-slot="banner-content" className="flex min-w-0 flex-1 flex-col gap-1">
        {title && (
          <p data-slot="banner-title" className="font-medium leading-snug">
            {title}
          </p>
        )}
        {children && (
          <div
            data-slot="banner-body"
            className="text-sm leading-snug text-muted-foreground"
          >
            {children}
          </div>
        )}
        {actions && (
          <div
            data-slot="banner-actions"
            className="mt-2 flex flex-wrap items-center gap-2"
          >
            {actions}
          </div>
        )}
      </div>

      {dismissible && (
        <Button
          data-slot="banner-dismiss"
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="-mt-1 -mr-1 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </Button>
      )}
    </div>
  )
}

export { Banner, bannerVariants }
export type { BannerProps, BannerTone }
