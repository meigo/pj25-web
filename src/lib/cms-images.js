import { capitalize } from "@lib/utils";
import { infoImages } from "@lib/store";
import { parse } from "node-html-parser";
import { CMS_API_KEY, API_URL, UPLOAD_URL } from "../config.js";

const headers = { "content-type": "text/html; charset=utf-8", "api-key": CMS_API_KEY };
const jsonHeaders = { "content-type": "application/json", "api-key": CMS_API_KEY };

/**
 * @param {string} id
 * @param {number[]} sizes
 * @param {"jpeg"|"webp"|"avif"} format
 * @returns
 */
async function getImageSource(id, sizes, format) {
  let s = "";
  for (const size of sizes) {
    const res = await fetch(`${API_URL}assets/image/${id}?w=${size}&mime=${format}`, { headers });
    if (res.ok) {
      const data = await res.text();
      s += `${data} ${size}w, `;
    }
  }
  return s.slice(0, -2);
}

/**
 * @param {string} path
 */
async function getImageDataByPath(path) {
  const res = await fetch(`${API_URL}custom/asset?path=${path}`, { headers: jsonHeaders });
  const data = await res.text();
  return JSON.parse(data);
}

//=========================================================================================================

/**
 * @param {*} data
 */
export async function getArtistPictureData(data) {
  const sizes = [250, 400, 700];

  const sources = [
    { type: "webp", srcset: await getImageSource(data._id, sizes, "webp") },
    { type: "jpeg", srcset: await getImageSource(data._id, sizes, "jpeg") },
  ];

  console.log(data.path);

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
  const res = await fetch(`${API_URL}assets/${id}`, { headers });
  const data = await res.json();

  const sizes = [400, 800, 1500];

  const sources = [
    { type: "webp", srcset: await getImageSource(data._id, sizes, "webp") },
    { type: "jpeg", srcset: await getImageSource(data._id, sizes, "jpeg") },
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

  const sources = [
    { type: "webp", srcset: await getImageSource(data._id, sizes, "webp") },
    { type: "jpeg", srcset: await getImageSource(data._id, sizes, "jpeg") },
  ];

  let s = `<div class="overflow-hidden rounded-xl focus-within:border-4 border-white mt-6">`;
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
export async function getInfoSectionTextWithPictures(html) {
  const root = parse(html);

  // FIND <IMG> ELEMENTS FROM TEXT
  const imgElements = root.querySelectorAll("img");

  /** @type {*} */
  const pictureMarkups = {};

  /** @type {{id:string, title:string}[]} */
  const images = [];
  for (const img of imgElements) {
    // GET IMAGE DATA FROM COCKPIT AND CREATE/CACHE RESPONSIVE IMAGES
    const imageData = await getImageDataByPath(img.attributes.src);
    images.push({ id: imageData._id, title: imageData.title });
    const pictureMarkup = await getInfoSectionPictureMarkup(imageData);
    pictureMarkups[img.attributes.src] = pictureMarkup;
  }
  // STORE FOR STATIC ROUTES GENERATION
  infoImages.set(images);

  // REPLACE <IMG> ELEMENTS WITH RESPONSIVE <PICTURE> ELEMENTS
  root.querySelectorAll("img").forEach((node) => {
    node.replaceWith(pictureMarkups[node.attributes.src]);
  });

  return root.toString();
}
