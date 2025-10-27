import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Use APP_ROOT for Home Assistant, fallback to process.cwd()
const APP_ROOT = process.env.APP_ROOT || process.cwd();

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(APP_ROOT, "client", "src"),
      "@shared": path.resolve(APP_ROOT, "shared"),
      "@assets": path.resolve(APP_ROOT, "attached_assets"),
    },
  },
  root: path.resolve(APP_ROOT, "client"),
  base: "./",
  build: {
    outDir: path.resolve(APP_ROOT, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
