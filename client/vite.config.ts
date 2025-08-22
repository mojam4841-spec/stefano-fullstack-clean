import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // shimy blokujące przypadkowe bundlowanie serwerowych paczek:
      "drizzle-orm": path.resolve(__dirname, "src/shims/empty.ts"),
      "drizzle-orm/pg-core": path.resolve(__dirname, "src/shims/empty.ts"),
      pg: path.resolve(__dirname, "src/shims/empty.ts"),
    },
  },
});
