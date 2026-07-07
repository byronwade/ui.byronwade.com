"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  Search,
} from "lucide-react"

import {
  SettingsPageIntro,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

function LabelDot({ color }: { color: "red" | "purple" | "blue" | "green" }) {
  return (
    <span
      data-slot="linear-label-dot"
      data-color={color}
      className="inline-block size-2 shrink-0 rounded-full"
    />
  )
}

export default function IssueLabelsPage() {
  const { setTheme } = useTheme()
  const [expanded, setExpanded] = React.useState(true)

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Issue labels" activeId="issue-labels" wide>
      <SettingsPageIntro title="Issue labels" />

      <div
        data-slot="linear-settings-toolbar"
        className="flex flex-wrap items-center gap-2"
      >
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name…"
            className="h-8 pl-8"
            data-slot="linear-settings-filter"
          />
        </div>
        <Select defaultValue="workspace">
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="workspace">Workspace</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">
            New group
          </Button>
          <Button size="sm">New label</Button>
        </div>
      </div>

      <div
        data-slot="linear-settings-table"
        className="overflow-hidden rounded-lg border border-border bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8">
                <Checkbox aria-label="Select all" />
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Name ↓
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Issues
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Last applied
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Created
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-muted/30">
              <TableCell />
              <TableCell colSpan={5}>
                <Input
                  placeholder="Group name"
                  className="h-8 border-dashed bg-transparent"
                />
              </TableCell>
              <TableCell />
            </TableRow>

            <TableRow className="hover:bg-muted/30">
              <TableCell>
                <Checkbox aria-label="Select UX Issues group" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="text-muted-foreground"
                    aria-label={expanded ? "Collapse group" : "Expand group"}
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        !expanded && "-rotate-90"
                      )}
                    />
                  </button>
                  <GripVertical className="size-4 text-muted-foreground/60" />
                  <span className="text-sm font-medium">UX Issues</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Lists of UX issues
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="text-sm text-muted-foreground">Apr 6</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" aria-label="Group actions" />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>Edit label name</DropdownMenuItem>
                    <DropdownMenuItem>Add label to group</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Archive…</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            {expanded ? (
              <>
                <TableRow className="hover:bg-muted/30">
                  <TableCell />
                  <TableCell>
                    <div className="flex items-center gap-2 pl-10">
                      <LabelDot color="green" />
                      <Input
                        placeholder="Label name"
                        className="h-7 max-w-[140px] border-dashed bg-transparent px-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      Add label description…
                    </span>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow className="hover:bg-muted/30">
                  <TableCell />
                  <TableCell>
                    <div className="flex items-center gap-2 pl-10">
                      <LabelDot color="red" />
                      <span className="text-sm">Bug</span>
                    </div>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-sm text-muted-foreground">Mar 30</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow className="hover:bg-muted/30">
                  <TableCell />
                  <TableCell>
                    <div className="flex items-center gap-2 pl-10">
                      <LabelDot color="purple" />
                      <span className="text-sm">Feature</span>
                    </div>
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-sm text-muted-foreground">2</TableCell>
                  <TableCell className="text-sm text-muted-foreground">6 days ago</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Mar 30</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow className="hover:bg-muted/30">
                  <TableCell />
                  <TableCell>
                    <div className="flex items-center gap-2 pl-10">
                      <LabelDot color="blue" />
                      <span className="text-sm">Improvement</span>
                    </div>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-sm text-muted-foreground">Mar 30</TableCell>
                  <TableCell />
                </TableRow>
              </>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </SettingsShell>
  )
}
