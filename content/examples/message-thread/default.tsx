"use client"

import { MessagesProvider } from "@/lib/comms-store"
import { MessageThread } from "@/components/message-thread"

export default function Example() {
  return (
    <div className="flex min-h-[28rem] justify-center p-6">
      <div className="flex h-[26rem] w-full max-w-lg overflow-hidden rounded-2xl bg-card edge">
        <MessagesProvider>
          <MessageThread conversationId="v1" />
        </MessagesProvider>
      </div>
    </div>
  )
}
