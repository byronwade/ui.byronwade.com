"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  label?: string
  className?: string
  size?: "default" | "sm" | "touch" | "icon-sm" | "icon-touch"
}

function CopyButton({
  value,
  label = "Copy",
  className,
  size = "touch",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const iconOnly = size === "icon-sm" || size === "icon-touch"

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={onCopy}
      className={cn(className)}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
      {iconOnly ? null : copied ? "Copied" : label}
    </Button>
  )
}

export { CopyButton }
export type { CopyButtonProps }
