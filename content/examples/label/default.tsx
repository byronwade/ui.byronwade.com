"use client";

import { Label } from "@/components/ui/label";

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Username</Label>
        <input
          id="username"
          type="text"
          placeholder="johndoe"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
