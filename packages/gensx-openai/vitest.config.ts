import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "./",
    globals: true,
    isolate: false,
    passWithNoTests: false,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    env: loadEnv("test", process.cwd(), ""),
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      reportsDirectory: "coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
    },
  },
  // TODO: Get swc working to speed things up
  // plugins: [
  //   swc.vite({
  //     module: { type: "es6" },
  //     tsconfigFile: "./tsconfig.json",
  //   }),
  // ],
});
