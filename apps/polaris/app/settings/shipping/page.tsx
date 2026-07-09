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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ZONES = [
  {
    name: "Domestic — United States",
    rates: "3 rates",
    status: "Active",
  },
  {
    name: "Canada",
    rates: "2 rates",
    status: "Active",
  },
  {
    name: "Rest of world",
    rates: "1 rate",
    status: "Draft",
  },
]

const RATES = [
  {
    zone: "Domestic — United States",
    name: "Standard",
    price: "$5.00",
    transit: "3–5 business days",
  },
  {
    zone: "Domestic — United States",
    name: "Express",
    price: "$15.00",
    transit: "1–2 business days",
  },
  {
    zone: "Canada",
    name: "Standard",
    price: "$12.00",
    transit: "5–8 business days",
  },
]

export default function ShippingSettingsPage() {
  return (
    <AdminShell
      activeId="settings"
      title="Shipping"
      headerActions={
        <Button size="sm" type="button">
          Create profile
        </Button>
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/settings" />}>
                Settings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shipping</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h2 className="text-sm font-medium text-foreground">
            Shipping profiles
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Zones, rates, and delivery estimates for your general profile.
          </p>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>General profile</CardTitle>
              <CardDescription>
                Applies to all products without a custom profile.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" type="button">
              Edit profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ZONES.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {zone.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{zone.rates}</p>
                </div>
                <Badge variant="outline">{zone.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rates</CardTitle>
            <CardDescription>
              Sample rates from the general shipping profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Transit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RATES.map((rate) => (
                  <TableRow key={`${rate.zone}-${rate.name}`}>
                    <TableCell>{rate.zone}</TableCell>
                    <TableCell>{rate.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {rate.price}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rate.transit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
