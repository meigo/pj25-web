import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://jaanituli.ee",
  // base: "/",
  trailingSlash: "never",
  integrations: [tailwind()],
  devToolbar: {
    enabled: false,
  },
});
