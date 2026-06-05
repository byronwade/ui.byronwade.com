"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Member = {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer"
  joined: string
}

const initial: Member[] = [
  {
    id: "u1",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "Admin",
    joined: "Jan 2024",
  },
  {
    id: "u2",
    name: "Morgan Chen",
    email: "morgan@example.com",
    role: "Editor",
    joined: "Feb 2024",
  },
  {
    id: "u3",
    name: "Jordan Park",
    email: "jordan@example.com",
    role: "Editor",
    joined: "Mar 2024",
  },
  {
    id: "u4",
    name: "Casey Liu",
    email: "casey@example.com",
    role: "Viewer",
    joined: "Apr 2024",
  },
  {
    id: "u5",
    name: "Taylor Kim",
    email: "taylor@example.com",
    role: "Viewer",
    joined: "May 2024",
  },
]

const roleVariant: Record<Member["role"], "default" | "secondary" | "outline"> =
  {
    Admin: "default",
    Editor: "secondary",
    Viewer: "outline",
  }

export default function Example() {
  const [members, setMembers] = useState<Member[]>(initial)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  function remove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    setOpenMenu(null)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto" onClick={() => setOpenMenu(null)}>
      <Table>
        <TableCaption>
          Team members — click the menu to take action.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {m.email}
              </TableCell>
              <TableCell>
                <Badge variant={roleVariant[m.role]}>{m.role}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {m.joined}
              </TableCell>
              <TableCell className="relative">
                <button
                  className="p-1 rounded hover:bg-muted transition-colors"
                  aria-label="Open actions"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenMenu(openMenu === m.id ? null : m.id)
                  }}
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>

                {openMenu === m.id && (
                  <div
                    className="absolute right-0 top-8 z-10 w-36 rounded-lg border bg-popover p-1 shadow-md text-popover-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                      onClick={() => remove(m.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
