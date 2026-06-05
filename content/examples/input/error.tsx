"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Example() {
  const [email, setEmail] = React.useState("not-an-email")
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("abc")

  const emailInvalid = email.length > 0 && !email.includes("@")
  const usernameInvalid = username.length > 0 && username.length < 3
  const passwordInvalid = password.length > 0 && password.length < 8

  return (
    <div className="flex flex-col gap-5 p-6 max-w-sm w-full">
      {/* Email – already invalid on mount to showcase the style */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="err-email">Email</Label>
        <Input
          id="err-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailInvalid}
          aria-describedby={emailInvalid ? "err-email-msg" : undefined}
        />
        {emailInvalid && (
          <p id="err-email-msg" className="text-xs text-destructive">
            Please enter a valid email address.
          </p>
        )}
      </div>

      {/* Username – error after typing too short */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="err-username">Username</Label>
        <Input
          id="err-username"
          type="text"
          placeholder="At least 3 characters"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={usernameInvalid}
          aria-describedby={usernameInvalid ? "err-username-msg" : undefined}
        />
        {usernameInvalid && (
          <p id="err-username-msg" className="text-xs text-destructive">
            Username must be at least 3 characters.
          </p>
        )}
      </div>

      {/* Password – error on short value */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="err-password">Password</Label>
        <Input
          id="err-password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={passwordInvalid}
          aria-describedby={passwordInvalid ? "err-password-msg" : undefined}
        />
        {passwordInvalid && (
          <p id="err-password-msg" className="text-xs text-destructive">
            Password must be at least 8 characters.
          </p>
        )}
      </div>
    </div>
  )
}
