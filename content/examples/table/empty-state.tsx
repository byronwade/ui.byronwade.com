"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inbox } from "lucide-react";

const allItems = [
  { id: "T-101", title: "Fix login redirect", assignee: "Alex R.", priority: "High", due: "Jun 3" },
  { id: "T-102", title: "Update onboarding flow", assignee: "Morgan C.", priority: "Medium", due: "Jun 7" },
  { id: "T-103", title: "Audit accessibility", assignee: "Jordan P.", priority: "Low", due: "Jun 14" },
];

export default function Example() {
  const [showEmpty, setShowEmpty] = useState(false);
  const items = showEmpty ? [] : allItems;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowEmpty((v) => !v)}
          className="px-3 py-1.5 rounded-md border text-sm hover:bg-muted transition-colors"
        >
          {showEmpty ? "Show data" : "Clear to empty state"}
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.assignee}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell className="text-muted-foreground">{item.due}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Inbox className="h-8 w-8 opacity-40" />
                  <p className="text-sm font-medium">No tasks found</p>
                  <p className="text-xs">Create a task to get started.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
