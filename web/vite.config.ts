import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
  server: { fs: { allow: [".."] } },
});
