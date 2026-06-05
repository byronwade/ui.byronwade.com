// Centered-tool archetype — a single focal task on a calm backdrop.
// uses: CenteredFocal, InputGroup, Button, GradientAvatar, Separator
//
// Design: the renowned split sign-in. A brand-lit story panel (gradient wash, grid
// lines, glow, a gradient wordmark, and a floating glass testimonial) frames the one
// decision; the focal form floats on a calm right column with designed states. The
// brand panel collapses on mobile so the single task always leads.
import { ArrowRight, Command, KeyRound, Lock, Mail } from "lucide-react"

import { CenteredFocal } from "@/components/centered-focal"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function CenteredToolArchetype() {
  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
      {/* ── Brand story panel ────────────────────────────────────── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand/12 via-background to-background"
        />
        <div
          aria-hidden
          className="bg-grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(120%_90%_at_0%_0%,#000,transparent_75%)]"
        />
        <div
          aria-hidden
          className="glow-brand absolute inset-x-0 -top-24 h-96 opacity-80"
        />

        <div className="relative flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-brand text-brand-foreground">
            <Command className="size-4" />
          </span>
          Console
        </div>

        <div className="relative max-w-md">
          <h2 className="text-gradient-brand text-4xl font-semibold leading-[1.1] tracking-tight">
            Run operations with total clarity.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Incidents, deploys, and live health — one calm surface for the whole
            team, from first alert to all-clear.
          </p>

          <figure className="mt-10 rounded-2xl bg-card/70 p-5 shadow-float backdrop-blur">
            <blockquote className="text-sm leading-relaxed">
              “We replaced three dashboards with Console. On-call finally feels
              calm — everything we need is one glance away.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <GradientAvatar seed="ana reyes" size="md" />
              <div className="text-xs">
                <div className="font-medium text-foreground">Ana Reyes</div>
                <div className="text-muted-foreground">
                  Head of Platform, Acme
                </div>
              </div>
            </figcaption>
          </figure>
        </div>

        <div className="relative flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>SOC 2</span>
          <span>99.99% SLA</span>
          <span>SSO / SAML</span>
        </div>
      </aside>

      {/* ── Focal form ───────────────────────────────────────────── */}
      <CenteredFocal
        className="min-h-dvh lg:min-h-full"
        backdrop={<div className="bg-grid size-full opacity-70 lg:hidden" />}
      >
        <div className="flex flex-col items-center">
          <div className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
            <Command className="size-5" />
          </div>
          <h1 className="mt-4 text-lg font-semibold tracking-tight">
            Sign in to Console
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back — enter your work email to continue.
          </p>
        </div>

        <div className="mt-6 space-y-3 text-left">
          <InputGroup>
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
            <InputGroupInput type="email" placeholder="you@company.com" />
          </InputGroup>
          <Button className="w-full">
            Continue
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          or
          <Separator className="flex-1" />
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            <Lock data-icon="inline-start" />
            Continue with SSO
          </Button>
          <Button variant="outline" className="w-full">
            <KeyRound data-icon="inline-start" />
            Continue with a passkey
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          No account?{" "}
          <span className="font-medium text-foreground">Create one</span>
        </p>
      </CenteredFocal>
    </div>
  )
}
