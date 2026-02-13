import { capitalize, fetchWithRetry, createLimit } from "@lib/utils";
import { infoImages } from "@lib/store";
import { parse } from "node-html-parser";
import { API_URL, UPLOAD_URL } from "../config.js";

const headers = { "content-type": "text/html; charset=utf-8" };
const jsonHeaders = { "content-type": "application/json" };
const limit = createLimit(10); // Max 10 concurrent CMS requests

/**
 * @param {string} id
 * @param {number[]} sizes
 * @param {"jpeg"|"webp"|"avif"} format
 * @returns
 */
async function getImageSource(id, sizes, format) {
  const results = await Promise.all(
    sizes.map(async (size) => {
      return limit(async () => {
        const res = await fetchWithRetry(`${API_URL}assets/image/${id}?w=${size}&mime=${format}`, { headers });
        if (res.ok) {
          const data = await res.text();
          return `${data} ${size}w`;
        }
        return null;
      });
    })
  );
  return results.filter(Boolean).join(", ");
}

/**
 * @param {string} path
 */
async function getImageDataByPath(path) {
  const res = await limit(() => fetchWithRetry(`${API_URL}custom/asset?path=${path}`, { headers: jsonHeaders }));
  const data = await res.text();
  return JSON.parse(data);
}

//=========================================================================================================

/**
 * @param {*} data
 */
export async function getArtistPictureData(data) {
  const sizes = [250, 400, 700];

  const [webpSrcset, jpegSrcset] = await Promise.all([getImageSource(data._id, sizes, "webp"), getImageSource(data._id, sizes, "jpeg")]);

  const sources = [
    { type: "webp", srcset: webpSrcset },
    { type: "jpeg", srcset: jpegSrcset },
  ];

  /** @type {PictureData} */
  const pictureData = {
    img: { src: UPLOAD_URL + data.path, w: data.width, h: data.height, alt: capitalize(data.title) + " pilt" },
    sources,
  };

  return pictureData;
}

//=========================================================================================================

/**
 * @param {string} id
 */
export async function getImagePagePictureData(id) {
  const res = await limit(() => fetchWithRetry(`${API_URL}assets/${id}`, { headers }));
  const data = await res.json();

  const sizes = [400, 800, 1500];

  const [webpSrcset, jpegSrcset] = await Promise.all([getImageSource(data._id, sizes, "webp"), getImageSource(data._id, sizes, "jpeg")]);

  const sources = [
    { type: "webp", srcset: webpSrcset },
    { type: "jpeg", srcset: jpegSrcset },
  ];

  /** @type {PictureData} */
  const pictureData = {
    img: { src: UPLOAD_URL + data.path, w: data.width, h: data.height, alt: capitalize(data.title) },
    sources,
  };
  return pictureData;
}

//=========================================================================================================

/**
 * @param {*} data
 */
async function getInfoSectionPictureMarkup(data) {
  if (!data) return undefined;

  const sizes = [400, 800];
  const sizesAttr = "(min-width: 1024px) 50vw, 95vw";

  const [webpSrcset, jpegSrcset] = await Promise.all([getImageSource(data._id, sizes, "webp"), getImageSource(data._id, sizes, "jpeg")]);

  const sources = [
    { type: "webp", srcset: webpSrcset },
    { type: "jpeg", srcset: jpegSrcset },
  ];

  let s = `<div class="overflow-hidden rounded-4xl border-4 border-pj-blue focus-within:border-white mt-6">`;
  s += `<a href="/image/${data._id}"><picture>`;
  sources.forEach((source) => {
    s += `<source srcset="${source.srcset}" type="image/${source.type}" sizes="${sizesAttr}" >`;
  });
  s += `<img 
  class="transition duration-300 hover:scale-105" 
  src="${UPLOAD_URL + data.path}" 
  alt="${data.title}" 
  width=${data.width} 
  height=${data.height} >`;
  s += "</picture></a></div>";

  return s;
}

/**
 * @param {string} html
 */
export async function getImageIdsFromHtml(html) {
  const root = parse(html);
  const imgElements = root.querySelectorAll("img");
  const images = [];

  await Promise.all(
    imgElements.map(async (img) => {
      const src = img.attributes.src;
      const imageData = await getImageDataByPath(src);
      images.push({ id: imageData._id, title: imageData.title });
    })
  );

  return images;
}

/**
 * @param {string} html
 */
export async function getInfoSectionTextWithPictures(html) {
  const root = parse(html);

  // FIND <IMG> ELEMENTS FROM TEXT
  const imgElements = root.querySelectorAll("img");

  /** @type {*} */
  const pictureMarkups = {};

  /** @type {{id:string, title:string}[]} */
  const images = [];

  await Promise.all(
    imgElements.map(async (img) => {
      const src = img.attributes.src;
      // GET IMAGE DATA FROM COCKPIT AND CREATE/CACHE RESPONSIVE IMAGES
      const imageData = await getImageDataByPath(src);
      images.push({ id: imageData._id, title: imageData.title });
      const pictureMarkup = await getInfoSectionPictureMarkup(imageData);
      pictureMarkups[src] = pictureMarkup;
    })
  );

  // STORE FOR STATIC ROUTES GENERATION
  infoImages.set(images);

  // REPLACE <IMG> ELEMENTS WITH RESPONSIVE <PICTURE> ELEMENTS
  root.querySelectorAll("img").forEach((node) => {
    node.replaceWith(pictureMarkups[node.attributes.src]);
  });

  return root.toString();
}
