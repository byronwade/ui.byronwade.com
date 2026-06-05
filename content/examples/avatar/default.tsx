"use client"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"

export default function Example() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Basic avatar with image */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">With image</span>
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/40?u=default1"
            alt="Sam Rivera"
          />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
      </div>

      {/* Fallback when no image */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Fallback initials</span>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      {/* Avatar with status badge */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">With badge</span>
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/40?u=default2"
            alt="Pat Chen"
          />
          <AvatarFallback>PC</AvatarFallback>
          <AvatarBadge className="bg-success" />
        </Avatar>
      </div>

      {/* Group of avatars */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Group</span>
        <AvatarGroup>
          <Avatar>
            <AvatarImage
              src="https://i.pravatar.cc/40?u=default3"
              alt="User A"
            />
            <AvatarFallback>UA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://i.pravatar.cc/40?u=default4"
              alt="User B"
            />
            <AvatarFallback>UB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://i.pravatar.cc/40?u=default5"
              alt="User C"
            />
            <AvatarFallback>UC</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  )
}
