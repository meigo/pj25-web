import { prng_alea } from "esm-seedrandom";

/**
 * @param {string} string
 * @returns {string}
 */
export function capitalize(string) {
  return string ? string[0].toUpperCase() + string.slice(1).toLowerCase() : string;
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

  // Map Estonian characters to ASCII
  const map = {
    ä: "a",
    ö: "o",
    õ: "o",
    ü: "u",
    š: "s",
    ž: "z",
  };

  str = str.replace(/[äöõüšž]/g, (match) => map[match]);

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

/**
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} retries
 * @param {number} backoff
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
  try {
    const res = await fetch(url, options);
    if (!res.ok && retries > 0 && res.status >= 500) {
      throw new Error(`Server error: ${res.status}`);
    }
    return res;
  } catch (err) {
    if (retries <= 0) throw err;
    console.warn(`Fetch failed for ${url}, retrying in ${backoff}ms... (${retries} left). Error: ${err.message}`);
    await new Promise((resolve) => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

/**
 * Creates a concurrency limiter.
 * @param {number} concurrency
 */
export function createLimit(concurrency) {
  let activeCount = 0;
  const queue = [];

  const next = () => {
    activeCount--;
    if (queue.length > 0) {
      queue.shift()();
    }
  };

  return (fn) => {
    return new Promise((resolve, reject) => {
      const run = async () => {
        activeCount++;
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          next();
        }
      };

      if (activeCount < concurrency) {
        run();
      } else {
        queue.push(run);
      }
    });
  };
}


