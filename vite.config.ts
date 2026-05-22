import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const host = process.env["TAURI_DEV_HOST"];

export default defineConfig({
  plugins: [react()],
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
