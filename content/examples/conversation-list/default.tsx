"use client"

import { MessagesProvider } from "@/lib/comms-store"
import { ConversationList } from "@/components/conversation-list"

export default function Example() {
  return (
    <div className="flex min-h-[28rem] justify-center p-6">
      <div className="h-[26rem] w-80 overflow-hidden rounded-2xl bg-card edge">
        <MessagesProvider>
          <ConversationList />
        </MessagesProvider>
      </div>
    </div>
  )
}
