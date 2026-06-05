import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <p className="text-sm text-muted-foreground">
        Use <code>AvatarBadge</code> to overlay a status indicator at the
        bottom-right corner.
      </p>

      {/* Default badge (dot) at each size */}
      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src="https://i.pravatar.cc/40?u=badge1" alt="User" />
            <AvatarFallback>AB</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <span className="text-xs text-muted-foreground">sm</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/40?u=badge2" alt="User" />
            <AvatarFallback>CD</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <span className="text-xs text-muted-foreground">default</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/40?u=badge3" alt="User" />
            <AvatarFallback>EF</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <span className="text-xs text-muted-foreground">lg</span>
        </div>
      </div>

      {/* Badge with semantic color overrides */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/40?u=badge4" alt="Online" />
            <AvatarFallback>ON</AvatarFallback>
            <AvatarBadge className="bg-success" />
          </Avatar>
          <span className="text-xs text-muted-foreground">online</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/40?u=badge5" alt="Away" />
            <AvatarFallback>AW</AvatarFallback>
            <AvatarBadge className="bg-warning" />
          </Avatar>
          <span className="text-xs text-muted-foreground">away</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage
              src="https://i.pravatar.cc/40?u=badge6"
              alt="Offline"
            />
            <AvatarFallback>OF</AvatarFallback>
            <AvatarBadge className="bg-muted-foreground" />
          </Avatar>
          <span className="text-xs text-muted-foreground">offline</span>
        </div>
      </div>
    </div>
  );
}
