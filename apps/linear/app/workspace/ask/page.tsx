"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { AskLinearWelcome } from "@/components/linear/ask-linear-welcome"
import { ChatHistoryPopover } from "@/components/linear/chat-history-popover"
import {
  WorkspaceFooterActions,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

const HISTORY_GROUPS = [
  {
    label: "Yesterday",
    items: [
      {
        id: "gen-issues",
        title: "Generate Linear issues from UI design",
        time: "23h",
      },
    ],
  },
  {
    label: "This week",
    items: [
      {
        id: "explain-project",
        title: "Explain project purpose",
        time: "3d",
      },
    ],
  },
]

export default function AskLinearPage() {
  const router = useRouter()
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [activeChat, setActiveChat] = React.useState("gen-issues")

  return (
    <WorkspaceShell
      activeNavId="my-issues"
      showIssueTabs={false}
      onSearch={() => router.push("/workspace/search")}
      onAskLinear={() => router.push("/workspace/ask")}
      onHistory={() => setHistoryOpen((value) => !value)}
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => setHistoryOpen((value) => !value)}
        />
      }
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <AskLinearWelcome
          onSubmit={() => router.push("/workspace/ask/chat")}
        />

        {historyOpen ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-end px-6">
            <div className="pointer-events-auto">
              <ChatHistoryPopover
                groups={HISTORY_GROUPS}
                activeId={activeChat}
                onSelect={(id) => {
                  setActiveChat(id)
                  setHistoryOpen(false)
                  if (id === "explain-project") {
                    router.push("/workspace/ask/chat")
                  }
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </WorkspaceShell>
  )
}
