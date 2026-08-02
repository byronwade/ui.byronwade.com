import { Hero } from "@/components/home/hero";
import { Principles } from "@/components/home/principles";
import { Density } from "@/components/home/density";
import { Tokens } from "@/components/home/tokens";
import { TypeSpecimen } from "@/components/home/type-specimen";
import { Agent } from "@/components/home/agent";

export default function Home() {
  return (
    <main>
      <Hero />
      <Principles />
      <Density />
      <Tokens />
      <TypeSpecimen />
      <Agent />
    </main>
  );
}
