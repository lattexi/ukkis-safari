import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// import fs from "fs";

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
  server: {
    host: true, // kuuntele LANissa
    // https: {
    //   key: fs.readFileSync("./certs/dev.key"),
    //   cert: fs.readFileSync("./certs/dev.pem"),
    // },
  },
  base: "/~lauralek/dist/",
  build: {
    // älä downlevlaa liikaa, ettei __publicField-helperiä tarvita erikseen
    target: "es2022",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
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
        icons: [
          {
            src: "icons/ukkohalla-safaris-logo-no-bg-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/ukkohalla-safaris-logo-no-bg-256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/ukkohalla-safaris-logo-no-bg-384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/ukkohalla-safaris-logo-no-bg-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      // 🔒 Tärkeää: Älä cacheta /api eikä /socket → muuten jää vanha auth/env välimuistiin.
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://traccar.latexi.dev/api",
  //       changeOrigin: true,
  //       secure: true,
  //       // If you need to rewrite the path, uncomment the line below
  //       // rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
});
