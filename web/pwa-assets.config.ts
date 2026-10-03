import { defineConfig, minimalPreset } from "@vite-pwa/assets-generator/config";

const BACKGROUND = "#05080f";

// minimalPreset force un fond blanc sur maskable ET apple : on impose le fond.
export default defineConfig({
  preset: {
    ...minimalPreset,
    maskable: { sizes: [512], resizeOptions: { background: BACKGROUND } },
    apple: { sizes: [180], resizeOptions: { background: BACKGROUND } },
  },
  images: ["public/icon.svg"],
});
