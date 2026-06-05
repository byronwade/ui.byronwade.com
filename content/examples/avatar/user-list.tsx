import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

const members = [
  {
    id: 1,
    name: "Jordan Lee",
    role: "Admin",
    src: "https://i.pravatar.cc/40?u=ul1",
    online: true,
  },
  {
    id: 2,
    name: "Morgan Kim",
    role: "Editor",
    src: "https://i.pravatar.cc/40?u=ul2",
    online: true,
  },
  {
    id: 3,
    name: "Riley Patel",
    role: "Viewer",
    src: "https://i.pravatar.cc/40?u=ul3",
    online: false,
  },
  {
    id: 4,
    name: "Casey Brown",
    role: "Editor",
    src: "/broken.jpg",
    online: false,
  },
  {
    id: 5,
    name: "Avery Singh",
    role: "Viewer",
    src: "https://i.pravatar.cc/40?u=ul5",
    online: true,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Example() {
  return (
    <div className="w-full max-w-sm p-6">
      <ul className="flex flex-col divide-y divide-border">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 py-3">
            <Avatar>
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              <AvatarBadge
                className={
                  member.online ? "bg-success" : "bg-muted-foreground"
                }
              />
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{member.name}</span>
              <span className="text-xs text-muted-foreground">{member.role}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
