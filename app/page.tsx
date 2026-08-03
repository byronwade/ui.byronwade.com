import { Hero } from "@/components/home/hero"
import { TileCraft } from "@/components/home/tile-craft"
import { TileFocus } from "@/components/home/tile-focus"
import { TileSkills } from "@/components/home/tile-skills"
import { TileAgents } from "@/components/home/tile-agents"
import { Closing } from "@/components/home/closing"

/**
 * App-first film — full Meridian loop on stage.
 * Compose → theme → cinema/agent → skills → grammar → close (a11y + install).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <TileCraft />
      <TileFocus />
      <TileSkills />
      <TileAgents />
      <Closing />
    </main>
  )
}
