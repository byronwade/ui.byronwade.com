import {
  defineConfig,
  configDefaults,
  coverageConfigDefaults,
} from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    // Claude Code creates throwaway git worktrees of OTHER branches under
    // `.claude/worktrees/**` (1000s of foreign test files). Without this the
    // main suite globs and runs them, so its pass/fail depends on unrelated
    // branches' WIP — an intermittent, confusing "flake". Scope discovery to
    // this checkout only.
    exclude: [...configDefaults.exclude, "**/.claude/**"],
    coverage: {
      provider: "v8",
      // The gate covers design-system component source only. `include` is matched
      // loosely (any path containing "components"), so anchor it away from app
      // routes like `app/(docs)/_components/*` and `app/preview/components/*`,
      // which are docs/catalog UI — not registry components — and carry a
      // different testing bar.
      include: ["components/**"],
      exclude: [...coverageConfigDefaults.exclude, "app/**"],
      reporter: ["text", "json-summary"],
      thresholds: {
        // Global coverage floor — ratcheted up only. (A per-glob threshold is an
        // ADDITIONAL per-file gate in Vitest 4; matched files still aggregate into
        // the global numbers.)
        statements: 95,
        branches: 90,
        functions: 99,
        lines: 96,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
