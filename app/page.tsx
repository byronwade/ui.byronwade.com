import { Hero } from "@/components/home/hero"
import { ReadingSection } from "@/components/home/reading-section"
import { GrammarSplit } from "@/components/home/grammar-split"
import { AiStack } from "@/components/home/ai-stack"
import { ThemeStrip } from "@/components/home/theme-strip"
import { WorkbenchSection } from "@/components/home/workbench-section"
import { SurfaceLane } from "@/components/home/surface-lane"
import { Closing } from "@/components/home/closing"

export default function Home() {
  return (
    <main>
      <Hero />
      <ReadingSection />
      <GrammarSplit />
      <AiStack />
      <ThemeStrip />
      <WorkbenchSection />
      <SurfaceLane />
      <Closing />
    </main>
  )
}
