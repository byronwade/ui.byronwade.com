"use client"

import {
  SettingsPageIntro,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$8",
    seats: "Per member / month",
    features: ["Issues & projects", "Unlimited viewers"],
  },
  {
    id: "business",
    name: "Business",
    price: "$14",
    seats: "Per member / month",
    features: ["Everything in Basic", "Guest accounts", "SLA", "Insights"],
    current: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    seats: "Annual contract",
    features: ["Everything in Business", "SAML SSO", "Audit log", "Support"],
  },
]

export default function BillingSettingsPage() {
  return (
    <SettingsShell title="Billing" activeId="billing" wide>
      <SettingsPageIntro
        title="Billing"
        description="Manage your workspace plan, payment method, and invoices."
      />

      <SettingsSection title="Current plan">
        <div
          data-slot="linear-billing-plan"
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-4"
        >
          <div>
            <p className="text-sm font-medium">Business trial</p>
            <p className="text-xs text-muted-foreground">29 days remaining · 12 seats</p>
          </div>
          <Button size="sm">Upgrade</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Compare plans">
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Includes</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {PLANS.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      {plan.name}
                      {plan.current ? (
                        <Badge variant="outline">Current</Badge>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {plan.price}
                    <span className="ml-1 text-muted-foreground">{plan.seats}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {plan.features.join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={plan.current ? "outline" : "default"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Selected" : "Choose"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsSection>

      <SettingsSection title="Payment method">
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Visa ···· 4242</p>
            <p className="text-xs text-muted-foreground">Expires 08/28</p>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Invoices">
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">Apr 1, 2026</TableCell>
                <TableCell className="font-mono text-xs">$168.00</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">Mar 1, 2026</TableCell>
                <TableCell className="font-mono text-xs">$168.00</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SettingsSection>
    </SettingsShell>
  )
}
