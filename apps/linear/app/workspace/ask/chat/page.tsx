"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { AskLinearChatPanel } from "@/components/linear/ask-linear-chat-panel"
import {
  WorkspaceFooterActions,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

export default function AskLinearChatPage() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [reply, setReply] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <WorkspaceShell
      breadcrumbs={[
        { label: "Active Issues", href: "/workspace/teams/as-mobbin/issues" },
        { label: "Explain project purpose" },
      ]}
      activeNavId="as-mobbin-issues"
      showIssueTabs={false}
      onSearch={() => router.push("/workspace/search")}
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-end px-6 pb-6">
        <AskLinearChatPanel
          title="Explain project purpose"
          reply={reply}
          onReplyChange={setReply}
          onClose={() => router.push("/workspace/ask")}
          className="shadow-none"
        >
          <p className="text-right text-sm text-muted-foreground">the first one</p>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">Worked for 3 seconds ▾</p>
            <p className="font-medium">User Insight &amp; Behavior Analytics Dashboard</p>
            <p>
              The project is currently <strong>In Progress</strong> and{" "}
              <strong>on track</strong> for the April milestone.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Discovery &amp; Alignment</strong> — 80% complete
              </li>
              <li>Research synthesis due Apr 8</li>
              <li>Dashboard wireframes in review</li>
            </ul>
            <p>
              Success metrics include activation rate, session depth, and weekly
              active researchers.
            </p>
          </div>
        </AskLinearChatPanel>
      </div>
    </WorkspaceShell>
  )
}
