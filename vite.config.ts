import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// HUOM: jos Traccarin TLS-ketjussa on ongelmia (testaus), voit vaihtaa secure: false hetkeksi.
// Älä jätä productioniin "false".

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
      "@types": path.resolve(__dirname, "src/shared/types"),
    },
  },

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "ukkis-safari",
        short_name: "ukkis-safari",
        description: "Safari tool",
        theme_color: "#d7eae0",
      },

      // 🔒 Tärkeää: Älä cacheta /api eikä /socket → muuten jää vanha auth/env välimuistiin.
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          // API GET
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkOnly",
            method: "GET",
          },
          // API POST/PUT/DELETE tms.
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkOnly",
            method: "POST",
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkOnly",
            method: "PUT",
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkOnly",
            method: "DELETE",
          },
          // WS-reitti (varotoimi — Workbox ei oikeasti käsittele WS:ää, mutta estetään mahdolliset HTTP-hitit)
          {
            urlPattern: ({ url }) => url.pathname === "/socket",
            handler: "NetworkOnly",
          },
          // Jos joskus kutsut suoraan Traccarin domainiin (ilman proxya), estä senkin cache:
          {
            urlPattern: /^https:\/\/traccar\.latexi\.dev\/api\/.*/i,
            handler: "NetworkOnly",
          },
        ],
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
