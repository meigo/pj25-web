/// <reference types="astro/client" />

declare module 'esm-seedrandom' {
  export function prng_alea(seed: string | number): () => number;
}
