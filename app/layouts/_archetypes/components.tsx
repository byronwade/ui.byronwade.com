// Slug -> Component map. Imported only by /preview/[slug] (a server route), so
// it may pull in both server and client archetype components. Keeping this out
// of ./index.ts keeps the gallery/frame/nav/search bundles free of archetype code.
import type { ComponentType } from "react"

import type { ArchetypeSlug } from "./index"
import { CockpitArchetype } from "./cockpit"
import { CenteredToolArchetype } from "./centered-tool"
import { RichInventoryArchetype } from "./rich-inventory"
import { SplitRailArchetype } from "./split-rail"
import { GaugeArchetype } from "./gauge"
import { HeroChartArchetype } from "./hero-chart"
import { BoardArchetype } from "./board"
import { ConversationArchetype } from "./conversation"
import { CanvasArchetype } from "./canvas"
import { StudioArchetype } from "./studio"
import { TradingDeskArchetype } from "./trading-desk"
import { ServiceMapArchetype } from "./service-map"

export const archetypeComponents: Record<ArchetypeSlug, ComponentType> = {
  cockpit: CockpitArchetype,
  "centered-tool": CenteredToolArchetype,
  "rich-inventory": RichInventoryArchetype,
  "split-rail": SplitRailArchetype,
  gauge: GaugeArchetype,
  "hero-chart": HeroChartArchetype,
  board: BoardArchetype,
  conversation: ConversationArchetype,
  canvas: CanvasArchetype,
  studio: StudioArchetype,
  "trading-desk": TradingDeskArchetype,
  "service-map": ServiceMapArchetype,
}
