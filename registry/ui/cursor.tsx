/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system: token surfaces (bg-secondary /
 * text-foreground), `cn()` + `className` passthrough, and `data-slot` hooks.
 * The pointer uses `currentColor`, so a live cursor is tinted via `text-*`.
 */
"use client"

import {
  Children,
  createContext,
  type HTMLAttributes,
  type SVGProps,
  useContext,
} from "react"

import { cn } from "@/lib/utils"

// Multiplayer cursors need distinct, coherent colors. `tone` colors the pointer
// (via currentColor on the root) and the body surface from one prop, using only
// token pairs that have a readable foreground. `neutral` is the original look.
type CursorTone = "neutral" | "brand" | "success" | "warning"

const cursorRootTone: Record<CursorTone, string> = {
  neutral: "",
  brand: "text-brand",
  success: "text-success",
  warning: "text-warning",
}

const cursorBodyTone: Record<CursorTone, string> = {
  neutral: "bg-secondary text-foreground",
  brand: "bg-brand text-brand-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
}

const CursorToneContext = createContext<CursorTone>("neutral")

export type CursorProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: CursorTone
}

export const Cursor = ({
  className,
  children,
  tone = "neutral",
  ...props
}: CursorProps) => (
  <CursorToneContext.Provider value={tone}>
    <span
      data-slot="cursor"
      className={cn(
        "pointer-events-none relative select-none",
        cursorRootTone[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  </CursorToneContext.Provider>
)

export type CursorPointerProps = SVGProps<SVGSVGElement>

export const CursorPointer = ({ className, ...props }: CursorPointerProps) => (
  <svg
    aria-hidden="true"
    data-slot="cursor-pointer"
    className={cn("size-3.5", className)}
    fill="none"
    focusable="false"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"
      fill="currentColor"
    />
  </svg>
)

export type CursorBodyProps = HTMLAttributes<HTMLSpanElement>

export const CursorBody = ({
  children,
  className,
  ...props
}: CursorBodyProps) => {
  const tone = useContext(CursorToneContext)
  return (
    <span
      data-slot="cursor-body"
      className={cn(
        "relative ml-3.5 flex flex-col whitespace-nowrap rounded-xl py-1 pr-3 pl-2.5 text-xs",
        Children.count(children) > 1 &&
          "rounded-tl [&>:first-child]:opacity-70",
        cursorBodyTone[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export type CursorNameProps = HTMLAttributes<HTMLSpanElement>

export const CursorName = ({ className, ...props }: CursorNameProps) => (
  <span
    data-slot="cursor-name"
    className={cn("font-medium", className)}
    {...props}
  />
)

export type CursorMessageProps = HTMLAttributes<HTMLSpanElement>

export const CursorMessage = ({ className, ...props }: CursorMessageProps) => (
  <span
    data-slot="cursor-message"
    className={cn("text-muted-foreground", className)}
    {...props}
  />
)
