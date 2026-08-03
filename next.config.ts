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

/** Legacy root routes → Meridian contract namespace. */
const meridianRedirects = [
  "/design",
  "/theme",
  "/surfaces",
  "/skills",
  "/system",
  "/for-agents",
  "/architecture",
  "/llms",
  "/design.md",
  "/agents.md",
  "/architecture.md",
  "/llms.txt",
] as const

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
    "/meridian/system/[slug]/raw": tracedAgentSources,
    "/meridian/design.md": tracedAgentSources,
    "/meridian/agents.md": tracedAgentSources,
    "/meridian/architecture.md": tracedAgentSources,
    "/meridian/llms.txt": tracedAgentSources,
  },
  async redirects() {
    return [
      ...meridianRedirects.map((source) => ({
        source,
        destination: `/meridian${source === "/llms" ? "/llms" : source}`,
        permanent: true,
      })),
      {
        source: "/skills/:slug*",
        destination: "/meridian/skills/:slug*",
        permanent: true,
      },
      {
        source: "/system/:slug*",
        destination: "/meridian/system/:slug*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
