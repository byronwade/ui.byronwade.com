import * as React from "react"
import { MapPin } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricStat } from "@/components/metric-stat"

interface CustomerAddress {
  line1?: string
  line2?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
}

interface CustomerCardProps extends React.ComponentProps<typeof Card> {
  name: string
  email?: string
  avatar?: string
  ordersCount?: number
  totalSpent?: number
  currency?: string
  locale?: string
  address?: CustomerAddress
  location?: string
}

/** First letters of the first two name words — the avatar fallback monogram. */
function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

/** "123 Main St" + "Suite 4" + "Austin, TX 78701" + "United States" — blank parts dropped. */
function addressLines(address: CustomerAddress) {
  const cityLine = [
    [address.city, address.region].filter(Boolean).join(", "),
    address.postalCode,
  ]
    .filter(Boolean)
    .join(" ")
  return [address.line1, address.line2, cityLine, address.country].filter(
    Boolean,
  )
}

/**
 * Shopify-admin customer summary: avatar + name/email, headline order/spend
 * stats, and an optional default address. Money is locale/currency formatted
 * and rendered `font-mono` like every other datum.
 */
function CustomerCard({
  name,
  email,
  avatar,
  ordersCount,
  totalSpent,
  currency = "USD",
  locale = "en-US",
  address,
  location,
  className,
  ...props
}: CustomerCardProps) {
  const lines = address ? addressLines(address) : []
  const hasStats = ordersCount !== undefined || totalSpent !== undefined

  return (
    <Card
      data-slot="customer-card"
      className={cn("gap-4", className)}
      {...props}
    >
      <CardHeader>
        <div
          className="flex items-center gap-3"
          data-slot="customer-card-identity"
        >
          <Avatar size="lg">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <CardTitle
              data-slot="customer-card-name"
              className="truncate text-sm"
            >
              {name}
            </CardTitle>
            {email && (
              <CardDescription
                data-slot="customer-card-email"
                className="truncate"
              >
                {email}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      {hasStats && (
        <CardContent>
          <div
            data-slot="customer-card-stats"
            className="flex flex-wrap gap-x-10 gap-y-4"
          >
            {ordersCount !== undefined && (
              <MetricStat
                label="Orders"
                value={
                  <span className="font-mono">
                    {new Intl.NumberFormat(locale).format(ordersCount)}
                  </span>
                }
              />
            )}
            {totalSpent !== undefined && (
              <MetricStat
                label="Lifetime spend"
                value={
                  <span className="font-mono">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency,
                    }).format(totalSpent)}
                  </span>
                }
              />
            )}
          </div>
        </CardContent>
      )}

      {(lines.length > 0 || location) && (
        <CardContent>
          {lines.length > 0 && (
            <address
              data-slot="customer-card-address"
              className="text-sm leading-relaxed text-muted-foreground not-italic"
            >
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </address>
          )}
          {location && (
            <p
              data-slot="customer-card-location"
              className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {location}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export { CustomerCard }
export type { CustomerAddress, CustomerCardProps }
