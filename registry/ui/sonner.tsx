"use client"

import { useTheme } from "@wrksz/themes/client"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle, CircleNotch, Info, Warning, XCircle } from "@/lib/icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme, theme } = useTheme()
  const sonnerTheme = resolvedTheme ?? theme ?? "light"

  return (
    // data-slot is declarative here: sonner's ToasterProps doesn't extend
    // HTMLAttributes, so it isn't forwarded to the rendered [data-sonner-toaster]
    // root. Kept for source-level consistency with the rest of the system.
    <Sonner
      data-slot="sonner"
      theme={sonnerTheme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" />,
        info: <Info className="size-4" />,
        warning: <Warning className="size-4" />,
        error: <XCircle className="size-4" />,
        loading: <CircleNotch className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
