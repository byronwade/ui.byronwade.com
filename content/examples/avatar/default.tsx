"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Single avatar with image and fallback */}
      <div className="flex items-center gap-4">
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/40?u=alice" alt="Alice" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>

        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/40?u=bob" alt="Bob" />
          <AvatarFallback>BO</AvatarFallback>
        </Avatar>

        <Avatar size="lg">
          <AvatarImage src="/broken.jpg" alt="Carol" />
          <AvatarFallback>CA</AvatarFallback>
        </Avatar>
      </div>

      {/* Avatar with a badge */}
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?u=dave" alt="Dave" />
        <AvatarFallback>DA</AvatarFallback>
        <AvatarBadge />
      </Avatar>

      {/* Grouped avatars */}
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/40?u=eve" alt="Eve" />
          <AvatarFallback>EV</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/40?u=frank" alt="Frank" />
          <AvatarFallback>FR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/40?u=grace" alt="Grace" />
          <AvatarFallback>GR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}
