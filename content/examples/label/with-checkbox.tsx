"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function Example() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [updates, setUpdates] = useState(true);

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm w-full">
      <p className="text-sm font-medium">Email preferences</p>

      <div className="flex items-center gap-2">
        <input
          id="notifications"
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          className="peer size-4 rounded border accent-foreground cursor-pointer"
        />
        <Label htmlFor="notifications" className="cursor-pointer">
          Activity notifications
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="marketing"
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="peer size-4 rounded border accent-foreground cursor-pointer"
        />
        <Label htmlFor="marketing" className="cursor-pointer">
          Product news and announcements
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="updates"
          type="checkbox"
          checked={updates}
          onChange={(e) => setUpdates(e.target.checked)}
          className="peer size-4 rounded border accent-foreground cursor-pointer"
        />
        <Label htmlFor="updates" className="cursor-pointer">
          Weekly digest
        </Label>
      </div>

      <div className="flex items-center gap-2 opacity-50">
        <input
          id="security"
          type="checkbox"
          checked
          disabled
          className="peer size-4 rounded border cursor-not-allowed"
        />
        <Label htmlFor="security" className="cursor-not-allowed">
          Security alerts (always on)
        </Label>
      </div>
    </div>
  );
}
