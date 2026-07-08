"use client"

import * as React from "react"
import {
  AtSign,
  Bold,
  Calendar,
  Check,
  ChevronDown,
  CircleDashed,
  Code,
  FileText,
  Hash,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  Maximize2,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  SignalHigh,
  SmilePlus,
  Strikethrough,
  Tag,
  Target,
  TextQuote,
  Underline,
  UserCircle2,
  Users,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const EMOJIS = ["👍", "🙏", "😂", "❤️", "👀", "✅", "😀", "🎉", "🔥", "🚀", "😅", "⚠️"]

function ProjectLogoBlock({ className }: { className?: string }) {
  return (
    <div
      data-slot="linear-project-logo"
      className={cn(
        "flex aspect-square w-full max-w-md items-center justify-center rounded-lg bg-background p-10",
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

      <section className="rounded-lg border border-border p-4">
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

      <section
        data-slot="linear-project-progress"
        className="rounded-lg border border-border p-4"
      >
        <button className="mb-3 flex items-center gap-1 text-sm font-medium text-foreground">
          Progress
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
        <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-0.5">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-[2px] bg-muted-foreground" />
              Scope
            </p>
            <p className="font-mono text-foreground">1</p>
          </div>
          <div className="space-y-0.5">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-[2px] bg-brand" />
              Completed
            </p>
            <p className="font-mono text-foreground">0</p>
          </div>
        </div>
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-muted/40 p-0.5 text-xs">
          <button className="rounded-md bg-card px-2 py-1 text-foreground">
            Assignees
          </button>
          <button className="rounded-md px-2 py-1 text-muted-foreground">
            Labels
          </button>
        </div>
        <div className="flex items-center justify-between py-1 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <UserCircle2 className="size-3.5" />
            No assignee
          </span>
          <span className="font-mono text-muted-foreground">1</span>
        </div>
      </section>

      <section className="rounded-lg border border-border p-4">
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
  onNewIssue?: () => void
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
  onNewIssue,
}: ProjectCommentProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(body)
  const [emojiOpen, setEmojiOpen] = React.useState(false)

  return (
    <div
      data-slot="linear-project-comment"
      className="rounded-lg border border-border bg-popover p-3"
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
              <DropdownMenuItem onClick={onNewIssue}>
                New issue from comment…
              </DropdownMenuItem>
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
      className="flex items-center gap-2 rounded-lg border border-border bg-popover px-3 py-2"
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

type OutlineItem = { id: string; label: string; emoji?: string; depth?: number }

function ProjectOutline({
  items,
  activeId,
  className,
}: {
  items: OutlineItem[]
  activeId?: string
  className?: string
}) {
  return (
    <div
      data-slot="linear-project-outline"
      className={cn(
        "w-64 overflow-hidden rounded-lg border border-border bg-popover p-2",
        className
      )}
    >
      <div className="mb-1 flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-foreground">
        <List className="size-3.5 text-muted-foreground" />
        Description
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            data-slot="linear-project-outline-item"
            data-active={activeId === item.id ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              activeId === item.id && "text-foreground"
            )}
            style={{ paddingLeft: `${(item.depth ?? 0) * 12 + 8}px` }}
          >
            {item.emoji ? <span>{item.emoji}</span> : null}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RichTextToolbar({ className }: { className?: string }) {
  const btn =
    "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
  return (
    <div
      data-slot="linear-rich-text-toolbar"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-sm text-foreground hover:bg-muted">
              Aa
              <ChevronDown className="size-3" />
            </button>
          }
        />
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem>Regular text</DropdownMenuItem>
          <DropdownMenuItem>Heading 1</DropdownMenuItem>
          <DropdownMenuItem>Heading 2</DropdownMenuItem>
          <DropdownMenuItem>Heading 3</DropdownMenuItem>
          <DropdownMenuItem>Heading 4</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="mx-0.5 h-5 w-px bg-border" />
      <button className={btn} aria-label="Bold">
        <Bold className="size-3.5" />
      </button>
      <button className={btn} aria-label="Italic">
        <Italic className="size-3.5" />
      </button>
      <button className={btn} aria-label="Strikethrough">
        <Strikethrough className="size-3.5" />
      </button>
      <button className={btn} aria-label="Underline">
        <Underline className="size-3.5" />
      </button>
      <button className={btn} aria-label="Link">
        <Link2 className="size-3.5" />
      </button>
      <span className="mx-0.5 h-5 w-px bg-border" />
      <button className={btn} aria-label="Quote">
        <TextQuote className="size-3.5" />
      </button>
      <button className={btn} aria-label="Code">
        <Code className="size-3.5" />
      </button>
      <button className={btn} aria-label="Image">
        <ImageIcon className="size-3.5" />
      </button>
      <button className={btn} aria-label="List">
        <List className="size-3.5" />
      </button>
      <span className="mx-0.5 h-5 w-px bg-border" />
      <button className={btn} aria-label="Mention">
        <AtSign className="size-3.5" />
      </button>
      <button className={btn} aria-label="Comment">
        <SmilePlus className="size-3.5" />
      </button>
    </div>
  )
}

const GIF_TILES = [
  { id: "1", label: "GG", tone: "bg-brand/20" },
  { id: "2", label: "LOL", tone: "bg-warning/20" },
  { id: "3", label: "BOO", tone: "bg-destructive/20" },
  { id: "4", label: "OK", tone: "bg-success/20" },
  { id: "5", label: "YES", tone: "bg-muted" },
  { id: "6", label: "WOW", tone: "bg-brand/10" },
]

function GifPicker({
  onSelect,
  className,
}: {
  onSelect?: (id: string) => void
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  return (
    <div
      data-slot="linear-gif-picker"
      className={cn(
        "w-80 overflow-hidden rounded-lg border border-border bg-popover p-2",
        className
      )}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for a gif"
        className="mb-2 h-8 w-full rounded-md border border-border bg-transparent px-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <div className="grid max-h-64 grid-cols-3 gap-1.5 overflow-auto">
        {GIF_TILES.map((tile) => (
          <button
            key={tile.id}
            type="button"
            data-slot="linear-gif-tile"
            className={cn(
              "flex aspect-video items-center justify-center rounded-lg font-mono text-xs text-foreground",
              tile.tone
            )}
            onClick={() => onSelect?.(tile.id)}
          >
            {tile.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProjectFileAttachment({
  name,
  size,
}: {
  name: string
  size: string
}) {
  return (
    <div
      data-slot="linear-project-attachment"
      className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2"
    >
      <FileText className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="truncate text-sm text-foreground">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{size}</p>
      </div>
    </div>
  )
}

function CreateIssueDialog({
  open,
  onOpenChange,
  title = "New Project Logo",
  quoteAuthor = "@alexsmith.mobbin@gmail.com",
  quoteBody = "Logo of AS Mobbin",
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  quoteAuthor?: string
  quoteBody?: string
  onCreate?: () => void
}) {
  const chip =
    "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted/40"
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="linear-create-issue-dialog"
        showCloseButton={false}
        className="max-w-xl gap-0 p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-brand/20 text-[7px] text-brand">
              ●
            </span>
            AS
            <span>›</span>
            <span className="text-foreground">New issue</span>
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded-md px-2 py-1 hover:bg-muted">Save as draft</button>
            <Button variant="ghost" size="icon-sm" className="size-6" aria-label="Expand">
              <Maximize2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-6"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 px-4 py-3">
          <input
            defaultValue={title}
            className="w-full bg-transparent text-lg font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          <div className="rounded-lg border-l-2 border-border pl-3 text-sm text-muted-foreground">
            <p className="text-xs">{quoteAuthor} said:</p>
            <p className="text-foreground">{quoteBody}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button className={chip}>
              <CircleDashed className="size-3.5" />
              Backlog
            </button>
            <button className={chip}>
              <SignalHigh className="size-3.5" />
              Priority
            </button>
            <button className={chip}>
              <UserCircle2 className="size-3.5" />
              Assignee
            </button>
            <button className={chip}>
              <span className="inline-flex size-3 items-center justify-center rounded-full bg-brand/20 text-[7px] text-brand">
                ●
              </span>
              User Insight &amp; Behavior …
            </button>
            <button className={chip}>
              <Tag className="size-3.5" />
              Labels
            </button>
            <button className={chip}>
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          <Button variant="ghost" size="icon-sm" aria-label="Attach">
            <Paperclip className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Switch className="scale-90" />
              Create more
            </label>
            <Button
              size="sm"
              onClick={() => {
                onCreate?.()
                onOpenChange(false)
              }}
            >
              Create issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export {
  CreateIssueDialog,
  GifPicker,
  ProjectComment,
  ProjectCommentComposer,
  ProjectFileAttachment,
  ProjectLogoBlock,
  ProjectOutline,
  ProjectPropertiesPanel,
  ProjectPropertyRow,
  RichTextToolbar,
}
export type { ProjectCommentProps, ProjectPropertyRowProps }
