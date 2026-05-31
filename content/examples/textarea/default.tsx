"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Example() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-2 p-6 max-w-md">
      <label htmlFor="message" className="text-sm font-medium">
        Your message
      </label>
      <Textarea
        id="message"
        placeholder="Type something here…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">{value.length} characters</p>
    </div>
  );
}
