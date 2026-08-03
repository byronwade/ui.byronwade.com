import type { NextConfig } from "next"

/** Markdown/agent sources read via `loadSource` at request time — keep in serverless traces. */
const tracedAgentSources = [
  "./design.md",
  "./agents.md",
  "./llms.txt",
  "./docs/**/*.md",
  "./skills/**/*.md",
  "./.cursor/skills/**/*.md",
  "./.cursor/agents/**/*.md",
]

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/*": tracedAgentSources,
    "/system/[slug]/raw": tracedAgentSources,
    "/design.md": tracedAgentSources,
    "/agents.md": tracedAgentSources,
    "/architecture.md": tracedAgentSources,
    "/llms.txt": tracedAgentSources,
  },
}

export default nextConfig
