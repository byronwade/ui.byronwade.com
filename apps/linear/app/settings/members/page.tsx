"use client"

import * as React from "react"
import { UserPlus } from "lucide-react"

import {
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Member = {
  id: string
  name: string
  email: string
  role: "Admin" | "Member" | "Guest"
  status: "Active" | "Invited" | "Suspended"
  initials: string
}

const MEMBERS: Member[] = [
  {
    id: "1",
    name: "Alex Smith",
    email: "alex@mobbin.com",
    role: "Admin",
    status: "Active",
    initials: "AS",
  },
  {
    id: "2",
    name: "Jordan Lee",
    email: "jordan@mobbin.com",
    role: "Member",
    status: "Active",
    initials: "JL",
  },
  {
    id: "3",
    name: "Sam Rivera",
    email: "sam@mobbin.com",
    role: "Member",
    status: "Active",
    initials: "SR",
  },
  {
    id: "4",
    name: "Casey Nguyen",
    email: "casey@partner.dev",
    role: "Guest",
    status: "Invited",
    initials: "CN",
  },
  {
    id: "5",
    name: "Riley Park",
    email: "riley@mobbin.com",
    role: "Member",
    status: "Suspended",
    initials: "RP",
  },
]

function statusVariant(
  status: Member["status"]
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "Active") return "secondary"
  if (status === "Invited") return "outline"
  return "destructive"
}

export default function MembersSettingsPage() {
  return (
    <SettingsShell title="Members" activeId="members" wide>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SettingsPageIntro
          title="Members"
          description="Manage workspace members, roles, and invitations."
        />
        <Button size="sm">
          <UserPlus className="size-4" />
          Invite people
        </Button>
      </div>

      <SettingsSection title="Workspace members">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MEMBERS.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 font-mono text-[10px] text-muted-foreground">
                        {member.initials}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {member.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {member.role}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant(member.status)}
                      className="font-normal"
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsSection>
    </SettingsShell>
  )
}
