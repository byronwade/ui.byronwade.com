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
        // Bloom animation-branch allowance (sanctioned per AGENTS.md). The bloom
        // components are now pure CSS (Motion removed). The few branches still
        // unreachable in jsdom are timing/measurement-only: the cross-axis
        // close `transitionend` handler (no real CSS transition fires in jsdom)
        // and the focus-trap Tab-wrap arms (gated on `el.offsetParent`, which
        // jsdom always reports as null). Every other branch — incl. both arms of
        // the reduced-motion ternaries, the inline/element-anchor mode, and the
        // mobile bottom-sheet — is covered.
        //
        // NOTE on scoping: in Vitest 4 a per-glob threshold is an ADDITIONAL
        // per-file gate; glob-matched files are STILL aggregated into the global
        // numbers (documented divergence from Jest). So the per-glob block below
        // pins the bloom files to their own measured floor without removing them
        // from the global average.
        //
        // Thresholds sit at the measured floor (rounded down). Ratcheted UP after
        // the CSS rewrite restored coverage; do not lower, never disable.
        statements: 96,
        branches: 93,
        functions: 99,
        lines: 97,
        "**/components/ui/bloom*.tsx": {
          statements: 92,
          branches: 86,
          functions: 97,
          lines: 95,
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
