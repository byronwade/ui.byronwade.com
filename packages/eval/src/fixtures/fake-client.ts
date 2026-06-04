import type { AnthropicClient } from "../generate.js";
import { ON_SYSTEM, OFF_SYSTEM } from "./responses.js";

/** Deterministic fake: with-rule (cacheSystem true) returns on-system code; baseline returns off-system. */
export function makeFakeClient(): AnthropicClient {
  return {
    async complete({ cacheSystem }) {
      return cacheSystem ? ON_SYSTEM : OFF_SYSTEM;
    },
  };
}
