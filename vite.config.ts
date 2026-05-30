import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const host = process.env["TAURI_DEV_HOST"];
const isTauri = !!(
  process.env["TAURI_ENV_TARGET"] ?? process.env["TAURI_ENV_DEBUG"]
);
const basePath = process.env["VITE_BASE_PATH"] ?? "/";

export default defineConfig({
  plugins: [
    react(),
    ...(!isTauri
      ? [
          VitePWA({
            registerType: "prompt",
            injectRegister: "auto",
            includeAssets: [
              "favicon.svg",
              "favicon.ico",
              "apple-touch-icon-180x180.png",
            ],
            manifest: {
              id: "/",
              name: "Compass",
              short_name: "Compass",
              description:
                "A personal life-navigation app — track your values, focuses, habits, and principles.",
              theme_color: "#0E0E11",
              background_color: "#0E0E11",
              display: "standalone",
              display_override: ["standalone", "minimal-ui"],
              orientation: "portrait",
              start_url: basePath,
              scope: basePath,
              icons: [
                {
                  src: "pwa-64x64.png",
                  sizes: "64x64",
                  type: "image/png",
                },
                {
                  src: "pwa-192x192.png",
                  sizes: "192x192",
                  type: "image/png",
                },
                {
                  src: "pwa-512x512.png",
                  sizes: "512x512",
                  type: "image/png",
                },
                {
                  src: "maskable-icon-512x512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "maskable",
                },
              ],
              screenshots: [
                {
                  src: "screenshots/desktop.png",
                  sizes: "1280x800",
                  type: "image/png",
                  form_factor: "wide",
                  label: "Compass — desktop view",
                },
                {
                  src: "screenshots/mobile.png",
                  sizes: "390x844",
                  type: "image/png",
                  form_factor: "narrow",
                  label: "Compass — mobile view",
                },
              ],
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
              navigateFallback: "index.html",
              navigateFallbackDenylist: [/^\/api\//],
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "google-fonts-stylesheets",
                    expiration: {
                      maxEntries: 10,
                      maxAgeSeconds: 60 * 60 * 24 * 365,
                    },
                    cacheableResponse: { statuses: [0, 200] },
                  },
                },
                {
                  urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "google-fonts-webfonts",
                    expiration: {
                      maxEntries: 30,
                      maxAgeSeconds: 60 * 60 * 24 * 365,
                    },
                    cacheableResponse: { statuses: [0, 200] },
                  },
                },
              ],
            },
            devOptions: { enabled: false },
          }),
        ]
      : []),
  ],
  base: basePath,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    host: host ?? false,
    port: 5173,
    strictPort: true,
    hmr: host ? { protocol: "ws", host, port: 5183 } : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: "safari13",
    minify: !process.env["TAURI_ENV_DEBUG"],
    sourcemap: !!process.env["TAURI_ENV_DEBUG"],
  },
});
