/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original interactive star rating © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: drops @radix-ui for an inlined
 * useControllableState, `data-slot` hooks, `fill-current` so the active color
 * follows whatever `text-*` token you set (defaults to the brand accent). Adds a
 * consolidated read-only `RatingBadge` variant (compact score + star) in the
 * spirit of Untitled UI's rating-badge.
 */
"use client"

import { type LucideProps, StarIcon } from "lucide-react"
import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode } from "react"
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T
  defaultProp: T
  onChange?: (value: T) => void
}) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? (prop as T) : uncontrolled
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )
  return [value, setValue] as const
}

type RatingContextValue = {
  value: number
  readOnly: boolean
  hoverValue: number | null
  focusedStar: number | null
  handleValueChange: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number,
  ) => void
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  setHoverValue: (value: number | null) => void
  setFocusedStar: (value: number | null) => void
}

const RatingContext = createContext<RatingContextValue | null>(null)

const useRating = () => {
  const context = useContext(RatingContext)
  if (!context) {
    throw new Error("useRating must be used within a Rating component")
  }
  return context
}

export type RatingButtonProps = LucideProps & {
  index?: number
  icon?: ReactElement<LucideProps>
}

export const RatingButton = ({
  index: providedIndex,
  size = 20,
  className,
  icon = <StarIcon />,
}: RatingButtonProps) => {
  const {
    value,
    readOnly,
    hoverValue,
    focusedStar,
    handleValueChange,
    setHoverValue,
    setFocusedStar,
    handleKeyDown,
  } = useRating()

  const index = providedIndex ?? 0
  const isActive = index < (hoverValue ?? focusedStar ?? value ?? 0)
  let tabIndex = -1
  if (!readOnly) tabIndex = value === index + 1 ? 0 : -1

  return (
    <button
      data-slot="rating-button"
      role="radio"
      aria-checked={value === index + 1}
      aria-label={`${index + 1} star${index === 0 ? "" : "s"}`}
      className={cn(
        "rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        readOnly && "cursor-default",
        className,
      )}
      disabled={readOnly}
      onBlur={() => setFocusedStar(null)}
      onClick={(event) => handleValueChange(event, index + 1)}
      onFocus={() => setFocusedStar(index + 1)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => !readOnly && setHoverValue(index + 1)}
      tabIndex={tabIndex}
      type="button"
    >
      {cloneElement(icon, {
        size,
        className: cn(
          "transition-colors duration-200",
          isActive && "fill-current",
          !readOnly && "cursor-pointer",
        ),
        "aria-hidden": "true",
      })}
    </button>
  )
}

export type RatingProps = {
  defaultValue?: number
  value?: number
  onChange?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number,
  ) => void
  onValueChange?: (value: number) => void
  readOnly?: boolean
  className?: string
  children?: ReactNode
}

export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = 0,
  onChange,
  readOnly = false,
  className,
  children,
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [focusedStar, setFocusedStar] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [value, onValueChange] = useControllableState<number>({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange,
  })

  const handleValueChange = useCallback(
    (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
      newValue: number,
    ) => {
      if (readOnly) return
      onChange?.(event, newValue)
      onValueChange(newValue)
    },
    [readOnly, onChange, onValueChange],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (readOnly) return
      const total = Children.count(children)
      let newValue = focusedStar !== null ? focusedStar : (value ?? 0)
      switch (event.key) {
        case "ArrowRight":
          newValue =
            event.shiftKey || event.metaKey
              ? total
              : Math.min(total, newValue + 1)
          break
        case "ArrowLeft":
          newValue =
            event.shiftKey || event.metaKey ? 1 : Math.max(1, newValue - 1)
          break
        default:
          return
      }
      event.preventDefault()
      setFocusedStar(newValue)
      handleValueChange(event, newValue)
    },
    [focusedStar, value, children, readOnly, handleValueChange],
  )

  useEffect(() => {
    if (focusedStar !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll("button")
      buttons[focusedStar - 1]?.focus()
    }
  }, [focusedStar])

  return (
    <RatingContext.Provider
      value={{
        value: value ?? 0,
        readOnly,
        hoverValue,
        focusedStar,
        handleValueChange,
        handleKeyDown,
        setHoverValue,
        setFocusedStar,
      }}
    >
      <div
        data-slot="rating"
        aria-label="Rating"
        className={cn("inline-flex items-center gap-0.5 text-brand", className)}
        onMouseLeave={() => setHoverValue(null)}
        ref={containerRef}
        role="radiogroup"
      >
        {Children.map(children, (child, index) => {
          if (!child) return null
          return cloneElement(child as ReactElement<RatingButtonProps>, {
            index,
          })
        })}
      </div>
    </RatingContext.Provider>
  )
}

export type RatingBadgeProps = {
  /** Score to display, e.g. 4.8. */
  value: number
  /** Denominator shown after the score (omit to hide). */
  max?: number
  /** Optional review count, shown muted in parentheses. */
  count?: number
  className?: string
}

/**
 * Compact, read-only score badge (star + number) — the consolidated
 * "rating-badge" variant. Tone follows the brand accent via `text-brand`.
 */
export const RatingBadge = ({
  value,
  max,
  count,
  className,
}: RatingBadgeProps) => (
  <span
    data-slot="rating-badge"
    className={cn(
      "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums",
      className,
    )}
  >
    <StarIcon aria-hidden="true" className="size-3 fill-current text-brand" />
    <span>{value.toFixed(1)}</span>
    {max ? <span className="text-muted-foreground">/ {max}</span> : null}
    {count !== undefined ? (
      <span className="text-muted-foreground">({count})</span>
    ) : null}
  </span>
)
