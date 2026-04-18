import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

// GitHub Pages base. Override with VITE_BASE if hosting elsewhere.
const base = process.env.VITE_BASE ?? "/swiss-theory-prep/";

// Inject app version + short git SHA into the bundle so Settings can show
// them. Both fall back gracefully when the env doesn't have git available
// (e.g. fresh tarball install) or when reading package.json fails.
const APP_VERSION = ((): string => {
  try {
    const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf8")) as {
      version?: string;
    };
    return pkg.version ?? "unknown";
  } catch {
    return "unknown";
  }
})();

const GIT_SHA = ((): string => {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
})();

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __GIT_SHA__: JSON.stringify(GIT_SHA),
  },
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
