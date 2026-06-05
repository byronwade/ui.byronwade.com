"use client"

import { ProductCard } from "@/components/product-card"

export default function Example() {
  return (
    <div className="max-w-[260px]">
      <ProductCard
        title="Merino Wool Crew Sweater"
        vendor="Northbound Apparel"
        image="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
        status="active"
        price={89}
        compareAtPrice={120}
        inventory={42}
        onClick={() => {}}
      />
    </div>
  )
}
