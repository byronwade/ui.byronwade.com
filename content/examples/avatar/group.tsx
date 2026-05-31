import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

export default function Example() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Small group */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Small (sm)</span>
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarImage src="https://i.pravatar.cc/40?u=g1" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarImage src="https://i.pravatar.cc/40?u=g2" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarImage src="https://i.pravatar.cc/40?u=g3" alt="User 3" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>

      {/* Default group with overflow count */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Default + overflow count
        </span>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/40?u=g4" alt="Alice" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/40?u=g5" alt="Bob" />
            <AvatarFallback>BO</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/40?u=g6" alt="Carol" />
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+7</AvatarGroupCount>
        </AvatarGroup>
      </div>

      {/* Large group */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Large (lg)</span>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/40?u=g7" alt="Dana" />
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/40?u=g8" alt="Eli" />
            <AvatarFallback>EL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/40?u=g9" alt="Fiona" />
            <AvatarFallback>FI</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+2</AvatarGroupCount>
        </AvatarGroup>
      </div>

      {/* Fallback-only group */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Fallbacks only</span>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>UV</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+12</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  );
}
