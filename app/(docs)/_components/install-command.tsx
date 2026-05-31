import { CodeBlock } from "@/app/(docs)/_components/code-block";

export function InstallCommand({ slug }: { slug: string }) {
  return <CodeBlock lang="bash" code={`npx shadcn@latest add @byronwade/${slug}`} />;
}
