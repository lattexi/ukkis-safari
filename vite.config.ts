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
