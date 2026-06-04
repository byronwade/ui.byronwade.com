import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { McpData } from "./types.js";

// Load the generated bundle at runtime (avoids JSON-module import assertions across tsc/node).
const here = dirname(fileURLToPath(import.meta.url));
export const data: McpData = JSON.parse(readFileSync(join(here, "data.generated.json"), "utf8"));
