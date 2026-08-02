import { Hero } from "@/components/home/hero";
import { WorkbenchSection } from "@/components/home/workbench-section";
import { SurfaceLane } from "@/components/home/surface-lane";
import { Closing } from "@/components/home/closing";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkbenchSection />
      <SurfaceLane />
      <Closing />
    </main>
  );
}
