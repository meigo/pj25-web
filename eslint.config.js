import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginSvelte from "eslint-plugin-svelte";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default [
  ...tseslint.config(tseslint.configs.recommended),
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginSvelte.configs["flat/recommended"],
  prettierConfig,
  {
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "svelte/no-at-html-tags": "off",
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];
