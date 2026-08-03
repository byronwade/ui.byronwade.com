import type { Metadata } from "next"

import { Hero } from "@/components/home/hero"
import { TileCraft } from "@/components/home/tile-craft"
import { TileFocus } from "@/components/home/tile-focus"
import { TileSkills } from "@/components/home/tile-skills"
import { TileAgents } from "@/components/home/tile-agents"
import { Closing } from "@/components/home/closing"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Meridian design contract — cinematic film, install DX, UI gallery, and agent grammar on stage.",
}

/**
 * App-first film — full Meridian loop on stage.
 * Compose → theme → cinema/agent → skills → grammar → close (a11y + install).
 */
export default function MeridianFilmPage() {
  return (
    <main data-slot="meridian-film">
      <Hero />
      <TileCraft />
      <TileFocus />
      <TileSkills />
      <TileAgents />
      <Closing />
    </main>
  )
}
