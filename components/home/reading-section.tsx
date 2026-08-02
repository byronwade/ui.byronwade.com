import Link from "next/link"
import { Stage } from "@/components/cinematic/stage"
import { ReadingArticle } from "@/components/reading/article"
import { Button } from "@/components/ui/button"

function ReadingSection() {
  return (
    <Stage id="reading" tone="paper" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <ReadingArticle
          lane="prose"
          eyebrow="Reading"
          title="Calm structure for words that matter."
          lead="Long-form on Meridian is measured, hierarchical, and quiet — so agents and humans can scan meaning without fighting the chrome."
        >
          <h2>What reading is for</h2>
          <p>
            UI chrome stays dense and task-shaped. Reading surfaces open the
            measure, slow the line height, and give every heading a job. If a
            paragraph does not earn its place, it does not ship.
          </p>

          <h2>How we structure it</h2>
          <ul>
            <li>One measure — 65ch, never a full-bleed wall of small type</li>
            <li>Clear heading ladder — size and tracking, not bold weight</li>
            <li>Lead paragraphs that frame the section before detail</li>
            <li>Lists and quotes when they clarify — never as decoration</li>
          </ul>

          <blockquote>
            Neutrals carry the room. One accent carries the decision. Soft warm
            paper keeps the feeling human; the brand stays the only loud note.
          </blockquote>

          <h2>For agents</h2>
          <p>
            When you write docs or essays in this system, use{" "}
            <span className="font-mono text-sm text-foreground">
              ReadingArticle
            </span>{" "}
            with <span className="font-mono text-sm">reading-prose</span> or{" "}
            <span className="font-mono text-sm">reading-ui</span>. Do not invent
            a third reading style. Do not drop body copy into a dashboard density.
          </p>

          <div className="reading-demo-break flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/for-agents">For agents</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/design.md">design.md</Link>
            </Button>
          </div>
        </ReadingArticle>
      </div>
    </Stage>
  )
}

export { ReadingSection }
