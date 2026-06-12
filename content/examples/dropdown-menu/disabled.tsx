"use client"

import { Archive, DownloadSimple, Lock, ShareNetwork, Trash } from "@/lib/icons"

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
              <DownloadSimple />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive />
              Archive
            </DropdownMenuItem>
            {/* Disabled: user lacks permission */}
            <DropdownMenuItem disabled>
              <ShareNetwork />
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
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
