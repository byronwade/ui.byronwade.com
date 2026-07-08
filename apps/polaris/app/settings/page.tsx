import Link from "next/link"
import { ChevronRight, CreditCard, Store, Truck } from "lucide-react"

import { AdminShell } from "@/components/polaris/admin-shell"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SETTINGS_ROWS = [
  {
    id: "general",
    title: "General",
    description: "Store name, contact details, and store defaults.",
    icon: <Store className="size-4 text-muted-foreground" />,
  },
  {
    id: "payments",
    title: "Payments",
    description: "Payment providers, payouts, and checkout settings.",
    icon: <CreditCard className="size-4 text-muted-foreground" />,
  },
  {
    id: "shipping",
    title: "Shipping",
    description: "Shipping zones, rates, and delivery profiles.",
    icon: <Truck className="size-4 text-muted-foreground" />,
  },
]

export default function SettingsPage() {
  return (
    <AdminShell activeId="settings" title="Settings">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Store settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage how your store appears to customers and how you get paid.
          </p>
        </div>

        <div className="space-y-2">
          {SETTINGS_ROWS.map((row) => (
            <Link
              key={row.id}
              href={`/settings#${row.id}`}
              id={row.id}
              className="block"
            >
              <Card className="transition-colors hover:bg-muted/30">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {row.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle>{row.title}</CardTitle>
                    <CardDescription>{row.description}</CardDescription>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
