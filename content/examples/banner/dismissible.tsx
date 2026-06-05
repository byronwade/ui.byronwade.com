"use client"

import * as React from "react"

import { Banner } from "@/components/banner"

export default function Example() {
  const [open, setOpen] = React.useState(true)

  if (!open) return null

  return (
    <Banner
      tone="success"
      title="Theme published"
      dismissible
      onDismiss={() => setOpen(false)}
    >
      Your new theme is now live on your online store.
    </Banner>
  )
}
