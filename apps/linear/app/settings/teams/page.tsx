"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronDown, Globe, Laptop, Lock, Search, Server } from "lucide-react"

import { SettingsShell } from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const TEAMS = [
  {
    id: "slmobbin",
    name: "SL Mobbin",
    identifier: "ASM",
    icon: <Globe className="size-4 text-brand" />,
    visibility: "Workspace",
    members: "-",
    issues: "5",
    created: "Jul 2024",
    href: "/settings/teams/as-mobbin",
  },
  {
    id: "backend",
    name: "Backend",
    identifier: "BAC",
    icon: <Server className="size-4 text-success" />,
    visibility: "Private",
    members: "-",
    issues: "-",
    created: "Jul 2024",
  },
  {
    id: "engineering",
    name: "Engineering Team",
    identifier: "ENG",
    icon: <Laptop className="size-4 text-muted-foreground" />,
    visibility: "Workspace",
    members: "-",
    issues: "-",
    created: "Apr 6",
    href: "/settings/teams/engineering",
  },
]

export default function TeamsListPage() {
  const router = useRouter()

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      toast.success("AS Mobbin and its dependencies were successfully deleted")
    }, 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <SettingsShell title="Teams" activeId="teams" wide>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-medium tracking-tight text-foreground">Teams</h1>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by name…"
              className="h-8 w-[280px] pl-8"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            Active
            <ChevronDown className="size-3.5" />
          </Button>
        </div>
        <Button size="sm" render={<Link href="/settings/teams/new" />}>
          Create team
        </Button>
      </div>

      <div
        data-slot="linear-teams-table"
        className="overflow-hidden rounded-lg border border-border bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[45%]">Name</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="bg-muted/30 py-1.5 text-xs text-muted-foreground"
              >
                Active <span className="ml-1 font-mono">{TEAMS.length}</span>
              </TableCell>
            </TableRow>
            {TEAMS.map((team) => (
              <TableRow
                key={team.id}
                data-slot="linear-teams-row"
                className={team.href ? "cursor-pointer" : undefined}
                onClick={team.href ? () => router.push(team.href!) : undefined}
              >
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-muted/30">
                      {team.icon}
                    </span>
                    <span className="font-medium text-foreground">{team.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {team.identifier}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    {team.visibility === "Private" ? (
                      <Lock className="size-3.5" />
                    ) : null}
                    {team.visibility}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {team.members}
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {team.issues}
                </TableCell>
                <TableCell className="text-muted-foreground">{team.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SettingsShell>
  )
}
