"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { CATALOG_COMPONENTS } from "@/lib/component-catalog"

export default function StyleguidePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/catalog")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Redirecting…
        </p>
        <h1 className="mt-2 text-lg font-medium">Full component catalog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All {CATALOG_COMPONENTS.length} components now live on the catalog page with per-component
          previews and search.
        </p>
        <Button className="mt-4" render={<Link href="/catalog" />}>
          Open catalog
        </Button>
      </div>
    </div>
  )
}
