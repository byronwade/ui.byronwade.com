import { Hero } from "@/components/home/hero";
import { CinemaStatement } from "@/components/home/cinema-statement";
import { Density } from "@/components/home/density";
import { Tokens } from "@/components/home/tokens";
import { Principles } from "@/components/home/principles";
import { TypeSpecimen } from "@/components/home/type-specimen";
import { Agent } from "@/components/home/agent";
import { Closing } from "@/components/home/closing";

export default function Home() {
  return (
    <main>
      <Hero />
      <CinemaStatement />
      <Density />
      <Tokens />
      <Principles />
      <TypeSpecimen />
      <Agent />
      <Closing />
    </main>
  );
}
