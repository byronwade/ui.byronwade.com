import type * as React from "react"

type OverflowMenuItem = {
  key: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

export type { OverflowMenuItem }
