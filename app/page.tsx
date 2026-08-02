import { Hero } from "@/components/home/hero";
import { AiStack } from "@/components/home/ai-stack";
import { ThemeStrip } from "@/components/home/theme-strip";
import { WorkbenchSection } from "@/components/home/workbench-section";
import { SurfaceLane } from "@/components/home/surface-lane";
import { Closing } from "@/components/home/closing";

export default function Home() {
  return (
    <main>
      <Hero />
      <AiStack />
      <ThemeStrip />
      <WorkbenchSection />
      <SurfaceLane />
      <Closing />
    </main>
  );
}
