import { Banner } from "@/components/banner"

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Banner tone="info" title="Development mode">
        Your store isn't visible to customers yet.
      </Banner>
      <Banner tone="success" title="Payment captured">
        The order has been paid and is ready to fulfill.
      </Banner>
      <Banner tone="warning" title="Inventory running low">
        Three products are below their reorder threshold.
      </Banner>
      <Banner tone="critical" title="Payment failed">
        We couldn't charge your card. Update your billing details to continue.
      </Banner>
    </div>
  )
}
