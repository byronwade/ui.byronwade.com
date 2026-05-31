"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Example() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked)}
        />
        <span className="text-sm">I agree to the terms and conditions</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox defaultChecked />
        <span className="text-sm">Subscribe to newsletter</span>
      </label>

      <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
        <Checkbox disabled />
        <span className="text-sm">Disabled option</span>
      </label>

      <p className="text-sm text-muted-foreground">
        Terms accepted: {accepted ? "Yes" : "No"}
      </p>
    </div>
  );
}
