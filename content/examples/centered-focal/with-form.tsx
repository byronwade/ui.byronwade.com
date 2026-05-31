"use client";

import { useState } from "react";
import { CenteredFocal } from "@/components/centered-focal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Example() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) setSubmitted(true);
  }

  return (
    <CenteredFocal
      backdrop={
        <div className="size-80 rounded-full bg-brand/8 blur-3xl" />
      }
    >
      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-brand/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">You&apos;re on the list!</p>
          <p className="text-xs text-muted-foreground">We&apos;ll reach out to <strong>{value}</strong> when a spot opens up.</p>
          <Button variant="ghost" size="sm" onClick={() => { setValue(""); setSubmitted(false); }}>
            Join with another address
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-base font-semibold text-foreground">Join the waitlist</h2>
            <p className="text-sm text-muted-foreground">Be the first to know when early access opens.</p>
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="sm">
            Request access
          </Button>
        </form>
      )}
    </CenteredFocal>
  );
}
