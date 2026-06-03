import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev-tools indicator (overlaps the bottom-left nav).
  devIndicators: false,
  // Component docs moved from /components/[slug] → /docs/[slug]; keep old links alive.
  async redirects() {
    return [{ source: "/components/:slug", destination: "/docs/:slug", permanent: true }];
  },
};

export default nextConfig;
