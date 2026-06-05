"use client"

import { SubscribeButton } from "@/components/ui/subscribe-button"

export default function Example() {
  return (
    <div className="flex w-72 items-center justify-center">
      <SubscribeButton defaultSubscribed defaultNotification="personalized" />
    </div>
  )
}
