/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom"
    // setupFiles: "./src/setupTests.ts"
  },
  build: {
    target: "ESNext",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "Gaguna",
      // the proper extensions will be added
      fileName: "gaguna"
    }
  }
});
