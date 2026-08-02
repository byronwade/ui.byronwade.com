import { Hero } from "@/components/home/hero"
import { TileCraft } from "@/components/home/tile-craft"
import { TileFocus } from "@/components/home/tile-focus"
import { TileAgents } from "@/components/home/tile-agents"
import { Closing } from "@/components/home/closing"

/**
 * Cinematic film — Apple product-page rhythm.
 * Brand → craft → product proof → agents → close.
 * System docs live on /theme and /for-agents.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <TileCraft />
      <TileFocus />
      <TileAgents />
      <Closing />
    </main>
  )
}
