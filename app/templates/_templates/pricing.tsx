"use client"

// Pricing template, a three-tier marketing pricing page.
// uses: Card, Badge, Button, SegmentedControl, Table, Separator
//
// Design: a calm marketing page with one signature moment, the featured "Pro"
// plan lifts out of the row on a brand-tinted card with a glow, while the billing
// toggle re-prices every tier live. A full comparison table and an FAQ carry the
// detail a real buyer needs before converting. Pure tokens; re-skins from --brand.
import * as React from "react"
import { ArrowRight, Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SegmentedControl } from "@/components/ui/segmented-control"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Cycle = "monthly" | "annual"

const tiers = [
  {
    name: "Starter",
    blurb: "Everything one builder needs to ship.",
    monthly: 0,
    annual: 0,
    cta: "Start for free",
    featured: false,
    points: [
      "1 project",
      "Community support",
      "1 GB bandwidth",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    blurb: "For small teams shipping to production.",
    monthly: 24,
    annual: 19,
    cta: "Start 14-day trial",
    featured: true,
    points: [
      "Unlimited projects",
      "Priority support",
      "100 GB bandwidth",
      "Advanced analytics",
      "Custom domains",
    ],
  },
  {
    name: "Scale",
    blurb: "Governance and scale for the whole org.",
    monthly: 80,
    annual: 64,
    cta: "Talk to sales",
    featured: false,
    points: [
      "SSO / SAML",
      "Audit log",
      "1 TB bandwidth",
      "SLA & DPA",
      "Dedicated support",
    ],
  },
]

const matrix: { feature: string; values: (string | boolean)[] }[] = [
  { feature: "Projects", values: ["1", "Unlimited", "Unlimited"] },
  { feature: "Bandwidth", values: ["1 GB", "100 GB", "1 TB"] },
  { feature: "Team members", values: ["1", "10", "Unlimited"] },
  { feature: "Analytics", values: ["Basic", "Advanced", "Advanced"] },
  { feature: "Custom domains", values: [false, true, true] },
  { feature: "SSO / SAML", values: [false, false, true] },
  { feature: "Audit log", values: [false, false, true] },
  { feature: "Support", values: ["Community", "Priority", "Dedicated"] },
]

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes, upgrade or downgrade at any time. Changes are prorated to the day, so you only pay for what you use.",
  },
  {
    q: "What happens when my trial ends?",
    a: "Your workspace stays on the free Starter plan. Nothing is deleted, upgrade whenever you're ready.",
  },
  {
    q: "Do you offer discounts?",
    a: "Annual billing saves you two months. We also offer free credits for students and open-source maintainers.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "All major cards and, on the Scale plan, invoicing with net-30 terms.",
  },
]

function price(tier: (typeof tiers)[number], cycle: Cycle) {
  const n = cycle === "monthly" ? tier.monthly : tier.annual
  return n === 0 ? "$0" : `$${n}`
}

export function PricingTemplate() {
  const [cycle, setCycle] = React.useState<Cycle>("annual")

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_45%_at_50%_0%,#000,transparent)]"
      />
      <div
        aria-hidden
        className="glow-brand pointer-events-none absolute inset-x-0 -top-24 h-80 opacity-60"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
            Pricing
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Simple pricing that{" "}
            <span className="text-gradient-brand">scales with you</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            Start free, then pick a plan when you&apos;re ready to ship. Every
            tier includes the full component library, you only pay for scale.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <SegmentedControl
              value={cycle}
              onValueChange={(v) => setCycle(v as Cycle)}
              options={[
                { label: "Monthly", value: "monthly" },
                { label: "Annual", value: "annual" },
              ]}
            />
            <Badge variant="success">Save 20%</Badge>
          </div>
        </header>

        {/* ── Tiers ───────────────────────────────────────────────── */}
        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative",
                tier.featured && "border-brand/40 edge ring-1 ring-brand/20",
              )}
            >
              {tier.featured && (
                <div
                  aria-hidden
                  className="glow-brand pointer-events-none absolute inset-x-0 -top-px h-24 opacity-70"
                />
              )}
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                  {tier.featured && <Badge>Most popular</Badge>}
                </div>
                <CardDescription>{tier.blurb}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-heading text-4xl font-semibold tracking-tight tabular-nums">
                    {price(tier, cycle)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.monthly === 0 ? "forever" : "/ seat / mo"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <Separator />
                <ul className="mt-4 space-y-2.5">
                  {tier.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span className="text-muted-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="relative">
                <Button
                  className="w-full"
                  variant={tier.featured ? "default" : "outline"}
                >
                  {tier.cta}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* ── Comparison table ────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-center font-heading text-xl font-semibold tracking-tight">
            Compare every plan
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl bg-card edge">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Feature</TableHead>
                  {tiers.map((t) => (
                    <TableHead key={t.name} className="text-center last:pr-5">
                      {t.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="pl-5 font-medium">
                      {row.feature}
                    </TableCell>
                    {row.values.map((v, i) => (
                      <TableCell key={i} className="text-center last:pr-5">
                        {typeof v === "boolean" ? (
                          v ? (
                            <Check className="mx-auto size-4 text-brand" />
                          ) : (
                            <Minus className="mx-auto size-4 text-muted-foreground/50" />
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {v}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="mx-auto mt-16 max-w-2xl">
          <h2 className="text-center font-heading text-xl font-semibold tracking-tight">
            Frequently asked
          </h2>
          <dl className="mt-6 divide-y divide-border rounded-2xl bg-card px-5 edge">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-sm font-medium">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA band ────────────────────────────────────────────── */}
        <section className="relative mt-16 overflow-hidden rounded-3xl border border-brand/30 bg-brand/5 px-6 py-12 text-center">
          <div
            aria-hidden
            className="glow-brand pointer-events-none absolute inset-x-0 -top-10 h-40 opacity-70"
          />
          <h2 className="relative font-heading text-2xl font-semibold tracking-tight text-balance">
            Ready to ship something calm?
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Spin up a workspace in under a minute. No credit card required on
            the Starter plan.
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">
              Get started free
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline">
              Book a demo
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
