import { slugify } from "@lib/utils";
import { siteData } from "@lib/store";
import { getArtistPictureData, getImagePagePictureData, getInfoSectionTextWithPictures } from "@lib/cms-images";
import { CMS_UPLOAD_PATH, CMS_URL, CMS_API_KEY, API_URL } from "../config.js";

const headers = { "content-type": "application/json", "api-key": CMS_API_KEY };

/**
 * @param {Language} language
 */
export async function getSiteData(language) {
  const res = await fetch(`${API_URL}content/item/site?locale=${language}`, { headers });
  const data = await res.json();
  if (data.ogImage && data.ogImage.path) data.ogImage = CMS_URL + CMS_UPLOAD_PATH + data.ogImage.path;

  siteData.set(data);
  return data;
}

/**
 * @param {Language} language
 */
export async function getMenuData(language) {
  const res = await fetch(`${API_URL}content/item/menu?locale=${language}`, { headers });

  /**
   * @typedef {Object} MenuResponse
   * @property {MenuItem[]} menu
   */
  /** @type {MenuResponse} */
  const data = await res.json();

  /** @type {MenuData} */
  const menuObject = {};
  for (const item of data.menu) {
    menuObject[item.target] = { title: item.title, url: item.url, target: item.target };
  }

  return menuObject;
}

/**
 * @param {Language} language
 */
export async function getArtistsSectionData(language) {
  const res = await fetch(`${API_URL}content/item/artistsSection?locale=${language}`, { headers });
  const data = await res.json();

  for (const artist of data.artists) {
    if (artist.image) artist.picture = await getArtistPictureData(artist.image);
    artist.slug = slugify(artist.name);
  }

  return data;
}

/**
 * @param {Language} language
 */
export async function getInfoSectionData(language) {
  const res = await fetch(`${API_URL}content/item/infoSection?locale=${language}`, { headers });
  const data = await res.json();

  if (data.text) data.html = await getInfoSectionTextWithPictures(data.text);

  return data;
}

/**
 * @param {Language} language
 */
export async function getScheduleSectionData(language) {
  const res = await fetch(`${API_URL}content/item/scheduleSection?locale=${language}`, { headers });
  const data = await res.json();
  return data;
}

export async function getBackgroundsData() {
  const res = await fetch(`${API_URL}content/item/backgrounds`, { headers });
  const data = await res.json();

  /** @type {ImageSectionData} */
  const imageSectionsData = { section1: [], section2: [] };

  if (data.imageSection1 && data.imageSection1.images.length) {
    for (const image of data.imageSection1.images) {
      const p = await getImagePagePictureData(image._id);
      imageSectionsData.section1.push(p);
    }
  }
  if (data.imageSection2 && data.imageSection2.images.length) {
    for (const image of data.imageSection2.images) {
      const p = await getImagePagePictureData(image._id);
      imageSectionsData.section2.push(p);
    }
  }

  return imageSectionsData;
}
