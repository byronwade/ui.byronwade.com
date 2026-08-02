"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  label?: string
  className?: string
  size?: "default" | "sm" | "touch" | "icon-sm" | "icon-touch"
}

async function writeClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const area = document.createElement("textarea")
  area.value = value
  area.setAttribute("readonly", "")
  area.style.position = "fixed"
  area.style.opacity = "0"
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand("copy")
  document.body.removeChild(area)
  if (!ok) throw new Error("Copy failed")
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
      await writeClipboard(value)
      setCopied(true)
      toast.success("Copied")
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error("Couldn’t copy")
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
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {iconOnly ? null : copied ? "Copied" : label}
    </Button>
  )
}

export { CopyButton }
export type { CopyButtonProps }
