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
      // Chunk 8 F-1/F-2: prompt-based updates — the app shows a toast and
      // the user chooses when to reload. Prevents a mid-mock catastrophe
      // when a deploy lands during a 45-minute exam.
      registerType: "prompt",
      includeAssets: [
        "favicon.svg",
        "offline.html",
        "icons/*.png",
        "signs/*.svg",
        "splash/*.png",
        "screenshots/*.png",
      ],
      manifest: {
        name: "Swiss Theory Prep",
        short_name: "TheoryPrep",
        description:
          "Personal offline-first PWA for the Swiss Category B theory exam.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        scope: base,
        start_url: base,
        lang: "en",
        categories: ["education", "productivity"],
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
          // F-4/F-5: apple-touch-icon variants so iOS "Add to Home Screen"
          // picks a crisp raster at the device's native size instead of
          // scaling the 192px down.
          {
            src: "icons/apple-touch-icon-180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "icons/apple-touch-icon-167.png",
            sizes: "167x167",
            type: "image/png",
          },
          {
            src: "icons/apple-touch-icon-152.png",
            sizes: "152x152",
            type: "image/png",
          },
        ],
        // F-3: install-preview screenshots surface in browser install
        // prompts (Android Chrome, Edge). Portrait-only to match the app's
        // `orientation: "portrait"` and the real iPhone install flow.
        screenshots: [
          {
            src: "screenshots/today.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Today — your day's rotation at a glance",
          },
          {
            src: "screenshots/review.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Review — a single card with three options",
          },
        ],
      },
      workbox: {
        // Cache app shell + bundled content. Limits to 5 MB so we don't blow
        // the precache budget on stray assets.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,json}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // F-7: route navigations to the SPA shell when online; the dedicated
        // offline.html acts as a graceful fallback only when the shell is
        // also missing from cache (first-load failure scenario).
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/api\//, new RegExp(`^${base}offline\\.html$`)],
        cleanupOutdatedCaches: true,
        // F-6: runtime cache for large static assets (signs, diagrams) —
        // CacheFirst with a bounded quota so a growing library doesn't
        // fill the device. Capped at ~30d freshness; stale entries are
        // eligible for eviction before the 200-entry cap kicks in.
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              /\/(signs|diagrams)\//.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "theory-prep-assets",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
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
