"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export default function Example() {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm">
      <Input
        type="text"
        placeholder="Enter your name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input type="text" placeholder="Disabled input" disabled />
    </div>
  );
}
