import { Hero } from "@/components/home/hero"
import { TileCraft } from "@/components/home/tile-craft"
import { TileFocus } from "@/components/home/tile-focus"
import { TileAgents } from "@/components/home/tile-agents"
import { Closing } from "@/components/home/closing"

/**
 * App-first film — Cursor-app density as the proof, not marketing spectacle.
 * Brand → neutrals → agent/composer → grammar → close.
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
