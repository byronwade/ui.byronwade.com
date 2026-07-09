import Link from "next/link"

import { AdminShell } from "@/components/polaris/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const PROVIDERS = [
  {
    id: "shopify-payments",
    name: "Shopify Payments",
    status: "Active",
    description: "Accept cards, Apple Pay, and Shop Pay with automatic payouts.",
  },
  {
    id: "paypal",
    name: "PayPal Express",
    status: "Connected",
    description: "Let customers check out with PayPal on product and cart pages.",
  },
  {
    id: "manual",
    name: "Manual payments",
    status: "Available",
    description: "Cash on delivery, money order, and bank deposit.",
  },
]

export default function PaymentsSettingsPage() {
  return (
    <AdminShell
      activeId="settings-payments"
      title="Payments"
      headerActions={
        <Button size="sm" type="button">
          Add provider
        </Button>
      }
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/settings" />}>
                Settings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Payments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h2 className="text-sm font-medium text-foreground">
            Payment providers
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how customers pay and how you receive payouts.
          </p>
        </div>

        <div className="space-y-3">
          {PROVIDERS.map((provider) => (
            <Card key={provider.id}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{provider.name}</CardTitle>
                    <Badge variant="outline">{provider.status}</Badge>
                  </div>
                  <CardDescription>{provider.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" type="button">
                  Manage
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Options shown at payment step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="capture-auto">Capture payment automatically</Label>
                <p className="text-xs text-muted-foreground">
                  Charge the card when the order is created.
                </p>
              </div>
              <Switch id="capture-auto" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="test-mode">Test mode</Label>
                <p className="text-xs text-muted-foreground">
                  Process payments with test credentials only.
                </p>
              </div>
              <Switch id="test-mode" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
