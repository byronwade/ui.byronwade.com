"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { Bloom } from "@/components/ui/bloom";
import { BloomFlow, type BloomFlowDef } from "@/components/ui/bloom-flow";

interface FormState {
  email: string;
  message: string;
}

const composeFlow: BloomFlowDef<FormState, { email: string }> = {
  id: "compose-message",
  initial: { email: "", message: "" },
  steps: [
    {
      title: "Send a message",
      caption: "Fill in the details below to send your message.",
      body: (state, set) => (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="bf-email">
              Recipient email
            </label>
            <input
              id="bf-email"
              type="email"
              value={state.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="bf-message">
              Message
            </label>
            <textarea
              id="bf-message"
              value={state.message}
              onChange={(e) => set({ message: e.target.value })}
              placeholder="Write something…"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      ),
      primaryLabel: "Send",
      canAdvance: (s) => s.email.includes("@") && s.message.trim().length > 0,
    },
  ],
  onComplete: async (state) => {
    await new Promise((r) => setTimeout(r, 800));
    return { email: state.email };
  },
  success: (result) => ({
    title: `Message sent to ${result.email}`,
    actions: undefined,
  }),
};

export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-[280px] items-end justify-center rounded-xl border border-border p-8">
      <Bloom
        open={open}
        onOpenChange={setOpen}
        placement="top"
        tone="surface"
        size={400}
        bar={
          <span className="flex items-center gap-2">
            <Mail className="size-4" />
            Compose
          </span>
        }
      >
        <BloomFlow flow={composeFlow} onClose={() => setOpen(false)} />
      </Bloom>
    </div>
  );
}
