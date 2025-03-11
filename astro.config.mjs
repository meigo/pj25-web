import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://jaanituli.ee",
  // base: "/",
  trailingSlash: "never",
  integrations: [tailwind(), svelte()],
  devToolbar: {
    enabled: false,
  },
});
