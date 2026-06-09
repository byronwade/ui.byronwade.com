"use client"

import { Archive, Download, Lock, Share2, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md edge px-4 py-2 text-sm">
          Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Item actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Download />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive />
              Archive
            </DropdownMenuItem>
            {/* Disabled: user lacks permission */}
            <DropdownMenuItem disabled>
              <Share2 />
              Share
            </DropdownMenuItem>
            {/* Disabled: feature locked */}
            <DropdownMenuItem disabled>
              <Lock />
              Publish
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Disabled: cannot delete published items */}
          <DropdownMenuItem variant="destructive" disabled>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
