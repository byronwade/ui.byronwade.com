import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src="https://i.pravatar.cc/40?u=user1" alt="User" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">sm</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar size="default">
            <AvatarImage src="https://i.pravatar.cc/40?u=user2" alt="User" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">default</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/40?u=user3" alt="User" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">lg</span>
        </div>
      </div>

      {/* Fallback-only at each size */}
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">sm</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">default</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">lg</span>
        </div>
      </div>
    </div>
  )
}
