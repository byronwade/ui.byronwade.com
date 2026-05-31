"use client";

import {
  Copy,
  Download,
  Edit,
  ExternalLink,
  Share2,
  Star,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md border px-4 py-2 text-sm">
          File actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Edit />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star />
              Add to favourites
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Download />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink />
              Open in new tab
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
