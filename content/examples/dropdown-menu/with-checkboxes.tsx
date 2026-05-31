"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Example() {
  const [showTitle, setShowTitle] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [showAssignee, setShowAssignee] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showCreatedAt, setShowCreatedAt] = useState(true);

  return (
    <div className="flex items-center justify-center p-16">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md border px-4 py-2 text-sm">
          Columns
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showTitle}
            onCheckedChange={setShowTitle}
          >
            Title
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showStatus}
            onCheckedChange={setShowStatus}
          >
            Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showAssignee}
            onCheckedChange={setShowAssignee}
          >
            Assignee
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPriority}
            onCheckedChange={setShowPriority}
          >
            Priority
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showCreatedAt}
            onCheckedChange={setShowCreatedAt}
          >
            Created at
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
