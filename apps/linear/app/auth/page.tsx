"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthPage() {
  const { setTheme } = useTheme()
  const [step, setStep] = React.useState<"login" | "email" | "code">("login")
  const [email, setEmail] = React.useState("")
  const [code, setCode] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <div
      data-slot="linear-auth-shell"
      className="flex min-h-screen flex-col bg-background"
    >
      <header className="flex h-12 items-center justify-end px-6">
        <Button variant="ghost" size="sm" render={<Link href="/" />}>
          Linear UI
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="mb-8 flex size-10 items-center justify-center rounded-full bg-foreground text-background">
          <span className="font-mono text-xs font-medium">///</span>
        </div>

        {step === "login" ? (
          <div className="w-full max-w-sm space-y-4 text-center">
            <h1 className="text-xl font-medium tracking-tight">Log in to Linear</h1>
            <p className="text-sm text-muted-foreground">
              You used email to log in last time
            </p>
            <div className="space-y-3 pt-2">
              <Button
                className="w-full"
                onClick={() => setStep("email")}
              >
                Continue with email
              </Button>
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </div>
          </div>
        ) : null}

        {step === "email" ? (
          <div className="w-full max-w-sm space-y-4 text-center">
            <h1 className="text-xl font-medium tracking-tight">
              What&apos;s your email address?
            </h1>
            <div className="space-y-2 pt-2 text-left">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address…"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!email.trim()}
              onClick={() => setStep("code")}
            >
              Continue with email
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep("login")}
            >
              Back to login
            </Button>
          </div>
        ) : null}

        {step === "code" ? (
          <div className="w-full max-w-sm space-y-4 text-center">
            <h1 className="text-xl font-medium tracking-tight">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent you a temporary login code. Please check your inbox at{" "}
              <span className="text-foreground">{email || "you@company.com"}</span>.
            </p>
            <div className="space-y-2 pt-2 text-left">
              <Label htmlFor="code" className="sr-only">
                Login code
              </Label>
              <Input
                id="code"
                placeholder="Enter code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                className="font-mono tracking-widest"
              />
            </div>
            <Button className="w-full" disabled={code.length < 4}>
              Continue with login code
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep("email")}
            >
              Back to login
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  )
}
