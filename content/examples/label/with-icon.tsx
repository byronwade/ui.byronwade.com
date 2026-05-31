"use client";

import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Search } from "lucide-react";

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-sm w-full">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">
          <User className="size-3.5" />
          Username
        </Label>
        <input
          id="username"
          type="text"
          placeholder="janedoe"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-icon">
          <Mail className="size-3.5" />
          Email
        </Label>
        <input
          id="email-icon"
          type="email"
          placeholder="jane@example.com"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">
          <Lock className="size-3.5" />
          Password
        </Label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="search">
          <Search className="size-3.5" />
          Search
        </Label>
        <input
          id="search"
          type="search"
          placeholder="Find something…"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
