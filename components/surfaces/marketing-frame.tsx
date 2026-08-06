"use client"

import Link from "next/link"

import { useContractScope } from "@/components/chrome/contract-scope"
import { Surface } from "@/components/surfaces/surface"
import { MediaPlane } from "@/components/cinematic/media-plane"
import { Button } from "@/components/ui/button"
import { bg, designCn, radiusIntent, text, typeClass } from "@/lib/design"

/**
 * Marketing-lane proof. Renders inside every contract's surface studio, so its
 * links resolve against the owning contract — hardcoded /meridian paths would
 * navigate a Harbor visitor out of Harbor.
 */
function MarketingFrame({ className }: { className?: string }) {
  const { id } = useContractScope()
  return (
    <Surface
      id="marketing"
      data-tone="theater"
      className={designCn(
        "relative flex h-[28rem] flex-col justify-end overflow-hidden md:h-[32rem]",
        radiusIntent("shell"),
        bg("dock"),
        text("dock"),
        className,
      )}
    >
      <MediaPlane />
      <div className="relative z-10 space-y-5 p-6 md:p-8">
        <p
          className={designCn(
            typeClass("label"),
            text("brand"),
            "text-[10px] tracking-[0.2em]",
          )}
        >
          Marketing
        </p>
        <h3 className="max-w-[12ch] text-3xl font-medium tracking-[-0.04em] md:text-4xl">
          Ship interfaces that feel finished.
        </h3>
        <p className={designCn("max-w-sm text-sm leading-relaxed", text("dock-muted"))}>
          Marketing lane — theater when the product is the subject, never when
          it is decoration.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="theater-ink" size="pill" asChild>
            <Link href={`/${id}/surfaces#marketing`}>Explore</Link>
          </Button>
          <Button variant="theater-outline" size="pill" asChild>
            <Link href={`/${id}/ui`}>Primitives</Link>
          </Button>
        </div>
      </div>
    </Surface>
  )
}

export { MarketingFrame }
