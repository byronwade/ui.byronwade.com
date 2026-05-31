"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export default function Example() {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm w-full">
      <Input
        type="text"
        placeholder="Full name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input type="search" placeholder="Search…" />
    </div>
  );
}
