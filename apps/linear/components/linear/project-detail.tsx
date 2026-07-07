"use client"

import * as React from "react"
import {
  Calendar,
  Check,
  ChevronDown,
  CircleDashed,
  Hash,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  SignalHigh,
  SmilePlus,
  Tag,
  Target,
  UserCircle2,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const EMOJIS = ["👍", "🙏", "😂", "❤️", "👀", "✅", "😀", "🎉", "🔥", "🚀", "😅", "⚠️"]

function ProjectLogoBlock({ className }: { className?: string }) {
  return (
    <div
      data-slot="linear-project-logo"
      className={cn(
        "flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-[#050505] p-10",
        className
      )}
      aria-label="Logo of AS Mobbin"
    >
      <div className="grid grid-cols-2 items-center font-mono text-5xl font-semibold tracking-tight text-white">
        <span className="border-b-2 border-white pb-2 text-center">AS</span>
        <span className="border-t-2 border-white pt-2 text-center">MOB</span>
      </div>
    </div>
  )
}

type ProjectPropertyRowProps = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function ProjectPropertyRow({ icon, label, value }: ProjectPropertyRowProps) {
  return (
    <div
      data-slot="linear-project-property-row"
      className="flex items-center gap-3 py-1.5 text-sm"
    >
      <span className="flex w-16 shrink-0 items-center gap-1.5 text-muted-foreground">
        {label}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5 text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {value}
      </span>
    </div>
  )
}

function ProjectPropertiesPanel() {
  return (
    <div data-slot="linear-project-panel" className="space-y-6">
      <section>
        <div className="mb-1 flex items-center justify-between">
          <button className="flex items-center gap-1 text-sm font-medium text-foreground">
            Properties
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <Button variant="ghost" size="icon-sm" aria-label="Add property">
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="divide-y divide-border/60">
          <ProjectPropertyRow
            icon={<CircleDashed className="size-3.5" />}
            label="Status"
            value="Backlog"
          />
          <ProjectPropertyRow
            icon={<SignalHigh className="size-3.5" />}
            label="Priority"
            value={<span className="text-muted-foreground">No priority</span>}
          />
          <ProjectPropertyRow
            icon={<UserCircle2 className="size-3.5" />}
            label="Lead"
            value={<span className="text-muted-foreground">Add lead</span>}
          />
          <ProjectPropertyRow
            icon={<Users className="size-3.5" />}
            label="Members"
            value={<span className="text-muted-foreground">Add members</span>}
          />
          <ProjectPropertyRow
            icon={<Calendar className="size-3.5" />}
            label="Dates"
            value={
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                Start <span>→</span> <Target className="size-3.5" /> Target
              </span>
            }
          />
          <ProjectPropertyRow
            icon={
              <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-brand/20 text-[8px] text-brand">
                ●
              </span>
            }
            label="Teams"
            value="AS Mobbin"
          />
          <ProjectPropertyRow
            icon={<Hash className="size-3.5" />}
            label="Slack"
            value={<span className="text-muted-foreground">Slack channel</span>}
          />
          <ProjectPropertyRow
            icon={<Tag className="size-3.5" />}
            label="Labels"
            value={<span className="text-muted-foreground">Add label</span>}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border p-4">
        <div className="mb-2 flex items-center justify-between">
          <button className="flex items-center gap-1 text-sm font-medium text-foreground">
            Milestones
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <Button variant="ghost" size="icon-sm" aria-label="Add milestone">
            <Plus className="size-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Add milestones to organize work within your project and break it into
          more granular stages.{" "}
          <span className="font-medium text-foreground">Learn more</span>
        </p>
      </section>

      <section className="rounded-2xl border border-border p-4">
        <div className="mb-2 flex items-center justify-between">
          <button className="flex items-center gap-1 text-sm font-medium text-foreground">
            Activity
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            See all
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar className="size-4">
            <AvatarFallback className="text-[8px]">A</AvatarFallback>
          </Avatar>
          <span>
            alexsmith.mobbin@gmail.com created the project ·{" "}
            <span className="font-mono">Mar 30</span>
          </span>
        </div>
      </section>
    </div>
  )
}

type ProjectCommentProps = {
  author: string
  timeAgo: string
  edited?: boolean
  body: string
  reactions?: { emoji: string; count: number }[]
  onResolve?: () => void
  onReact?: (emoji: string) => void
  onEditSave?: (value: string) => void
  onDelete?: () => void
}

function ProjectComment({
  author,
  timeAgo,
  edited,
  body,
  reactions = [],
  onResolve,
  onReact,
  onEditSave,
  onDelete,
}: ProjectCommentProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(body)
  const [emojiOpen, setEmojiOpen] = React.useState(false)

  return (
    <div
      data-slot="linear-project-comment"
      className="rounded-2xl border border-border bg-popover p-3 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-5">
          <AvatarFallback className="text-[9px]">A</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-medium text-foreground">{author}</span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {timeAgo}
          {edited ? " (edited)" : ""}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6"
            aria-label="Resolve thread"
            onClick={onResolve}
          >
            <Check className="size-3.5" />
          </Button>
          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-6"
                  aria-label="Add reaction"
                >
                  <SmilePlus className="size-3.5" />
                </Button>
              }
            />
            <PopoverContent
              data-slot="linear-emoji-picker"
              className="w-72 p-2"
              align="start"
            >
              <input
                placeholder="Search emoji…"
                className="mb-2 h-7 w-full rounded-md border border-border bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <p className="px-1 pb-1 text-xs text-muted-foreground">Frequently used</p>
              <div className="grid grid-cols-8 gap-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="flex size-7 items-center justify-center rounded-md text-base hover:bg-muted"
                    onClick={() => {
                      onReact?.(emoji)
                      setEmojiOpen(false)
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-6"
                  aria-label="Comment actions"
                >
                  <MoreHorizontal className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setEditing(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem>Subscribe to thread</DropdownMenuItem>
              <DropdownMenuItem onClick={onResolve}>Resolve thread</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy link to comment</DropdownMenuItem>
              <DropdownMenuItem>Copy content as Markdown</DropdownMenuItem>
              <DropdownMenuItem>New issue from comment…</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={onDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {editing ? (
        <div className="mt-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-16 resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <Button variant="ghost" size="icon-sm" aria-label="Attach">
              <Paperclip className="size-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraft(body)
                  setEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onEditSave?.(draft)
                  setEditing(false)
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-1.5 text-sm text-foreground">{body}</p>
      )}

      {reactions.length > 0 && !editing ? (
        <div className="mt-2 flex items-center gap-1.5">
          {reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              type="button"
              data-slot="linear-comment-reaction"
              className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-xs"
            >
              <span>{reaction.emoji}</span>
              <span className="font-mono text-muted-foreground">{reaction.count}</span>
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6"
            aria-label="Add reaction"
          >
            <SmilePlus className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function ProjectCommentComposer({
  placeholder = "Reply…",
  value,
  onChange,
  onSubmit,
}: {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}) {
  return (
    <div
      data-slot="linear-comment-composer"
      className="flex items-center gap-2 rounded-2xl border border-border bg-popover px-3 py-2 shadow-sm"
    >
      <Avatar className="size-5">
        <AvatarFallback className="text-[9px]">A</AvatarFallback>
      </Avatar>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit?.()
        }}
      />
      <Button
        size="icon-sm"
        className="size-6 rounded-full"
        aria-label="Send"
        disabled={!value.trim()}
        onClick={onSubmit}
      >
        <Send className="size-3.5" />
      </Button>
    </div>
  )
}

export {
  ProjectComment,
  ProjectCommentComposer,
  ProjectLogoBlock,
  ProjectPropertiesPanel,
  ProjectPropertyRow,
}
export type { ProjectCommentProps, ProjectPropertyRowProps }
