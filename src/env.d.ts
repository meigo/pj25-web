/// <reference types="astro/client" />

declare module "esm-seedrandom" {
  export function prng_alea(_seed: string | number): () => number; // eslint-disable-line no-unused-vars
}
