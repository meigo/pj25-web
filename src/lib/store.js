import { atom } from "nanostores";

/** @type {WritableAtom<{id:string, title:string}[]>} */
export const infoImages = atom();

/** @type {WritableAtom<SiteData>} */
export const siteData = atom();
