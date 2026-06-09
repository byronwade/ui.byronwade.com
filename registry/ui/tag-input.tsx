"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T
  defaultProp: T
  onChange?: (value: T) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? (prop as T) : uncontrolled
  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )
  return [value, setValue] as const
}

const tagInputVariants = cva(
  "flex w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-input/30 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 dark:bg-input/30",
  {
    variants: {
      size: {
        sm: "min-h-7 gap-1 p-1 text-xs",
        default: "min-h-8 gap-1 p-1.5 text-sm",
        lg: "min-h-9 gap-1.5 p-2 text-base",
      },
      error: {
        true: "border-destructive ring-3 ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20 dark:ring-destructive/40",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  },
)

type TagInputTagTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "destructive"

const tagToneVariants: Record<
  TagInputTagTone,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  neutral: "secondary",
  brand: "default",
  success: "success",
  warning: "warning",
  destructive: "destructive",
}

type TagInputProps = {
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  suggestions?: string[]
  tagTones?: Record<string, TagInputTagTone>
  maxTags?: number
  disabled?: boolean
  error?: boolean
  placeholder?: string
  id?: string
  name?: string
  className?: string
} & Pick<VariantProps<typeof tagInputVariants>, "size">

function TagInput({
  value: valueProp,
  defaultValue,
  onChange,
  suggestions = [],
  tagTones = {},
  maxTags,
  size = "default",
  disabled = false,
  error = false,
  placeholder = "Add tag…",
  id,
  name,
  className,
}: TagInputProps) {
  const [tags, setTags] = useControllableState<string[]>({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange,
  })
  const [draft, setDraft] = React.useState("")
  const [highlight, setHighlight] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const atCap = maxTags !== undefined && tags.length >= maxTags
  const inputDisabled = disabled || atCap

  const matches = React.useMemo(() => {
    const query = draft.trim().toLowerCase()
    if (query.length === 0) return []
    return suggestions.filter(
      (s) => s.toLowerCase().includes(query) && !tags.includes(s),
    )
  }, [draft, suggestions, tags])

  const open = matches.length > 0 && !inputDisabled

  // The cap is enforced by disabling the input (and hiding suggestions) at
  // `atCap`, so every `addTag` caller is already gated — no extra guard here.
  function addTag(raw: string) {
    const next = raw.trim()
    if (next.length === 0) return
    if (tags.includes(next)) return
    setTags([...tags, next])
    setDraft("")
    setHighlight(-1)
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const picked = highlight >= 0 ? matches[highlight] : undefined
      addTag(picked ?? draft)
      return
    }
    if (event.key === "Backspace" && draft.length === 0 && tags.length > 0) {
      event.preventDefault()
      removeTag(tags[tags.length - 1])
      return
    }
    if (event.key === "ArrowDown" && open) {
      event.preventDefault()
      setHighlight((h) => (h + 1) % matches.length)
      return
    }
    if (event.key === "ArrowUp" && open) {
      event.preventDefault()
      setHighlight((h) => (h <= 0 ? matches.length - 1 : h - 1))
    }
  }

  return (
    <div data-slot="tag-input" className="relative">
      <div
        data-slot="tag-input-field"
        data-disabled={disabled ? "" : undefined}
        className={cn(tagInputVariants({ size, error }), className)}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => {
          const tone = tagTones[tag] ?? "neutral"

          return (
            <Badge
              key={tag}
              data-slot="tag-input-tag"
              data-tone={tone}
              variant={tagToneVariants[tone]}
              className="gap-1 pr-1"
            >
              {tag}
              <button
                type="button"
                data-slot="tag-input-remove"
                aria-label={`Remove ${tag}`}
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation()
                  removeTag(tag)
                }}
                className="inline-flex size-3.5 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )
        })}
        <input
          ref={inputRef}
          id={id}
          type="text"
          data-slot="tag-input-input"
          aria-label="Add tag"
          aria-invalid={error || undefined}
          disabled={inputDisabled}
          value={draft}
          placeholder={placeholder}
          onChange={(event) => {
            setDraft(event.target.value)
            setHighlight(-1)
          }}
          onKeyDown={onKeyDown}
          className="h-5 min-w-24 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed"
        />
        {name
          ? tags.map((tag) => (
              <input key={tag} type="hidden" name={name} value={tag} />
            ))
          : null}
      </div>

      {open ? (
        <ul
          data-slot="tag-input-suggestions"
          role="listbox"
          className="absolute z-50 mt-1 flex max-h-56 w-full flex-col gap-0.5 overflow-y-auto rounded-lg bg-popover p-1 text-sm text-popover-foreground edge"
        >
          {matches.map((match, index) => (
            <li
              key={match}
              data-slot="tag-input-suggestion"
              role="option"
              aria-selected={index === highlight}
              className={cn(
                "cursor-pointer rounded-sm px-2 py-1 outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                index === highlight && "bg-accent text-accent-foreground",
              )}
              onMouseDown={(event) => {
                event.preventDefault()
                addTag(match)
                inputRef.current?.focus()
              }}
            >
              {match}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export { TagInput, tagInputVariants }
export type { TagInputProps, TagInputTagTone }
