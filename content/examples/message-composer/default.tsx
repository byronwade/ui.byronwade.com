"use client"

import { MessagesProvider } from "@/lib/comms-store"
import { MessageComposer } from "@/components/message-composer"

export default function Example() {
  return (
    <div className="flex min-h-[28rem] justify-center p-6">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card edge">
        <div className="flex min-h-[18rem] items-center justify-center px-6 text-[13px] text-muted-foreground">
          Thread preview area
        </div>
        <MessagesProvider>
          <MessageComposer
            conversationId="v1"
            onPickTemplate={() => undefined}
            onSchedule={() => undefined}
            onAttach={() => undefined}
          />
        </MessagesProvider>
      </div>
    </div>
  )
}
