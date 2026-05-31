import { Search, Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm w-full">
      {/* Leading icon */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input type="search" placeholder="Search…" className="pl-8" />
      </div>

      {/* Leading icon – email */}
      <div className="relative">
        <Mail className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input type="email" placeholder="Email address" className="pl-8" />
      </div>

      {/* Leading icon – user */}
      <div className="relative">
        <User className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input type="text" placeholder="Username" className="pl-8" />
      </div>

      {/* Leading icon – password */}
      <div className="relative">
        <Lock className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input type="password" placeholder="Password" className="pl-8" />
      </div>
    </div>
  );
}
