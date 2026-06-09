/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original interactive star rating © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: drops @radix-ui for an inlined
 * useControllableState, `data-slot` hooks, and a two-layer fill so the active
 * color follows whatever `text-*` token you set (defaults to the brand accent).
 * Adds fractional/half-star support (display + interactive `allowHalf` select),
 * native form submission via `name`, and a consolidated read-only `RatingBadge`
 * variant (compact score + star) in the spirit of Untitled UI's rating-badge.
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

import { useControllableState } from "@/lib/controllable-state"
import { cn } from "@/lib/utils"

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

type RatingContextValue = {
  value: number
  readOnly: boolean
  allowHalf: boolean
  hoverValue: number | null
  focusedStar: number | null
  handleValueChange: (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
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
    allowHalf,
    hoverValue,
    focusedStar,
    handleValueChange,
    setHoverValue,
    setFocusedStar,
    handleKeyDown,
  } = useRating()

  const index = providedIndex ?? 0
  // Current value driving the visual: hover wins, then keyboard focus, then value.
  const current = hoverValue ?? focusedStar ?? value ?? 0
  // Round to avoid float noise in the rendered width (e.g. 3.7 → "70%", not "70.0000001%").
  const fill = +(clamp(current - index, 0, 1) * 100).toFixed(2)
  const isInteger = !allowHalf

  // Map a pointer position inside the star to the half it points at.
  const halfFromPointer = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1
    return ratio <= 0.5 ? index + 0.5 : index + 1
  }

  const renderIcon = (extra: string) =>
    cloneElement(icon, {
      size,
      className: cn("transition-colors duration-200", extra),
      "aria-hidden": "true",
    })

  const iconLayers = (
    <span data-slot="rating-button-icon" className="relative inline-block">
      {renderIcon(cn(!readOnly && "cursor-pointer", "text-current/35"))}
      <span
        data-slot="rating-button-fill"
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fill}%` }}
      >
        {renderIcon(cn(!readOnly && "cursor-pointer", "fill-current"))}
      </span>
    </span>
  )

  // Half mode: the container is the slider, so each star is a presentational
  // pointer target — not focusable, so `aria-hidden` stays valid for axe.
  if (!isInteger) {
    return (
      <span
        data-slot="rating-button"
        aria-hidden="true"
        className={cn(
          "inline-flex rounded-full p-0.5",
          readOnly ? "cursor-default" : "cursor-pointer",
          className,
        )}
        onClick={
          readOnly
            ? undefined
            : (event) => handleValueChange(event, halfFromPointer(event))
        }
        onMouseMove={
          readOnly
            ? undefined
            : (event) => setHoverValue(halfFromPointer(event))
        }
      >
        {iconLayers}
      </span>
    )
  }

  // Integer mode: accessible radio button with roving tabindex + keyboard.
  let tabIndex = -1
  if (!readOnly) tabIndex = value === index + 1 ? 0 : -1

  return (
    <button
      data-slot="rating-button"
      role="radio"
      aria-checked={value === index + 1}
      aria-label={`${index + 1} star${index === 0 ? "" : "s"}`}
      className={cn(
        "rounded-full p-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
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
      {iconLayers}
    </button>
  )
}

export type RatingProps = {
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => void
  readOnly?: boolean
  /** Allow half-star (0.5-step) display and interactive selection. */
  allowHalf?: boolean
  /** When set, renders a hidden input so the score submits in a native form. */
  name?: string
  className?: string
  children?: ReactNode
}

export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = 0,
  readOnly = false,
  allowHalf = false,
  name,
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

  const total = Children.count(children)
  const step = allowHalf ? 0.5 : 1

  const handleValueChange = useCallback(
    (
      event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
      newValue: number,
    ) => {
      if (readOnly) return
      onValueChange(newValue)
    },
    [readOnly, onValueChange],
  )

  // Shared arrow-key math for both the radio and slider keyboard models.
  const stepValue = useCallback(
    (event: KeyboardEvent<HTMLElement>, base: number) => {
      let newValue = base
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          newValue =
            event.shiftKey || event.metaKey
              ? total
              : clamp(base + step, step, total)
          break
        case "ArrowLeft":
        case "ArrowDown":
          newValue =
            event.shiftKey || event.metaKey
              ? step
              : clamp(base - step, step, total)
          break
        default:
          return null
      }
      event.preventDefault()
      return newValue
    },
    [step, total],
  )

  // Integer (radio) model: roving focus across the star buttons.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (readOnly) return
      const newValue = stepValue(event, focusedStar ?? value ?? 0)
      if (newValue === null) return
      setFocusedStar(newValue)
      handleValueChange(event, newValue)
    },
    [focusedStar, value, readOnly, stepValue, handleValueChange],
  )

  // Half (slider) model: keyboard handled at the container.
  const handleSliderKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (readOnly) return
      const newValue = stepValue(event, value ?? 0)
      if (newValue === null) return
      handleValueChange(event, newValue)
    },
    [readOnly, value, stepValue, handleValueChange],
  )

  useEffect(() => {
    if (allowHalf) return
    if (focusedStar !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll("button")
      buttons[Math.ceil(focusedStar) - 1]?.focus()
    }
  }, [focusedStar, allowHalf])

  const sliderProps = allowHalf
    ? ({
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": total,
        "aria-valuenow": value ?? 0,
        "aria-valuetext": `${value ?? 0} of ${total} stars`,
        "aria-readonly": readOnly || undefined,
        tabIndex: readOnly ? -1 : 0,
        onKeyDown: handleSliderKeyDown,
      } as const)
    : ({ role: "radiogroup" } as const)

  return (
    <RatingContext.Provider
      value={{
        value: value ?? 0,
        readOnly,
        allowHalf,
        hoverValue,
        focusedStar,
        handleValueChange,
        handleKeyDown,
        setHoverValue,
        setFocusedStar,
      }}
    >
      <div
        {...sliderProps}
        data-slot="rating"
        aria-label="Rating"
        className={cn("inline-flex items-center gap-0.5 text-brand", className)}
        onMouseLeave={() => setHoverValue(null)}
        ref={containerRef}
      >
        {Children.map(children, (child, index) => {
          if (!child) return null
          return cloneElement(child as ReactElement<RatingButtonProps>, {
            index,
          })
        })}
        {name ? (
          <input type="hidden" name={name} value={value ?? 0} readOnly />
        ) : null}
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
