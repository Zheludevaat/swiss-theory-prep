import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// GitHub Pages base. Override with VITE_BASE if hosting elsewhere.
const base = process.env.VITE_BASE ?? "/swiss-theory-prep/";

export default defineConfig({
  base,
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png", "signs/*.svg"],
      manifest: {
        name: "Swiss Theory Prep",
        short_name: "TheoryPrep",
        description:
          "Personal offline-first PWA for the Swiss Category B theory exam.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        scope: base,
        start_url: base,
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Cache app shell + bundled content. Limits to 5 MB so we don't blow
        // the precache budget on stray assets.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,json}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    target: "es2022",
    sourcemap: true,
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
