"use client"

import * as React from "react"

import { useControllableState } from "@/lib/controllable-state"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface CommentComposerProps
  extends Omit<
    React.ComponentProps<"div">,
    "onSubmit" | "defaultValue" | "onChange"
  > {
  avatarSrc?: string
  currentUserName?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onCancel?: () => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  submitLabel?: string
  cancelLabel?: string
}

/** Derive avatar fallback initials from a display name (max two letters). */
function initials(name?: string) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function CommentComposer({
  avatarSrc,
  currentUserName,
  placeholder = "Add a comment…",
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  onCancel,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  submitLabel = "Comment",
  cancelLabel = "Cancel",
  className,
  ...props
}: CommentComposerProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const currentValue = isControlled ? value : internalValue

  const [focused, setFocused] = React.useState(false)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  const hasValue = currentValue.trim().length > 0
  const resolvedOpen = openProp !== undefined ? open : open || focused || hasValue

  function setValue(next: string) {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  function handleSubmit() {
    onSubmit?.(currentValue)
    if (!isControlled) setInternalValue("")
  }

  function handleCancel() {
    onCancel?.()
    if (!isControlled) setInternalValue("")
    setFocused(false)
    setOpen(false)
  }

  function handleFocus() {
    setFocused(true)
    if (openProp === undefined) setOpen(true)
  }

  return (
    <div
      data-slot="comment-composer"
      className={cn("flex items-start gap-3", className)}
      {...props}
    >
      <Avatar data-slot="comment-composer-avatar">
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={currentUserName} /> : null}
        <AvatarFallback>{initials(currentUserName)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <textarea
          data-slot="comment-composer-input"
          aria-label={placeholder}
          rows={1}
          placeholder={placeholder}
          value={currentValue}
          onChange={(event) => setValue(event.target.value)}
          onFocus={handleFocus}
          className={cn(
            "field-sizing-content min-h-9 w-full resize-none border-0 border-b border-border bg-transparent py-1.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-foreground",
          )}
        />

        {resolvedOpen ? (
          <div
            data-slot="comment-composer-actions"
            className="flex items-center justify-end gap-2"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!hasValue}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { CommentComposer }
export type { CommentComposerProps }
