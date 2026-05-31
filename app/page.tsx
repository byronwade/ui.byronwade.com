import Link from "next/link";
import { categories, byCategory } from "@/content/components";
import { ThemeToggle } from "@/app/_components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="flex h-14 items-center justify-end px-6"><ThemeToggle /></header>
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">byronwade/ui</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A personal design system — token-driven components with one swappable green accent, installable into any
          Next + Tailwind v4 project via the shadcn CLI.
        </p>

        <h2 className="mt-12 text-sm font-medium uppercase tracking-wide text-muted-foreground">Quick start</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-sm">
{`npx shadcn@latest init <REGISTRY_URL>/r/foundation.json
# components.json: "registries": { "@byronwade": "<REGISTRY_URL>/r/{name}.json" }
npx shadcn@latest add @byronwade/gauge`}
        </pre>

        <h2 className="mt-12 text-sm font-medium uppercase tracking-wide text-muted-foreground">What's inside</h2>
        <div className="mt-4 space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="text-sm font-semibold">{cat}</div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {byCategory(cat).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/components/${c.slug}`} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:text-foreground">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
