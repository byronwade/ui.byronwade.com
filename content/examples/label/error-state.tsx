"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Example() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("taken_name");
  const [website, setWebsite] = useState("https://example.com");

  const emailError = email.length > 0 && !email.includes("@");
  const usernameError = username === "taken_name";
  const websiteValid = website.startsWith("https://") && website.length > 10;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-sm w-full">
      {/* Error state */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="err-email" className={emailError ? "text-destructive" : ""}>
          {emailError && <AlertCircle className="size-3.5" />}
          Email address
        </Label>
        <input
          id="err-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          aria-invalid={emailError}
          aria-describedby={emailError ? "email-error" : undefined}
          className={`rounded-md border px-3 py-2 text-sm ${
            emailError ? "border-destructive focus:outline-destructive" : ""
          }`}
        />
        {emailError && (
          <p id="email-error" className="text-xs text-destructive">
            Enter a valid email address.
          </p>
        )}
      </div>

      {/* Error with helper */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="err-username" className={usernameError ? "text-destructive" : ""}>
          {usernameError && <AlertCircle className="size-3.5" />}
          Username
        </Label>
        <input
          id="err-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={usernameError}
          className={`rounded-md border px-3 py-2 text-sm ${
            usernameError ? "border-destructive" : ""
          }`}
        />
        {usernameError && (
          <p className="text-xs text-destructive">
            That username is already taken.
          </p>
        )}
      </div>

      {/* Valid / success state */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ok-website" className={websiteValid ? "text-green-600 dark:text-green-500" : ""}>
          {websiteValid && <CheckCircle2 className="size-3.5" />}
          Website
        </Label>
        <input
          id="ok-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={`rounded-md border px-3 py-2 text-sm ${
            websiteValid ? "border-green-500" : ""
          }`}
        />
        {websiteValid && (
          <p className="text-xs text-green-600 dark:text-green-500">
            Looks good!
          </p>
        )}
      </div>
    </div>
  );
}
