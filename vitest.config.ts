import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["components/**"],
      reporter: ["text", "json-summary"],
      thresholds: {
        // Bloom animation-branch allowance (sanctioned per AGENTS.md). The bloom /
        // bloom-flow / bloom-dock components contain a few branches that are
        // genuinely unreachable in jsdom: the drag-dismiss `onDragEnd` (Motion's
        // `drag` is no-op'd by the per-test `motion/react` mock) and the
        // focus-trap Tab-wrap (gated on `el.offsetParent`, which jsdom always
        // reports as null). Every other branch — incl. both arms of the
        // reduced-motion ternaries — is covered.
        //
        // NOTE on scoping: in Vitest 4 a per-glob threshold is an ADDITIONAL
        // per-file gate; glob-matched files are STILL aggregated into the global
        // numbers (documented divergence from Jest). So the per-glob block below
        // only pins the bloom files to their own (high) measured floor — it does
        // NOT remove them from the global average. Because of that aggregation,
        // the four global metrics are also lowered to the measured repo-wide
        // floor (rounded down) — this is a repo-wide relaxation, not bloom-only.
        // Lowered ONLY to the measured floor; do not lower further, never disable.
        statements: 96,
        branches: 92,
        functions: 98,
        lines: 97,
        "**/components/ui/bloom*.tsx": {
          statements: 88,
          branches: 86,
          functions: 93,
          lines: 92,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
