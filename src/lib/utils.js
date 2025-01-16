import { prng_alea } from "esm-seedrandom";

/**
 * @param {string} string
 * @returns {string}
 */
export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * @param {string|number} seed
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomRange(seed, min, max) {
  const myrng = prng_alea(seed);
  return myrng() * (max - min) + min;
}

/**
 * @param {string|number} seed
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomRangeInt(seed, min, max) {
  const myrng = prng_alea(seed);
  return Math.round(myrng() * (max - min) + min);
}

/**
 * @param {string|number} seed
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function randomRotationClass(seed, min, max) {
  const myrng = prng_alea(seed.toString());
  const r = Math.ceil(myrng.quick() * (max - min) + min);
  if (r < 0) return "-rotate-" + Math.abs(r);
  return "rotate-" + r;
}

/**
 * @param {number} index
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function randomRotationClass2(index, min, max) {
  const myrng = prng_alea(index);
  const r = Math.round(myrng() * (max - min) + min);
  if (isOdd(index)) return "-rotate-" + r;
  return "rotate-" + r;
}

/**
 * @param {number} number
 * @returns {boolean}
 */
export function isOdd(number) {
  return number % 2 !== 0;
}

/**
 * @param {string} path
 * @returns {string}
 */
export function getFileFromPath(path) {
  return path.substring(path.lastIndexOf("/") + 1);
}

/**
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}
