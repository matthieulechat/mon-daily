import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    qrcode(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: { globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"] },
      manifest: {
        name: "Mon Daily",
        short_name: "Mon Daily",
        description: "Ton Daily Drive maison : musique et podcasts d'actu en français.",
        theme_color: "#05080f",
        background_color: "#05080f",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
        ],
      },
    }),
  ],
  // Même .env.local que les scripts (racine du projet). Les préfixes sont
  // exacts à dessein : SUPABASE_SERVICE_ROLE_KEY ne doit JAMAIS finir dans le
  // bundle navigateur, donc pas de préfixe générique "SUPABASE_".
  envDir: "..",
  envPrefix: ["VITE_", "SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"],
  resolve: {
    alias: {
      // Données pures partagées avec le backend (liste des shows, bornes et
      // valeurs par défaut des réglages) : une seule source de vérité.
      "@shared": fileURLToPath(new URL("../scripts", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // host: true expose le serveur sur le réseau local (nécessaire au QR code).
  server: { host: true, fs: { allow: [".."] } },
});
