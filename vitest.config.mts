import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
      // The real `server-only` package throws unconditionally outside
      // Next's own bundler — see test-utils/server-only-stub.ts.
      "server-only": path.resolve(import.meta.dirname, "test-utils/server-only-stub.ts"),
    },
  },
});
